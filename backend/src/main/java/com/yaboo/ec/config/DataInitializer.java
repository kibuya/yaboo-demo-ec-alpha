package com.yaboo.ec.config;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import com.yaboo.ec.entity.Customer;
import com.yaboo.ec.entity.Item;
import com.yaboo.ec.entity.ItemStock;
import com.yaboo.ec.entity.Order;
import com.yaboo.ec.repository.CustomerRepository;
import com.yaboo.ec.repository.ItemRepository;
import com.yaboo.ec.repository.ItemStockRepository;
import com.yaboo.ec.repository.OrderRepository;
import java.io.FileReader;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

  private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
  private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy/M/d");

  @Autowired private CustomerRepository customerRepository;

  @Autowired private ItemRepository itemRepository;

  @Autowired private ItemStockRepository itemStockRepository;

  @Autowired private OrderRepository orderRepository;

  @Override
  public void run(String... args) {
    try {
      loadCustomers();
      loadItems();
      loadItemStocks();
      loadOrders();
      logger.info("Sample data loaded successfully");
    } catch (Exception e) {
      logger.error("Failed to load sample data", e);
    }
  }

  private void loadCustomers() throws IOException, CsvException {
    if (customerRepository.count() > 0) {
      logger.info("Customers already exist, skipping data load");
      return;
    }

    ClassPathResource resource = new ClassPathResource("sample-data/cust.csv");
    try (CSVReader reader = new CSVReader(new FileReader(resource.getFile()))) {
      List<String[]> records = reader.readAll();
      records.remove(0);

      for (String[] record : records) {
        try {
          if (record.length < 10 || record[0].trim().isEmpty()) {
            continue; // Skip invalid records
          }
          Customer customer =
              new Customer(
                  record[0].trim(),
                  record[1].trim(),
                  record[2].trim(),
                  record[3].trim(),
                  record[4].trim(),
                  LocalDate.parse(record[5].trim(), DATE_FORMATTER),
                  Integer.parseInt(record[6].trim()),
                  Integer.parseInt(record[7].trim()),
                  new BigDecimal(record[8].trim()),
                  LocalDate.parse(record[9].trim(), DATE_FORMATTER),
                  "password");
          customerRepository.save(customer);
        } catch (Exception e) {
          logger.warn("Failed to parse customer record: {}", String.join(",", record), e);
        }
      }
      logger.info("Loaded {} customers", records.size());
    }
  }

  private void loadItems() throws IOException, CsvException {
    if (itemRepository.count() > 0) {
      logger.info("Items already exist, skipping data load");
      return;
    }

    ClassPathResource resource = new ClassPathResource("sample-data/item.csv");
    try (CSVReader reader = new CSVReader(new FileReader(resource.getFile()))) {
      List<String[]> records = reader.readAll();
      records.remove(0);

      for (String[] record : records) {
        try {
          if (record.length < 3 || record[0].trim().isEmpty()) {
            continue; // Skip invalid records
          }
          Item item =
              new Item(record[0].trim(), record[1].trim(), new BigDecimal(record[2].trim()));
          itemRepository.save(item);
        } catch (Exception e) {
          logger.warn("Failed to parse item record: {}", String.join(",", record), e);
        }
      }
      logger.info("Loaded {} items", records.size());
    }
  }

  private void loadItemStocks() throws IOException, CsvException {
    if (itemStockRepository.count() > 0) {
      logger.info("Item stocks already exist, skipping data load");
      return;
    }

    ClassPathResource resource = new ClassPathResource("sample-data/itemstock.csv");
    try (CSVReader reader = new CSVReader(new FileReader(resource.getFile()))) {
      List<String[]> records = reader.readAll();
      records.remove(0);

      for (String[] record : records) {
        try {
          if (record.length < 2 || record[0].trim().isEmpty() || record[1].trim().isEmpty()) {
            continue; // Skip invalid records
          }
          ItemStock itemStock = new ItemStock(record[0].trim(), Integer.parseInt(record[1].trim()));
          itemStockRepository.save(itemStock);
        } catch (Exception e) {
          logger.warn("Failed to parse item stock record: {}", String.join(",", record), e);
        }
      }
      logger.info("Loaded {} item stocks", records.size());
    }
  }

  private void loadOrders() throws IOException, CsvException {
    if (orderRepository.count() > 0) {
      logger.info("Orders already exist, skipping data load");
      return;
    }

    ClassPathResource resource = new ClassPathResource("sample-data/order.csv");
    try (CSVReader reader = new CSVReader(new FileReader(resource.getFile()))) {
      List<String[]> records = reader.readAll();
      records.remove(0);

      for (String[] record : records) {
        try {
          if (record.length < 8 || record[0].trim().isEmpty() || record[2].trim().isEmpty()) {
            continue; // Skip invalid records
          }
          Order order =
              new Order(
                  record[2].trim(),
                  record[0].trim(),
                  LocalDate.parse(record[1].trim(), DATE_FORMATTER),
                  new BigDecimal(record[3].trim()),
                  record[4].trim(),
                  record[5].trim(),
                  Integer.parseInt(record[6].trim()),
                  new BigDecimal(record[7].trim()));
          orderRepository.save(order);
        } catch (Exception e) {
          logger.warn("Failed to parse order record: {}", String.join(",", record), e);
        }
      }
      logger.info("Loaded {} orders", records.size());
    }
  }
}
