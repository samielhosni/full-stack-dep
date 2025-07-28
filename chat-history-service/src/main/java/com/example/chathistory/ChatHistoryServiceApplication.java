package com.example.chathistory;

import com.example.chathistory.model.User;
import com.example.chathistory.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class ChatHistoryServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatHistoryServiceApplication.class, args);
	}
	@Bean
	CommandLineRunner init(UserRepository userRepo) {
		return args -> {
			if (userRepo.count() == 0) {
				userRepo.saveAll(List.of(
						new User("admin", "admin123", "admin"),
						new User("sami", "sami123", "user"),
						new User("mariem", "mariem123", "user"),
						new User("mayssa", "mayssa123", "user")
				));
			}
		};
	}

}
