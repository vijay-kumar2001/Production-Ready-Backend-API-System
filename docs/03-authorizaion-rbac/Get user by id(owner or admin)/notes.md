> This flow is tested and validated using Postman (Production API) and MongoDB Atlas.

## Get User By ID (Owner or Admin)

This flow demonstrates role-based and ownership-based access control.

A user can:

* Access their own data (owner)
* Admin can access any user's data
* Other users are restricted

---

### Step 1: Authentication Setup

Three actors are involved:

* USER 1 (owner)
* ADMIN
* USER 2 (unauthorized user)

Each logs in and receives an access token.

---

### Step 2: Owner Access

Request:
GET /users/{{USER_ID}}

Headers:
Authorization: Bearer {{USER_ACCESS_TOKEN}}

Response:

* Status: 200 OK
* Returns own user data

---

### Step 3: Admin Access

Request:
GET /users/{{USER_ID}}

Headers:
Authorization: Bearer {{ADMIN_ACCESS_TOKEN}}

Response:

* Status: 200 OK
* Admin can access any user

---

### Step 4: Unauthorized Access

Request:
GET /users/{{USER_ID}}

Headers:
Authorization: Bearer {{USER2_ACCESS_TOKEN}}

Response:

* Status: 403 Forbidden

---

### Testing Validation

* Verified using Postman test scripts
* Checked:

  * Status codes (200 / 403)
  * Ownership validation
  * Role-based access
  * Sensitive data not exposed

---

### Observations

* Ownership is enforced strictly
* Admin override works correctly
* Unauthorized users are blocked
* Response contains only sanitized user data

---

### Security Considerations

* Prevents horizontal privilege escalation
* Ensures user data isolation
* Protects sensitive user information

---

### Real-world Behavior

* Users can view their own data
* Admins can access all users
* Unauthorized access attempts are denied

---

## 🌍 Deployment Verification

This flow was re-tested on the deployed production server.

### Production Endpoint

```text id="z3k8pm"
GET https://production-ready-backend-api-system.onrender.com/users/:id
```

---

### Validation Results

* Owner access: **200 OK**
* Admin access: **200 OK**
* Unauthorized user access: **403 Forbidden**
* Behavior consistent with local environment

---

### Database Verification (MongoDB Atlas)

* Retrieved user data matches document in `users` collection
* No unauthorized data exposure observed
* Data consistency maintained across multiple requests

---

### Additional Observations (Production)

* Ownership validation correctly compares request userId with token userId
* Admin role bypass works reliably across all users
* Unauthorized access attempts consistently blocked

---

### System Behavior Insights

```text id="k5t2mz"
✔ Fine-grained authorization (RBAC + ownership) fully functional  
✔ Authorization layer enforces both identity and role checks  
✔ Prevents horizontal privilege escalation attacks  
✔ Secure resource-level access control implemented  
```

---

### Deployment Confidence

```text id="p8x4rt"
✔ Ownership-based access control verified in production  
✔ RBAC working in combination with resource-level checks  
✔ Secure user data isolation ensured  
✔ Suitable for real-world multi-user systems  
```
