package com.techsur.server.archive;

import com.techsur.server.model.JobUpload;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobUploadRepository extends JpaRepository<JobUpload, Long> {
    List<JobUpload> findByEmail(String email);
}
