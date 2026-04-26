# 📌 Project Overview

This project is a **production-ready backend system** built using **Node.js, Express, and MongoDB Atlas**, focused on **secure authentication, session management, and role-based access control**.

It combines **JWT-based authentication with database-backed sessions**, enabling:

* Token revocation
* Session tracking across devices
* Fine-grained access control (role + ownership)

---

## 🔐 Core Capabilities

* Hybrid authentication (Access + Refresh Tokens + Sessions)
* Refresh token rotation (single-use tokens)
* Sliding session mechanism (activity-based extension)
* Role-based access control (admin vs user)
* Ownership validation for resource-level access
* Centralized error handling

---

## 🧩 System Characteristics

* Layered architecture (controller → service → model)
* Clear separation of concerns
* Stateless + stateful hybrid auth model
* Secure cookie handling (httpOnly refresh tokens)
* Input validation with sanitized responses

---

## 🗄️ Data Model

The system uses three main collections:

* Users
* Sessions
* Refresh Tokens

Together, they maintain **authentication state, session validity, and token lifecycle control**.

---

## 🔁 Key Behaviors

* Login → creates session + tokens
* Refresh → rotates tokens and extends session
* Logout → removes session and invalidates tokens
* Protected routes → validate both token and session

---

## 🛡️ Security Focus

Designed to mitigate:

* Unauthorized access
* Token replay and reuse
* Horizontal & vertical privilege escalation
* Token misuse across sessions

---

## 🌍 Production Context

* Deployed on **Render (Node.js service)**
* Uses **MongoDB Atlas (cloud database)**
* Integrates **Geo-location (MaxMind)** for session context

---

## 🧠 Purpose

This project demonstrates the design of a **secure, structured, and production-aware backend system**, going beyond basic APIs to reflect real-world authentication and authorization patterns.

---
