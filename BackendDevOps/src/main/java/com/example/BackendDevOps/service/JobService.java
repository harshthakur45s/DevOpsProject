package com.example.BackendDevOps.service;

import com.example.BackendDevOps.entities.Job;
import com.example.BackendDevOps.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public List<Job> allJobs() {
        return jobRepository.findAll();
    }

    public Optional<Job> singleJob(Long id) {
        return jobRepository.findById(id);
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}