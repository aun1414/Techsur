package com.techsur.server.controller;

import com.techsur.server.dto.SignupRequest;
import com.techsur.server.model.User;
import com.techsur.server.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.techsur.server.dto.LoginRequest;
import com.techsur.server.security.JwtUtil;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;


    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequest signupRequest) {
        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            return "Email already in use!";
        }

        String encodedPassword = passwordEncoder.encode(signupRequest.getPassword());

        User newUser = new User(
            signupRequest.getEmail(),
            encodedPassword,
            signupRequest.getFullName()
        );

        userRepository.save(newUser);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
            .orElse(null);

        if (user == null) {
            return "User not found!";
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return "Invalid password!";
        }

        try {
            String token = jwtUtil.generateToken(user.getEmail());
            return token;
        } catch (Exception e) {
            e.printStackTrace();  // Print full error in console
            return "Token generation failed: " + e.getMessage();
        }
    }

    @GetMapping("/me")
    public String getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return "Hello again, " + email + "! You are authenticated.";
    }


}
