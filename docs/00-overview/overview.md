# 📌 Project Overview

This project is a **production-style backend system** built using **Node.js, Express, and MongoDB**, focusing on **secure authentication, session management, and role-based access control**.

Unlike basic API implementations, this system combines **JWT-based authentication with database-backed sessions**, enabling:

* Token revocation
* Session tracking
* Controlled access across users and roles

---

## 🔐 Core Capabilities

* Hybrid authentication (Access + Refresh Tokens + Sessions)
* Refresh token rotation (single-use tokens)
* Sliding session mechanism (prevents auto logout during activity)
* Role-based access control (admin vs user)
* Ownership validation for resource access
* Centralized error handling

---

## 🧩 System Characteristics

* Layered architecture (controller → service → model)
* Clear separation of concerns
* Stateless + stateful hybrid auth model
* Secure cookie handling for refresh tokens
* Input validation and sanitized responses

---

## 🗄️ Data Model

The system uses three main collections:

* Users
* Sessions
* Refresh Tokens

These work together to maintain **authentication state, session validity, and token lifecycle control**.

---

## 🔁 Key Behaviors

* Login creates session + tokens
* Refresh rotates tokens and extends session
* Logout removes session and tokens
* Protected routes validate both token and session

---

## 🛡️ Security Focus

The system is designed to prevent:

* Unauthorized access
* Token replay attacks
* Privilege escalation
* Token misuse across contexts

---

## 🧠 Purpose

This project demonstrates not just API development, but the ability to design a **secure, structured, and scalable backend system** with real-world considerations.
