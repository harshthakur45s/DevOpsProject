package com.example.BackendDevOps.controller;

import com.example.BackendDevOps.entities.Candidate;
import com.example.BackendDevOps.service.CandidateService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/candidates")
@CrossOrigin(origins = "http://localhost:5173")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    // Get All Candidates
    @GetMapping
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        return new ResponseEntity<>(candidateService.allCandidates(), HttpStatus.OK);
    }

    // Signup
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Candidate candidate) {

        Optional<Candidate> existing =
                candidateService.singleCandidate(candidate.getEmail());

        if (existing.isPresent()) {
            return new ResponseEntity<>("Email already taken",
                    HttpStatus.BAD_REQUEST);
        }

        // Temporary: store password as plain text (security disabled)
        candidate.setPassword(candidate.getPassword());

        Candidate saved = candidateService.createCandidate(candidate);

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload,
                                   HttpServletRequest request) {

        String email = payload.get("email");
        String password = payload.get("password");

        Optional<Candidate> candidate =
                candidateService.singleCandidate(email);

        if (candidate.isEmpty()) {
            return new ResponseEntity<>(
                    Map.of("error", "Email not found"),
                    HttpStatus.NOT_FOUND);
        }

        // Temporary password check (no encryption)
        if (!password.equals(candidate.get().getPassword())) {
            return new ResponseEntity<>(
                    Map.of("error", "Wrong password"),
                    HttpStatus.UNAUTHORIZED);
        }

        HttpSession session = request.getSession(true);

        Map<String, Object> response = new HashMap<>();
        response.put("token", session.getId());
        response.put("candidate", candidate.get());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}