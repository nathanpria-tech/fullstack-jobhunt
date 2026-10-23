-- Database Schema for JobHunt
CREATE DATABASE IF NOT EXISTS jobhunt_db;
USE jobhunt_db;

-- 1. Table: users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('job_seeker', 'recruiter') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Table: jobs
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recruiter_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  company VARCHAR(150) NOT NULL,
  location VARCHAR(150) NOT NULL,
  type ENUM('full-time', 'part-time', 'contract', 'internship') NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NULL,
  salary_min INT NULL,
  salary_max INT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_jobs_recruiter
    FOREIGN KEY (recruiter_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Table: applications
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  applicant_id INT NOT NULL,
  cover_letter TEXT NULL,
  status ENUM('pending', 'reviewed', 'rejected') NOT NULL DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_job_applicant UNIQUE (job_id, applicant_id),
  CONSTRAINT fk_applications_job
    FOREIGN KEY (job_id) REFERENCES jobs(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_applications_applicant
    FOREIGN KEY (applicant_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
