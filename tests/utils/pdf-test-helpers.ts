import { Page } from '@playwright/test';

/**
 * 新しいタブで開かれたPDFページから、PDFデータ本体をBase64文字列として取得します。
 * @param pdfPage - PDFが開かれているPlaywrightのPageオブジェクト
 * @returns PDFデータ本体のBase64文字列
 */
export async function getBase64FromPdfPage(pdfPage: Page): Promise<string> {
  // ページが完全に読み込まれるのを待つ
  await pdfPage.waitForLoadState('networkidle');
  await pdfPage.waitForTimeout(1000); // 念のため少し待機

  return await pdfPage.evaluate(async () => {
    const blobUrl = window.location.href;
    
    // XMLHttpRequestを使ってblobデータを取得
    const blob = await new Promise<Blob>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', blobUrl, true);
      xhr.responseType = 'blob';
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new TypeError('Network request failed'));
      xhr.send();
    });

    // FileReaderを使ってblobをData URL(Base64)に変換
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

    // "data:application/pdf;base64," のプレフィックス部分を削除して返す
    return dataUrl.split(',')[1];
  });
}
