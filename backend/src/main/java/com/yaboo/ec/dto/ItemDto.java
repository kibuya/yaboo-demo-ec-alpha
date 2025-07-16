package com.yaboo.ec.dto;

import java.math.BigDecimal;

public class ItemDto {
  private String item;
  private String itemCategory;
  private BigDecimal itemPrice;
  private Integer stock;

  public ItemDto() {}

  public ItemDto(String item, String itemCategory, BigDecimal itemPrice, Integer stock) {
    this.item = item;
    this.itemCategory = itemCategory;
    this.itemPrice = itemPrice;
    this.stock = stock;
  }

  public String getItem() {
    return item;
  }

  public void setItem(String item) {
    this.item = item;
  }

  public String getItemCategory() {
    return itemCategory;
  }

  public void setItemCategory(String itemCategory) {
    this.itemCategory = itemCategory;
  }

  public BigDecimal getItemPrice() {
    return itemPrice;
  }

  public void setItemPrice(BigDecimal itemPrice) {
    this.itemPrice = itemPrice;
  }

  public Integer getStock() {
    return stock;
  }

  public void setStock(Integer stock) {
    this.stock = stock;
  }
}
