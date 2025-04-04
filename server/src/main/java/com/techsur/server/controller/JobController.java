package com.techsur.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/job")
public class JobController {

    @PostMapping("/upload")
    public ResponseEntity<String> uploadJob(@RequestParam("file") MultipartFile file) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        try {
            String basePath = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "jobs";
            String userFolderPath = basePath + File.separator + email.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");

            File userFolder = new File(userFolderPath);
            if (!userFolder.exists()) {
                userFolder.mkdirs();
            }

            String filePath = userFolderPath + File.separator + file.getOriginalFilename();
            file.transferTo(new File(filePath));

            return ResponseEntity.ok("Job description uploaded successfully for: " + email);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload job description.");
        }
    }
}
