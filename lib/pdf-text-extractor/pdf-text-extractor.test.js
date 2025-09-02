const path = require('path');
const assert = require('assert');
const { extractTextFromPdf } = require('./pdf-text-extractor.js');

async function runTest() {
  console.log('Running test for pdf-text-extractor (from .js file)...');

  try {
    // テスト用のPDFファイルのパス
    const pdfPath = path.join(__dirname, 'test-sample.pdf');

    // PDFからテキストを抽出
    const text = await extractTextFromPdf(pdfPath);

    // --- 検証 --- //
    console.log('Extracted Text (first 100 chars):', text.substring(0, 100) + '...');

    // 1. タイトルが含まれているか
    assert.ok(text.includes('Low Stock Items (Top 10)'), 'Test Failed: Title not found.');
    console.log('✓ Test Passed: Title is correct.');

    // 2. テーブルのヘッダーが含まれているか
    assert.ok(text.includes('商品コード'), 'Test Failed: Header "商品コード" not found.');
    assert.ok(text.includes('価格'), 'Test Failed: Header "価格" not found.');
    console.log('✓ Test Passed: Table headers are correct.');

    // 3. 特定の商品の情報が含まれているか (1位の商品)
    assert.ok(text.includes('nb11261'), 'Test Failed: Product code "nb11261" not found.');
    assert.ok(text.includes('789'), 'Test Failed: Price "789" not found.');
    console.log('✓ Test Passed: Specific product data is correct.');

    // 4. フッターの注釈が含まれているか
    assert.ok(text.includes('在庫数の少ない順に表示しています'), 'Test Failed: Footer note not found.');
    console.log('✓ Test Passed: Footer note is correct.');

    console.log('\n✅ All tests passed successfully!');

  } catch (error) {
    console.error('\n❌ Test execution failed:', error);
    process.exit(1); // エラーで終了
  }
}

// テストを実行
runTest();