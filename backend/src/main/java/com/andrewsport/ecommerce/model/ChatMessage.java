package com.andrewsport.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "chat_messages")
public class ChatMessage {

    @Id
    private String id;

    /** userId of the customer — groups all messages into 1 thread per User */
    @Indexed
    private String userId;

    /** username of sender (customer username or "admin") */
    private String senderUsername;

    /** USER | ADMIN */
    private String senderRole;

    private String content;

    private Instant timestamp;

    /** false until the recipient reads it */
    private boolean isRead;

    public ChatMessage() {}

    public ChatMessage(String userId, String senderUsername, String senderRole, String content) {
        this.userId = userId;
        this.senderUsername = senderUsername;
        this.senderRole = senderRole;
        this.content = content;
        this.timestamp = Instant.now();
        this.isRead = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSenderUsername() { return senderUsername; }
    public void setSenderUsername(String senderUsername) { this.senderUsername = senderUsername; }

    public String getSenderRole() { return senderRole; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
}
