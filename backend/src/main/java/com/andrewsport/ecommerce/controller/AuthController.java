package com.andrewsport.ecommerce.controller;

import com.andrewsport.ecommerce.dto.AuthRequests.*;
import com.andrewsport.ecommerce.model.RefreshToken;
import com.andrewsport.ecommerce.service.UserService;
import com.andrewsport.ecommerce.service.RefreshTokenService;
import com.andrewsport.ecommerce.config.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpHeaders;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

import org.springframework.lang.NonNull;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@SuppressWarnings("null")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private void setCookies(HttpServletResponse response, @NonNull String accessToken, @NonNull String refreshToken) {
        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .secure(false) // false for localhost HTTP
                .path("/")
                .maxAge(86400) // 24h
                .sameSite("Lax")
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false) // false for localhost HTTP
                .path("/")
                .maxAge(604800) // 7 days
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
    }

    private void clearCookies(HttpServletResponse response) {
        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = userService.login(request);
        setCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request, HttpServletResponse response) {
        AuthResponse authResponse = userService.register(request);
        setCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @RequestBody(required = false) TokenRefreshRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        
        String requestRefreshToken = null;
        if (request != null) {
            requestRefreshToken = request.getRefreshToken();
        }
        
        if (requestRefreshToken == null || requestRefreshToken.trim().isEmpty()) {
            if (httpRequest.getCookies() != null) {
                for (Cookie cookie : httpRequest.getCookies()) {
                    if ("refreshToken".equals(cookie.getName())) {
                        requestRefreshToken = cookie.getValue();
                        break;
                    }
                }
            }
        }

        if (requestRefreshToken == null || requestRefreshToken.trim().isEmpty()) {
            return ResponseEntity.status(400).body("Refresh token is missing!");
        }

        String finalToken = requestRefreshToken;
        return refreshTokenService.findByToken(finalToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUsername)
                .<ResponseEntity<?>>map(username -> {
                    UserDetails userDetails = userService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    String token = jwtTokenProvider.generateToken(authentication);
                    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(username);
                    
                    setCookies(httpResponse, token, newRefreshToken.getToken());
                    
                    return ResponseEntity.ok(new TokenRefreshResponse(token, newRefreshToken.getToken()));
                })
                .orElse(ResponseEntity.status(400).body("Refresh token is not in database!"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        clearCookies(response);
        return ResponseEntity.ok(java.util.Map.of("message", "Đã đăng xuất thành công"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        return ResponseEntity.ok(userService.findByUsername(principal.getName()));
    }

    @PostMapping("/register/send-otp")
    public ResponseEntity<?> sendRegisterOtp(@RequestBody RegisterRequest request) {
        try {
            userService.sendRegistrationOtp(request.getEmail(), request.getUsername());
            return ResponseEntity.ok(java.util.Map.of("message", "Mã OTP đã được gửi đến email của bạn."));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/register/verify-otp")
    public ResponseEntity<?> verifyAndRegister(@RequestBody VerifyOtpRequest request, HttpServletResponse response) {
        try {
            AuthResponse authResponse = userService.verifyAndRegister(request);
            setCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<?> sendForgotPasswordOtp(@RequestBody SendOtpRequest request) {
        try {
            userService.sendForgotPasswordOtp(request.getEmail());
            return ResponseEntity.ok(java.util.Map.of("message", "Mã OTP đã được gửi đến email của bạn."));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            userService.resetPassword(request);
            return ResponseEntity.ok(java.util.Map.of("message", "Mật khẩu đã được đặt lại thành công!"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/social-login")
    public ResponseEntity<?> socialLogin(@RequestBody SocialLoginRequest request, HttpServletResponse response) {
        try {
            AuthResponse authResponse = userService.socialLogin(request);
            setCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
