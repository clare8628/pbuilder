// 部署驗證測試
const fs = require('fs');
const path = require('path');

console.log('部署前驗證...\n');

// 檢查必需檔案
const files = ['index.html', 'worker.js', 'wrangler.toml', 'test.js'];
let ready = true;

files.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✓ ${file} 存在`);
  } else {
    console.log(`✗ ${file} 缺失`);
    ready = false;
  }
});

// 驗證 HTML 大小
const htmlSize = fs.statSync(path.join(__dirname, 'index.html')).size;
console.log(`\n✓ HTML 大小: ${(htmlSize / 1024).toFixed(2)} KB`);

// 驗證 wrangler.toml
const toml = fs.readFileSync(path.join(__dirname, 'wrangler.toml'), 'utf-8');
if (toml.includes('name = "promptbuilder"')) {
  console.log('✓ Wrangler 配置正確');
} else {
  console.log('✗ Wrangler 配置異常');
  ready = false;
}

if (ready) {
  console.log('\n部署就緒！');
  console.log('預期 Endpoint: https://promptbuilder.pages.dev');
  process.exit(0);
} else {
  console.log('\n部署檢查失敗');
  process.exit(1);
}
