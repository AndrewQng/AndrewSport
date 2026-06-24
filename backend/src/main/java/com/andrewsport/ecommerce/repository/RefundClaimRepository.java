package com.andrewsport.ecommerce.repository;

import com.andrewsport.ecommerce.model.RefundClaim;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RefundClaimRepository extends MongoRepository<RefundClaim, String> {
    List<RefundClaim> findByUserId(String userId);
    List<RefundClaim> findByOrderId(String orderId);
    List<RefundClaim> findAllByOrderByCreatedAtDesc();
    List<RefundClaim> findByUserIdOrderByCreatedAtDesc(String userId);
}
