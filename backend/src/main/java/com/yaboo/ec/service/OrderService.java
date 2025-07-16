package com.yaboo.ec.service;

import com.yaboo.ec.dto.OrderDto;
import com.yaboo.ec.dto.OrderRequestDto;
import com.yaboo.ec.entity.Item;
import com.yaboo.ec.entity.ItemStock;
import com.yaboo.ec.entity.Order;
import com.yaboo.ec.repository.ItemRepository;
import com.yaboo.ec.repository.ItemStockRepository;
import com.yaboo.ec.repository.OrderRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

  @Autowired private OrderRepository orderRepository;

  @Autowired private ItemRepository itemRepository;

  @Autowired private ItemStockRepository itemStockRepository;

  public List<OrderDto> getOrdersByCustomerId(String customerId) {
    List<Order> orders = orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId);
    return orders.stream().map(this::convertToDto).collect(Collectors.toList());
  }

  public List<OrderDto> getAllOrders() {
    List<Order> orders = orderRepository.findAll();
    return orders.stream().map(this::convertToDto).collect(Collectors.toList());
  }

  @Transactional
  public OrderDto createOrder(OrderRequestDto orderRequest) {
    Optional<Item> itemOpt = itemRepository.findById(orderRequest.getItemCode());
    if (itemOpt.isEmpty()) {
      throw new IllegalArgumentException("Item not found: " + orderRequest.getItemCode());
    }

    Item item = itemOpt.get();
    Optional<ItemStock> stockOpt = itemStockRepository.findById(orderRequest.getItemCode());
    if (stockOpt.isEmpty() || stockOpt.get().getStock() < orderRequest.getQuantity()) {
      throw new IllegalArgumentException(
          "Insufficient stock for item: " + orderRequest.getItemCode());
    }

    ItemStock stock = stockOpt.get();
    stock.setStock(stock.getStock() - orderRequest.getQuantity());
    itemStockRepository.save(stock);

    String orderNo = generateOrderNo();
    BigDecimal orderPrice =
        item.getItemPrice().multiply(new BigDecimal(orderRequest.getQuantity()));

    Order order =
        new Order(
            orderNo,
            orderRequest.getCustomerId(),
            LocalDate.now(),
            item.getItemPrice(),
            item.getItem(),
            item.getItemCategory(),
            orderRequest.getQuantity(),
            orderPrice);

    Order savedOrder = orderRepository.save(order);
    return convertToDto(savedOrder);
  }

  private String generateOrderNo() {
    String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    long count = orderRepository.count() + 1;
    return String.format("%s-%06d", date, count);
  }

  private OrderDto convertToDto(Order order) {
    return new OrderDto(
        order.getOrderNo(),
        order.getCustomerId(),
        order.getOrderDate(),
        order.getItemPrice(),
        order.getOrderItem(),
        order.getOrderItemCategory(),
        order.getOrderNum(),
        order.getOrderPrice());
  }
}
