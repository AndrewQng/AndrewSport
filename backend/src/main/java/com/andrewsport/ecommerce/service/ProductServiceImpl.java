package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Product;
import com.andrewsport.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts(String category, String search) {
        boolean hasCategory = StringUtils.hasText(category);
        boolean hasSearch = StringUtils.hasText(search);
        List<Product> rawProducts;

        if (hasCategory && hasSearch) {
            rawProducts = productRepository.findByCategoryIgnoreCaseAndNameContainingIgnoreCase(category, search);
        } else if (hasCategory) {
            rawProducts = productRepository.findByCategoryIgnoreCase(category);
        } else if (hasSearch) {
            rawProducts = productRepository.findByNameContainingIgnoreCase(search);
        } else {
            rawProducts = productRepository.findAll();
        }

        return rawProducts.stream()
                .filter(p -> !"DELETED".equalsIgnoreCase(p.getStatus()))
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Override
    public Product createProduct(Product product) {
        if (product.getStatus() == null) {
            product.setStatus("ACTIVE");
        }
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(String id, Product productDetails) {
        Product product = getProductById(id);
        
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setImageUrl(productDetails.getImageUrl());
        product.setCategory(productDetails.getCategory());
        product.setBrand(productDetails.getBrand());
        product.setStatus(productDetails.getStatus());
        product.setIsFlashSale(productDetails.getIsFlashSale());
        product.setFlashSalePrice(productDetails.getFlashSalePrice());

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(String id) {
        Product product = getProductById(id);
        product.setStatus("DELETED");
        productRepository.save(product);
    }
}
