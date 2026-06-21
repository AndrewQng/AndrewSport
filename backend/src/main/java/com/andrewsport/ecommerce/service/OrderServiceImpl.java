package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Order;
import com.andrewsport.ecommerce.model.OrderItem;
import com.andrewsport.ecommerce.model.Product;
import com.andrewsport.ecommerce.model.User;
import com.andrewsport.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public Order createOrder(Order order) {
        double subtotal = 0.0;
        for (OrderItem item : order.getItems()) {
            Product product = productService.getProductById(item.getProductId());
            Double itemPrice = product.getPrice();
            
            if (item.getSku() != null && !item.getSku().trim().isEmpty() && product.getVariations() != null) {
                com.andrewsport.ecommerce.model.ProductVariation selectedVar = null;
                for (com.andrewsport.ecommerce.model.ProductVariation var : product.getVariations()) {
                    if (item.getSku().equals(var.getSku())) {
                        selectedVar = var;
                        break;
                    }
                }
                
                if (selectedVar != null) {
                    if (selectedVar.getStockQuantity() < item.getQuantity()) {
                        throw new RuntimeException("Biến thể sản phẩm " + product.getName() + " (" + item.getVariationDetail() + ") không đủ hàng trong kho!");
                    }
                    selectedVar.setStockQuantity(selectedVar.getStockQuantity() - item.getQuantity());
                    itemPrice = selectedVar.getPrice();
                    
                    int totalStock = 0;
                    for (com.andrewsport.ecommerce.model.ProductVariation var : product.getVariations()) {
                        totalStock += var.getStockQuantity();
                    }
                    product.setStockQuantity(totalStock);
                } else {
                    if (product.getStockQuantity() < item.getQuantity()) {
                        throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ hàng trong kho!");
                    }
                    product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
                }
            } else {
                if (product.getStockQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ hàng trong kho!");
                }
                product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            }
            
            productService.updateProduct(product.getId(), product);
            subtotal += itemPrice * item.getQuantity();
        }

        // Apply discount coupon if present
        double discount = 0.0;
        if (order.getCouponCode() != null && !order.getCouponCode().trim().isEmpty()) {
            String code = order.getCouponCode().trim().toUpperCase();
            if ("ANDREW20".equals(code)) {
                discount = subtotal * 0.2;
                if (discount > 500000.0) discount = 500000.0;
            } else if ("WELCOMESPORT".equals(code)) {
                discount = 100000.0;
                if (discount > subtotal) discount = subtotal;
            } else if ("PICKLEBALL".equals(code)) {
                discount = 50000.0;
                if (discount > subtotal) discount = subtotal;
            } else {
                throw new RuntimeException("Mã giảm giá không hợp lệ!");
            }
            order.setCouponCode(code);
        }

        order.setDiscountAmount(discount);
        order.setTotalAmount(subtotal - discount);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderStatus("PROCESSING");
        order.setPaymentStatus("PAID");
        
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getMyOrders(String username) {
        User user = userService.findByUsername(username);
        return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId());
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    @Transactional
    public Order updateOrderStatus(String id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setOrderStatus(status);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order cancelOrder(String id, String username) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại."));
        
        User user = userService.findByUsername(username);
        if (!order.getUserId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền hủy đơn hàng này.");
        }

        if (!"PROCESSING".equals(order.getOrderStatus())) {
            throw new RuntimeException("Chỉ có thể hủy đơn hàng khi trạng thái là PROCESSING (Đang xử lý).");
        }

        // Restore stock for all products in the cancelled order
        for (OrderItem item : order.getItems()) {
            try {
                Product product = productService.getProductById(item.getProductId());
                if (product != null) {
                    if (item.getSku() != null && !item.getSku().trim().isEmpty() && product.getVariations() != null) {
                        com.andrewsport.ecommerce.model.ProductVariation selectedVar = null;
                        for (com.andrewsport.ecommerce.model.ProductVariation var : product.getVariations()) {
                            if (item.getSku().equals(var.getSku())) {
                                selectedVar = var;
                                break;
                            }
                        }
                        if (selectedVar != null) {
                            selectedVar.setStockQuantity(selectedVar.getStockQuantity() + item.getQuantity());
                            
                            int totalStock = 0;
                            for (com.andrewsport.ecommerce.model.ProductVariation var : product.getVariations()) {
                                totalStock += var.getStockQuantity();
                            }
                            product.setStockQuantity(totalStock);
                        } else {
                            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                        }
                    } else {
                        product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                    }
                    productService.updateProduct(product.getId(), product);
                }
            } catch (Exception e) {
                // Ignore if product was deleted from catalog
            }
        }

        order.setOrderStatus("CANCELLED");
        return orderRepository.save(order);
    }
}
