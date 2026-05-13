package com.example.BackendDevOps.repository;

import com.example.BackendDevOps.entities.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {

    Optional<Recruiter> findByEmail(String email);
}