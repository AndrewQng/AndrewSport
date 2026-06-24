package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.WarrantyClaim;
import java.util.List;

public interface WarrantyClaimService {
    WarrantyClaim createWarrantyClaim(WarrantyClaim claim, String username);
    List<WarrantyClaim> getMyWarrantyClaims(String username);
    List<WarrantyClaim> getAllWarrantyClaims();
    WarrantyClaim approveWarrantyClaim(String claimId, String adminComment);
    WarrantyClaim rejectWarrantyClaim(String claimId, String adminComment);
}
