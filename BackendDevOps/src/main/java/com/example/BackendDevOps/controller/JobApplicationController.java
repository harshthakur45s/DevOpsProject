package com.example.BackendDevOps.controller;

import com.example.BackendDevOps.entities.JobApplication;
import com.example.BackendDevOps.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/applications")
@CrossOrigin(origins = "http://localhost:5175")
public class JobApplicationController {

        @Autowired
    private JobApplicationService jobApplicationService;

    // Apply to job
    @PostMapping
    public ResponseEntity<JobApplication> apply(@RequestBody JobApplication jobApplication) {

        JobApplication saved = jobApplicationService.apply(jobApplication);

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Get all applications
    @GetMapping
    public ResponseEntity<List<JobApplication>> getAll() {
        return new ResponseEntity<>(jobApplicationService.allApplications(), HttpStatus.OK);
    }

    // Get by candidate
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<JobApplication>> getByCandidate(@PathVariable Long candidateId) {

        return new ResponseEntity<>(
                jobApplicationService.getByCandidate(candidateId),
                HttpStatus.OK
        );
    }

    // Get by job
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplication>> getByJob(@PathVariable Long jobId) {

        return new ResponseEntity<>(
                jobApplicationService.getByJob(jobId),
                HttpStatus.OK
        );
    }

    // Update status
    @PostMapping("/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody String status) {
        try {
            if (status != null) {
                status = status.trim();
                if (status.endsWith("=")) {
                    status = status.substring(0, status.length() - 1);
                }
                if (status.startsWith("\"") && status.endsWith("\"")) {
                    status = status.substring(1, status.length() - 1);
                }
            }
            JobApplication updated = jobApplicationService.updateStatus(id, status);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete application
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable Long id) {
        try {
            jobApplicationService.deleteApplication(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}