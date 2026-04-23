# 📄 4. `database-behavior.md`

```md
# 🗄️ Database Behavior

## Collections

### 1. Users
- email (unique)
- password (hashed)
- role

---

### 2. Sessions
- sessionId (unique)
- userId
- device, IP, location
- expiresAt

---

### 3. Refresh Tokens
- refreshToken (unique)
- sessionId (indexed)

---

## 🔁 Relationships

```

User → Session → RefreshToken

```

---

## ⚙️ Indexing Strategy

| Field | Reason |
|------|--------|
| email | login lookup |
| sessionId | session validation |
| refreshToken | token lookup |

---

## 🧠 Why sessionId is NOT unique in tokens

Because:

- Token rotation
- Race conditions
- Retry requests

Multiple tokens per session can exist temporarily.

---

## ⚡ Performance Optimization

- `.lean()` used for faster reads
- Indexes for frequent queries

---

## 🔁 Lifecycle

### Login
- Create session
- Store refresh token

### Refresh
- Delete old token
- Create new token
- Extend session

### Logout
- Delete session
- Delete all tokens

---

## 🧠 Key Insight

Database is not just storage.

It acts as:

```

Security state manager

```
```
