package com.techsur.server.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class MatchResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String resumeFile;
    private String jobFile;
    private double matchScore;
    private LocalDateTime timestamp;

    public MatchResult() {}

    public MatchResult(String email, String resumeFile, String jobFile, double matchScore, LocalDateTime timestamp) {
        this.email = email;
        this.resumeFile = resumeFile;
        this.jobFile = jobFile;
        this.matchScore = matchScore;
        this.timestamp = timestamp;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getResumeFile() {
        return resumeFile;
    }

    public void setResumeFile(String resumeFile) {
        this.resumeFile = resumeFile;
    }

    public String getJobFile() {
        return jobFile;
    }

    public void setJobFile(String jobFile) {
        this.jobFile = jobFile;
    }

    public double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(double matchScore) {
        this.matchScore = matchScore;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}

