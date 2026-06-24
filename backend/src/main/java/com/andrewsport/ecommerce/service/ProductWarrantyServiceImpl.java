package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Order;
import com.andrewsport.ecommerce.model.OrderItem;
import com.andrewsport.ecommerce.model.Product;
import com.andrewsport.ecommerce.model.ProductWarranty;
import com.andrewsport.ecommerce.model.User;
import com.andrewsport.ecommerce.repository.ProductWarrantyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class ProductWarrantyServiceImpl implements ProductWarrantyService {

    @Autowired
    private ProductWarrantyRepository productWarrantyRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    private final Random random = new Random();

    @Override
    @Transactional
    public void generateWarrantiesForOrder(Order order) {
        // Check if warranties are already generated for this order to avoid duplicates
        List<ProductWarranty> existing = productWarrantyRepository.findByOrderId(order.getId());
        if (!existing.isEmpty()) {
            return;
        }

        for (OrderItem item : order.getItems()) {
            try {
                Product product = productService.getProductById(item.getProductId());
                int warrantyMonths = product != null ? product.getWarrantyPeriod() : 12;

                // Generate a unique warranty code
                String warrantyCode = generateUniqueWarrantyCode();

                LocalDateTime expiryDate = LocalDateTime.now().plusMonths(warrantyMonths);

                ProductWarranty warranty = new ProductWarranty(
                        warrantyCode,
                        order.getId(),
                        item.getProductId(),
                        item.getProductName(),
                        item.getSku(),
                        order.getUserId(),
                        expiryDate,
                        "ACTIVE"
                );

                productWarrantyRepository.save(warranty);
            } catch (Exception e) {
                System.err.println("Failed to generate warranty for product " + item.getProductId() + ": " + e.getMessage());
            }
        }
    }

    @Override
    public List<ProductWarranty> getMyWarranties(String username) {
        User user = userService.findByUsername(username);
        return productWarrantyRepository.findByUserId(user.getId());
    }

    @Override
    public List<ProductWarranty> getWarrantiesByOrderId(String orderId) {
        return productWarrantyRepository.findByOrderId(orderId);
    }

    private String generateUniqueWarrantyCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        while (true) {
            StringBuilder sb = new StringBuilder("WAR-");
            for (int i = 0; i < 8; i++) {
                sb.append(chars.charAt(random.nextInt(chars.length())));
            }
            String code = sb.toString();
            if (productWarrantyRepository.findByWarrantyCode(code).isEmpty()) {
                return code;
            }
        }
    }
}
