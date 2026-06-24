package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.RefundClaim;
import java.util.List;

public interface RefundClaimService {
    RefundClaim createRefundClaim(RefundClaim claim, String username);
    List<RefundClaim> getMyRefundClaims(String username);
    List<RefundClaim> getAllRefundClaims();
    RefundClaim approveRefundClaim(String claimId, String adminComment);
    RefundClaim rejectRefundClaim(String claimId, String adminComment);
}
