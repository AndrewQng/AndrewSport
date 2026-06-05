package com.andrewsport.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "otps")
public class OtpVerification {
    @Id
    private String id;
    private String email;
    private String code;
    private String type; // "REGISTER", "FORGOT_PASSWORD"
    private LocalDateTime expiryTime;

    public OtpVerification() {}

    public OtpVerification(String email, String code, String type, LocalDateTime expiryTime) {
        this.email = email;
        this.code = code;
        this.type = type;
        this.expiryTime = expiryTime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }
}
