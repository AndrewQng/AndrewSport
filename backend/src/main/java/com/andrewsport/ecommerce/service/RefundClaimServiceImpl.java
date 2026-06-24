package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Order;
import com.andrewsport.ecommerce.model.RefundClaim;
import com.andrewsport.ecommerce.model.User;
import com.andrewsport.ecommerce.repository.OrderRepository;
import com.andrewsport.ecommerce.repository.RefundClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RefundClaimServiceImpl implements RefundClaimService {

    @Autowired
    private RefundClaimRepository refundClaimRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public RefundClaim createRefundClaim(RefundClaim claim, String username) {
        User user = userService.findByUsername(username);
        Order order = orderRepository.findById(claim.getOrderId())
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại."));

        if (!order.getUserId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền yêu cầu hoàn tiền cho đơn hàng này.");
        }

        if (!"DELIVERED".equals(order.getOrderStatus())) {
            throw new RuntimeException("Chỉ có thể yêu cầu hoàn tiền cho đơn hàng đã giao thành công (DELIVERED).");
        }

        if (order.getDeliveryDate() == null) {
            throw new RuntimeException("Không tìm thấy thông tin ngày nhận hàng.");
        }

        // Check if within 7 days
        if (order.getDeliveryDate().plusDays(7).isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Đã quá thời hạn 7 ngày để yêu cầu hoàn tiền kể từ ngày nhận hàng.");
        }

        claim.setUserId(user.getId());
        claim.setStatus("PENDING");
        claim.setCreatedAt(LocalDateTime.now());

        return refundClaimRepository.save(claim);
    }

    @Override
    public List<RefundClaim> getMyRefundClaims(String username) {
        User user = userService.findByUsername(username);
        return refundClaimRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Override
    public List<RefundClaim> getAllRefundClaims() {
        return refundClaimRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public RefundClaim approveRefundClaim(String claimId, String adminComment) {
        RefundClaim claim = refundClaimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Yêu cầu hoàn tiền không tồn tại."));
        
        claim.setStatus("APPROVED");
        claim.setAdminComment(adminComment);
        return refundClaimRepository.save(claim);
    }

    @Override
    @Transactional
    public RefundClaim rejectRefundClaim(String claimId, String adminComment) {
        RefundClaim claim = refundClaimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Yêu cầu hoàn tiền không tồn tại."));
        
        claim.setStatus("REJECTED");
        claim.setAdminComment(adminComment);
        return refundClaimRepository.save(claim);
    }
}
