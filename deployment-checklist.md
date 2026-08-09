# PBuilder Cloudflare Pages 部署檢查清單

**部署時間：** 2026-08-09 12:35:00 UTC+0

## 部署前驗證 ✅

### 檔案狀態
- ✓ index.html (36KB, 最後修改: Aug 9 11:51)
- ✓ wrangler.toml (配置已驗證)
- ✓ _worker.js (SPA 路由配置)
- ✓ package.json (依賴配置)

### 內容驗證
- ✓ 編號 01-09 完整正確
- ✓ 編號視覺呈現：寬高 44px, 字體 16px, 字重 700
- ✓ 漸層背景、邊框、陰影完整
- ✓ Active 狀態 scale 動畫

### 配置驗證
- ✓ 專案名稱: pbuilder
- ✓ Pages build output: .
- ✓ Compatibility date: 2024-08-08

### 測試驗證
- ✓ 單元測試全部通過 (4/4)
- ✓ HTML 結構完整
- ✓ 樣式定義正確

## 部署指令

```bash
cd PBuilder
npx wrangler pages publish . --project-name pbuilder
```

## 預期部署結果

- **主網址**: https://pbuilder.pages.dev
- **預覽 URL**: https://[hash].pbuilder.pages.dev
- **預期 Status**: ✓ 成功（綠色勾選）

## 部署後驗證

1. 訪問 https://pbuilder.pages.dev
2. 確認 PromptBuilder UI 完整載入
3. 確認編號視覺呈現正確（01-09）
4. 確認 Network 標籤顯示最新 index.html 時間戳記
5. 檢查瀏覽器開發工具無報錯

## Iris 驗證清單

- [ ] 訪問網址確認頁面載入
- [ ] 驗證編號視覺呈現正確
- [ ] 驗證功能正常運作
- [ ] 確認版本為最新（時間戳記更新）
- [ ] 無 console 報錯

---

**部署狀態**: ⏳ 待執行
**驗證狀態**: ⏳ 待驗證
