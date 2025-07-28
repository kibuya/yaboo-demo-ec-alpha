package com.yaboo.ec.service;

import com.yaboo.ec.dto.ItemDto;
import com.yaboo.ec.entity.Item;
import com.yaboo.ec.entity.ItemStock;
import com.yaboo.ec.repository.ItemRepository;
import com.yaboo.ec.repository.ItemStockRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ItemService {

  @Autowired private ItemRepository itemRepository;

  @Autowired private ItemStockRepository itemStockRepository;

  public List<ItemDto> getAllItems() {
    List<Item> items = itemRepository.findAll();
    return items.stream().map(this::convertToDto).collect(Collectors.toList());
  }

  public List<ItemDto> searchByCategory(String category) {
    List<Item> items = itemRepository.findByItemCategoryContainingIgnoreCase(category);
    return items.stream().map(this::convertToDto).collect(Collectors.toList());
  }

  public List<ItemDto> searchByItemCode(String itemCode) {
    List<Item> items = itemRepository.findByItemContainingIgnoreCase(itemCode);
    return items.stream().map(this::convertToDto).collect(Collectors.toList());
  }

  public Optional<ItemDto> getItemByCode(String itemCode) {
    Optional<Item> item = itemRepository.findById(itemCode);
    return item.map(this::convertToDto);
  }

  public List<ItemDto> getLowStockItems(int limit) {
    Pageable pageable = PageRequest.of(0, limit);
    List<ItemStock> lowStockItems = itemStockRepository.findAllOrderByStockAsc(pageable);
    
    System.out.println("Low stock items found: " + lowStockItems.size());
    lowStockItems.forEach(stock -> System.out.println("Item: " + stock.getItem() + ", Stock: " + stock.getStock()));

    return lowStockItems.stream()
        .map(
            stock -> {
              Optional<Item> item = itemRepository.findById(stock.getItem());
              return item.map(
                  i ->
                      new ItemDto(
                          i.getItem(), i.getItemCategory(), i.getItemPrice(), stock.getStock()));
            })
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.toList());
  }

  private ItemDto convertToDto(Item item) {
    Optional<ItemStock> stock = itemStockRepository.findById(item.getItem());
    Integer stockCount = stock.map(ItemStock::getStock).orElse(0);

    return new ItemDto(item.getItem(), item.getItemCategory(), item.getItemPrice(), stockCount);
  }
}
