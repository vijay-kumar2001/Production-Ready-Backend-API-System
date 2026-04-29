> This flow is tested and validated using Postman (Production API) and MongoDB Atlas.

## Delete User (Owner or Admin)

This flow demonstrates role-based and ownership-based deletion control.

A user can:

* Delete their own account (owner)
* Admin can delete any user
* Other users are restricted

This flow also validates complete authentication cleanup by removing:

* User document
* Sessions
* Refresh tokens

This ensures no orphaned authentication state remains after deletion.

---

### Step 1: Authentication Setup

Three actors are involved:

* USER 1 (owner)
* ADMIN
* USER 2 (unauthorized user)

Each logs in and receives an access token.

Additional validation:

* USER 1 has active session(s)
* Corresponding refresh tokens exist in database

This is important because delete flow must remove both.

---

### Step 2: Owner Self Delete

Request:
DELETE /users/{{USER_ID}}

Headers:
Authorization: Bearer {{USER_ACCESS_TOKEN}}

Response:

* Status: 200 OK
* Message: "Your account deleted"

Example:

```json
{
  "message": "Your account deleted",
  "user": {
    "_id": "...",
    "email": "user1@test.com",
    "role": "user"
  }
}
```

---

### Step 3: Admin Deletes Another User

Request:
DELETE /users/{{TARGET_USER_ID}}

Headers:
Authorization: Bearer {{ADMIN_ACCESS_TOKEN}}

Response:

* Status: 200 OK
* Message: "User deleted"

Admin can delete any user regardless of ownership.

---

### Step 4: Unauthorized Delete Attempt

Request:
DELETE /users/{{OTHER_USER_ID}}

Headers:
Authorization: Bearer {{USER2_ACCESS_TOKEN}}

Response:

* Status: 403 Forbidden

This confirms normal users cannot delete other users.

---

### Step 5: Invalid / Already Deleted User

Request:
DELETE /users/{{INVALID_OR_DELETED_ID}}

Headers:
Authorization: Bearer {{ADMIN_ACCESS_TOKEN}}

Response:

* Status: 404 Not Found

This confirms proper handling of invalid or missing resources.

---

### Step 6: Post-Delete Access Verification

After successful deletion:

Request:
GET /profile

using old access token

Response:

* Status: 401 Unauthorized

This confirms:

* Session invalidation worked
* Deleted user cannot continue using old authentication state

---

### Database Verification (MongoDB Atlas)

Before:

* User exists in `users`
* Active sessions exist in `sessions`
* Refresh tokens exist in `refreshTokens`

After:

* User removed from `users`
* All sessions removed from `sessions`
* All refresh tokens removed from `refreshTokens`

This confirms complete cleanup.

---

### Testing Validation

* Verified using Postman test scripts
* Checked:

  * Status codes (200 / 403 / 404 / 401)
  * Ownership validation
  * Admin override
  * Session cleanup
  * Refresh token cleanup
  * Authentication invalidation after delete

---

### Observations

* Delete route is not just database deletion
* Ownership validation is enforced strictly
* Admin override works correctly
* Authentication state is fully removed
* No orphan sessions or tokens remain

---

### Security Considerations

* Prevents unauthorized account deletion
* Prevents horizontal privilege escalation
* Prevents stale refresh token reuse
* Ensures complete authentication invalidation
* Maintains database consistency

---

### Real-world Behavior

* Users can securely delete their own accounts
* Admins can remove users when required
* Unauthorized users cannot delete others
* Deleted users lose all future access immediately

---

## 🌍 Deployment Verification

This flow was re-tested on the deployed production server.

### Production Endpoint

```text
DELETE https://production-ready-backend-api-system.onrender.com/users/:id
```

---

### Validation Results

* Owner self-delete: **200 OK**
* Admin delete: **200 OK**
* Unauthorized delete attempt: **403 Forbidden**
* Invalid/deleted user: **404 Not Found**
* Old token after deletion: **401 Unauthorized**

Behavior consistent with local environment.

---

### Additional Observations (Production)

* Ownership validation correctly compares token user with target user
* Admin role bypass works reliably
* Session cleanup reflects immediately in MongoDB Atlas
* Refresh token cleanup prevents future token refresh attempts

---

### System Behavior Insights

```text
✔ Delete flow enforces both RBAC and ownership validation  
✔ User deletion includes full authentication cleanup  
✔ Sessions and refresh tokens are treated as dependent resources  
✔ Prevents orphaned auth state and stale access reuse  
✔ Resource deletion is production-safe and security-aware  
```

---

### Deployment Confidence

```text
✔ Secure delete flow verified in production  
✔ Ownership + admin deletion logic working correctly  
✔ Full auth cleanup confirmed  
✔ Suitable for real-world user lifecycle management  
```
