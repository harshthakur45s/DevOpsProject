package com.example.BackendDevOps.service;

import com.example.BackendDevOps.entities.Candidate;
import com.example.BackendDevOps.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    public List<Candidate> allCandidates() {
        return candidateRepository.findAll();
    }

    public Optional<Candidate> singleCandidate(String email) {
        return candidateRepository.findByEmail(email);
    }

    public Candidate createCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);
    }
}