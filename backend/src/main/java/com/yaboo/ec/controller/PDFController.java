package com.yaboo.ec.controller;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.yaboo.ec.dto.ItemDto;
import com.yaboo.ec.service.ItemService;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "*")
public class PDFController {

  @Autowired private ItemService itemService;

  @GetMapping("/low-stock")
  public ResponseEntity<byte[]> generateLowStockPDF() {
    try {
      List<ItemDto> lowStockItems = itemService.getLowStockItems(10);
      System.out.println("PDF Controller - Items for PDF: " + lowStockItems.size());
      lowStockItems.forEach(item -> System.out.println("PDF Item: " + item.getItem() + ", Stock: " + item.getStock()));
      
      byte[] pdfData = generatePDF(lowStockItems);

      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_PDF);
      headers.setContentDisposition(
          org.springframework.http.ContentDisposition.inline().filename("low-stock-report.pdf").build());

      return ResponseEntity.ok().headers(headers).body(pdfData);

    } catch (Exception e) {
      e.printStackTrace(); // エラーログを出力
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  private byte[] generatePDF(List<ItemDto> items) throws DocumentException, IOException {
    System.out.println("Generating PDF for " + items.size() + " items");
    
    Document document = new Document(PageSize.A4);
    ByteArrayOutputStream out = new ByteArrayOutputStream();

    PdfWriter.getInstance(document, out);
    document.open();
    
    // データが空の場合のメッセージ
    if (items.isEmpty()) {
      Font normalFont = new Font(Font.FontFamily.HELVETICA, 12);
      Paragraph noDataMsg = new Paragraph("No low stock items found.", normalFont);
      noDataMsg.setAlignment(Element.ALIGN_CENTER);
      document.add(noDataMsg);
      document.close();
      return out.toByteArray();
    }

    // フォントの設定をコメントアウト（デフォルトフォントを使用）
    BaseFont baseFont;
    try {
      baseFont = BaseFont.createFont("HeiseiKakuGo-W5", "UniJIS-UCS2-H", BaseFont.NOT_EMBEDDED);
      System.out.println("Using Japanese font: HeiseiKakuGo-W5");
    } catch (Exception e) {
      System.out.println("Japanese font not available, using Helvetica: " + e.getMessage());
      baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
    }
    Font titleFont = new Font(baseFont, 18, Font.BOLD);
    Font headerFont = new Font(baseFont, 12, Font.BOLD);
    Font normalFont = new Font(baseFont, 10);
    
    // デフォルトフォントを使用
    // Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
    // Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
    // Font normalFont = new Font(Font.FontFamily.HELVETICA, 10);

    // タイトル（英語も併記してフォント問題を回避）
    Paragraph title = new Paragraph("Low Stock Items (Top 10)", titleFont);
    title.setAlignment(Element.ALIGN_CENTER);
    title.setSpacingAfter(20);
    document.add(title);


    // テーブル作成
    PdfPTable table = new PdfPTable(5);
    table.setWidthPercentage(100);
    table.setWidths(new float[] {1, 3, 3, 2, 2});

    // ヘッダー
    addTableHeader(table, headerFont);

    // データ行
    int rank = 1;
    for (ItemDto item : items) {
      addTableRow(table, rank++, item, normalFont);
    }

    document.add(table);

    // フッター
    Paragraph footer = new Paragraph("\n※在庫数の少ない順に表示しています", normalFont);
    footer.setAlignment(Element.ALIGN_LEFT);
    footer.setSpacingBefore(20);
    document.add(footer);

    document.close();
    return out.toByteArray();
  }

  private void addTableHeader(PdfPTable table, Font headerFont) {
    String[] headers = {"順位", "商品コード", "商品カテゴリ", "価格", "在庫数"};

    for (String header : headers) {
      PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
      cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
      cell.setHorizontalAlignment(Element.ALIGN_CENTER);
      cell.setPadding(8);
      table.addCell(cell);
    }
  }

  private void addTableRow(PdfPTable table, int rank, ItemDto item, Font normalFont) {
    // 順位
    PdfPCell rankCell = new PdfPCell(new Phrase(String.valueOf(rank), normalFont));
    rankCell.setHorizontalAlignment(Element.ALIGN_CENTER);
    rankCell.setPadding(8);
    table.addCell(rankCell);

    // 商品コード
    PdfPCell codeCell = new PdfPCell(new Phrase(item.getItem(), normalFont));
    codeCell.setHorizontalAlignment(Element.ALIGN_CENTER);
    codeCell.setPadding(8);
    table.addCell(codeCell);

    // 商品カテゴリ
    PdfPCell categoryCell = new PdfPCell(new Phrase(item.getItemCategory(), normalFont));
    categoryCell.setHorizontalAlignment(Element.ALIGN_LEFT);
    categoryCell.setPadding(8);
    table.addCell(categoryCell);

    // 価格
    PdfPCell priceCell =
        new PdfPCell(new Phrase("¥" + String.format("%,d", item.getItemPrice().longValue()), normalFont));
    priceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
    priceCell.setPadding(8);
    table.addCell(priceCell);

    // 在庫数
    PdfPCell stockCell = new PdfPCell(new Phrase(String.valueOf(item.getStock()), normalFont));
    stockCell.setHorizontalAlignment(Element.ALIGN_CENTER);
    stockCell.setPadding(8);

    // 在庫数に応じて背景色を変更
    if (item.getStock() == 0) {
      stockCell.setBackgroundColor(BaseColor.RED);
    } else if (item.getStock() <= 5) {
      stockCell.setBackgroundColor(BaseColor.YELLOW);
    }

    table.addCell(stockCell);
  }
}
