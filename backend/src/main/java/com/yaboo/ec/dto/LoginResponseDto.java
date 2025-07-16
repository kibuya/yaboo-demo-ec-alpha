package com.yaboo.ec.dto;

public class LoginResponseDto {
  private String customerId;
  private String firstName;
  private String lastName;
  private boolean success;
  private String message;

  public LoginResponseDto() {}

  public LoginResponseDto(
      String customerId, String firstName, String lastName, boolean success, String message) {
    this.customerId = customerId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.success = success;
    this.message = message;
  }

  public static LoginResponseDto success(String customerId, String firstName, String lastName) {
    return new LoginResponseDto(customerId, firstName, lastName, true, "ログイン成功");
  }

  public static LoginResponseDto failure(String message) {
    return new LoginResponseDto(null, null, null, false, message);
  }

  public String getCustomerId() {
    return customerId;
  }

  public void setCustomerId(String customerId) {
    this.customerId = customerId;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public boolean isSuccess() {
    return success;
  }

  public void setSuccess(boolean success) {
    this.success = success;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }
}
