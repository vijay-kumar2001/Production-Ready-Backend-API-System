> This flow is tested and validated using Postman (Production API) and MongoDB Atlas.

## Profile Flow

This flow retrieves the authenticated user's profile and session details.
It is a protected route and requires a valid access token.

---

### Request

* Method: GET
* Endpoint: /profile

Headers:
Authorization: Bearer {{ACCESS_TOKEN}}

---

### Response

* Status: 200 OK

{
"message": "Profile fetched",
"user": {
"_id": "69e6b734df866b32f55891a6",
"email": "[user1@test.com](mailto:user1@test.com)",
"role": "user",
"createdAt": "2026-04-20T23:31:00.997Z",
"updatedAt": "2026-04-20T23:31:00.997Z"
},
"session": {
"_id": "69e807465432b83a6423fab5",
"sessionId": "577a4bb3-78b9-4558-9ef3-d9131f5c0037",
"userId": "69e6b734df866b32f55891a6",
"ip": "127.0.0.1",
"userAgent": "PostmanRuntime/7.53.0",
"device": "Desktop",
"location": "unknown",
"expiresAt": 1778024685175,
"createdAt": "2026-04-21T23:24:54.394Z",
"updatedAt": "2026-04-21T23:44:45.175Z"
}
}

---

### Database Changes

Before:

* Session exists with expiry time

After:

* Session expiry updated (extended)

---

### Environment Variables

* ACCESS_TOKEN used for authentication
* USER_EMAIL used for validation

---

### Testing Validation

* Verified response using Postman test scripts
* Checked:

  * Status code (200)
  * User object returned
  * Session object returned
  * Email consistency

---

### Observations

* Profile route is protected using access token
* Session is extended on each request
* User data is sanitized before response

---

### Security Considerations

* Access token required for access
* Session validation ensures token legitimacy
* Prevents unauthorized access

---

### Negative Testing

* Missing token → 401 Unauthorized
* Invalid token → 401 Unauthorized

---

### Real-world Behavior

* Authenticated users can fetch their profile
* Session activity keeps user logged in
* Unauthorized users are blocked

---

## 🌍 Deployment Verification

This flow was re-tested on the deployed production server.

### Production Endpoint

```text id="z7k3pm"
GET https://production-ready-backend-api-system.onrender.com/profile
```

---

### Validation Results

* Request executed successfully with valid access token
* Status code: **200 OK**
* User and session data returned correctly
* Response structure consistent with local environment

---

### Database Verification (MongoDB Atlas)

* Session document retrieved successfully
* Session expiry timestamp updated (sliding session behavior)
* User data matches stored document in users collection

---

### Additional Observations (Production)

* User-Agent correctly captured and returned
* Device type identified successfully
* Geo-location resolved via MaxMind GeoDB (approximate accuracy expected)
* Session metadata (IP, device, location) consistently maintained

---

### System Behavior Insights

```text id="k3p9xz"
✔ Middleware-based authentication fully functional  
✔ JWT validation combined with session verification  
✔ Sliding session mechanism working correctly  
✔ Session enriched with device and location metadata  
```

---

### Deployment Confidence

```text id="m8t2vr"
✔ Protected route security verified in production  
✔ Session validation working reliably  
✔ User context correctly attached to requests  
✔ Suitable for real-world authenticated systems  
```
