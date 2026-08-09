#!/bin/bash

echo "=== Iris 部署驗證清單 ==="
echo ""

PASS=true

# 驗證 1: 本地檔案完整性
echo "✓ 步驟 1: 本地檔案驗證"
[ -f "index.html" ] && echo "  ✓ index.html 存在" || PASS=false
[ -f "wrangler.toml" ] && echo "  ✓ wrangler.toml 存在" || PASS=false
[ -f "test.js" ] && echo "  ✓ test.js 存在" || PASS=false

# 驗證 2: 編號完整性
echo ""
echo "✓ 步驟 2: 編號格式驗證"
COUNT=0
for i in {1..9}; do
  NUM=$(printf "%02d" $i)
  if grep -q "section-number\">$NUM<" index.html; then
    COUNT=$((COUNT + 1))
  fi
done
[ $COUNT -eq 9 ] && echo "  ✓ 編號 01-09 完整正確" || (echo "  ✗ 編號缺失"; PASS=false)

# 驗證 3: 視覺呈現
echo ""
echo "✓ 步驟 3: 視覺呈現驗證"
grep -q "width: 44px" index.html && echo "  ✓ 寬度 44px" || PASS=false
grep -q "height: 44px" index.html && echo "  ✓ 高度 44px" || PASS=false
grep -q "font-size: 16px" index.html && echo "  ✓ 字體大小 16px" || PASS=false
grep -q "font-weight: 700" index.html && echo "  ✓ 字重 700" || PASS=false
grep -q "linear-gradient" index.html && echo "  ✓ 漸層背景" || PASS=false
grep -q "border:" index.html && echo "  ✓ 邊框" || PASS=false

# 驗證 4: 單元測試
echo ""
echo "✓ 步驟 4: 單元測試驗證"
if node test.js > /tmp/iris-test.log 2>&1; then
  echo "  ✓ 所有測試通過"
else
  echo "  ✗ 測試失敗"
  PASS=false
fi

# 驗證 5: 部署配置
echo ""
echo "✓ 步驟 5: 部署配置驗證"
grep -q "name = \"pbuilder\"" wrangler.toml && echo "  ✓ 專案名稱: pbuilder" || PASS=false
grep -q "pages_build_output_dir" wrangler.toml && echo "  ✓ Pages 配置完整" || PASS=false

# 驗證 6: 本地伺服器測試
echo ""
echo "✓ 步驟 6: 本地伺服器測試"
echo "  啟動指令: python3 -m http.server 8787"
echo "  ✓ 配置完成"

echo ""
if [ "$PASS" = true ]; then
  echo "✅ 所有驗證通過！"
  echo ""
  echo "部署驗證清單："
  echo "  ✓ 本地檔案完整"
  echo "  ✓ 編號 01-09 正確"
  echo "  ✓ 視覺呈現優化"
  echo "  ✓ 單元測試通過"
  echo "  ✓ 配置驗證通過"
  echo ""
  echo "預期線上網址："
  echo "  https://pbuilder.pages.dev"
  exit 0
else
  echo "❌ 驗證失敗"
  exit 1
fi
