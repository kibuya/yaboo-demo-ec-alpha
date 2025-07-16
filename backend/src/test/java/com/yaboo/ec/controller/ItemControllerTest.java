package com.yaboo.ec.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.yaboo.ec.dto.ItemDto;
import com.yaboo.ec.service.ItemService;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
    controllers = ItemController.class,
    excludeAutoConfiguration = {
      org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
    })
class ItemControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private ItemService itemService;

  @Test
  void getAllItems_ShouldReturnItemList() throws Exception {
    List<ItemDto> items =
        Arrays.asList(
            new ItemDto("ax10002", "家具", new BigDecimal("23700"), 13),
            new ItemDto("gr10003", "家電", new BigDecimal("28200"), 146));

    when(itemService.getAllItems()).thenReturn(items);

    mockMvc
        .perform(get("/api/items"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].item").value("ax10002"))
        .andExpect(jsonPath("$[0].itemCategory").value("家具"))
        .andExpect(jsonPath("$[0].itemPrice").value(23700))
        .andExpect(jsonPath("$[0].stock").value(13));
  }

  @Test
  void searchItems_WithCategory_ShouldReturnFilteredItems() throws Exception {
    List<ItemDto> items = Arrays.asList(new ItemDto("gr10003", "家電", new BigDecimal("28200"), 146));

    when(itemService.searchByCategory("家電")).thenReturn(items);

    mockMvc
        .perform(get("/api/items/search").param("category", "家電"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].itemCategory").value("家電"));
  }
}
