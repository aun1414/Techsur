package com.techsur.server.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_uploads")
public class ResumeUpload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String fileName;

    private String filePath;

    private LocalDateTime uploadTime;

    public ResumeUpload() {}

    public ResumeUpload(String email, String fileName, String filePath, LocalDateTime uploadTime) {
        this.email = email;
        this.fileName = fileName;
        this.filePath = filePath;
        this.uploadTime = uploadTime;
    }

    // Getters and setters...
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFileName() {
        return fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public LocalDateTime getUploadTime() {
        return uploadTime;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public void setUploadTime(LocalDateTime uploadTime) {
        this.uploadTime = uploadTime;
    }
}
