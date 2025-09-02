// =================================================================================
// pdfjs-dist を Node.js (CommonJS) 環境で利用するための注意点
// ---------------------------------------------------------------------------------
// 2024年8月現在、pdfjs-distの最新バージョンをNode.jsで利用するには、いくつかの課題を
// 解決する必要がある。このコードは、その解決策を反映したものである。
//
// 1. モジュールの読み込み:
//    - 最新版の`legacy`ビルドは、CommonJS(.js)ではなくESM(.mjs)形式で提供される。
//    - そのため、`require()`では直接読み込めず、非同期の`import()`を使う必要がある。
//
// 2. ワーカーのセットアップ:
//    - Node.js環境でテキスト抽出(`getTextContent`)を正しく機能させるには、
//      バックグラウンドでPDFを解析するワーカープロセスが必要。
//    - `GlobalWorkerOptions.workerSrc`に、`pdf.worker.mjs`の絶対パスを
//      設定することでワーカーを有効化する。
//
// 3. 日本語(マルチバイト文字)の対応:
//    - 日本語を含むPDFを正しく解析するには、文字コードとフォントのマッピング情報が
//      必要となり、CMapファイルと標準フォントへのパスを明示的に指定する必要がある。
//    - `getDocument`のオプションとして`cMapUrl`と`standardFontDataUrl`を設定する。
//
// 参考情報:
// - 公式サンプル: https://github.com/mozilla/pdf.js/blob/master/examples/node/getinfo.js
// - 関連Issue: https://github.com/mozilla/pdf.js/issues/13322
// =================================================================================
const fs = require('fs');
const path = require('path');

// モジュールと初期化状態を保持する変数
let pdfjsLib;
let isInitialized = false;

// ライブラリの非同期初期化
async function initializePdfJs() {
  if (isInitialized) {
    return; // 既に初期化済み
  }

  try {
    // ESM形式のpdf.mjsを動的にimport
    const pdfjsModule = await import('pdfjs-dist/legacy/build/pdf.mjs');
    pdfjsLib = pdfjsModule;
    
    // ワーカーのパスを設定
    pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
    
    isInitialized = true;

  } catch (error) {
    console.error('Failed to initialize pdf.js library:', error);
    throw error;
  }
}

/**
 * PDFファイルから全てのテキストを抽出します。
 * @param {string} filePath - PDFファイルのパス
 * @returns {Promise<string>} 抽出したテキスト全体
 */
async function extractTextFromPdf(filePath) {
  // 実行前に初期化を保証する
  await initializePdfJs();

  try {
    const data = new Uint8Array(fs.readFileSync(filePath));

    // CMapと標準フォントのパスを解決
    const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
    const cMapUrl = path.join(pdfjsDistPath, 'cmaps/');
    const standardFontDataUrl = path.join(pdfjsDistPath, 'standard_fonts/');

    const pdfDocument = await pdfjsLib.getDocument({
      data,
      verbosity: 0,
      cMapUrl: cMapUrl,
      cMapPacked: true,
      standardFontDataUrl: standardFontDataUrl,
    }).promise;

    let fullText = '';
    const numPages = pdfDocument.numPages;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();

  } catch (error) {
    console.error(`Error extracting text from PDF: ${filePath}`, error);
    throw error;
  }
}

module.exports = {
  extractTextFromPdf,
};
