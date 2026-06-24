package com.andrewsport.ecommerce.repository;

import com.andrewsport.ecommerce.model.WarrantyClaim;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface WarrantyClaimRepository extends MongoRepository<WarrantyClaim, String> {
    List<WarrantyClaim> findByUserId(String userId);
    List<WarrantyClaim> findByOrderId(String orderId);
    Optional<WarrantyClaim> findByWarrantyCode(String warrantyCode);
    List<WarrantyClaim> findAllByOrderByCreatedAtDesc();
    List<WarrantyClaim> findByUserIdOrderByCreatedAtDesc(String userId);
}
