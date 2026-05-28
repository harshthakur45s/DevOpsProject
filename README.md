# DevOps Full Stack Project

A complete full-stack DevOps project built using React, Spring Boot, MySQL, Docker, and Docker Compose.

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS

## Backend
- Spring Boot
- Maven
- Java 25

## Database
- MySQL 8

## DevOps Tools
- Docker
- Docker Compose
- Git & GitHub

---

# Project Architecture

React Frontend
↓
Spring Boot Backend
↓
MySQL Database

All services are containerized using Docker and orchestrated using Docker Compose.

---

# Folder Structure

```bash
DevOpsCA2/
│
├── BackendDevOps/
│   ├── src/
│   ├── Dockerfile
│   ├── pom.xml
│   └── .dockerignore
│
├── FrontendDevOps/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   └── .dockerignore
│
├── docker-compose.yml
├── .gitignore
└── README.md


Webhook test



new workflow


# DevOps Project – Recruitment Management System

## Overview

This project is a Full Stack Recruitment Management System developed using Java Spring Boot, React, Docker, and MySQL/H2 Database. The platform enables recruiters to create and manage job postings while allowing candidates to apply for jobs through an interactive web interface.

The system follows a modern layered architecture with REST APIs, frontend-backend integration, and Dockerized deployment.

---

# Features

## Recruiter Features

* Recruiter Registration & Login
* Create Job Postings
* Manage Posted Jobs
* Delete Job Listings
* View Job Applications
* Update Candidate Application Status
* Maintain Recruiter Job Mapping

## Candidate Features

* Candidate Registration & Login
* Browse Available Jobs
* Apply for Jobs
* Upload Resume Links
* Track Application Status

## Application Management

* Application Status Handling

  * Applied
  * Shortlisted
  * Rejected
* Delete Applications
* Recruiter-Candidate Workflow

---

# Tech Stack

## Frontend

* React.js
* Redux Toolkit
* Vite
* Tailwind CSS

## Backend

* Java
* Spring Boot
* Spring Data JPA
* REST APIs
* Hibernate

## Database

* MySQL
* H2 Database

## DevOps & Deployment

* Docker
* Docker Compose
* Nginx

---

# System Architecture

Frontend (React + Vite)
↓
REST API Communication
↓
Spring Boot Backend
↓
MySQL / H2 Database

Docker containers are used for isolated deployment and environment consistency.

---

# Project Structure

```bash id="3i2l95"
DevOpsProject/
│
├── BackendDevOps/
│   ├── controller/
│   ├── service/
│   ├── entities/
│   ├── repository/
│   └── config/
│
├── FrontendDevOps/
│   ├── components/
│   ├── pages/
│   ├── store/
│   └── modals/
│
├── docker-compose.yml
└── README.md
```

---

# API Highlights

## Recruiter APIs

* Create Recruiter
* Login Recruiter
* Append Job to Recruiter
* Remove Job from Recruiter

## Job APIs

* Create Job
* Fetch All Jobs
* Delete Job

## Application APIs

* Apply for Job
* Update Application Status
* Delete Application

---

# Key Engineering Concepts Used

* RESTful API Design
* Layered Backend Architecture
* Entity Relationships
* Dockerized Full Stack Deployment
* Frontend-Backend Integration
* State Management using Redux
* CORS Configuration
* Environment-based Configuration
* Role-based Workflow Handling

---

# Future Enhancements

* JWT Authentication
* Role Based Authorization
* CI/CD Pipeline Integration
* Kubernetes Deployment
* Email Notifications
* Resume Upload System
* Admin Dashboard

---

# How to Run the Project

## Clone Repository

```bash id="cpm7kl"
git clone https://github.com/harshthakur45s/DevOpsProject.git
```

## Run using Docker

```bash id="wzh5tw"
docker-compose up --build
```

## Frontend

Runs on:

```bash id="d3mqqg"
http://localhost:5175
```

## Backend

Runs on:

```bash id="2jjlwm"
http://localhost:8081
```

---

# Author

Harsh Thakur
B.Tech CSE Student
Full Stack Java Developer & DevOps Enthusiast
