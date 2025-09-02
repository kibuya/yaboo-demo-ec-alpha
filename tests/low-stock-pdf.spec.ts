import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { extractTextFromPdf } from '../lib/pdf-text-extractor/pdf-text-extractor.js';
import { getBase64FromPdfPage } from './utils/pdf-test-helpers.ts';

test.describe('在庫少出力PDF生成テスト', () => {
  test('在庫少出力ボタンでPDFを生成し、スクリーンショット比較でPDF内容を検証', async ({ page, context }) => {
    // タイムアウト時間を延長
    test.setTimeout(60000);
    
    // 1. YABOO ECサイト(http://localhost:3000)にアクセス
    console.log('Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // 現在のURLを確認
    console.log('Current URL:', page.url());
    console.log('Page title:', await page.title());
    
    // 2. データ読み込み完了を待つ（読み込み中テキストが消えるまで待つ）
    console.log('Waiting for data loading to complete...');
    await page.waitForSelector('text=読み込み中...', { state: 'detached', timeout: 10000 });
    
    // yaboo-buttonコンポーネントを確認
    const yabooButtonExists = await page.locator('yaboo-button:has-text("在庫少出力")').count();
    console.log('yaboo-button count:', yabooButtonExists);
    
    // 在庫少出力ボタンが有効になるまで待つ
    console.log('Waiting for 在庫少出力 button to be enabled...');
    if (yabooButtonExists > 0) {
      await page.waitForSelector('yaboo-button:has-text("在庫少出力"):not([disabled])', { timeout: 10000 });
    } else {
      await page.waitForSelector('button:has-text("在庫少出力"):not([disabled])', { timeout: 10000 });
    }

    // 4. 新しいタブでPDFが開かれることを確認
    console.log('Waiting for new PDF tab...');
    const pagePromise = context.waitForEvent('page');

    console.log('Clicking 在庫少出力 button...');
    if (yabooButtonExists > 0) {
      await page.click('yaboo-button:has-text("在庫少出力")');
    } else {
      await page.click('text=📊 在庫少出力');
    }

    const pdfPage = await pagePromise;
    console.log('New PDF tab opened.');

    // 5. 新しいタブからPDFのBase64データを取得
    const base64Data = await getBase64FromPdfPage(pdfPage);

    // Base64からBufferに変換
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    
    // PDFをローカルに保存
    const pdfFilePath = path.join(__dirname, '../test-results/downloaded-pdf.pdf');
    console.log('Saving PDF to:', pdfFilePath);
    fs.writeFileSync(pdfFilePath, pdfBuffer);

    // 7. 作成したライブラリを使ってPDFのテキスト内容を抽出して検証
    console.log('Extracting PDF text using custom library...');
    const pdfText = await extractTextFromPdf(pdfFilePath);
    console.log('Extracted text length:', pdfText.length);

    // 8. 期待結果PDFと比較して、内容が完全に一致することを検証
    console.log('Comparing downloaded PDF with expected PDF...');

    // 期待結果PDFからテキストを抽出
    const expectedPdfPath = path.join(__dirname, './expected-low-stock.pdf');
    const expectedText = await extractTextFromPdf(expectedPdfPath);
    console.log(`Expected text length: ${expectedText.length}`);

    // ダウンロードしたPDFのテキスト（actualText）と期待結果（expectedText）を比較
    expect(pdfText).toBe(expectedText);
    console.log('✓ Downloaded PDF content matches the expected content.');
    
    
  });
});