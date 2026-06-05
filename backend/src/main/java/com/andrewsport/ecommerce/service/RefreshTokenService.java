package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.RefreshToken;

import java.util.Optional;

public interface RefreshTokenService {
    Optional<RefreshToken> findByToken(String token);
    RefreshToken createRefreshToken(String username);
    RefreshToken verifyExpiration(RefreshToken token);
    void deleteByUsername(String username);
}
