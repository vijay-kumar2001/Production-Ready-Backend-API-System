# 🏗️ System Architecture

## Overview

This project is a production-style backend system built using:

* Node.js + Express
* MongoDB Atlas (via Mongoose)
* JWT-based authentication
* Session-based security layer
* Modular architecture (controllers, services, models, middleware)

The system follows a **layered architecture pattern**:

```
Request → Middleware → Controller → Service → Model → Database
```

---

## 🔁 Request Lifecycle

1. **Client sends request**
2. **Middleware Layer**

   * Validation (body, headers)
   * Authentication (JWT verification)
   * Authorization (RBAC + ownership)
3. **Controller**

   * Handles request/response
   * Delegates logic to service
4. **Service Layer**

   * Business logic
   * Security checks
   * Orchestrates models
5. **Model Layer**

   * Direct DB interaction
6. **Database**

   * MongoDB Atlas stores users, sessions, tokens

---

## 📦 Project Structure

* **Controllers**

  * Handle HTTP logic only
* **Services**

  * Core business + security logic
* **Models**

  * Database interaction only
* **Middlewares**

  * Cross-cutting concerns (auth, validation, RBAC)
* **Utils**

  * Stateless helpers (JWT, bcrypt, geo, token helpers)
* **Config**

  * Centralized environment management

---

## 🔐 Authentication Architecture

This system uses **Hybrid Authentication**:

### 1. Access Token (Short-lived)

* Sent in `Authorization: Bearer <token>`
* Used for protected routes
* Stateless (JWT)

### 2. Refresh Token (Long-lived)

* Stored in HTTP-only cookie
* Used only to generate new tokens
* Rotated on each use (prevents reuse)

### 3. Session Layer (Database-backed)

* Each login creates a session
* Session contains:

  * device info
  * IP
  * location (via GeoDB)
  * expiry
* Adds **revocation capability**
* Acts as **source of truth**

---

## 🔄 Token + Session Relationship

```
User → Session → Refresh Token → Access Token
```

* Session is the **root of trust**
* Tokens are **derived credentials**
* Logout destroys session → invalidates all tokens

---

## 🌍 Production Architecture

The system is deployed using:

* **Render (Backend Hosting)**
* **MongoDB Atlas (Database)**
* **MaxMind GeoLite2 (Geo-location)**

### Runtime Behavior:

* Server may **cold start** on inactivity (Render free tier)
* First request may take longer (boot time)
* Subsequent requests are fast
* GeoDB is **downloaded at runtime** using license key
* No large files stored in repository

---

## 📍 External Integrations

### 1. MongoDB Atlas

* Cloud database
* Stores users, sessions, tokens
* Enables real-time production validation

### 2. MaxMind GeoDB

* Used for IP → location resolution
* Loaded dynamically at server startup
* Adds contextual session metadata

### 3. Render Deployment

* Handles server hosting
* Environment variables managed securely
* Automatic redeploy on Git push

---

## ⚙️ Configuration System

Config is centralized via a dedicated configuration module.

Key features:

* Type-safe env parsing
* Required vs optional variables
* Boolean & number normalization
* Feature-based config abstraction
* Centralized access across app

---

## 🧠 Design Principles Used

* Separation of concerns
* DRY (e.g., token helpers, cookie helpers)
* Idempotent operations (logout)
* Fail-safe defaults
* Defense-in-depth security
* Least privilege (RBAC + ownership)

---

## 🔄 Runtime Security Flow

```
Request → JWT Verified → Session Checked → Role Checked → Resource Access
```

This ensures:

* Token alone is not trusted
* Session must exist and be valid
* Role + ownership enforced

---

## 🚀 Why This Architecture Matters

This is not just CRUD.

It demonstrates:

* Production-ready structure
* Security-first design
* Hybrid auth (JWT + session)
* Token rotation strategy
* Fine-grained authorization (RBAC + ownership)
* External system integration (GeoDB, Atlas)
* Real-world deployment behavior

---
