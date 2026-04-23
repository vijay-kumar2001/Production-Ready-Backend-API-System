> This flow is tested and validated using Postman and MongoDB Compass.

## Get User By ID (Owner or Admin)

This flow demonstrates role-based and ownership-based access control.

A user can:
- Access their own data (owner)
- Admin can access any user's data
- Other users are restricted

---

### Step 1: Authentication Setup

Three actors are involved:

- USER 1 (owner)
- ADMIN
- USER 2 (unauthorized user)

Each logs in and receives an access token.

---

### Step 2: Owner Access

Request:
GET /users/{{USER_ID}}

Headers:
Authorization: Bearer {{USER_ACCESS_TOKEN}}

Response:
- Status: 200 OK
- Returns own user data

---

### Step 3: Admin Access

Request:
GET /users/{{USER_ID}}

Headers:
Authorization: Bearer {{ADMIN_ACCESS_TOKEN}}

Response:
- Status: 200 OK
- Admin can access any user

---

### Step 4: Unauthorized Access

Request:
GET /users/{{USER_ID}}

Headers:
Authorization: Bearer {{USER2_ACCESS_TOKEN}}

Response:
- Status: 403 Forbidden

---

### Testing Validation

- Verified using Postman test scripts
- Checked:
  - Status codes (200 / 403)
  - Ownership validation
  - Role-based access
  - Sensitive data not exposed

---

### Observations

- Ownership is enforced strictly
- Admin override works correctly
- Unauthorized users are blocked

---

### Security Considerations

- Prevents horizontal privilege escalation
- Ensures user data isolation
- Protects sensitive user information

---

### Real-world Behavior

- Users can view their own data
- Admins can access all users
- Unauthorized access attempts are denied