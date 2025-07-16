package com.yaboo.ec.repository;

import com.yaboo.ec.entity.Item;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, String> {

  List<Item> findByItemCategoryContainingIgnoreCase(String category);

  List<Item> findByItemContainingIgnoreCase(String itemCode);
}
