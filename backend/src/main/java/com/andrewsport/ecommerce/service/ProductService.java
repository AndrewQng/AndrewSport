package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Product;
import org.springframework.lang.NonNull;
import java.util.List;

public interface ProductService {
    List<Product> getAllProducts(String category, String search);
    Product getProductById(@NonNull String id);
    Product createProduct(Product product);
    Product updateProduct(@NonNull String id, Product product);
    void deleteProduct(@NonNull String id);
}
