# 🚀 Production-Ready Backend API System

A **secure, scalable, and production-style backend system** built using **Node.js, Express, and MongoDB**, implementing **hybrid authentication (JWT + Session)**, role-based access control, and real-world security practices.

---

## 🧠 Why This Project Exists

Most backend projects stop at:

* Basic JWT authentication
* Simple CRUD APIs
* No session management or security depth

This project goes beyond that.

It is designed to demonstrate:

✔ Real-world authentication architecture
✔ Security-first backend design
✔ Clean layered architecture
✔ Stateful session control over stateless JWT
✔ Production-ready backend practices

---

## 🌐 Live Deployment

The backend is **live and deployed in production**:

```text
https://production-ready-backend-api-system.onrender.com
```
### ⚠️ Note on Cold Starts (Render Free Tier)

This project is deployed on the **free tier of Render**, which uses a **spin-down mechanism during inactivity**.

* If the service is idle, it is automatically stopped
* On the next incoming request, the server **boots up again**

👉 As a result:

```text
First request may take ~30–50 seconds (cold start)  
Subsequent requests are fast and normal  
```

This behavior is expected in free-tier environments and does not affect functionality.

---

### 🔹 Deployment Stack

* **Hosting**: Render
* **Database**: MongoDB Atlas
* **Environment**: Production (cloud-based)

---

## ⚙️ Production Behavior Notes

* Server runs in a **stateless cloud environment**
* Filesystem is **ephemeral (non-persistent)**
* External dependencies (Geo DB) are handled dynamically
* Environment variables are managed via **Render dashboard**

---

## 🚀 Getting Started

Follow these steps to run the project locally.

---

### 1. Clone the repository

