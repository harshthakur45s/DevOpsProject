package com.example.BackendDevOps.repository;

import com.example.BackendDevOps.entities.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {

}