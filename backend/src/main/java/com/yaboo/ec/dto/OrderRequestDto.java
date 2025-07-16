package com.yaboo.ec.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class OrderRequestDto {
  @NotBlank private String customerId;

  @NotBlank private String itemCode;

  @NotNull @Positive private Integer quantity;

  public OrderRequestDto() {}

  public OrderRequestDto(String customerId, String itemCode, Integer quantity) {
    this.customerId = customerId;
    this.itemCode = itemCode;
    this.quantity = quantity;
  }

  public String getCustomerId() {
    return customerId;
  }

  public void setCustomerId(String customerId) {
    this.customerId = customerId;
  }

  public String getItemCode() {
    return itemCode;
  }

  public void setItemCode(String itemCode) {
    this.itemCode = itemCode;
  }

  public Integer getQuantity() {
    return quantity;
  }

  public void setQuantity(Integer quantity) {
    this.quantity = quantity;
  }
}