```bash
git clone https://github.com/vijay-kumar2001/production-ready-backend-api-system.git
cd production-ready-backend-api-system
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create a `.env` file in the root:

```bash
cp .env.example .env
```

Now update values inside `.env`:

```env
DB_URL=your-mongodb-connection-string
JWT_SECRET=your-secret-key
MAXMIND_LICENSE_KEY=your_license_key
```

---

### 4. Setup Geo Database (Production + Local)

This project uses **MaxMind GeoLite2 City database** for IP-based location detection.

---

#### 🔹 Local Development

You can manually download the database:

* Visit MaxMind website
* Download `GeoLite2-City.mmdb`
* Place it in:

```text
src/geo/
```

---

#### 🔹 Production (Automatic Setup)

In production, the system:

```text
✔ Automatically downloads Geo DB at runtime  
✔ Extracts from tar.gz archive  
✔ Stores in correct path  
✔ Cleans temporary files  
```

👉 This ensures:

```text
✔ No manual setup required  
✔ Works across deployments  
✔ Handles missing files automatically  
```

---

### 5. Start the server

```bash
npm run dev
```

Server will run on:

```text
http://localhost:3020
```

---

### 6. Test APIs

* Import Postman collection from `/postman` folder
* Or test manually using any API client

---

### ⚠️ Important Notes

* Ensure MongoDB is running locally or use a cloud DB
* Do NOT commit your `.env` file
* Geo database is handled automatically in production
* Admin user is auto-seeded if enabled in config

---

## 🏗️ System Architecture

```text
Client → Middleware → Controller → Service → Model → Database
```

### Layers Explained

| Layer          | Responsibility                            |
| -------------- | ----------------------------------------- |
| **Middleware** | Validation, Authentication, Authorization |
| **Controller** | Request/Response handling                 |
| **Service**    | Business logic + security enforcement     |
| **Model**      | Database interaction                      |
| **Utils**      | Stateless helpers (JWT, hashing, geo)     |

---

## 🔐 Hybrid Authentication System

This project uses a **Hybrid Auth Model** combining JWT + Sessions.

### 1. Access Token (Short-lived)

* Sent via `Authorization: Bearer <token>`
* Used for protected APIs
* Stateless but short-lived for security

---

### 2. Refresh Token (Long-lived)

* Stored in **HTTP-only cookie**
* Used only for token renewal
* Never exposed to frontend JS

---

### 3. Session Layer (Database-backed)

Each login creates a session storing:

* sessionId
* userId
* IP address
* device & user-agent
* expiry timestamp

👉 This converts JWT from **stateless → state-aware system**

---

## 🔁 Authentication & Session Flow

```text
Login → Session Created → Tokens Generated  
↓  
Access Token → Used for APIs  
↓  
Expires → Refresh Token Used  
↓  
New Tokens Issued + Session Extended
```

---

## 🔄 Token Rotation (Critical Security Feature)

On every refresh:

* Old refresh token is **deleted**
* New refresh token is **issued and stored**

```text
Old Token → Invalid  
New Token → Active
```

### Why this matters:

✔ Prevents replay attacks
✔ Stolen tokens become useless after one use
✔ Ensures single-use refresh tokens

---

## ⏳ Sliding Session (Session Extension)

Each valid request:

```text
session.expiresAt = now + SESSION_EXPIRES_IN
```

### Impact:

✔ Prevents auto logout during activity
✔ Maintains user experience
✔ Ensures session expires only after inactivity

👉 This is a **sliding window session mechanism**

---

## 🛡️ Security Features

### ✅ Core Protections

* Refresh token rotation
* Session validation on every request
* Token type separation (access vs refresh)
* HTTP-only cookies (XSS protection)
* Role-based access control (RBAC)
* Ownership validation (resource-level security)
* Input validation & sanitization
* Centralized error handling middleware

---

## 🚨 Attacks Prevented

| Attack                  | Protection             |
| ----------------------- | ---------------------- |
| Replay attack           | Token rotation         |
| Token reuse after theft | Rotation + session     |
| Token swapping          | sessionId verification |
| XSS token access        | httpOnly cookies       |
| Privilege escalation    | RBAC                   |
| Horizontal access abuse | owner checks           |
| Invalid input injection | validation middleware  |

---

## 🔄 Session + Token Relationship

```text
User → Session → Refresh Token → Access Token
```

* Session = **source of truth**
* Tokens = **derived credentials**

---

## ⚠️ Centralized Error Handling

The system uses a **custom AppError class + global error middleware**.

### Benefits:

✔ Consistent error responses
✔ Clean controller/service code
✔ Separation of logic vs error formatting

Example:

```json
{
  "message": "Invalid token",
  "status": 401
}
```

---

## 🧩 Key Features

### 🔐 Authentication

* Register / Login
* Refresh token flow
* Logout (idempotent)
* Token rotation implemented

---

### 👤 User System

* Profile retrieval
* Session inspection
* Secure user data sanitization

---

### 👥 Admin Features (RBAC)

* Get all users (admin only)
* Get user by ID (owner/admin)
* Update user roles (admin only)

---

### 🔄 CRUD & Data Flow

* Create → register user
* Read → profile, users
* Update → role update
* Delete → logout (session + token removal)

---

### ⚙️ Config System

* Centralized config object
* Type-safe env parsing
* Required/optional validation
* Feature-based config separation

---

## 🔄 Runtime Dependency Handling

This system implements **dynamic dependency management**:

### 🔹 Example: Geo Database

```text
✔ Not stored in repository  
✔ Not manually uploaded  
✔ Automatically downloaded on startup  
✔ Always available when server runs  
```

---

### 🔹 Why this matters

```text
✔ Works in cloud environments  
✔ Handles ephemeral filesystem  
✔ Eliminates manual setup errors  
✔ Improves reliability  
```

---

## 📁 Project Structure

```text
/config        → Environment + feature configs  
/controllers   → Request handling  
/services      → Business logic  
/models        → Database layer  
/middlewares   → Auth, validation, RBAC  
/routes        → API routes  
/utils         → JWT, bcrypt, geo  
/db            → DB connection  
/scripts       → Admin seeding  
/error-lab     → AppError + error middleware  
```

---

## ⚙️ Environment Configuration

Example:

```text
JWT_SECRET=super-secret-key  
JWT_ACCESS_EXPIRES_IN=5m  
JWT_REFRESH_EXPIRES_IN=14d  
SESSION_EXPIRES_IN=1209600000  
COOKIE_HTTP_ONLY=true  
```

---

## 🗄️ Database Design

### Collections

#### Users

* email (unique)
* password (bcrypt hashed)
* role

#### Sessions

* sessionId
* userId
* device info
* expiresAt

#### Refresh Tokens

* refreshToken (unique)
* sessionId (indexed)

---

## ⚡ Database Behavior Highlights

* Token rotation deletes old entries
* Session expiry checked per request
* Logout removes session + tokens
* `.lean()` used for optimized reads

---

## 🔐 Protected Route Flow

1. Validate Authorization header
2. Verify access token
3. Validate session from DB
4. Extend session (sliding window)
5. Attach `req.user`

---

## 🧠 Key Design Decisions

### Why NOT JWT alone?

JWT alone:

❌ Cannot revoke
❌ Vulnerable to misuse

This system:

✔ Adds session control
✔ Enables logout & invalidation
✔ Tracks active users

---

### Why Token Rotation?

✔ Prevents replay attacks
✔ Limits token lifetime even if stolen

---

### Why Sliding Session?

✔ Improves UX
✔ Keeps system secure & active

---

### Why Service Layer?

✔ Separation of concerns
✔ Reusable business logic
✔ Cleaner controllers

---

## 🌐 Deployment Design Decisions

### Why not store Geo DB in repo?

```text
❌ Large size (~60MB)  
❌ Not scalable  
❌ Not production-friendly  
```

---

### Why runtime download?

```text
✔ Always available  
✔ Works across environments  
✔ No manual intervention  
✔ Production-grade approach  
```

---

### Why root route (`/`) added?

```text
✔ Handles Render health checks  
✔ Prevents unnecessary 404 logs  
✔ Improves observability  
```

---

## 🧪 Testing Strategy

Tested using structured Postman collection:

* Positive flows
* Negative scenarios
* Security edge cases
* DB state verification (MongoDB Atlas)

---

## 🌍 Testing in Production

All APIs can be tested using:

```text
BASE_URL = https://production-ready-backend-api-system.onrender.com
```

---

### 🔹 Recommended Flow

```text
1. Register user  
2. Login  
3. Access protected routes  
4. Refresh token  
5. Test admin routes  
```

---

### 🔹 Verify via MongoDB Atlas

```text
✔ Users collection updates  
✔ Sessions created  
✔ Tokens rotated  
✔ Roles updated  
```

---

---

## 🔗 API Reference (Production-Verified)

All routes are tested on production and follow consistent request/response patterns.

Base URL:

```text
https://production-ready-backend-api-system.onrender.com
```

---

## 🔐 Authentication Routes

### 1. Register

```http
POST /auth/register
```

**Body:**

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "email": "...",
    "role": "user"
  }
}
```

