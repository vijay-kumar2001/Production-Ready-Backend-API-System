> This flow is tested and validated using Postman and MongoDB Compass.

## Register User Flow

This flow allows a new user to register using email and password.
On success, the user is stored in the database with a hashed password.

---

### Request

- Method: POST  
- Endpoint: /auth/register  

Body:
{
  "email": "user1@test.com",
  "password": "123xyz"
}

---

### Response

- Status: 201 Created  

{
  "message": "User registered successfully",
  "user": {
    "email": "user1@test.com",
    "role": "user",
    "_id": "69e6b734df866b32f55891a6",
    "createdAt": "2026-04-20T23:31:00.997Z",
    "updatedAt": "2026-04-20T23:31:00.997Z"
  }
}

---

### Database Changes

Before:
- User did not exist  

After:
- New user document created in users collection  
- Password stored as hashed value  

Note: MongoDB Compass requires manual refresh to reflect latest changes.

---

### Environment Variables

- USER_EMAIL and USER_ID are stored after successful registration  
- These variables are reused in subsequent requests (e.g., login, user retrieval)

---

### Testing Validation

- Verified response using Postman test scripts  
- Checked:
  - Status code (201)
  - Response structure
  - Email consistency with request
  - Password not exposed

---

### Observations

- Password is hashed (security)  
- User is assigned default role "user"  
- Response does not expose password  

---

### Security Considerations

- Password is hashed using bcrypt (one-way hashing, not reversible encryption)  
- Sensitive fields are removed before sending response  
- Prevents storing plain-text passwords  