> This flow is tested and validated using Postman and MongoDB Compass.

## Login Flow

This flow authenticates a registered user using email and password.
On success, an access token is returned, a refresh token is set as a cookie, and a session is created in the database.

---

### Request

- Method: POST  
- Endpoint: /auth/login  

Body:
{
  "email": "{{USER_EMAIL}}",
  "password": "123xyz"
}

---

### Response

- Status: 200 OK  

{
  "message": "Login successful",
  "accessToken": "...",
  "user": {
    "_id": "...",
    "email": "user1@test.com",
    "role": "user"
  }
}

- Cookie:
  - refreshToken (httpOnly)

---

### Database Changes

Before:
- No active session
- No refresh token stored

After:
- New session document created in `sessions` collection
- Refresh token stored in `refreshTokens` collection

---

### Environment Variables

- ACCESS_TOKEN is stored for authenticated requests  
- LOGGED_IN_USER_ID is stored for user-specific operations  

---

### Testing Validation

- Verified response using Postman test scripts  
- Checked:
  - Status code (200)
  - Access token presence
  - User object structure
  - Password not exposed  

---

### Observations

- Login creates a session for tracking user activity  
- Refresh token is stored securely in cookie (httpOnly)  
- Access token is returned in response  

---

### Security Considerations

- Access token is short-lived (JWT)  
- Refresh token is stored in DB (enables revocation)  
- Session validation adds extra security layer  
- Cookie is httpOnly (prevents XSS access)  