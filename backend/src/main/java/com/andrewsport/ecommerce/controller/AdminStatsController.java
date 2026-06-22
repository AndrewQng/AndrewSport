package com.andrewsport.ecommerce.controller;

import com.andrewsport.ecommerce.model.Order;
import com.andrewsport.ecommerce.model.OrderItem;
import com.andrewsport.ecommerce.model.Product;
import com.andrewsport.ecommerce.model.User;
import com.andrewsport.ecommerce.repository.OrderRepository;
import com.andrewsport.ecommerce.repository.ProductRepository;
import com.andrewsport.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatsController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        List<Order> orders = orderRepository.findAll();
        List<Product> products = productRepository.findAll();
        List<User> users = userRepository.findAll();

        // 1. Total Revenue (VND) - Exclude Cancelled orders
        double totalRevenue = orders.stream()
                .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getOrderStatus()))
                .mapToDouble(Order::getTotalAmount)
                .sum();

        // 2. Counts
        long totalOrdersCount = orders.size();
        long activeProductsCount = products.stream()
                .filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus()))
                .count();
        long outOfStockProductsCount = products.stream()
                .filter(p -> p.getStockQuantity() <= 0)
                .count();
        long totalUsersCount = users.stream()
                .filter(u -> "USER".equalsIgnoreCase(u.getRole()))
                .count();

        // 3. Category Sales
        // Load products into map for quick lookup of categories
        Map<String, String> productCategoryMap = products.stream()
                .filter(p -> p.getId() != null)
                .collect(Collectors.toMap(Product::getId, Product::getCategory, (v1, v2) -> v1));

        Map<String, Double> categorySales = new HashMap<>();
        // Initialize default categories with 0.0
        categorySales.put("Badminton", 0.0);
        categorySales.put("Tennis", 0.0);
        categorySales.put("Pickleball", 0.0);

        for (Order o : orders) {
            if ("CANCELLED".equalsIgnoreCase(o.getOrderStatus())) continue;
            for (OrderItem item : o.getItems()) {
                if (item.getProductId() != null) {
                    String cat = productCategoryMap.get(item.getProductId());
                    if (cat == null) cat = "Badminton"; // default fallback
                    categorySales.put(cat, categorySales.getOrDefault(cat, 0.0) + (item.getPrice() * item.getQuantity()));
                }
            }
        }

        // 4. Sales over time (Daily Revenue)
        // Group by Date formatted as yyyy-MM-dd
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Map<String, Double> dailyRevenue = new TreeMap<>();
        
        for (Order o : orders) {
            if ("CANCELLED".equalsIgnoreCase(o.getOrderStatus())) continue;
            if (o.getOrderDate() != null) {
                String dateStr = o.getOrderDate().format(formatter);
                dailyRevenue.put(dateStr, dailyRevenue.getOrDefault(dateStr, 0.0) + o.getTotalAmount());
            }
        }

        List<Map<String, Object>> revenueTimeSeries = new ArrayList<>();
        for (Map.Entry<String, Double> entry : dailyRevenue.entrySet()) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", entry.getKey());
            point.put("revenue", entry.getValue());
            revenueTimeSeries.add(point);
        }

        // 5. Top Selling Products
        Map<String, Integer> productQuantities = new HashMap<>();
        Map<String, Double> productRevenues = new HashMap<>();
        Map<String, String> productNames = new HashMap<>();

        for (Order o : orders) {
            if ("CANCELLED".equalsIgnoreCase(o.getOrderStatus())) continue;
            for (OrderItem item : o.getItems()) {
                String pid = item.getProductId();
                if (pid != null) {
                    productQuantities.put(pid, productQuantities.getOrDefault(pid, 0) + item.getQuantity());
                    productRevenues.put(pid, productRevenues.getOrDefault(pid, 0.0) + (item.getPrice() * item.getQuantity()));
                    productNames.put(pid, item.getProductName());
                }
            }
        }

        List<Map<String, Object>> topProducts = new ArrayList<>();
        for (String pid : productQuantities.keySet()) {
            Map<String, Object> pInfo = new HashMap<>();
            pInfo.put("productId", pid);
            pInfo.put("name", productNames.get(pid));
            pInfo.put("quantity", productQuantities.get(pid));
            pInfo.put("revenue", productRevenues.get(pid));
            topProducts.add(pInfo);
        }
        // Sort by quantity desc
        topProducts.sort((p1, p2) -> Integer.compare((Integer) p2.get("quantity"), (Integer) p1.get("quantity")));
        if (topProducts.size() > 5) {
            topProducts = topProducts.subList(0, 5);
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalOrders", totalOrdersCount);
        stats.put("activeProducts", activeProductsCount);
        stats.put("outOfStockProducts", outOfStockProductsCount);
        stats.put("totalUsers", totalUsersCount);
        stats.put("categorySales", categorySales);
        stats.put("revenueTimeSeries", revenueTimeSeries);
        stats.put("topProducts", topProducts);

        return ResponseEntity.ok(stats);
    }
}
