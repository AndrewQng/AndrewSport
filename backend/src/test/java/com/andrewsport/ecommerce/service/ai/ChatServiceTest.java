package com.andrewsport.ecommerce.service.ai;

import com.andrewsport.ecommerce.model.Product;
import com.andrewsport.ecommerce.service.ChatService;
import com.andrewsport.ecommerce.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ChatServiceTest {

    @Mock
    private ProductService productService;

    @Mock
    private AiClient aiClient;

    @InjectMocks
    private ChatService chatService;

    @Mock
    private OpenAiClientAdapter openAiClientAdapter;

    @Mock
    private OfflineFallbackAdapter offlineFallbackAdapter;

    @InjectMocks
    private FallbackAiClient fallbackAiClient;

    private List<Product> sampleProducts;

    @BeforeEach
    void setUp() {
        sampleProducts = new ArrayList<>();
        Product p1 = new Product("Yonex Astrox 99 Pro", "High end badminton racket", 4500000.0, 10, "url", "Badminton", "Yonex", "ACTIVE");
        p1.setId("p1");
        sampleProducts.add(p1);
    }

    @Test
    @DisplayName("ChatService builds prompt and delegates to AiClient")
    void testChatServiceDelegatesToAiClient() throws Exception {
        when(productService.getAllProducts(null, null)).thenReturn(sampleProducts);
        when(aiClient.generateReply(anyString(), eq("hello"))).thenReturn("mocked response");

        String reply = chatService.getReply("hello");

        assertEquals("mocked response", reply);
        verify(aiClient, times(1)).generateReply(contains("Yonex Astrox 99 Pro"), eq("hello"));
    }

    @Test
    @DisplayName("FallbackAiClient calls OpenAI successfully")
    void testFallbackClientSuccess() throws Exception {
        when(openAiClientAdapter.generateReply(anyString(), anyString())).thenReturn("openai success response");

        String reply = fallbackAiClient.generateReply("prompt", "message");

        assertEquals("openai success response", reply);
        verify(openAiClientAdapter, times(1)).generateReply("prompt", "message");
        verifyNoInteractions(offlineFallbackAdapter);
    }

    @Test
    @DisplayName("FallbackAiClient falls back to offline adapter when OpenAI throws exception")
    void testFallbackClientFallbackOnException() throws Exception {
        when(openAiClientAdapter.generateReply(anyString(), anyString())).thenThrow(new RuntimeException("API connection timeout"));
        when(offlineFallbackAdapter.generateReply(anyString(), anyString())).thenReturn("offline fallback response");

        String reply = fallbackAiClient.generateReply("prompt", "message");

        assertEquals("offline fallback response", reply);
        verify(openAiClientAdapter, times(1)).generateReply("prompt", "message");
        verify(offlineFallbackAdapter, times(1)).generateReply("prompt", "message");
    }
}
