#!/bin/bash

echo "=== PBuilder Cloudflare Pages 最終驗證 ==="
echo ""

PASS=true

# 驗證 1: 所有必需檔案存在
echo "✓ 檔案檢查"
[ -f "index.html" ] && echo "  ✓ index.html" || (echo "  ✗ index.html 缺失"; PASS=false)
[ -f "wrangler.toml" ] && echo "  ✓ wrangler.toml" || (echo "  ✗ wrangler.toml 缺失"; PASS=false)
[ -f "package.json" ] && echo "  ✓ package.json" || (echo "  ✗ package.json 缺失"; PASS=false)

# 驗證 2: HTML 關鍵內容
echo ""
echo "✓ HTML 內容檢查"
grep -q "section-number" index.html && echo "  ✓ 編號元素存在" || (echo "  ✗ 編號元素缺失"; PASS=false)
grep -q "44px" index.html && echo "  ✓ 編號尺寸優化" || (echo "  ✗ 編號尺寸未優化"; PASS=false)
grep -q "font-weight: 700" index.html && echo "  ✓ 編號字重優化" || (echo "  ✗ 編號字重未優化"; PASS=false)

# 驗證 3: 編號格式 01-09
echo ""
echo "✓ 編號格式驗證"
FOUND_COUNT=0
for i in {1..9}; do
  NUM=$(printf "%02d" $i)
  if grep -q "section-number\">$NUM<" index.html; then
    FOUND_COUNT=$((FOUND_COUNT + 1))
  else
    echo "  ✗ 編號 $NUM 缺失"; PASS=false
  fi
done
[ $FOUND_COUNT -eq 9 ] && echo "  ✓ 所有編號 01-09 完整"

# 驗證 4: Wrangler 配置
echo ""
echo "✓ Wrangler 配置檢查"
grep -q "name = \"pbuilder\"" wrangler.toml && echo "  ✓ 專案名稱: pbuilder" || (echo "  ✗ 專案名稱錯誤"; PASS=false)
grep -q "pages_build_output_dir" wrangler.toml && echo "  ✓ Pages 配置完整" || (echo "  ✗ Pages 配置缺失"; PASS=false)

# 驗證 5: 單元測試
echo ""
echo "✓ 單元測試執行"
if node test.js > /tmp/test.log 2>&1; then
  echo "  ✓ 所有測試通過"
else
  echo "  ✗ 測試失敗"
  tail -10 /tmp/test.log
  PASS=false
fi

# 驗證 6: 檔案大小
echo ""
echo "✓ 檔案大小檢查"
SIZE=$(du -h index.html | cut -f1)
echo "  ✓ index.html: $SIZE"

echo ""
if [ "$PASS" = true ]; then
  echo "✅ 所有驗證通過！"
  echo ""
  echo "已準備好部署至 Cloudflare Pages："
  echo "  命令: npx wrangler pages publish"
  echo "  預期 URL: https://pbuilder.pages.dev"
  exit 0
else
  echo "❌ 驗證失敗，無法進行部署"
  exit 1
fi
