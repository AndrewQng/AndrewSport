package com.andrewsport.ecommerce.controller;

import com.andrewsport.ecommerce.model.ProductWarranty;
import com.andrewsport.ecommerce.model.WarrantyClaim;
import com.andrewsport.ecommerce.service.ProductWarrantyService;
import com.andrewsport.ecommerce.service.WarrantyClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/warranties")
public class WarrantyClaimController {

    @Autowired
    private WarrantyClaimService warrantyClaimService;

    @Autowired
    private ProductWarrantyService productWarrantyService;

    @PostMapping("/claims")
    public ResponseEntity<?> createWarrantyClaim(@RequestBody WarrantyClaim claim, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Vui lòng đăng nhập!"));
        }
        try {
            WarrantyClaim created = warrantyClaimService.createWarrantyClaim(claim, principal.getName());
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-claims")
    public ResponseEntity<?> getMyWarrantyClaims(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Vui lòng đăng nhập!"));
        }
        try {
            return ResponseEntity.ok(warrantyClaimService.getMyWarrantyClaims(principal.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-warranties")
    public ResponseEntity<?> getMyWarranties(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Vui lòng đăng nhập!"));
        }
        try {
            List<ProductWarranty> warranties = productWarrantyService.getMyWarranties(principal.getName());
            return ResponseEntity.ok(warranties);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllWarrantyClaims() {
        try {
            return ResponseEntity.ok(warrantyClaimService.getAllWarrantyClaims());
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/admin/{id}/approve")
    public ResponseEntity<?> approveWarrantyClaim(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        try {
            String adminComment = body != null ? body.getOrDefault("adminComment", "") : "";
            WarrantyClaim approved = warrantyClaimService.approveWarrantyClaim(id, adminComment);
            return ResponseEntity.ok(approved);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/admin/{id}/reject")
    public ResponseEntity<?> rejectWarrantyClaim(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        try {
            String adminComment = body != null ? body.getOrDefault("adminComment", "") : "";
            WarrantyClaim rejected = warrantyClaimService.rejectWarrantyClaim(id, adminComment);
            return ResponseEntity.ok(rejected);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }
}
