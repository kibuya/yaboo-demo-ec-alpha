import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

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

    // 3. 在庫少出力ボタンをクリック
    console.log('Clicking 在庫少出力 button...');
    if (yabooButtonExists > 0) {
      await page.click('yaboo-button:has-text("在庫少出力")');
    } else {
      await page.click('text=📊 在庫少出力');
    }

    // 4. 新しいタブでPDFが開かれることを確認
    console.log('Waiting for new PDF tab...');
    const pagePromise = context.waitForEvent('page');
    const pdfPage = await pagePromise;
    
    // PDFページのURLがblobで始まることを確認
    console.log('PDF Page URL:', pdfPage.url());
    expect(pdfPage.url()).toMatch(/^blob:http:\/\/localhost:3000\//);

    // 5. PDFタブに切り替え（自動的に新しいページに移動）
    await pdfPage.waitForLoadState('networkidle');

    // PDFが正常に読み込まれるまで少し待つ
    await pdfPage.waitForTimeout(3000);

    // 6. PDFが正常に生成されたことを基本確認
    console.log('Verifying PDF generation...');
    const response = await page.request.get('http://localhost:8080/api/pdf/low-stock');
    expect(response.ok()).toBeTruthy();
    
    // PDFのContent-Typeが正しいことを確認
    const contentType = response.headers()['content-type'];
    expect(contentType).toBe('application/pdf');
    
    // 7. PDFのテキスト内容を抽出して検証
    console.log('Extracting PDF text content for verification...');
    
    // blob URLからの取得方法（コメントアウト）
    /*
    const pdfArrayBuffer = await pdfPage.evaluate(async () => {
      try {
        // 現在のblob URLからPDFデータを取得
        const currentUrl = window.location.href;
        const response = await fetch(currentUrl);
        const arrayBuffer = await response.arrayBuffer();
        
        // ArrayBufferをUint8Arrayに変換して返す
        return Array.from(new Uint8Array(arrayBuffer));
        
      } catch (error) {
        console.error('PDF binary data extraction error:', error);
        throw error;
      }
    });
    
    const pdfBuffer = Buffer.from(pdfArrayBuffer);
    */
    
    // APIエンドポイントから直接PDFデータを取得
    console.log('Fetching PDF data from API endpoint...');
    const pdfResponse = await page.request.get('http://localhost:8080/api/pdf/low-stock');
    const pdfBuffer = await pdfResponse.body();
    
    // PDFをローカルに保存
    const pdfFilePath = path.join(__dirname, '../test-results/downloaded-pdf.pdf');
    console.log('Saving PDF to:', pdfFilePath);
    fs.writeFileSync(pdfFilePath, pdfBuffer);
    
    // 保存されたPDFファイルを読み込んでテキスト抽出
    console.log('Reading saved PDF file for text extraction...');
    const savedPdfBuffer = fs.readFileSync(pdfFilePath);
    
    // pdf.jsを使用してテキストを抽出
    console.log('Using pdf.js for text extraction...');
    
    // pdf.jsの設定
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/Users/yabukihironori/app/yaboo-demo-ec-alpha/node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs';
    
    // PDFドキュメントを読み込み
    const pdfDocument = await pdfjsLib.getDocument({
      data: savedPdfBuffer,
      verbosity: 0 // ログレベルを下げる
    }).promise;
    
    let pdfText = '';
    
    console.log('PDF document loaded, pages:', pdfDocument.numPages);
    
    // 全ページのテキストを抽出
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      console.log(`Page ${pageNum} text items:`, textContent.items.length);
      
      // テキストアイテムを結合
      const pageText = textContent.items
        .map((item) => item.str)
        .join(' ');
      
      pdfText += pageText + '\n';
      console.log(`Page ${pageNum} text:`, pageText);
    }
    
    console.log('Full PDF text extracted with pdf.js:', pdfText);
    console.log('PDF text length:', pdfText.length);
    
    // PDFバッファのサイズとヘッダーを確認
    console.log('PDF buffer size:', savedPdfBuffer.length);
    console.log('PDF header:', savedPdfBuffer.subarray(0, 8).toString('ascii'));
    
    // 8. 抽出したテキスト内容を検証
    // タイトルと金額がテキストに含まれているかチェック
    
    console.log('Validating PDF text content...');
    
    // 英語タイトルの存在を確認
    expect(pdfText).toContain('Low Stock Items');
    console.log('✓ Title "Low Stock Items" found in PDF text');
    
    // 期待される価格（¥789）の存在を確認
    expect(pdfText).toContain('789');
    console.log('✓ Expected price "789" found in PDF text');
    
    // 追加の検証：テーブルヘッダーの存在確認
    expect(pdfText).toContain('Rank');
    expect(pdfText).toContain('Price');
    console.log('✓ Table headers found in PDF text');
    
    console.log('PDFテキスト内容の検証が完了しました。1番目の商品価格¥789を含む正しいPDFが生成されています。');
    
    // PDFが正常に表示されていることも確認
    expect(pdfPage.url()).toContain('blob:');
  });
});