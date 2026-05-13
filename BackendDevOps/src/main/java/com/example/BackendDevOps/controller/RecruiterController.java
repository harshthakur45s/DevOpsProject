package com.example.BackendDevOps.controller;

import com.example.BackendDevOps.entities.Recruiter;
import com.example.BackendDevOps.service.RecruiterService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/recruiters")
@CrossOrigin(origins = "http://localhost:5173")
public class RecruiterController {

    @Autowired
    private RecruiterService recruiterService;

    // Get All Recruiters
    @GetMapping
    public ResponseEntity<List<Recruiter>> getAllRecruiters() {
        return new ResponseEntity<>(recruiterService.allRecruiters(), HttpStatus.OK);
    }

    // Signup
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Recruiter recruiter) {

        Optional<Recruiter> existing =
                recruiterService.singleRecruiter(recruiter.getEmail());

        if (existing.isPresent()) {
            return new ResponseEntity<>("Email already taken",
                    HttpStatus.BAD_REQUEST);
        }

        Recruiter saved = recruiterService.createRecruiter(recruiter);

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload,
                                   HttpServletRequest request) {

        String email = payload.get("email");
        String password = payload.get("password");

        Optional<Recruiter> recruiter =
                recruiterService.singleRecruiter(email);

        if (recruiter.isEmpty()) {
            return new ResponseEntity<>(
                    Map.of("error", "Email not found"),
                    HttpStatus.NOT_FOUND);
        }

        if (!password.equals(recruiter.get().getPassword())) {
            return new ResponseEntity<>(
                    Map.of("error", "Wrong password"),
                    HttpStatus.UNAUTHORIZED);
        }

        HttpSession session = request.getSession(true);

        Map<String, Object> response = new HashMap<>();
        response.put("token", session.getId());
        response.put("recruiter", recruiter.get());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}