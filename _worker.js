// Cloudflare Pages - Advanced Mode Worker
// 正確格式：export default { fetch(request, env, context) }
// 靜態資源一律透過 env.ASSETS.fetch(request) 轉發，避免遞迴呼叫

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);

    // 全站服務人次計數 API（Cloudflare KV）
    if (url.pathname === '/api/usage-count') {
      if (request.method === 'GET') {
        const raw = await env.USAGE_COUNTER.get('total_count');
        const count = raw ? parseInt(raw, 10) : 0;
        return new Response(JSON.stringify({ count }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'POST') {
        const raw = await env.USAGE_COUNTER.get('total_count');
        const count = raw ? parseInt(raw, 10) : 0;
        const next = count + 1;
        // 注意：KV 非強一致性資料庫，高併發下可能有極小機率漏計，
        // 此專案流量不大，可接受，不需引入 Durable Objects。
        await env.USAGE_COUNTER.put('total_count', String(next));
        return new Response(JSON.stringify({ count: next }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response('Method Not Allowed', { status: 405 });
    }

    // 其餘所有請求：直接轉發給 Pages 的靜態資源服務
    // env.ASSETS 是 Cloudflare Pages 內建綁定，指向已部署的靜態檔案
    return env.ASSETS.fetch(request);
  }
};
