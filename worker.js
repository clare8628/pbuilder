// PBuilder - Cloudflare Pages 靜態網站

/**
 * Cloudflare Pages 會自動服務靜態檔案
 * 本 Worker 僅作為 SPA 路由處理
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 如果請求的是靜態資源，讓 Cloudflare 處理
    if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(pathname)) {
      return new Response('Not Found', { status: 404 });
    }

    // 所有其他路由返回 index.html (SPA)
    // 在本地開發中，Wrangler 會從當前目錄提供文件
    return new Response('OK', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
