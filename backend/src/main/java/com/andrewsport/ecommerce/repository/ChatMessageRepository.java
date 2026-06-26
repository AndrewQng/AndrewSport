package com.andrewsport.ecommerce.repository;

import com.andrewsport.ecommerce.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    List<ChatMessage> findByUserIdOrderByTimestampAsc(String userId);

    long countByUserIdAndSenderRoleAndIsReadFalse(String userId, String senderRole);

    List<ChatMessage> findByUserIdAndSenderRoleAndIsReadFalse(String userId, String senderRole);
}
