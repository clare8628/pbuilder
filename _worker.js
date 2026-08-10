// Cloudflare Pages - Advanced Mode Worker
// 正確格式：export default { fetch(request, env, context) }
// 靜態資源一律透過 env.ASSETS.fetch(request) 轉發，避免遞迴呼叫

export default {
  async fetch(request, env, context) {
    // 直接將所有請求轉發給 Pages 的靜態資源服務
    // env.ASSETS 是 Cloudflare Pages 內建綁定，指向已部署的靜態檔案
    return env.ASSETS.fetch(request);
  }
};
