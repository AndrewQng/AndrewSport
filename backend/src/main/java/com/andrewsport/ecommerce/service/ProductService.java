package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Product;
import java.util.List;

public interface ProductService {
    List<Product> getAllProducts(String category, String search);
    Product getProductById(String id);
    Product createProduct(Product product);
    Product updateProduct(String id, Product product);
    void deleteProduct(String id);
}
