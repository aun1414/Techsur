package com.techsur.server.controller;

import com.techsur.server.dto.SignupRequest;
import com.techsur.server.model.User;
import com.techsur.server.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

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
}
