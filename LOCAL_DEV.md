# PBuilder 本地開發指南

## 啟動本地開發伺服器

### 方式 1：Python HTTP 伺服器 (推薦)
```bash
cd PBuilder
python3 -m http.server 8787
```

訪問：http://localhost:8787

### 方式 2：Wrangler 開發伺服器
```bash
cd PBuilder
npx wrangler pages dev
```

訪問：http://localhost:8787

## 雲端部署

### 部署至 Cloudflare Pages
```bash
cd PBuilder
npx wrangler pages publish
```

雲端網址：https://pbuilder.pages.dev

## 故障排除

### 本地連線無法建立
- 確保 Python 3 已安裝
- 檢查埠 8787 是否被佔用
- 嘗試用另一個埠：`python3 -m http.server 8888`

### index.html 不存在
- 確認目錄結構：PBuilder/index.html 必須存在
- 檢查檔案編碼：應為 UTF-8

## 測試清單
- [ ] 本地伺服器啟動成功
- [ ] http://localhost:8787 能正常訪問
- [ ] PromptBuilder UI 完整載入
- [ ] 編號視覺呈現正確（01-09）
- [ ] 各項功能正常運作
