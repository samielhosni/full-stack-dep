package com.example.chathistory.repository;

import com.example.chathistory.model.ChatHistory;
import com.example.chathistory.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndPassword(String username, String password);
}



