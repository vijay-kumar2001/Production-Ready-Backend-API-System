> This flow is tested and validated using Postman (Production API) and MongoDB Atlas.

## Get All Users (Admin Only)

This flow demonstrates role-based access control where only admin users can access all users.

---

### Step 1: Admin Authentication

Admin logs in to obtain access token.

Request:
POST /auth/login

Body:
{
"email": "[admin@system.com](mailto:admin@system.com)",
"password": "adminPassword123"
}

Response:

* Status: 200 OK
* user.role = "admin"
* accessToken returned

---

### Step 2: Access Admin Route

Request:
GET /users

Headers:
Authorization: Bearer {{ACCESS_TOKEN_ADMIN}}

Response:

* Status: 200 OK
* Returns list of all users

---

### Step 3: Negative Testing

Using normal user token:

Authorization: Bearer {{ACCESS_TOKEN}}

Response:

* Status: 403 Forbidden

---

### Observations

* Only admin can access this route
* Normal users are restricted
* Response returns sanitized user data (no sensitive fields)

---

### Security Considerations

* Role-based middleware enforces access
* Prevents unauthorized data access
* Ensures least-privilege principle

---

### Real-world Behavior

* Admin dashboards can fetch all users
* Regular users are restricted from global data

---

## 🌍 Deployment Verification

This flow was re-tested on the deployed production server.

### Production Endpoint

```text id="k9d3zp"
GET https://production-ready-backend-api-system.onrender.com/users
```

---

### Validation Results

* Request executed successfully using admin credentials
* Status code: **200 OK**
* Users list returned correctly
* Response consistent with local environment

---

### Database Verification (MongoDB Atlas)

* Users retrieved match documents in `users` collection
* Multiple users visible including admin and normal users
* No sensitive fields (e.g., password) exposed in response

---

### Negative Case Validation (Production)

* Access attempt using normal user token
* Status code: **403 Forbidden**
* Access correctly denied

---

### Additional Observations (Production)

* Role-based middleware correctly identifies admin users
* Authorization logic consistently enforced across requests
* No privilege escalation observed

---

### System Behavior Insights

```text id="p4m8xt"
✔ Role-based access control (RBAC) fully functional  
✔ Authorization layer enforced after authentication  
✔ Admin privileges correctly scoped to protected routes  
✔ System prevents unauthorized access to sensitive data  
```

---

### Deployment Confidence

```text id="x7t2mn"
✔ Admin route is production-ready  
✔ RBAC enforcement verified  
✔ Secure data access ensured  
✔ Suitable for real-world admin operations  
```
