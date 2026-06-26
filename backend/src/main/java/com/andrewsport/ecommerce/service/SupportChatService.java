package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.dto.ChatMessageResponse;
import com.andrewsport.ecommerce.model.ChatMessage;
import com.andrewsport.ecommerce.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Live support chat between authenticated User and Admin.
 * 1 thread per User — keyed by userId.
 */
@Service
public class SupportChatService {

    private final ChatMessageRepository repo;

    public SupportChatService(ChatMessageRepository repo) {
        this.repo = repo;
    }

    public ChatMessageResponse save(String userId, String senderUsername,
                                    String senderRole, String content) {
        ChatMessage msg = new ChatMessage(userId, senderUsername, senderRole, content);
        msg = repo.save(msg);
        return toResponse(msg);
    }

    public List<ChatMessageResponse> getHistory(String userId) {
        return repo.findByUserIdOrderByTimestampAsc(userId)
                   .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Mark USER messages as read — called when admin opens thread */
    public void markUserMessagesRead(String userId) {
        List<ChatMessage> unread = repo.findByUserIdAndSenderRoleAndIsReadFalse(userId, "USER");
        unread.forEach(m -> m.setRead(true));
        repo.saveAll(unread);
    }

    /** Mark ADMIN messages as read — called when user opens chat */
    public void markAdminMessagesRead(String userId) {
        List<ChatMessage> unread = repo.findByUserIdAndSenderRoleAndIsReadFalse(userId, "ADMIN");
        unread.forEach(m -> m.setRead(true));
        repo.saveAll(unread);
    }

    /** Unread count per userId (USER messages unread by admin) */
    public Map<String, Long> getUnreadCountPerUser() {
        return repo.findAll().stream()
                .filter(m -> "USER".equals(m.getSenderRole()) && !m.isRead())
                .collect(Collectors.groupingBy(ChatMessage::getUserId, Collectors.counting()));
    }

    /** All distinct userIds that have ever initiated a support chat */
    public List<String> getAllChatUserIds() {
        return repo.findAll().stream()
                .filter(m -> "USER".equals(m.getSenderRole()))
                .map(ChatMessage::getUserId)
                .distinct()
                .collect(Collectors.toList());
    }

    private ChatMessageResponse toResponse(ChatMessage m) {
        return new ChatMessageResponse(
                m.getId(), m.getUserId(), m.getSenderUsername(),
                m.getSenderRole(), m.getContent(), m.getTimestamp(), m.isRead()
        );
    }
}
