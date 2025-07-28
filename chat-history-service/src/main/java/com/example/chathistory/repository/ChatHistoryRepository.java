package com.example.chathistory.repository;

import com.example.chathistory.model.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findByUserIdOrderByTimestampDesc(Long userId);
}