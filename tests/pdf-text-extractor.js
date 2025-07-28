// PDF text extraction utility using pdfjs-dist
const fs = require('fs');
const pdfParse = require('pdfjs-dist/legacy/build/pdf.js');

async function extractTextFromPDF(pdfBuffer) {
  try {
    // PDFドキュメントを読み込み
    const pdfDocument = await pdfParse.getDocument(pdfBuffer).promise;
    
    let fullText = '';
    
    // 全ページのテキストを抽出
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // テキストアイテムを結合
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    throw new Error('PDF text extraction failed: ' + error.message);
  }
}

module.exports = { extractTextFromPDF };