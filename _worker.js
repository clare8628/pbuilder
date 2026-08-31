// Cloudflare Pages - Advanced Mode Worker
// 正確格式：export default { fetch(request, env, context) }
// 靜態資源一律透過 env.ASSETS.fetch(request) 轉發，避免遞迴呼叫

// 所有統計資料集中在單一 KV key，POST 只需 1 次 get + 1 次 put
const STATS_KEY = 'stats_v1';
const LEGACY_COUNT_KEY = 'total_count'; // 舊版純計數 key，僅用於首次遷移
const TZ_OFFSET_MIN = 480; // Asia/Taipei = UTC+8（台灣無日光節約時間，固定位移即可）

function emptyStats() {
  return {
    total: 0,
    date: '',                          // hours 對應的當地日期（YYYY-MM-DD）
    hours: new Array(24).fill(0),      // 今日各小時區段人次
    hoursAll: new Array(24).fill(0),   // 歷史累計各小時區段人次
    countries: {}                      // { 'TW': 12, 'US': 3, ... }
  };
}

// 依 Asia/Taipei 取當地日期與小時（13:20 與 13:35 都落在 hour=13）
function localParts(now = new Date()) {
  const t = new Date(now.getTime() + TZ_OFFSET_MIN * 60000);
  return { date: t.toISOString().slice(0, 10), hour: t.getUTCHours() };
}

function normalizeHours(arr) {
  const out = new Array(24).fill(0);
  if (Array.isArray(arr)) {
    for (let i = 0; i < 24; i++) {
      const n = Number(arr[i]);
      out[i] = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
    }
  }
  return out;
}

async function readStats(env) {
  let raw = null;
  try {
    raw = await env.USAGE_COUNTER.get(STATS_KEY, 'json');
  } catch (err) {
    raw = null;
  }

  const stats = emptyStats();
  if (raw && typeof raw === 'object') {
    stats.total = Number(raw.total) > 0 ? Math.floor(Number(raw.total)) : 0;
    stats.date = typeof raw.date === 'string' ? raw.date : '';
    stats.hours = normalizeHours(raw.hours);
    stats.hoursAll = normalizeHours(raw.hoursAll);
    if (raw.countries && typeof raw.countries === 'object') {
      for (const [code, n] of Object.entries(raw.countries)) {
        const v = Number(n);
        if (Number.isFinite(v) && v > 0) stats.countries[code] = Math.floor(v);
      }
    }
    return stats;
  }

  // 首次啟用：沿用舊 total_count，避免既有人次歸零（時段/國別無歷史資料，從 0 起算）
  const legacy = await env.USAGE_COUNTER.get(LEGACY_COUNT_KEY);
  stats.total = legacy ? parseInt(legacy, 10) || 0 : 0;
  return stats;
}

// 跨日時把 hours 歸零，hoursAll 保留累計
function rollDay(stats, date) {
  if (stats.date !== date) {
    stats.date = date;
    stats.hours = new Array(24).fill(0);
  }
  return stats;
}

function statsPayload(stats) {
  return {
    count: stats.total,
    date: stats.date,
    hours: stats.hours,
    hoursAll: stats.hoursAll,
    countries: stats.countries,
    timezone: 'Asia/Taipei'
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);

    // 完整統計（人次 + 時段分佈 + 國別分佈）
    if (url.pathname === '/api/stats') {
      if (request.method !== 'GET') return new Response('Method Not Allowed', { status: 405 });
      const { date } = localParts();
      const stats = rollDay(await readStats(env), date); // 只讀不寫，跨日回傳歸零後的今日資料
      return json(statsPayload(stats));
    }

    // 全站服務人次計數 API（Cloudflare KV）
    if (url.pathname === '/api/usage-count') {
      if (request.method === 'GET') {
        const stats = await readStats(env);
        return json({ count: stats.total });
      }

      if (request.method === 'POST') {
        const { date, hour } = localParts();
        const stats = rollDay(await readStats(env), date);

        stats.total += 1;
        stats.hours[hour] += 1;
        stats.hoursAll[hour] += 1;

        // request.cf.country 由 Cloudflare 邊緣節點判定；本地 wrangler dev 可能為空
        const country = (request.cf && request.cf.country) || 'XX';
        stats.countries[country] = (stats.countries[country] || 0) + 1;

        // 注意：KV 非強一致性資料庫，高併發下可能有極小機率漏計，
        // 此專案流量不大，可接受，不需引入 Durable Objects。
        await env.USAGE_COUNTER.put(STATS_KEY, JSON.stringify(stats));
        return json(statsPayload(stats));
      }

      return new Response('Method Not Allowed', { status: 405 });
    }

    // 其餘所有請求：直接轉發給 Pages 的靜態資源服務
    // env.ASSETS 是 Cloudflare Pages 內建綁定，指向已部署的靜態檔案
    return env.ASSETS.fetch(request);
  }
};
