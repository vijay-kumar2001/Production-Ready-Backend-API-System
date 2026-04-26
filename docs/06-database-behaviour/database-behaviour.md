# 🗄️ Database Behavior

## Collections

### 1. Users

* email (unique)
* password (hashed)
* role
* createdAt / updatedAt

---

### 2. Sessions

* sessionId (unique)
* userId
* device
* IP
* location (via GeoDB)
* expiresAt
* createdAt / updatedAt

---

### 3. Refresh Tokens

* refreshToken (unique)
* sessionId (indexed)
* createdAt

---

## 🔁 Relationships

```text id="s4k9vm"
User → Session → RefreshToken
```

* One user can have multiple sessions
* One session can have multiple refresh tokens (temporarily, during rotation)

---

## 🌍 Production Database

* Hosted on **MongoDB Atlas**
* Enables real-time validation of:

  * authentication flows
  * session lifecycle
  * token rotation
* Ensures consistency across local and deployed environments

---

## ⚙️ Indexing Strategy

| Field        | Reason             |
| ------------ | ------------------ |
| email        | fast login lookup  |
| sessionId    | session validation |
| refreshToken | token lookup       |

---

## 🧠 Why sessionId is NOT unique in tokens

Because:

* Token rotation
* Network retries
* Parallel requests

👉 Multiple tokens may exist briefly for the same session, but:

```text id="m8r2kx"
Only the latest valid token is accepted
```

---

## 🔄 Token Rotation Behavior

* Old refresh token is deleted on use
* New refresh token is generated
* Rotation prevents reuse (replay attacks)
* Ensures secure token lifecycle

---

## ⏱️ Session Lifecycle Management

* Session expiry is stored in `expiresAt`
* Extended on each authenticated request (**sliding session**)
* Acts as **central control point for authentication state**

---

## ⚡ Performance Optimization

* `.lean()` used for faster read operations
* Indexed queries for authentication paths
* Minimal data selection (no unnecessary fields)

---

## 🔁 Lifecycle Flow

### Login

* Create session
* Store refresh token
* Capture device, IP, location

---

### Refresh

* Delete old refresh token
* Create new refresh token
* Extend session expiry

---

### Logout

* Delete session
* Delete all associated refresh tokens

---

## 🔐 Security Behavior

* Password stored as hashed value (bcrypt)
* Refresh tokens stored in DB for revocation
* Session required for all protected access
* Prevents:

  * token reuse
  * unauthorized access
  * session hijacking (to an extent)

---

## 🧠 Key Insight

Database is not just storage.

It acts as:

```text id="c7p4mz"
Security state manager + session authority
```

---

## 🚀 Why This Design Matters

```text id="x3n9qt"
✔ Enables token revocation (not possible in pure JWT systems)  
✔ Supports session tracking across devices  
✔ Allows secure logout (true invalidation)  
✔ Maintains consistency between stateless and stateful auth  
✔ Scales for real-world multi-session environments  
```

---
