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
@Table(name = "customers")
public class Customer {

  @Id
  @Column(name = "customerid", length = 10)
  private String customerId;

  @NotBlank
  @Column(name = "lastname", length = 50)
  private String lastName;

  @NotBlank
  @Column(name = "firstname", length = 50)
  private String firstName;

  @NotBlank
  @Column(name = "areacode", length = 5)
  private String areaCode;

  @NotBlank
  @Column(name = "area", length = 20)
  private String area;

  @NotNull
  @Column(name = "birthday")
  private LocalDate birthday;

  @NotNull
  @Column(name = "age")
  private Integer age;

  @NotNull
  @Column(name = "sex")
  private Integer sex;

  @Column(name = "totalprice", precision = 10, scale = 0)
  private BigDecimal totalPrice;

  @Column(name = "lastorderdate")
  private LocalDate lastOrderDate;

  @NotBlank
  @Column(name = "password", length = 255)
  private String password;

  public Customer() {}

  public Customer(
      String customerId,
      String lastName,
      String firstName,
      String areaCode,
      String area,
      LocalDate birthday,
      Integer age,
      Integer sex,
      BigDecimal totalPrice,
      LocalDate lastOrderDate,
      String password) {
    this.customerId = customerId;
    this.lastName = lastName;
    this.firstName = firstName;
    this.areaCode = areaCode;
    this.area = area;
    this.birthday = birthday;
    this.age = age;
    this.sex = sex;
    this.totalPrice = totalPrice;
    this.lastOrderDate = lastOrderDate;
    this.password = password;
  }

  public String getCustomerId() {
    return customerId;
  }

  public void setCustomerId(String customerId) {
    this.customerId = customerId;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getAreaCode() {
    return areaCode;
  }

  public void setAreaCode(String areaCode) {
    this.areaCode = areaCode;
  }

  public String getArea() {
    return area;
  }

  public void setArea(String area) {
    this.area = area;
  }

  public LocalDate getBirthday() {
    return birthday;
  }

  public void setBirthday(LocalDate birthday) {
    this.birthday = birthday;
  }

  public Integer getAge() {
    return age;
  }

  public void setAge(Integer age) {
    this.age = age;
  }

  public Integer getSex() {
    return sex;
  }

  public void setSex(Integer sex) {
    this.sex = sex;
  }

  public BigDecimal getTotalPrice() {
    return totalPrice;
  }

  public void setTotalPrice(BigDecimal totalPrice) {
    this.totalPrice = totalPrice;
  }

  public LocalDate getLastOrderDate() {
    return lastOrderDate;
  }

  public void setLastOrderDate(LocalDate lastOrderDate) {
    this.lastOrderDate = lastOrderDate;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
