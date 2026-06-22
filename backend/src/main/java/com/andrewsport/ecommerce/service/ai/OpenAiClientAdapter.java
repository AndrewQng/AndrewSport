package com.andrewsport.ecommerce.service.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
public class OpenAiClientAdapter implements AiClient {

    @Value("${app.openai.api-key}")
    private String apiKey;

    @Override
    public String generateReply(String systemPrompt, String userMessage) throws Exception {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("mock-key") || apiKey.contains("OPENAI_API_KEY")) {
            throw new IllegalStateException("OpenAI API Key is missing or unconfigured.");
        }

        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-3.5-turbo");

        List<Map<String, String>> messages = new ArrayList<>();
        
        Map<String, String> systemMsg = new HashMap<>();
        systemMsg.put("role", "system");
        systemMsg.put("content", systemPrompt);
        messages.add(systemMsg);

        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", userMessage);
        messages.add(userMsg);

        body.put("messages", messages);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        
        @SuppressWarnings("rawtypes")
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
        if (response.getStatusCode().is2xxSuccessful()) {
            Map<?, ?> responseBody = response.getBody();
            if (responseBody != null) {
                List<?> choices = (List<?>) responseBody.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<?, ?> choice = (Map<?, ?>) choices.get(0);
                    Map<?, ?> msgObj = (Map<?, ?>) choice.get("message");
                    if (msgObj != null) {
                        return (String) msgObj.get("content");
                    }
                }
            }
        }
        
        throw new RuntimeException("Failed to get response from OpenAI API. Status code: " + response.getStatusCode());
    }

    // Getter for tests to mock/verify configuration
    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
}
