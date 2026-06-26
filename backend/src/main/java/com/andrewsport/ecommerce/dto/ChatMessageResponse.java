package com.andrewsport.ecommerce.dto;

import java.time.Instant;

/** Payload broadcast TO subscribers */
public class ChatMessageResponse {
    private String id;
    private String userId;
    private String senderUsername;
    private String senderRole;
    private String content;
    private Instant timestamp;
    private boolean isRead;

    public ChatMessageResponse() {}

    public ChatMessageResponse(String id, String userId, String senderUsername,
                               String senderRole, String content,
                               Instant timestamp, boolean isRead) {
        this.id = id;
        this.userId = userId;
        this.senderUsername = senderUsername;
        this.senderRole = senderRole;
        this.content = content;
        this.timestamp = timestamp;
        this.isRead = isRead;
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getSenderUsername() { return senderUsername; }
    public String getSenderRole() { return senderRole; }
    public String getContent() { return content; }
    public Instant getTimestamp() { return timestamp; }
    public boolean isRead() { return isRead; }

    public void setId(String id) { this.id = id; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setSenderUsername(String s) { this.senderUsername = s; }
    public void setSenderRole(String r) { this.senderRole = r; }
    public void setContent(String c) { this.content = c; }
    public void setTimestamp(Instant t) { this.timestamp = t; }
    public void setRead(boolean r) { this.isRead = r; }
}
