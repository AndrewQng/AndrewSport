package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Order;
import org.springframework.lang.NonNull;
import java.util.List;

public interface OrderService {
    Order createOrder(Order order);
    List<Order> getMyOrders(String username);
    List<Order> getAllOrders();
    Order updateOrderStatus(@NonNull String id, String status);
    Order cancelOrder(@NonNull String id, String username);
}
