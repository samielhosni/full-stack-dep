package com.example.chathistory.controller;

import com.example.chathistory.model.ChatMessage;
import com.example.chathistory.repository.ChatMessageRepository;
import com.example.chathistory.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;


import java.util.List;

@RestController
@RequestMapping("/chat-history")
@CrossOrigin("*")
public class ChatHistoryController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatService chatService;

    @GetMapping("/{username}")
    public List<ChatMessage> getChatHistory(@PathVariable String username) {
        return chatMessageRepository.findBySenderOrderByTimestampDesc(username);
    }

    @PostMapping("/save")
    public ChatMessage saveChat(@RequestBody ChatMessageDTO chatMessageDTO) {
        return chatService.save(chatMessageDTO.getContent(), chatMessageDTO.getSender());
    }

    // DTO class inside the controller for convenience
    public static class ChatMessageDTO {
        private String content;
        private String sender;

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }
    }


    @GetMapping("/history-pairs")
public List<Map<String, String>> getQuestionAnswerPairs() {
    List<ChatMessage> allMessages = chatMessageRepository.findAllByOrderByTimestampAsc();
    List<Map<String, String>> qaPairs = new ArrayList<>();

    for (int i = 0; i < allMessages.size() - 1; i++) {
        ChatMessage question = allMessages.get(i);
        ChatMessage answer = allMessages.get(i + 1);

        if ("user".equalsIgnoreCase(question.getSender()) && "assistant".equalsIgnoreCase(answer.getSender())) {
            Map<String, String> pair = new HashMap<>();
            pair.put("question", question.getContent());
            pair.put("answer", answer.getContent());
            qaPairs.add(pair);
            i++; // skip the next message since it's already used as answer
        }
    }

    return qaPairs;
}

@GetMapping("/all")
public List<ChatMessage> getAllChatHistory() {
    return chatMessageRepository.findAllByOrderByTimestampAsc();
}

}
