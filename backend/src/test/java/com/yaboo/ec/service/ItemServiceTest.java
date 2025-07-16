package com.yaboo.ec.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

import com.yaboo.ec.dto.ItemDto;
import com.yaboo.ec.entity.Item;
import com.yaboo.ec.entity.ItemStock;
import com.yaboo.ec.repository.ItemRepository;
import com.yaboo.ec.repository.ItemStockRepository;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

  @Mock private ItemRepository itemRepository;

  @Mock private ItemStockRepository itemStockRepository;

  @InjectMocks private ItemService itemService;

  @Test
  void getAllItems_ShouldReturnAllItemsWithStock() {
    Item item1 = new Item("ax10002", "家具", new BigDecimal("23700"));
    Item item2 = new Item("gr10003", "家電", new BigDecimal("28200"));
    List<Item> items = Arrays.asList(item1, item2);

    ItemStock stock1 = new ItemStock("ax10002", 13);
    ItemStock stock2 = new ItemStock("gr10003", 146);

    when(itemRepository.findAll()).thenReturn(items);
    when(itemStockRepository.findById("ax10002")).thenReturn(Optional.of(stock1));
    when(itemStockRepository.findById("gr10003")).thenReturn(Optional.of(stock2));

    List<ItemDto> result = itemService.getAllItems();

    assertNotNull(result);
    assertEquals(2, result.size());
    assertEquals("ax10002", result.get(0).getItem());
    assertEquals(13, result.get(0).getStock());
    assertEquals("gr10003", result.get(1).getItem());
    assertEquals(146, result.get(1).getStock());
  }

  @Test
  void searchByCategory_ShouldReturnFilteredItems() {
    Item item = new Item("gr10003", "家電", new BigDecimal("28200"));
    List<Item> items = Arrays.asList(item);
    ItemStock stock = new ItemStock("gr10003", 146);

    when(itemRepository.findByItemCategoryContainingIgnoreCase("家電")).thenReturn(items);
    when(itemStockRepository.findById("gr10003")).thenReturn(Optional.of(stock));

    List<ItemDto> result = itemService.searchByCategory("家電");

    assertNotNull(result);
    assertEquals(1, result.size());
    assertEquals("家電", result.get(0).getItemCategory());
  }
}
