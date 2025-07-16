package com.yaboo.ec.controller;

import com.yaboo.ec.entity.Customer;
import com.yaboo.ec.service.CustomerService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

  @Autowired private CustomerService customerService;

  @GetMapping
  public ResponseEntity<List<Customer>> getAllCustomers() {
    List<Customer> customers = customerService.getAllCustomers();
    return ResponseEntity.ok(customers);
  }

  @GetMapping("/{customerId}")
  public ResponseEntity<Customer> getCustomer(@PathVariable String customerId) {
    Optional<Customer> customer = customerService.getCustomerById(customerId);
    return customer.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }
}
