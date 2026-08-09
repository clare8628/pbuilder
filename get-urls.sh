#!/bin/bash
# 取得 PBuilder 本地與雲端網址

echo "=== PBuilder 網址資訊 ==="
echo ""

# 本地開發網址
echo "📍 本地開發網址："
if [ -f "wrangler.toml" ]; then
  PROJECT_NAME=$(grep "^name" wrangler.toml | cut -d'"' -f2)
  echo "  http://localhost:8787"
  echo "  (執行 'npx wrangler dev' 啟動本地服務)"
else
  echo "  http://localhost:8787"
fi

echo ""
echo "☁️  雲端部署網址："
echo "  https://promptbuilder.pages.dev"
echo "  (Cloudflare Pages 正式環境)"

echo ""
echo "📋 快速啟動指令："
echo "  本地開發: cd PBuilder && npx wrangler dev"
echo "  部署更新: cd PBuilder && npx wrangler deploy"

