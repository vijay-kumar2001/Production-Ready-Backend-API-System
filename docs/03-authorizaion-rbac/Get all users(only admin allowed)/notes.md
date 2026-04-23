## Get All Users (Admin Only)

This flow demonstrates role-based access control where only admin users can access all users.

---

### Step 1: Admin Authentication

Admin logs in to obtain access token.

Request:
POST /auth/login

Body:
{
  "email": "admin@system.com",
  "password": "adminPassword123"
}

Response:
- Status: 200 OK  
- user.role = "admin"  
- accessToken returned  

---

### Step 2: Access Admin Route

Request:
GET /users

Headers:
Authorization: Bearer {{ACCESS_TOKEN_ADMIN}}

Response:
- Status: 200 OK  
- Returns list of all users  

---

### Step 3: Negative Testing

Using normal user token:

Authorization: Bearer {{ACCESS_TOKEN}}

Response:
- Status: 403 Forbidden  

---

### Observations

- Only admin can access this route  
- Normal users are restricted  

---

### Security Considerations

- Role-based middleware enforces access  
- Prevents unauthorized data access  

---

### Real-world Behavior

- Admin dashboards can fetch all users  
- Regular users are restricted from global data  