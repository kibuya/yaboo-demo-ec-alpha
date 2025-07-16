package com.yaboo.ec.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "items")
public class Item {

  @Id
  @Column(name = "item", length = 20)
  private String item;

  @NotBlank
  @Column(name = "itemcate", length = 20)
  private String itemCategory;

  @NotNull
  @Column(name = "itemprice", precision = 10, scale = 0)
  private BigDecimal itemPrice;

  public Item() {}

  public Item(String item, String itemCategory, BigDecimal itemPrice) {
    this.item = item;
    this.itemCategory = itemCategory;
    this.itemPrice = itemPrice;
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
}
