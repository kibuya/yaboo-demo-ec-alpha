package com.yaboo.ec.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequestDto {
  @NotBlank private String customerId;

  @NotBlank private String password;

  public LoginRequestDto() {}

  public LoginRequestDto(String customerId, String password) {
    this.customerId = customerId;
    this.password = password;
  }

  public String getCustomerId() {
    return customerId;
  }

  public void setCustomerId(String customerId) {
    this.customerId = customerId;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
