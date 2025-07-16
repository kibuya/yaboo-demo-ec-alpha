package com.yaboo.ec.service;

import com.yaboo.ec.entity.Customer;
import com.yaboo.ec.repository.CustomerRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

  @Autowired private CustomerRepository customerRepository;

  public List<Customer> getAllCustomers() {
    return customerRepository.findAll();
  }

  public Optional<Customer> getCustomerById(String customerId) {
    return customerRepository.findByCustomerId(customerId);
  }

  public boolean validateCustomer(String customerId, String password) {
    Optional<Customer> customer = customerRepository.findByCustomerId(customerId);
    return customer.isPresent() && customer.get().getPassword().equals(password);
  }
}