---

### 2. Login

```http
POST /auth/login
```

**Body:**

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "accessToken": "...",
  "user": {
    "_id": "...",
    "email": "...",
    "role": "user"
  }
}
```

**Behavior:**

* Sets `refreshToken` in httpOnly cookie
* Creates session in DB
* Captures device + IP + geo (if available)

---

### 3. Refresh Token

```http
POST /auth/refresh
```

**Headers:**

```text
Cookie: refreshToken=...
```

**Response:**

```json
{
  "message": "Token refreshed",
  "accessToken": "..."
}
```

**Behavior:**

* Rotates refresh token
* Extends session (sliding session)
* Invalidates old refresh token

---

### 4. Logout

```http
POST /auth/logout
```

**Response:**

```json
{
  "message": "user logged out."
}
```

**Behavior:**

* Deletes session
* Deletes refresh tokens
* Clears cookie
* Invalidates all authentication state

---

## 👤 User Routes

### 5. Get Profile (Protected)

```http
GET /profile
```

**Headers:**

```text
Authorization: Bearer <accessToken>
```

**Response:**

```json
{
  "message": "Profile fetched",
  "user": {...},
  "session": {...}
}
```

**Behavior:**

* Requires valid access token
* Verifies session from DB
* Extends session expiry
* Returns session metadata (device, IP, location)

---

## 👥 Admin Routes (RBAC)

> ⚠️ Admin credentials are **not exposed publicly**.
> Use your own seeded admin or create via controlled setup.

---

### 6. Get All Users (Admin Only)

```http
GET /users
```

**Headers:**

```text
Authorization: Bearer <adminToken>
```

**Response:**

```json
{
  "message": "Users fetched successfully",
  "users": [...]
}
```

**Behavior:**

* Only accessible by admin
* Returns sanitized user data

---

### 7. Get User by ID (Owner / Admin)

```http
GET /users/:id
```

**Headers:**

```text
Authorization: Bearer <accessToken>
```

**Behavior:**

* Owner → allowed
* Admin → allowed
* Others → 403 Forbidden

---

### 8. Update User Role (Admin Only)

```http
PUT /users/:id/role
```

**Headers:**

```text
Authorization: Bearer <adminToken>
Content-Type: application/json
```

**Body:**

```json
{
  "role": "admin"
}
```

**Behavior:**

* Only admin allowed
* Updates role immediately in DB
* Prevents invalid role values

---

## ⚠️ Error Handling Pattern

All errors follow consistent structure:

```json
{
  "message": "Error message",
  "status": 400
}
```

---

## 🔄 Complete Auth Lifecycle (Production Behavior)

```text
Register → Login → Access Protected Routes  
↓  
Access Token Expires  
↓  
Refresh Token Used  
↓  
New Tokens Issued (Rotation)  
↓  
Logout → Session + Tokens Destroyed
```

---

## 🧪 Production Testing Coverage

The system has been tested for:

```text
✔ Positive flows (all routes)  
✔ Negative cases (invalid token, missing token)  
✔ RBAC enforcement  
✔ Ownership validation  
✔ Token rotation correctness  
✔ Session lifecycle (create → extend → destroy)  
✔ Database consistency (MongoDB Atlas)  
✔ External dependency behavior (GeoDB)  
```

---

## 🧠 Behavioral Guarantees

```text
✔ Stateless JWT enhanced with stateful session validation  
✔ Token misuse prevented via rotation  
✔ Session acts as source of truth  
✔ Authorization enforced at multiple levels (auth + role + ownership)  
✔ System remains consistent across local and production environments  
```

---
---

## 📸 Production Validation (Proof)

This system has been tested end-to-end on the deployed environment.

### Verified in Production:

```text
✔ User registration → reflected in MongoDB Atlas  
✔ Login → session + tokens created  
✔ Refresh → token rotation confirmed  
✔ Logout → session + tokens removed  
✔ Profile → session + device + geo data returned  
✔ Admin routes → RBAC enforced correctly  
```

### Validation Sources:

* Postman (production API testing)
* MongoDB Atlas (real-time DB verification)

👉 This ensures the system is not just functional locally, but behaves correctly in real-world deployment.

---



## 📊 What Makes This Project Stand Out

This is NOT:

❌ Basic CRUD project
❌ Simple JWT implementation

This IS:

✔ Hybrid authentication system
✔ Session-aware backend
✔ Security-focused design
✔ Production-style architecture
✔ Real-world token lifecycle management
✔ Cloud deployment + runtime dependency handling

---

## 🌍 Production-Ready Capabilities

```text
✔ Deployed on cloud (Render)  
✔ Uses managed database (MongoDB Atlas)  
✔ Handles environment-based configuration  
✔ Supports runtime dependency setup  
✔ Designed for real-world infrastructure  
```

---

## 🧑‍💻 Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT (jsonwebtoken)
* bcryptjs
* cookie-parser

---

## 🧰 Additional Production Tools

* Axios (stream-based downloads)
* tar (archive extraction)
* MaxMind (Geo IP database)

---

## 🧠 Advanced Learnings Demonstrated

```text
✔ Difference between local vs production systems  
✔ Handling ephemeral file systems  
✔ Runtime dependency management  
✔ Debugging deployment logs  
✔ Managing external APIs securely  
✔ Designing self-healing backend systems  
```

---

## 🧠 Key Learning Outcomes

This project demonstrates:

* Deep understanding of authentication systems
* Token lifecycle management
* Backend security practices
* Scalable architecture design
* Clean code organization

---

## 🚀 Future Improvements

* Rate limiting
* CSRF protection
* Refresh token hashing
* Device/session management UI
* Logging system (Winston)

---

## 🔥 Final Note

> This project is not just about APIs — it’s about building a **secure backend system with real-world constraints and behavior.**

---

## ⭐ If you like this project

Give it a ⭐ and feel free to explore or suggest improvements!
