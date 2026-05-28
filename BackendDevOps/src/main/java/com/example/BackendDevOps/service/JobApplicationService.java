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

    @Autowired
    private com.example.BackendDevOps.repository.JobRepository jobRepository;

    public List<JobApplication> allApplications() {
        return jobApplicationRepository.findAll();
    }

    public Optional<JobApplication> singleApplication(Long id) {
        return jobApplicationRepository.findById(id);
    }

    public JobApplication apply(JobApplication jobApplication) {
        jobApplication.setStatus("Pending");
        if (jobApplication.getJobId() != null) {
            jobRepository.findById(jobApplication.getJobId()).ifPresent(job -> {
                if (jobApplication.getPosition() == null || jobApplication.getPosition().trim().isEmpty()) {
                    jobApplication.setPosition(job.getPosition());
                }
                if (jobApplication.getCompany() == null || jobApplication.getCompany().trim().isEmpty()) {
                    jobApplication.setCompany(job.getCompany());
                }
                if (jobApplication.getLocation() == null || jobApplication.getLocation().trim().isEmpty()) {
                    jobApplication.setLocation(job.getLocation());
                }
            });
        }
        return jobApplicationRepository.save(jobApplication);
    }

    public List<JobApplication> getByCandidate(Long candidateId) {
        return jobApplicationRepository.findByCandidateId(candidateId);
    }

    public List<JobApplication> getByJob(Long jobId) {
        return jobApplicationRepository.findByJobId(jobId);
    }

    public JobApplication updateStatus(Long id, String status) {
        Optional<JobApplication> appOpt = jobApplicationRepository.findById(id);
        if (appOpt.isPresent()) {
            JobApplication app = appOpt.get();
            app.setStatus(status);
            return jobApplicationRepository.save(app);
        }
        throw new RuntimeException("Application not found with id: " + id);
    }

    public void deleteApplication(Long id) {
        if (jobApplicationRepository.existsById(id)) {
            jobApplicationRepository.deleteById(id);
        } else {
            throw new RuntimeException("Application not found with id: " + id);
        }
    }
}