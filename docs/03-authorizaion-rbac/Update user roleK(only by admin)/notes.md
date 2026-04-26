> This flow is tested and validated using Postman (Production API) and MongoDB Atlas.

## Update User Role (Admin Only)

This flow demonstrates privilege control where only admin users can modify roles.

---

### Step 1: Admin Authentication

Admin logs in to obtain access token.

Request:
POST /auth/login

Response:

* Status: 200 OK
* user.role = "admin"
* accessToken returned

---

### Step 2: Role Update

Request:
PUT /users/{{USER_ID}}/role

Headers:
Authorization: Bearer {{ADMIN_ACCESS_TOKEN}}
Content-Type: application/json

Body:
{
"role": "admin"
}

Response:

* Status: 200 OK
* User role updated successfully

---

### Step 3: Database Verification

Before:

* role = "user"

After:

* role = "admin"

---

### Step 4: Unauthorized Attempt

Request:
PUT /users/{{USER_ID}}/role

Headers:
Authorization: Bearer {{USER_ACCESS_TOKEN}}

Response:

* Status: 403 Forbidden

---

### Step 5: Edge Cases

* Invalid role → 400 Bad Request
* Invalid user ID → 404 Not Found

---

### Testing Validation

* Verified using Postman test scripts
* Checked:

  * Role update success
  * DB consistency
  * Access restrictions

---

### Observations

* Only admin can update roles
* Role changes reflect immediately in DB
* Response contains updated and sanitized user object

---

### Security Considerations

* Prevents privilege escalation
* Restricts sensitive operations to admin
* Validates input role strictly

---

### Real-world Behavior

* Admins manage user permissions
* Unauthorized users cannot escalate privileges

---

## 🌍 Deployment Verification

This flow was re-tested on the deployed production server.

### Production Endpoint

```text id="q4z8kp"
PUT https://production-ready-backend-api-system.onrender.com/users/:id/role
```

---

### Validation Results

* Request executed successfully using admin credentials
* Status code: **200 OK**
* Role updated correctly in response
* Behavior consistent with local environment

---

### Database Verification (MongoDB Atlas)

* User role updated successfully in `users` collection
* Changes persisted immediately
* No data inconsistency observed

---

### Negative Case Validation (Production)

* Normal user attempt → **403 Forbidden**
* Invalid role → **400 Bad Request**
* Invalid user ID → **404 Not Found**

---

### Additional Observations (Production)

* Role updates take effect instantly for subsequent requests
* Authorization layer consistently blocks unauthorized attempts
* Input validation prevents invalid role assignment

---

### System Behavior Insights

```text id="k2v9xm"
✔ Privilege control (RBAC enforcement) fully functional  
✔ System-level operations restricted to admin users  
✔ Secure role management implemented  
✔ Prevents vertical privilege escalation  
```

---

### Deployment Confidence

```text id="m7t3qp"
✔ Role update flow is production-ready  
✔ Admin privilege enforcement verified  
✔ Secure system control ensured  
✔ Suitable for real-world permission management  
```
