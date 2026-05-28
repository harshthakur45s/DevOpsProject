package com.example.BackendDevOps.controller;

import com.example.BackendDevOps.entities.Job;
import com.example.BackendDevOps.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/jobs")
@CrossOrigin(origins = "http://localhost:5175")
public class JobController {

    @Autowired
    private JobService jobService;

    // Get all jobs
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return new ResponseEntity<>(jobService.allJobs(), HttpStatus.OK);
    }

    // Get single job
    @GetMapping("/{id}")
    public ResponseEntity<?> getJob(@PathVariable Long id) {

        Optional<Job> job = jobService.singleJob(id);

        if (job.isEmpty()) {
            return new ResponseEntity<>("Job not found", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(job.get(), HttpStatus.OK);
    }

    // Create job
    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {

        Job saved = jobService.createJob(job);

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Delete job
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {

        jobService.deleteJob(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}