package com.techsur.server.controller;

import com.techsur.server.model.User;
import com.techsur.server.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.techsur.server.model.MatchResult;
import com.techsur.server.repository.MatchResultRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;


@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin", description = "Admin-only endpoints for user and system management")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MatchResultRepository matchResultRepository;
    @Operation(summary = "Get all registered users (admin only)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "List of users"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')") 
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    @Operation(summary = "Get system stats (total users, matches, top skills)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Stats returned successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        long totalUsers = userRepository.count();
        long totalMatches = matchResultRepository.count();
        List<MatchResult> allMatches = matchResultRepository.findAll();

        //Extract and count skills
        Map<String, Integer> skillCount = new HashMap<>();

        for (MatchResult result : allMatches) {
            String analysis = result.getAnalysis();

            if (analysis != null && analysis.contains("**2. Key Matching Skills:**")) {
                int start = analysis.indexOf("**2. Key Matching Skills:**");
                int end = analysis.indexOf("**3.", start); // assume section ends at "**3."

                if (start != -1 && end != -1) {
                    String skillsBlock = analysis.substring(start, end);
                    String[] lines = skillsBlock.split("\\*");

                    for (String line : lines) {
                        String skill = line.trim();
                        if (!skill.isEmpty() && !skill.startsWith("*") && !skill.contains("Key Matching")) {
                            skillCount.put(skill, skillCount.getOrDefault(skill, 0) + 1);
                        }
                    }
                }
            }
        }

        //Top 3 skills by frequency
        List<String> topSkills = skillCount.entrySet().stream()
            .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
            .limit(3)
            .map(Map.Entry::getKey)
            .toList();

        //Response map
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalMatches", totalMatches);
        stats.put("topSkills", topSkills);

        return ResponseEntity.ok(stats);
    }
    @Operation(summary = "Delete a user by ID (admin only)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User deleted successfully"),
        @ApiResponse(responseCode = "403", description = "Admins cannot delete themselves"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null && user.getId().equals(id)) {
            return ResponseEntity.status(403).body("Admins cannot delete themselves.");
        }
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
