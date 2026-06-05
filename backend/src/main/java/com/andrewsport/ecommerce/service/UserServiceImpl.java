package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.config.JwtTokenProvider;
import com.andrewsport.ecommerce.dto.AuthRequests.*;
import com.andrewsport.ecommerce.model.User;
import com.andrewsport.ecommerce.model.RefreshToken;
import com.andrewsport.ecommerce.model.OtpVerification;
import com.andrewsport.ecommerce.repository.UserRepository;
import com.andrewsport.ecommerce.repository.OtpVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import org.springframework.context.annotation.Lazy;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpVerificationRepository otpVerificationRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    @Lazy
    private AuthenticationManager authenticationManager;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getEmail(),
                request.getFullName(),
                "USER",
                "ACTIVE"
        );

        userRepository.save(user);

        // Authenticate new user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());

        return new AuthResponse(token, refreshToken.getToken(), user.getUsername(), user.getRole(), user.getFullName());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());

        return new AuthResponse(token, refreshToken.getToken(), user.getUsername(), user.getRole(), user.getFullName());
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    @Override
    public void sendRegistrationOtp(String email, String username) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại trong hệ thống!");
        }
        if (email != null && !email.trim().isEmpty() && userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email đã được đăng ký trong hệ thống!");
        }

        String code = String.format("%06d", new Random().nextInt(1000000));
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

        otpVerificationRepository.deleteByEmailAndType(email, "REGISTER");

        OtpVerification otp = new OtpVerification(email, code, "REGISTER", expiryTime);
        otpVerificationRepository.save(otp);

        emailService.sendOtpEmail(email, code, "Đăng ký tài khoản");
    }

    @Override
    public AuthResponse verifyAndRegister(VerifyOtpRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty() && userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được đăng ký!");
        }

        OtpVerification otp = otpVerificationRepository.findByEmailAndCodeAndType(
                request.getEmail(), request.getOtp(), "REGISTER"
        ).orElseThrow(() -> new RuntimeException("Mã OTP không chính xác hoặc đã hết hiệu lực."));

        if (LocalDateTime.now().isAfter(otp.getExpiryTime())) {
            otpVerificationRepository.delete(otp);
            throw new RuntimeException("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
        }

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getEmail(),
                request.getFullName(),
                "USER",
                "ACTIVE"
        );
        userRepository.save(user);
        otpVerificationRepository.delete(otp);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());

        return new AuthResponse(token, refreshToken.getToken(), user.getUsername(), user.getRole(), user.getFullName());
    }

    @Override
    public void sendForgotPasswordOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email chưa được đăng ký trong hệ thống!"));

        String code = String.format("%06d", new Random().nextInt(1000000));
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

        otpVerificationRepository.deleteByEmailAndType(email, "FORGOT_PASSWORD");

        OtpVerification otp = new OtpVerification(email, code, "FORGOT_PASSWORD", expiryTime);
        otpVerificationRepository.save(otp);

        emailService.sendOtpEmail(email, code, "Quên mật khẩu");
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        OtpVerification otp = otpVerificationRepository.findByEmailAndCodeAndType(
                request.getEmail(), request.getOtp(), "FORGOT_PASSWORD"
        ).orElseThrow(() -> new RuntimeException("Mã OTP không chính xác hoặc đã hết hiệu lực."));

        if (LocalDateTime.now().isAfter(otp.getExpiryTime())) {
            otpVerificationRepository.delete(otp);
            throw new RuntimeException("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại."));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otpVerificationRepository.delete(otp);
    }

    @Override
    public AuthResponse socialLogin(SocialLoginRequest request) {
        String provider = request.getProvider().toUpperCase();
        String providerId = request.getProviderId();
        String email = request.getEmail();
        String fullName = request.getFullName();

        if (providerId == null || providerId.trim().isEmpty()) {
            throw new RuntimeException("Social Provider ID không hợp lệ.");
        }

        Optional<User> existingUser = Optional.empty();

        if ("GOOGLE".equals(provider)) {
            existingUser = userRepository.findByGoogleId(providerId);
        } else if ("FACEBOOK".equals(provider)) {
            existingUser = userRepository.findByFacebookId(providerId);
        }

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            // Check if user with this email already exists
            Optional<User> userByEmail = Optional.empty();
            if (email != null && !email.trim().isEmpty()) {
                userByEmail = userRepository.findByEmail(email);
            }

            if (userByEmail.isPresent()) {
                user = userByEmail.get();
                // Link account
                if ("GOOGLE".equals(provider)) {
                    user.setGoogleId(providerId);
                } else if ("FACEBOOK".equals(provider)) {
                    user.setFacebookId(providerId);
                }
                userRepository.save(user);
            } else {
                // Register a new user
                String username = provider.toLowerCase() + "_" + providerId;
                // Ensure unique username just in case
                if (userRepository.existsByUsername(username)) {
                    username = username + "_" + UUID.randomUUID().toString().substring(0, 5);
                }

                String randomPassword = UUID.randomUUID().toString();

                user = new User(
                        username,
                        passwordEncoder.encode(randomPassword),
                        email,
                        fullName != null ? fullName : "Social User",
                        "USER",
                        "ACTIVE"
                );

                if ("GOOGLE".equals(provider)) {
                    user.setGoogleId(providerId);
                } else if ("FACEBOOK".equals(provider)) {
                    user.setFacebookId(providerId);
                }

                userRepository.save(user);
            }
        }

        // Programmatically authenticate without credentials check
        UserDetails userDetails = loadUserByUsername(user.getUsername());
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());

        return new AuthResponse(token, refreshToken.getToken(), user.getUsername(), user.getRole(), user.getFullName());
    }
}
