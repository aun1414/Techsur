package com.techsur.server;

import com.techsur.server.model.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.techsur.server.repository.UserRepository;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	@Bean
	public CommandLineRunner testDatabase(UserRepository userRepository) {
		return args -> {
			User testUser = new User("hr@example.com", "password123", "HR Manager");
			userRepository.save(testUser);
			System.out.println("✅ User saved to database!");
		};
	}

}
