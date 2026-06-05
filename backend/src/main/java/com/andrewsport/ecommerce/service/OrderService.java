package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Order;
import java.util.List;

public interface OrderService {
    Order createOrder(Order order);
    List<Order> getMyOrders(String username);
    List<Order> getAllOrders();
    Order updateOrderStatus(String id, String status);
    Order cancelOrder(String id, String username);
}
