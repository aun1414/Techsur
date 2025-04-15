package com.techsur.server.archive;

import com.techsur.server.model.ResumeUpload;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeUploadRepository extends JpaRepository<ResumeUpload, Long> {
    List<ResumeUpload> findByEmail(String email);
}
