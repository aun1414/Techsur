package com.techsur.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.techsur.server.model.JobUpload;
import com.techsur.server.repository.JobUploadRepository;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/job")
public class JobController {
    @Autowired
    private JobUploadRepository jobUploadRepository;

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
            JobUpload upload = new JobUpload(
                email,
                file.getOriginalFilename(),
                filePath,
                LocalDateTime.now()
            );
            jobUploadRepository.save(upload);

            return ResponseEntity.ok("Job description uploaded and saved to DB successfully for: " + email);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload job description.");
        }
    }
    @GetMapping("/list")
    public ResponseEntity<List<JobUpload>> listJobs() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<JobUpload> uploads = jobUploadRepository.findByEmail(email);
        return ResponseEntity.ok(uploads);
}

}
