# 📄 2. `protected-routes.md`

```md
# 🔐 Protected Routes & Authentication Flow

## Overview

Protected routes require:

1. Valid access token
2. Valid session

Both must pass.

---

## 🔁 Flow

```

Request → hybridAuthMiddleware → Controller

```

---

## 🧱 Step-by-Step Validation

### 1. Authorization Header Check

```

Authorization: Bearer <accessToken>

```

- Missing → 401
- Invalid format → 401

---

### 2. Access Token Verification

- Signature verified
- Expiry checked
- Token type validated (`access`)

---

### 3. Session Validation

- Session exists in DB
- Not expired
- Matches token sessionId

---

### 4. Sliding Session Extension

Each valid request:

```

session.expiresAt = now + SESSION_EXPIRES_IN

````

---

## 📦 req.user Injection

After validation:

```js
req.user = {
  userId,
  sessionId,
  role
}
````

---

## 🔐 Why Cookie is NOT Used Here

* Access token → explicit (header)
* Refresh token → implicit (cookie)

This separation:

* Prevents accidental usage
* Reduces attack surface

---

## ⚠️ Failure Cases

| Case            | Result |
| --------------- | ------ |
| Missing header  | 401    |
| Invalid token   | 401    |
| Expired token   | 401    |
| Invalid session | 401    |

---

## 🧠 Key Insight

Authentication is not:

```
"Do you have token?"
```

It is:

```
"Are you still valid in system state?"
```

That’s why session exists.

````

---
