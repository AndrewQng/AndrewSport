package com.andrewsport.ecommerce.controller;

import com.andrewsport.ecommerce.dto.ChatMessageRequest;
import com.andrewsport.ecommerce.dto.ChatMessageResponse;
import com.andrewsport.ecommerce.model.User;
import com.andrewsport.ecommerce.repository.UserRepository;
import com.andrewsport.ecommerce.service.SupportChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/support")
public class SupportChatController {

    private final SupportChatService chatService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public SupportChatController(SupportChatService chatService,
                                 UserRepository userRepository,
                                 SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // ── STOMP: handles messages from both USER and ADMIN ─────────────────────
    // Client publishes to: /app/support.send
    @MessageMapping("/support.send")
    public void handleMessage(@Payload ChatMessageRequest req, StompHeaderAccessor sha) {
        var principal = sha.getUser();
        if (principal == null) return;

        String username = principal.getName();
        User sender = userRepository.findByUsername(username).orElse(null);
        if (sender == null) return;

        String role = sender.getRole();
        String userId;

        if ("ADMIN".equals(role)) {
            // Admin replies to a specific user thread; targetUserId sent as native header
            userId = sha.getFirstNativeHeader("targetUserId");
        } else {
            userId = sender.getId();
        }

        if (userId == null) return;

        ChatMessageResponse saved = chatService.save(userId, username, role, req.getContent());

        // Both user and admin are subscribed to /topic/support/{userId}
        messagingTemplate.convertAndSend("/topic/support/" + userId, saved);
    }

    // ── REST: message history ─────────────────────────────────────────────────

    /** User gets own chat history; admin unread msgs marked read */
    @GetMapping("/history")
    public ResponseEntity<List<ChatMessageResponse>> getMyHistory(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByUsername(principal.getUsername()).orElseThrow();
        chatService.markAdminMessagesRead(user.getId());
        return ResponseEntity.ok(chatService.getHistory(user.getId()));
    }

    /** Admin gets history for a specific user thread */
    @GetMapping("/history/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<ChatMessageResponse>> getUserHistory(@PathVariable String userId) {
        chatService.markUserMessagesRead(userId);
        return ResponseEntity.ok(chatService.getHistory(userId));
    }

    /** Admin: unread count per userId */
    @GetMapping("/unread-counts")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, Long>> getUnreadCounts() {
        return ResponseEntity.ok(chatService.getUnreadCountPerUser());
    }

    /** Admin: list all users who have ever sent a support message */
    @GetMapping("/all-users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllChatUsers() {
        Map<String, Long> unread = chatService.getUnreadCountPerUser();
        List<String> allUserIds = chatService.getAllChatUserIds();

        List<Map<String, Object>> result = allUserIds.stream().map(uid -> {
            User u = userRepository.findById(uid).orElse(null);
            String displayName = (u != null && u.getFullName() != null) ? u.getFullName()
                    : (u != null ? u.getUsername() : uid);
            String uname = u != null ? u.getUsername() : uid;
            return Map.<String, Object>of(
                    "userId", uid,
                    "username", uname,
                    "fullName", displayName,
                    "unreadCount", unread.getOrDefault(uid, 0L)
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
