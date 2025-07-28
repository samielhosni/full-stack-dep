package com.example.chathistory.controller;

import com.example.chathistory.model.ChatHistory;
import com.example.chathistory.repository.ChatHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat-history")
@CrossOrigin
public class ChatHistoryController {

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @GetMapping("/{userId}")
    public List<ChatHistory> getChatHistory(@PathVariable Long userId) {
        return chatHistoryRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}

