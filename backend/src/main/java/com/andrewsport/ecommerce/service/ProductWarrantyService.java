package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Order;
import com.andrewsport.ecommerce.model.ProductWarranty;
import java.util.List;

public interface ProductWarrantyService {
    void generateWarrantiesForOrder(Order order);
    List<ProductWarranty> getMyWarranties(String username);
    List<ProductWarranty> getWarrantiesByOrderId(String orderId);
}
