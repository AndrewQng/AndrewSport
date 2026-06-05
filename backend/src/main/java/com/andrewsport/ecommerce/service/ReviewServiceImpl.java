package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Review;
import com.andrewsport.ecommerce.model.User;
import com.andrewsport.ecommerce.repository.ReviewRepository;
import com.andrewsport.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Review> getReviewsByProduct(String productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Override
    public Map<String, Object> getProductRatingStats(String productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        double avg = 0.0;
        int count = reviews.size();
        
        if (count > 0) {
            double sum = 0.0;
            for (Review r : reviews) {
                sum += r.getRating();
            }
            avg = sum / count;
        }

        // Format to 1 decimal place
        avg = Math.round(avg * 10.0) / 10.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", avg);
        stats.put("totalReviews", count);
        return stats;
    }

    @Override
    public Review createReview(String productId, String username, int rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Số sao đánh giá phải từ 1 đến 5 sao.");
        }

        String fullName = username;
        try {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null && user.getFullName() != null) {
                fullName = user.getFullName();
            }
        } catch (Exception e) {
            // fallback to username
        }

        Review review = new Review(productId, username, fullName, rating, comment, LocalDateTime.now());
        return reviewRepository.save(review);
    }
}
