package com.example.chathistory.controller;

import com.example.chathistory.model.ChatMessage;
import com.example.chathistory.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/chat-history")
@CrossOrigin
public class ChatController {

    private final ChatService service;

    public ChatController(ChatService service) {
        this.service = service;
    }

    @PostMapping
    public ChatMessage save(@RequestBody ChatMessage msg) {
        if (msg.getTimestamp() == null) {
            msg.setTimestamp(LocalDateTime.now());
        }
        return service.save(msg);
    }

    @GetMapping
    public List<ChatMessage> getAll() {
        return service.findAll();
    }
}
