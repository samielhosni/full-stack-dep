package com.example.chathistory.service;

import com.example.chathistory.model.ChatMessage;
import com.example.chathistory.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.lang.String;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public ChatMessage save(String content, String sender) {
        ChatMessage message = new ChatMessage();
        message.setSender(sender); // You should replace this with real sender info
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        return chatMessageRepository.save(message);
    }
}
