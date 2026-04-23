# 📄 1. `architecture.md`

```md
# 🏗️ System Architecture

## Overview

This project is a production-style backend system built using:

- Node.js + Express
- MongoDB (via Mongoose)
- JWT-based authentication
- Session-based security layer
- Modular architecture (controllers, services, models, middleware)

The system follows a **layered architecture pattern**:

```

Request → Middleware → Controller → Service → Model → Database

```

---

## 🔁 Request Lifecycle

1. **Client sends request**
2. **Middleware Layer**
   - Validation (body, headers)
   - Authentication (JWT verification)
   - Authorization (RBAC)
3. **Controller**
   - Handles request/response
   - Delegates logic to service
4. **Service Layer**
   - Business logic
   - Security checks
   - Orchestrates models
5. **Model Layer**
   - Direct DB interaction
6. **Database**
   - MongoDB stores users, sessions, tokens

---

## 📦 Project Structure

- **Controllers**
  - Handle HTTP logic only
- **Services**
  - Core business + security logic
- **Models**
  - Database interaction only
- **Middlewares**
  - Cross-cutting concerns (auth, validation)
- **Utils**
  - Stateless helpers (JWT, bcrypt, geo)
- **Config**
  - Centralized environment management

---

## 🔐 Authentication Architecture

This system uses **Hybrid Authentication**:

### 1. Access Token (Short-lived)
- Sent in `Authorization: Bearer <token>`
- Used for protected routes

### 2. Refresh Token (Long-lived)
- Stored in HTTP-only cookie
- Used only to generate new tokens

### 3. Session Layer (Database-backed)
- Each login creates a session
- Session contains:
  - device info
  - IP
  - expiry
- Adds **revocation capability**

---

## 🔄 Token + Session Relationship

```

User → Session → Refresh Token → Access Token

```

- Session is the **root of trust**
- Tokens are **derived credentials**

---

## ⚙️ Configuration System

Config is centralized via:

:contentReference[oaicite:0]{index=0}

Key features:

- Type-safe env parsing
- Required vs optional variables
- Boolean & number normalization
- Feature-based config abstraction

---

## 🧠 Design Principles Used

- Separation of concerns
- DRY (e.g., token helpers, cookie helpers)
- Idempotent operations (logout)
- Fail-safe defaults
- Defense-in-depth security

---

## 🚀 Why This Architecture Matters

This is not just CRUD.

It demonstrates:

- Production-ready structure
- Security-first design
- Scalable configuration
- Real-world auth flow (not tutorial-level)

```

---
