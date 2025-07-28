package com.yaboo.ec.repository;

import com.yaboo.ec.entity.ItemStock;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemStockRepository extends JpaRepository<ItemStock, String> {

  @Query("SELECT s FROM ItemStock s ORDER BY s.stock ASC")
  List<ItemStock> findAllOrderByStockAsc(Pageable pageable);
}
