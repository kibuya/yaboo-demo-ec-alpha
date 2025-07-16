package com.yaboo.ec.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "orders")
public class Order {

  @Id
  @Column(name = "orderno", length = 20)
  private String orderNo;

  @NotBlank
  @Column(name = "customerid", length = 10)
  private String customerId;

  @NotNull
  @Column(name = "orderdate")
  private LocalDate orderDate;

  @NotNull
  @Column(name = "itemprice", precision = 10, scale = 0)
  private BigDecimal itemPrice;

  @NotBlank
  @Column(name = "orderitem", length = 20)
  private String orderItem;

  @NotBlank
  @Column(name = "orderitemcate", length = 20)
  private String orderItemCategory;

  @NotNull
  @Column(name = "ordernum")
  private Integer orderNum;

  @NotNull
  @Column(name = "orderprice", precision = 10, scale = 0)
  private BigDecimal orderPrice;

  public Order() {}

  public Order(
      String orderNo,
      String customerId,
      LocalDate orderDate,
      BigDecimal itemPrice,
      String orderItem,
      String orderItemCategory,
      Integer orderNum,
      BigDecimal orderPrice) {
    this.orderNo = orderNo;
    this.customerId = customerId;
    this.orderDate = orderDate;
    this.itemPrice = itemPrice;
    this.orderItem = orderItem;
    this.orderItemCategory = orderItemCategory;
    this.orderNum = orderNum;
    this.orderPrice = orderPrice;
  }

  public String getOrderNo() {
    return orderNo;
  }

  public void setOrderNo(String orderNo) {
    this.orderNo = orderNo;
  }

  public String getCustomerId() {
    return customerId;
  }

  public void setCustomerId(String customerId) {
    this.customerId = customerId;
  }

  public LocalDate getOrderDate() {
    return orderDate;
  }

  public void setOrderDate(LocalDate orderDate) {
    this.orderDate = orderDate;
  }

  public BigDecimal getItemPrice() {
    return itemPrice;
  }

  public void setItemPrice(BigDecimal itemPrice) {
    this.itemPrice = itemPrice;
  }

  public String getOrderItem() {
    return orderItem;
  }

  public void setOrderItem(String orderItem) {
    this.orderItem = orderItem;
  }

  public String getOrderItemCategory() {
    return orderItemCategory;
  }

  public void setOrderItemCategory(String orderItemCategory) {
    this.orderItemCategory = orderItemCategory;
  }

  public Integer getOrderNum() {
    return orderNum;
  }

  public void setOrderNum(Integer orderNum) {
    this.orderNum = orderNum;
  }

  public BigDecimal getOrderPrice() {
    return orderPrice;
  }

  public void setOrderPrice(BigDecimal orderPrice) {
    this.orderPrice = orderPrice;
  }
}
