package com.andrewsport.ecommerce.controller;

import com.andrewsport.ecommerce.model.RefundClaim;
import com.andrewsport.ecommerce.service.RefundClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/refunds")
public class RefundClaimController {

    @Autowired
    private RefundClaimService refundClaimService;

    @PostMapping
    public ResponseEntity<?> createRefundClaim(@RequestBody RefundClaim claim, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Vui lòng đăng nhập!"));
        }
        try {
            RefundClaim created = refundClaimService.createRefundClaim(claim, principal.getName());
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-claims")
    public ResponseEntity<?> getMyRefundClaims(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Vui lòng đăng nhập!"));
        }
        try {
            return ResponseEntity.ok(refundClaimService.getMyRefundClaims(principal.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllRefundClaims() {
        try {
            return ResponseEntity.ok(refundClaimService.getAllRefundClaims());
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/admin/{id}/approve")
    public ResponseEntity<?> approveRefundClaim(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        try {
            String adminComment = body != null ? body.getOrDefault("adminComment", "") : "";
            RefundClaim approved = refundClaimService.approveRefundClaim(id, adminComment);
            return ResponseEntity.ok(approved);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/admin/{id}/reject")
    public ResponseEntity<?> rejectRefundClaim(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        try {
            String adminComment = body != null ? body.getOrDefault("adminComment", "") : "";
            RefundClaim rejected = refundClaimService.rejectRefundClaim(id, adminComment);
            return ResponseEntity.ok(rejected);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }
}
