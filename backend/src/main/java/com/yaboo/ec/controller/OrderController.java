package com.yaboo.ec.controller;

import com.yaboo.ec.dto.OrderDto;
import com.yaboo.ec.dto.OrderRequestDto;
import com.yaboo.ec.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

  @Autowired private OrderService orderService;

  @GetMapping
  public ResponseEntity<List<OrderDto>> getAllOrders() {
    List<OrderDto> orders = orderService.getAllOrders();
    return ResponseEntity.ok(orders);
  }

  @GetMapping("/customer/{customerId}")
  public ResponseEntity<List<OrderDto>> getOrdersByCustomer(@PathVariable String customerId) {
    List<OrderDto> orders = orderService.getOrdersByCustomerId(customerId);
    return ResponseEntity.ok(orders);
  }

  @PostMapping
  public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderRequestDto orderRequest) {
    try {
      OrderDto order = orderService.createOrder(orderRequest);
      return ResponseEntity.status(HttpStatus.CREATED).body(order);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }
}
