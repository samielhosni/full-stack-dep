package com.example.chathistory.controller;

import com.example.chathistory.model.ChatMessage;
import com.example.chathistory.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat-history")
@CrossOrigin
public class ChatHistoryController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

   @GetMapping("/{username}")
public List<ChatMessage> getChatHistory(@PathVariable String username) {
    return chatMessageRepository.findBySenderOrderByTimestampDesc(username);
}
}

