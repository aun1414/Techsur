package com.techsur.server.controller;

import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import com.techsur.server.repository.MatchResultRepository;
import com.techsur.server.model.MatchResult;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class MatchController {
    @Autowired
    private MatchResultRepository matchResultRepository;


    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/match")
    public ResponseEntity<?> matchFiles(@RequestParam("resume") MultipartFile resume,
                                        @RequestParam("job") MultipartFile job) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();

            // Prepare the request to Flask microservice
            String flaskUrl = "http://localhost:5000/match";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("resume", new ByteArrayResource(resume.getBytes()) {
                @Override
                public String getFilename() {
                    return resume.getOriginalFilename();
                }
            });
            body.add("job", new ByteArrayResource(job.getBytes()) {
                @Override
                public String getFilename() {
                    return job.getOriginalFilename();
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Send the request to Python AI service
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            flaskUrl,
            HttpMethod.POST,
            requestEntity,
            new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null || !responseBody.containsKey("match")) {
                return ResponseEntity.status(500).body("Flask response missing or invalid.");
            }
            double matchScore = Double.parseDouble(responseBody.get("match").toString());
            String analysis = responseBody.get("analysis").toString();
            MatchResult result = new MatchResult(
            email,
            resume.getOriginalFilename(),
            job.getOriginalFilename(),
            matchScore,
            analysis,
            LocalDateTime.now()
            );
            
            matchResultRepository.save(result);
            responseBody.put("id", result.getId());

            // Return the AI result to frontend
            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Matching failed.");
        }
    }
    @GetMapping("/match/history")
    public ResponseEntity<?> getMatchHistory() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();

            List<MatchResult> matches = matchResultRepository.findByEmail(email);

            //Sort by timestamp descending
            List<MatchResult> sorted = matches.stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(Collectors.toList());

            return ResponseEntity.ok(sorted);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to fetch match history.");
        }
    }
    
    @DeleteMapping("/match/{id}")
    public ResponseEntity<?> deleteMatch(@PathVariable Long id) {
        matchResultRepository.deleteById(id);
        return ResponseEntity.ok("Deleted match with ID: " + id);
    }
    
    @GetMapping("/match/{id}")
    public ResponseEntity<?> getMatchById(@PathVariable Long id) {
        try {
            MatchResult match = matchResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found"));

            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            if (!match.getEmail().equals(email)) {
                return ResponseEntity.status(403).body("Access denied");
            }

            return ResponseEntity.ok(match);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to fetch match.");
        }
    }


}
