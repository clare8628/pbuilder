// Cloudflare Pages Function
// 攔截所有請求，返回 index.html (SPA)

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // 如果請求靜態資源（js, css, png 等），直接返回
  if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/i.test(url.pathname)) {
    return context.next();
  }

  // 其他所有請求都返回 index.html (SPA 路由)
  return context.next();
}
