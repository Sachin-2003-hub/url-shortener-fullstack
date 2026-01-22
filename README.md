# 🔗 Full Stack URL Shortener

A scalable URL shortening service built with **Java Spring Boot** (Backend) and **React** (Frontend).
This project demonstrates key System Design concepts including **Base62 Encoding**, **Layered Architecture**, and **Database Persistence**.

![Project Status](https://img.shields.io/badge/status-active-success)
![Java](https://img.shields.io/badge/Java-17%2B-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![React](https://img.shields.io/badge/React-18-blue)

## 🏗 System Architecture

The application follows a clean **MVC (Model-View-Controller)** architecture to ensure separation of concerns:

* **Controller Layer:** Handles HTTP requests (REST API).
* **Service Layer:** Contains business logic (Base62 conversion, Input Validation).
* **Repository Layer:** Manages database interactions (JPA/Hibernate).
* **Database:** H2 (In-Memory) or MySQL for persistent storage.

### Core Algorithm: Base62
Instead of random strings, this system uses **Base62 Encoding** on the database Auto-Increment ID.
* ID `100` -> Short Code `b8`
* Guarantees uniqueness (no collisions).
* Optimized for URL-safe characters (`a-z`, `A-Z`, `0-9`).

---

## 🚀 Features

* **Shorten URLs:** Convert long links into compact, shareable codes.
* **Redirection:** Instant 302 redirection to the original URL.
* **Analytics:** Track total clicks for every link.
* **Validation:** Prevents invalid URL formats and handles 404 errors gracefully.
* **CORS Enabled:** Seamless integration between React and Spring Boot.

---

## 🛠️ Tech Stack

### Backend
* **Language:** Java
* **Framework:** Spring Boot (Web, Data JPA)
* **Database:** H2 (Dev) / MySQL (Prod)
* **Build Tool:** Maven

### Frontend
* **Library:** React.js (Vite)
* **Styling:** Bootstrap 5
* **HTTP Client:** Fetch API

---

## ⚙️ Getting Started

### Prerequisites
* Java 17 or higher
* Node.js & npm

### 1. Setup Backend (Spring Boot)
```bash
# Clone the repository
git clone [https://github.com/YOUR_USERNAME/url-shortener.git](https://github.com/YOUR_USERNAME/url-shortener.git)

# Navigate to backend
cd backend

# Run the application
mvn spring-boot:run

# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev

![Screenshot](<Screenshot (15).png>)