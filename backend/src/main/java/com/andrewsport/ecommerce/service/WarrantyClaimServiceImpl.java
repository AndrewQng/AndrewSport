package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.ProductWarranty;
import com.andrewsport.ecommerce.model.User;
import com.andrewsport.ecommerce.model.WarrantyClaim;
import com.andrewsport.ecommerce.repository.ProductWarrantyRepository;
import com.andrewsport.ecommerce.repository.WarrantyClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class WarrantyClaimServiceImpl implements WarrantyClaimService {

    @Autowired
    private WarrantyClaimRepository warrantyClaimRepository;

    @Autowired
    private ProductWarrantyRepository productWarrantyRepository;

    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public WarrantyClaim createWarrantyClaim(WarrantyClaim claim, String username) {
        User user = userService.findByUsername(username);
        
        ProductWarranty warranty = productWarrantyRepository.findByWarrantyCode(claim.getWarrantyCode())
                .orElseThrow(() -> new RuntimeException("Mã bảo hành không tồn tại hoặc không hợp lệ."));

        if (!warranty.getUserId().equals(user.getId())) {
            throw new RuntimeException("Mã bảo hành này không thuộc về tài khoản của bạn.");
        }

        if ("EXPIRED".equals(warranty.getStatus()) || warranty.getExpiryDate().isBefore(LocalDateTime.now())) {
            warranty.setStatus("EXPIRED");
            productWarrantyRepository.save(warranty);
            throw new RuntimeException("Thẻ bảo hành này đã hết hạn sử dụng.");
        }

        if ("CLAIMED".equals(warranty.getStatus())) {
            throw new RuntimeException("Mã bảo hành này đã được sử dụng trước đó.");
        }

        if (!warranty.getProductId().equals(claim.getProductId())) {
            throw new RuntimeException("Mã bảo hành này không khớp với sản phẩm bạn yêu cầu bảo hành.");
        }

        claim.setUserId(user.getId());
        claim.setOrderId(warranty.getOrderId());
        claim.setSku(warranty.getSku());
        claim.setStatus("PENDING");
        claim.setCreatedAt(LocalDateTime.now());

        return warrantyClaimRepository.save(claim);
    }

    @Override
    public List<WarrantyClaim> getMyWarrantyClaims(String username) {
        User user = userService.findByUsername(username);
        return warrantyClaimRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Override
    public List<WarrantyClaim> getAllWarrantyClaims() {
        return warrantyClaimRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public WarrantyClaim approveWarrantyClaim(String claimId, String adminComment) {
        WarrantyClaim claim = warrantyClaimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Yêu cầu bảo hành không tồn tại."));

        claim.setStatus("APPROVED");
        claim.setAdminComment(adminComment);

        // Mark the warranty as CLAIMED
        ProductWarranty warranty = productWarrantyRepository.findByWarrantyCode(claim.getWarrantyCode())
                .orElse(null);
        if (warranty != null) {
            warranty.setStatus("CLAIMED");
            productWarrantyRepository.save(warranty);
        }

        return warrantyClaimRepository.save(claim);
    }

    @Override
    @Transactional
    public WarrantyClaim rejectWarrantyClaim(String claimId, String adminComment) {
        WarrantyClaim claim = warrantyClaimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Yêu cầu bảo hành không tồn tại."));

        claim.setStatus("REJECTED");
        claim.setAdminComment(adminComment);
        return warrantyClaimRepository.save(claim);
    }
}
