package com.yaboo.ec.controller;

import com.yaboo.ec.dto.LoginRequestDto;
import com.yaboo.ec.dto.LoginResponseDto;
import com.yaboo.ec.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

  @Autowired private CustomerService customerService;

  @PostMapping("/login")
  public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {
    try {
      if (customerService.validateCustomer(
          loginRequest.getCustomerId(), loginRequest.getPassword())) {
        var customer = customerService.getCustomerById(loginRequest.getCustomerId());
        if (customer.isPresent()) {
          LoginResponseDto response =
              LoginResponseDto.success(
                  customer.get().getCustomerId(),
                  customer.get().getFirstName(),
                  customer.get().getLastName());
          return ResponseEntity.ok(response);
        }
      }

      LoginResponseDto response = LoginResponseDto.failure("顧客IDまたはパスワードが正しくありません");
      return ResponseEntity.badRequest().body(response);
    } catch (Exception e) {
      LoginResponseDto response = LoginResponseDto.failure("ログイン処理でエラーが発生しました");
      return ResponseEntity.internalServerError().body(response);
    }
  }
}
