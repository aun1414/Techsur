package com.techsur.server.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.techsur.server.dto.LoginRequest;
import com.techsur.server.dto.SignupRequest;
import com.techsur.server.model.User;
import com.techsur.server.repository.UserRepository;
import com.techsur.server.security.JwtUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Authentication", description = "User signup, login, and authentication utilities")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;


    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Operation(summary = "Register a new user")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User registered successfully"),
        @ApiResponse(responseCode = "400", description = "Email already in use")
    })
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

        if (signupRequest.getEmail().equalsIgnoreCase("admin@example.com")) {
            newUser.setRole(User.Role.ADMIN);
        } else {
            newUser.setRole(User.Role.USER);
        }

        userRepository.save(newUser);
        return "User registered successfully!";
    }

    @Operation(summary = "Login and receive JWT token")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login successful, token returned"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
            .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password!");
        }

        try {
            String token = jwtUtil.generateToken(user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("email", user.getEmail());
            response.put("role", user.getRole().name());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Token generation failed: " + e.getMessage());
        }
    }

    @Operation(
        summary = "Get the currently authenticated user's email",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User is authenticated"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/me")
    public String getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return "Hello again, " + email + "! You are authenticated.";
    }


}
