package com.andrewsport.ecommerce.service.ai;

public interface AiClient {
    String generateReply(String systemPrompt, String userMessage) throws Exception;
}
