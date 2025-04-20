package com.techsur.server.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.techsur.server.model.MatchResult;
import com.techsur.server.repository.MatchResultRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;


@CrossOrigin(origins = "http://localhost:3000")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Match API", description = "Handles resume-job matching operations")
@RestController
@RequestMapping("/api")
public class MatchController {
    @Autowired
    private MatchResultRepository matchResultRepository;


    private final RestTemplate restTemplate = new RestTemplate();
    @Operation(
        summary = "Match resume with job description",
        description = "Uploads two files and returns a match score with AI analysis"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Match computed successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/match", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> matchFiles(@Parameter(description = "Resume file (.pdf/.txt)", required = true)
    @RequestPart("resume") MultipartFile resume,

    @Parameter(description = "Job description file (.pdf/.txt)", required = true)
    @RequestPart("job") MultipartFile job) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();

            // Prepare the request to Flask microservice
            String flaskUrl = "http://18.217.132.99:5000/match";

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

    @Operation(
        summary = "Get match history for the logged-in user",
        description = "Returns a list of past resume-job match results"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Match history fetched successfully"),
        @ApiResponse(responseCode = "500", description = "Failed to fetch match history")
    })
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
    @Operation(
        summary = "Delete a match result by ID",
        description = "Deletes a specific resume-job match record"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Match deleted successfully")
    })
    @DeleteMapping("/match/{id}")
    public ResponseEntity<?> deleteMatch(@PathVariable Long id) {
        matchResultRepository.deleteById(id);
        return ResponseEntity.ok("Deleted match with ID: " + id);
    }
    
    @Operation(
        summary = "Get a specific match result by ID",
        description = "Returns detailed match info including AI analysis for the given ID"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Match found"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "500", description = "Failed to fetch match")
    })
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
