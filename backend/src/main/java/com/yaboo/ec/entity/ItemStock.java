package com.yaboo.ec.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "item_stocks")
public class ItemStock {

  @Id
  @Column(name = "item", length = 20)
  private String item;

  @NotNull
  @Column(name = "stock")
  private Integer stock;

  public ItemStock() {}

  public ItemStock(String item, Integer stock) {
    this.item = item;
    this.stock = stock;
  }

  public String getItem() {
    return item;
  }

  public void setItem(String item) {
    this.item = item;
  }

  public Integer getStock() {
    return stock;
  }

  public void setStock(Integer stock) {
    this.stock = stock;
  }
}
