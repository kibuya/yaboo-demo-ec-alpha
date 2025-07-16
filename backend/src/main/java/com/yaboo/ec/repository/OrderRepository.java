package com.yaboo.ec.repository;

import com.yaboo.ec.entity.Order;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

  List<Order> findByCustomerIdOrderByOrderDateDesc(String customerId);
}
