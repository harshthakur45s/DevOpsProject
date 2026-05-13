package com.example.BackendDevOps.service;

import com.example.BackendDevOps.entities.JobApplication;
import com.example.BackendDevOps.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    public List<JobApplication> allApplications() {
        return jobApplicationRepository.findAll();
    }

    public Optional<JobApplication> singleApplication(Long id) {
        return jobApplicationRepository.findById(id);
    }

    public JobApplication apply(JobApplication jobApplication) {
        jobApplication.setStatus("APPLIED");
        return jobApplicationRepository.save(jobApplication);
    }

    public List<JobApplication> getByCandidate(Long candidateId) {
        return jobApplicationRepository.findByCandidateId(candidateId);
    }

    public List<JobApplication> getByJob(Long jobId) {
        return jobApplicationRepository.findByJobId(jobId);
    }
}