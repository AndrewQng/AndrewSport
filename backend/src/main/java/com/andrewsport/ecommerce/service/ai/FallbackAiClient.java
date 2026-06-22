package com.andrewsport.ecommerce.service.ai;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class FallbackAiClient implements AiClient {

    @Autowired
    private OpenAiClientAdapter openAiClient;

    @Autowired
    private OfflineFallbackAdapter offlineFallbackClient;

    @Override
    public String generateReply(String systemPrompt, String userMessage) {
        try {
            return openAiClient.generateReply(systemPrompt, userMessage);
        } catch (Exception e) {
            System.err.println("OpenAI AI client failed, falling back to offline rule-based client: " + e.getMessage());
            return offlineFallbackClient.generateReply(systemPrompt, userMessage);
        }
    }
}
