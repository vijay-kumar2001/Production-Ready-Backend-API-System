> This flow is tested and validated using Postman and MongoDB Compass.

## Logout Flow

This flow logs out the user by invalidating the session and removing associated refresh tokens.

---

### Request

- Method: POST  
- Endpoint: /auth/logout  

- No request body  
- Refresh token is sent via httpOnly cookie  

---

### Response

- Status: 200 OK  

{
  "message": "user logged out."
}

- Cookie:
  - refreshToken cleared

---

### Database Changes

Before:
- Active session exists  
- Refresh token stored  

After:
- Session deleted from `sessions` collection  
- Refresh tokens deleted from `refreshTokens` collection  

---

### Testing Validation

- Verified response using Postman test scripts  
- Checked:
  - Status code (200)
  - Logout message returned  

---

### Observations

- Logout removes session completely  
- Refresh token is invalidated  
- User cannot refresh or access protected routes  

---

### Security Considerations

- Prevents reuse of stolen refresh tokens  
- Ensures complete session invalidation  
- Forces re-authentication after logout  

---

### Real-world Behavior

- After logout, refresh token cannot be used  
- User must login again to access protected routes  

---

### Post-Logout Access Verification

- Attempted to access protected route `/profile` after logout  
- Result: **401 Unauthorized**

This confirms:
- Access token is no longer valid (session removed)  
- Protected routes are properly secured  
- Logout fully invalidates user authentication state  