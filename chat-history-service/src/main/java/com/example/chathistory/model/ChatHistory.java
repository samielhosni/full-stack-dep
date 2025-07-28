package com.example.chathistory.model;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
    @Table(name = "chat_history")
    public class ChatHistory {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String message;
        private LocalDateTime timestamp;

        @ManyToOne
        @JoinColumn(name = "user_id")
        private User user;

        // Getters and setters
    }


