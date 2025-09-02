import { promises as fs } from 'fs';
import { createRequire } from 'module';
import path from 'path';
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// ESM内でrequire.resolveを使うための準備
const require = createRequire(import.meta.url);

/**
 * PDFファイルから全てのテキストを抽出します。
 * @param {string} filePath - PDFファイルのパス
 * @returns {Promise<string>} 抽出したテキスト全体
 */
export async function extractTextFromPdf(filePath) {
  // ワーカーと追加リソースのパスを解決
  const workerSrc = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
  const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
  const cMapUrl = path.join(pdfjsDistPath, 'cmaps/');
  const standardFontDataUrl = path.join(pdfjsDistPath, 'standard_fonts/');

  pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

  try {
    const data = new Uint8Array(await fs.readFile(filePath));

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