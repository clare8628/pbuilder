#!/bin/bash

echo "=== Cloudflare Pages 部署驗證流程 ==="
echo ""

# 1. 檢查必需檔案
echo "📋 步驟 1: 驗證檔案完整性"
FILES=("index.html" "wrangler.toml" "package.json" "test.js")
ALL_EXIST=true

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    SIZE=$(du -h "$file" | cut -f1)
    echo "  ✓ $file ($SIZE)"
  else
    echo "  ✗ $file 缺失"
    ALL_EXIST=false
  fi
done

if [ "$ALL_EXIST" = false ]; then
  echo ""
  echo "❌ 檔案驗證失敗"
  exit 1
fi

echo ""
echo "📊 步驟 2: 驗證 HTML 內容完整性"
# 檢查關鍵元素
CHECKS=(
  "app-header"
  "section-number"
  "form-section"
  "outputPanel"
)

for check in "${CHECKS[@]}"; do
  if grep -q "$check" index.html; then
    echo "  ✓ 找到 $check"
  else
    echo "  ✗ 缺失 $check"
    ALL_EXIST=false
  fi
done

echo ""
echo "🎨 步驟 3: 驗證編號樣式"
if grep -q "width: 44px" index.html && grep -q "height: 44px" index.html; then
  echo "  ✓ 編號尺寸已優化 (44px)"
else
  echo "  ✗ 編號尺寸未優化"
  ALL_EXIST=false
fi

if grep -q "font-size: 16px" index.html && grep -q "font-weight: 700" index.html; then
  echo "  ✓ 編號字體已優化 (16px, weight: 700)"
else
  echo "  ✗ 編號字體未優化"
  ALL_EXIST=false
fi

echo ""
echo "🔢 步驟 4: 驗證編號格式 (01-09)"
for i in {1..9}; do
  NUM=$(printf "%02d" $i)
  if grep -q "section-number\">$NUM<" index.html; then
    echo "  ✓ 編號 $NUM 正確"
  else
    echo "  ✗ 編號 $NUM 缺失或錯誤"
    ALL_EXIST=false
  fi
done

echo ""
echo "📝 步驟 5: 驗證 wrangler.toml 配置"
if grep -q "name = \"pbuilder\"" wrangler.toml; then
  echo "  ✓ 專案名稱正確: pbuilder"
else
  echo "  ✗ 專案名稱錯誤"
  ALL_EXIST=false
fi

if grep -q "pages_build_output_dir = \".\"" wrangler.toml; then
  echo "  ✓ Pages 輸出目錄配置正確"
else
  echo "  ✗ Pages 輸出目錄配置有誤"
  ALL_EXIST=false
fi

echo ""
echo "🧪 步驟 6: 執行單元測試"
if node test.js > /dev/null 2>&1; then
  echo "  ✓ 所有單元測試通過"
else
  echo "  ✗ 單元測試失敗"
  ALL_EXIST=false
fi

echo ""
echo "=== 部署驗證結果 ==="
if [ "$ALL_EXIST" = true ]; then
  echo "✅ 所有驗證通過，已準備好部署至 Cloudflare Pages"
  echo ""
  echo "部署指令："
  echo "  npx wrangler pages publish"
  echo ""
  echo "預期雲端網址："
  echo "  https://pbuilder.pages.dev"
  exit 0
else
  echo "❌ 驗證失敗，無法進行部署"
  exit 1
fi
