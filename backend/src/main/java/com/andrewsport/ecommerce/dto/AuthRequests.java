package com.andrewsport.ecommerce.dto;

public class AuthRequests {
    
    public static class LoginRequest {
        private String username;
        private String password;

        public LoginRequest() {}
        public LoginRequest(String username, String password) {
            this.username = username;
            this.password = password;
        }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String username;
        private String password;
        private String email;
        private String fullName;

        public RegisterRequest() {}
        public RegisterRequest(String username, String password, String email, String fullName) {
            this.username = username;
            this.password = password;
            this.email = email;
            this.fullName = fullName;
        }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
    }

    public static class AuthResponse {
        private String token;
        private String refreshToken;
        private String username;
        private String role;
        private String fullName;

        public AuthResponse() {}
        public AuthResponse(String token, String refreshToken, String username, String role, String fullName) {
            this.token = token;
            this.refreshToken = refreshToken;
            this.username = username;
            this.role = role;
            this.fullName = fullName;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
    }

    public static class TokenRefreshRequest {
        private String refreshToken;

        public TokenRefreshRequest() {}
        public TokenRefreshRequest(String refreshToken) {
            this.refreshToken = refreshToken;
        }

        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    }

    public static class TokenRefreshResponse {
        private String accessToken;
        private String refreshToken;

        public TokenRefreshResponse() {}
        public TokenRefreshResponse(String accessToken, String refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }

        public String getAccessToken() { return accessToken; }
        public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    }

    public static class SendOtpRequest {
        private String email;
        private String type; // REGISTER, FORGOT_PASSWORD

        public SendOtpRequest() {}
        public SendOtpRequest(String email, String type) {
            this.email = email;
            this.type = type;
        }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
    }

    public static class VerifyOtpRequest {
        private String username;
        private String password;
        private String email;
        private String fullName;
        private String otp;

        public VerifyOtpRequest() {}
        public VerifyOtpRequest(String username, String password, String email, String fullName, String otp) {
            this.username = username;
            this.password = password;
            this.email = email;
            this.fullName = fullName;
            this.otp = otp;
        }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }

    public static class ResetPasswordRequest {
        private String email;
        private String otp;
        private String newPassword;

        public ResetPasswordRequest() {}
        public ResetPasswordRequest(String email, String otp, String newPassword) {
            this.email = email;
            this.otp = otp;
            this.newPassword = newPassword;
        }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class SocialLoginRequest {
        private String provider; // GOOGLE, FACEBOOK
        private String email;
        private String fullName;
        private String providerId;

        public SocialLoginRequest() {}
        public SocialLoginRequest(String provider, String email, String fullName, String providerId) {
            this.provider = provider;
            this.email = email;
            this.fullName = fullName;
            this.providerId = providerId;
        }
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getProviderId() { return providerId; }
        public void setProviderId(String providerId) { this.providerId = providerId; }
    }
}
