package com.techsur.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.techsur.server.model.ResumeUpload;
import com.techsur.server.repository.ResumeUploadRepository;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {
    @Autowired
    private ResumeUploadRepository resumeUploadRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        try {
            // Use a real base directory (outside of Tomcat temp)
            String basePath = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "resumes";
            String userFolderPath = basePath + File.separator + email.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");

            File userFolder = new File(userFolderPath);
            if (!userFolder.exists()) {
                userFolder.mkdirs();  // create parent folders if needed
            }

            String filePath = userFolderPath + File.separator + file.getOriginalFilename();
            file.transferTo(new File(filePath));
            ResumeUpload upload = new ResumeUpload(
                email,
                file.getOriginalFilename(),
                filePath,
                LocalDateTime.now()
            );
            resumeUploadRepository.save(upload);

            return ResponseEntity.ok("Resume uploaded and saved to DB successfully for: " + email);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload resume.");
        }
    }

}
