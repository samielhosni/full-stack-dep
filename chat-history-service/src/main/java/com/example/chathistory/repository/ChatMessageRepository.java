package com.example.chathistory.repository;

import com.example.chathistory.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
List<ChatMessage> findBySenderOrderByTimestampDesc(String sender);
List<ChatMessage> findAllByOrderByTimestampAsc();

}