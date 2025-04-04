package com.techsur.server.controller;

import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class MatchController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/match")
    public ResponseEntity<?> matchFiles(@RequestParam("resume") MultipartFile resume,
                                        @RequestParam("job") MultipartFile job) {
        try {
            //String email = SecurityContextHolder.getContext().getAuthentication().getName();

            // Prepare the request to Flask microservice
            String flaskUrl = "http://localhost:5000/match"; // Update later when deployed

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


            // Return the AI result to frontend
            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Matching failed.");
        }
    }
}
