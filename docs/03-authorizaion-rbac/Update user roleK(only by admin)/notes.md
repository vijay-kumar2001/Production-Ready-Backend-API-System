> This flow is tested and validated using Postman and MongoDB Compass.

## Update User Role (Admin Only)

This flow demonstrates privilege control where only admin users can modify roles.

---

### Step 1: Admin Authentication

Admin logs in to obtain access token.

Request:
POST /auth/login

Response:
- Status: 200 OK  
- user.role = "admin"  
- accessToken returned  

---

### Step 2: Role Update

Request:
PUT /users/{{USER_ID}}/admin

Headers:
Authorization: Bearer {{ADMIN_ACCESS_TOKEN}}

Response:
- Status: 200 OK  
- User role updated successfully  

---

### Step 3: Database Verification

Before:
- role = "user"

After:
- role = "admin"

---

### Step 4: Unauthorized Attempt

Request:
PUT /users/{{USER_ID}}/:role

Headers:
Authorization: Bearer {{USER_ACCESS_TOKEN}}

Response:
- Status: 403 Forbidden  

---

### Step 5: Edge Cases

- Invalid role → 400 Bad Request  
- Invalid user ID → 404 Not Found  

---

### Testing Validation

- Verified using Postman test scripts  
- Checked:
  - Role update success  
  - DB consistency  
  - Access restrictions  

---

### Observations

- Only admin can update roles  
- Role changes reflect immediately in DB  

---

### Security Considerations

- Prevents privilege escalation  
- Restricts sensitive operations to admin  
- Validates input role strictly  

---

### Real-world Behavior

- Admins manage user permissions  
- Unauthorized users cannot escalate privileges  