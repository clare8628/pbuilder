/**
 * PBuilder 編號與樣式驗證測試
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 讀取 HTML 檔案
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// 測試 1: 驗證所有編號都是兩位格式 (01-09)
console.log('Test 1: 驗證編號格式...');
const numberPattern = /<span class="section-number">(\d+)<\/span>/g;
const matches = [...htmlContent.matchAll(numberPattern)];
const numbers = matches.map(m => m[1]);

let test1Pass = true;
numbers.forEach((num, idx) => {
  const expected = String(idx + 1).padStart(2, '0');
  const actual = num;
  if (actual !== expected) {
    console.error(`  ✗ 第 ${idx + 1} 個編號: 預期 ${expected}，得到 ${actual}`);
    test1Pass = false;
  }
});

if (test1Pass && numbers.length === 9) {
  console.log(`  ✓ 所有 9 個編號格式正確 (01-09)`);
} else if (numbers.length !== 9) {
  console.error(`  ✗ 編號個數不對: 預期 9，得到 ${numbers.length}`);
  test1Pass = false;
}

// 測試 2: 驗證編號樣式 CSS
console.log('\nTest 2: 驗證編號樣式定義...');
const cssPattern = /\.section-number\s*\{([^}]*)\}/;
const cssMatch = htmlContent.match(cssPattern);
let test2Pass = false;

if (cssMatch) {
  const cssContent = cssMatch[1];
  const checks = [
    { rule: 'width: 44px', desc: '寬度升級為 44px' },
    { rule: 'height: 44px', desc: '高度升級為 44px' },
    { rule: 'font-size: 16px', desc: '字體大小升級為 16px' },
    { rule: 'font-weight: 700', desc: '字重升級為 700' },
    { rule: 'border:', desc: '邊框已添加' },
    { rule: 'box-shadow:', desc: '陰影已添加' },
    { rule: 'linear-gradient', desc: '漸層背景已添加' }
  ];

  test2Pass = true;
  checks.forEach(({ rule, desc }) => {
    if (cssContent.includes(rule)) {
      console.log(`  ✓ ${desc}`);
    } else {
      console.error(`  ✗ ${desc} - 規則未找到`);
      test2Pass = false;
    }
  });
}

// 測試 3: 驗證 has-value 狀態樣式
console.log('\nTest 3: 驗證 has-value 狀態樣式...');
const activeStatePattern = /\.form-section\.has-value\s*\.section-number\s*\{([^}]*)\}/;
const activeMatch = htmlContent.match(activeStatePattern);
let test3Pass = false;

if (activeMatch) {
  const activeCSS = activeMatch[1];
  const activeChecks = [
    { rule: 'background:', desc: '背景漸層已定義' },
    { rule: 'transform: scale', desc: '縮放動畫已添加' },
    { rule: 'box-shadow:', desc: '陰影已增強' }
  ];

  test3Pass = true;
  activeChecks.forEach(({ rule, desc }) => {
    if (activeCSS.includes(rule)) {
      console.log(`  ✓ ${desc}`);
    } else {
      console.error(`  ✗ ${desc}`);
      test3Pass = false;
    }
  });
}

// 測試 4: 驗證編號與標題的對應
console.log('\nTest 4: 驗證編號與標題對應...');
const sections = [
  { num: '01', title: '專案名稱' },
  { num: '02', title: '專案類型' },
  { num: '03', title: '目標使用者與描述' },
  { num: '04', title: '核心功能' },
  { num: '05', title: '視覺風格' },
  { num: '06', title: '語言' },
  { num: '07', title: '雲端部署進度' },
  { num: '08', title: 'RWD 設計支援' },
  { num: '09', title: '不要做' }
];

let test4Pass = true;
sections.forEach(({ num, title }) => {
  const sectionRegex = new RegExp(
    `<span class="section-number">${num}</span>.*?<h2 class="section-title">[^<]*${title}[^<]*</h2>`,
    's'
  );
  if (sectionRegex.test(htmlContent)) {
    console.log(`  ✓ ${num} - ${title}`);
  } else {
    console.error(`  ✗ ${num} - ${title} 對應失敗`);
    test4Pass = false;
  }
});

// 總結
console.log('\n' + '='.repeat(50));
const allPass = test1Pass && test2Pass && test3Pass && test4Pass;
if (allPass) {
  console.log('✓ 所有測試通過！');
  process.exit(0);
} else {
  console.log('✗ 部分測試失敗');
  process.exit(1);
}
