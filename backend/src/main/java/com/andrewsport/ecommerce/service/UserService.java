package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.dto.AuthRequests.*;
import com.andrewsport.ecommerce.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    User findByUsername(String username);
    void sendRegistrationOtp(String email, String username);
    AuthResponse verifyAndRegister(VerifyOtpRequest request);
    void sendForgotPasswordOtp(String email);
    void resetPassword(ResetPasswordRequest request);
    AuthResponse socialLogin(SocialLoginRequest request);
}
