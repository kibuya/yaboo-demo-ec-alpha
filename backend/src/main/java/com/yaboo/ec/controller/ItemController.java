package com.yaboo.ec.controller;

import com.yaboo.ec.dto.ItemDto;
import com.yaboo.ec.service.ItemService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

  @Autowired private ItemService itemService;

  @GetMapping
  public ResponseEntity<List<ItemDto>> getAllItems() {
    List<ItemDto> items = itemService.getAllItems();
    return ResponseEntity.ok(items);
  }

  @GetMapping("/search")
  public ResponseEntity<List<ItemDto>> searchItems(
      @RequestParam(required = false) String category,
      @RequestParam(required = false) String itemCode) {

    List<ItemDto> items;
    if (category != null && !category.isEmpty()) {
      items = itemService.searchByCategory(category);
    } else if (itemCode != null && !itemCode.isEmpty()) {
      items = itemService.searchByItemCode(itemCode);
    } else {
      items = itemService.getAllItems();
    }

    return ResponseEntity.ok(items);
  }

  @GetMapping("/{itemCode}")
  public ResponseEntity<ItemDto> getItem(@PathVariable String itemCode) {
    Optional<ItemDto> item = itemService.getItemByCode(itemCode);
    return item.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }
}
