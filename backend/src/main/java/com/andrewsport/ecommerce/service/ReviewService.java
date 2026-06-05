package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Review;
import java.util.List;
import java.util.Map;

public interface ReviewService {
    List<Review> getReviewsByProduct(String productId);
    Map<String, Object> getProductRatingStats(String productId);
    Review createReview(String productId, String username, int rating, String comment);
}
