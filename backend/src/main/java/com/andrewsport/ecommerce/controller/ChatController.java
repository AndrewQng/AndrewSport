package com.andrewsport.ecommerce.controller;

import com.andrewsport.ecommerce.dto.ChatDTOs.*;
import com.andrewsport.ecommerce.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String reply = chatService.getReply(request.getMessage());
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}
