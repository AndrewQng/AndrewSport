package com.andrewsport.ecommerce.repository;

import com.andrewsport.ecommerce.model.OtpVerification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface OtpVerificationRepository extends MongoRepository<OtpVerification, String> {
    Optional<OtpVerification> findByEmailAndCodeAndType(String email, String code, String type);
    void deleteByEmailAndType(String email, String type);
}
