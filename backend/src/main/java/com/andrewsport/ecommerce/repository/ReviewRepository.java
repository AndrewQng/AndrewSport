package com.andrewsport.ecommerce.repository;

import com.andrewsport.ecommerce.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByProductId(String productId);
    long countByProductId(String productId);
}
