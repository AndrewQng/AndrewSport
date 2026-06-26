package com.andrewsport.ecommerce.dto;

/** Payload sent FROM client (user or admin) over STOMP */
public class ChatMessageRequest {
    private String content;

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
