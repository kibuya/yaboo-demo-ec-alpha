package com.yaboo.ec.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class OrderDto {
  private String orderNo;
  private String customerId;
  private LocalDate orderDate;
  private BigDecimal itemPrice;
  private String orderItem;
  private String orderItemCategory;
  private Integer orderNum;
  private BigDecimal orderPrice;

  public OrderDto() {}

  public OrderDto(
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
