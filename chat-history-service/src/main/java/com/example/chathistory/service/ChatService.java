package com.example.chathistory.service;

import com.example.chathistory.model.ChatMessage;
import com.example.chathistory.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository repo;

    public ChatService(ChatMessageRepository repo) {
        this.repo = repo;
    }

    public ChatMessage save(ChatMessage msg) {
        return repo.save(msg);
    }

    public List<ChatMessage> findAll() {
        return repo.findAll();
    }
}
