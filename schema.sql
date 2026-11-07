-- ============================================================
-- Priyanshi Srivastava Portfolio - Database Schema
-- Run this against your MySQL instance before starting the app
-- ============================================================

CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    role        VARCHAR(20)  NOT NULL DEFAULT 'ADMIN',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(150)  NOT NULL,
    description   TEXT          NOT NULL,
    tech_stack    VARCHAR(500)  NOT NULL,
    github_url    VARCHAR(300),
    live_url      VARCHAR(300),
    image_url     VARCHAR(300),
    featured      BOOLEAN       NOT NULL DEFAULT FALSE,
    display_order INT           NOT NULL DEFAULT 0,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(150) NOT NULL,
    subject      VARCHAR(200) NOT NULL,
    message      TEXT         NOT NULL,
    ip_address   VARCHAR(45),
    is_read      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Seed data: default admin (password = Admin@123)
-- BCrypt hash of "Admin@123"
-- ============================================================
INSERT INTO admin_users (username, password, email, role)
VALUES ('admin',
        '$2a$12$4d/l0Y.0mGxbubMCBRLSyeIwTVfBaJBmBxRMgynlPwF9Qm1NMVD2.',
        'priyanshi.srivastava@example.com',
        'ADMIN')
ON DUPLICATE KEY UPDATE username = username;

-- Seed data: sample projects
INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured, display_order) VALUES
('E-Commerce Platform',
 'A full-stack e-commerce web application with product listing, cart management, user authentication, and payment integration.',
 'React, Spring Boot, MySQL, JWT, Stripe',
 'https://github.com/priyanshi/ecommerce',
 'https://ecommerce-demo.example.com',
 TRUE, 1),
('Task Management App',
 'A collaborative task management tool with real-time updates, drag-and-drop boards, and team collaboration features.',
 'Vue.js, Node.js, MongoDB, Socket.io',
 'https://github.com/priyanshi/taskmanager',
 NULL,
 TRUE, 2),
('Weather Dashboard',
 'A responsive weather dashboard that displays current conditions and 7-day forecasts using the OpenWeatherMap API.',
 'HTML, CSS, JavaScript, OpenWeatherMap API',
 'https://github.com/priyanshi/weather-dashboard',
 'https://weather.example.com',
 FALSE, 3);
