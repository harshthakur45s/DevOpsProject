package com.example.BackendDevOps.service;

import com.example.BackendDevOps.entities.Recruiter;
import com.example.BackendDevOps.repository.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecruiterService {

    @Autowired
    private RecruiterRepository recruiterRepository;

    public List<Recruiter> allRecruiters() {
        return recruiterRepository.findAll();
    }

    public Optional<Recruiter> singleRecruiter(String email) {
        return recruiterRepository.findByEmail(email);
    }

    public Recruiter createRecruiter(Recruiter recruiter) {
        return recruiterRepository.save(recruiter);
    }

    public Recruiter appendJobId(String email, Long jobId) {
        Optional<Recruiter> recruiterOpt = recruiterRepository.findByEmail(email);
        if (recruiterOpt.isPresent()) {
            Recruiter recruiter = recruiterOpt.get();
            if (!recruiter.getJobIds().contains(jobId)) {
                recruiter.getJobIds().add(jobId);
                return recruiterRepository.save(recruiter);
            }
            return recruiter;
        }
        throw new RuntimeException("Recruiter not found with email: " + email);
    }

    public Recruiter removeJobId(String email, Long jobId) {
        Optional<Recruiter> recruiterOpt = recruiterRepository.findByEmail(email);
        if (recruiterOpt.isPresent()) {
            Recruiter recruiter = recruiterOpt.get();
            if (recruiter.getJobIds().contains(jobId)) {
                recruiter.getJobIds().remove(jobId);
                return recruiterRepository.save(recruiter);
            }
            return recruiter;
        }
        throw new RuntimeException("Recruiter not found with email: " + email);
    }
}