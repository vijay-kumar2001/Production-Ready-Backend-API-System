> This flow is tested and validated using Postman and MongoDB Compass.

## Refresh Token Flow

This flow generates a new access token using a valid refresh token.
It also rotates the refresh token and extends the session.

---

### Request

- Method: POST  
- Endpoint: /auth/refresh  

- No request body  
- Refresh token is sent via httpOnly cookie  

---

### Response

- Status: 200 OK  

{
  "message": "Token refreshed",
  "accessToken": "..."
}

- Cookie:
  - New refreshToken (httpOnly)

---

### Database Changes

Before:
- Existing refresh token stored
- Active session exists

After:
- Old refresh token deleted
- New refresh token inserted (same sessionId)
- Session expiry extended

---

### Environment Variables

- ACCESS_TOKEN is updated after refresh  
- Used for subsequent authenticated requests  

---

### Testing Validation

- Verified response using Postman test scripts  
- Checked:
  - Status code (200)
  - Access token returned
  - Token rotation (new ≠ old)

---

### Observations

- Refresh token is rotated on every request  
- Session remains same but extended  
- No user credentials required  

---
### Real-world Behavior

- Access token expired after inactivity
- Refresh token was used to generate a new access token
- User remained logged in without re-entering credentials

### Security Considerations

- Prevents replay attacks via token rotation  
- Refresh token stored in DB enables revocation  
- Session validation adds additional security layer  
- Cookie is httpOnly (not accessible via JS)  