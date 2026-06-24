package com.andrewsport.ecommerce.repository;

import com.andrewsport.ecommerce.model.ProductWarranty;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ProductWarrantyRepository extends MongoRepository<ProductWarranty, String> {
    List<ProductWarranty> findByUserId(String userId);
    List<ProductWarranty> findByOrderId(String orderId);
    Optional<ProductWarranty> findByWarrantyCode(String warrantyCode);
    Optional<ProductWarranty> findByWarrantyCodeAndUserId(String warrantyCode, String userId);
}
