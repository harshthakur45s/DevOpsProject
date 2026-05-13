package com.example.BackendDevOps.repository;

import com.example.BackendDevOps.entities.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByEmail(String email);
}