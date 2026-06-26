package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.service.ai.AiClient;
import org.springframework.stereotype.Service;

/**
 * AI-powered sports consultant chat service.
 * Delegates to the configured AiClient implementation (OpenAI or offline fallback).
 */
@Service
public class ChatService {

    private final AiClient aiClient;

    private static final String SYSTEM_PROMPT =
            "Bạn là trợ lý tư vấn thể thao chuyên về cầu lông, tennis và pickleball. " +
            "Hãy tư vấn sản phẩm phù hợp với trình độ và phong cách thi đấu của khách hàng. " +
            "Trả lời bằng tiếng Việt, ngắn gọn và thân thiện.";

    public ChatService(AiClient aiClient) {
        this.aiClient = aiClient;
    }

    public String getReply(String userMessage) {
        try {
            return aiClient.generateReply(SYSTEM_PROMPT, userMessage);
        } catch (Exception e) {
            return "Xin lỗi, trợ lý AI tạm thời không khả dụng. Vui lòng thử lại sau.";
        }
    }
}
