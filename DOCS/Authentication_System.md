
---

## **PocketPilot: Authentication System Documentation**

This document details the architecture, flow, and security considerations for the PocketPilot user authentication system, built on Node.js, Express.js, bcrypt, JWT, and Passport.js. The system is designed to securely manage user accounts, protect sensitive data, and enable authenticated access to the platform's features.

---

### **1. Introduction & Purpose**

The authentication system is the gateway to PocketPilot. It ensures that only legitimate users can access their financial data and use the platform's features. The system comprises user registration, secure login, and robust session management via JSON Web Tokens (JWT).

### **2. Core Components & Technologies**

*   **Node.js & Express.js:** Provide the server-side environment and web framework for handling API requests.
*   **bcrypt:** A strong password hashing function that securely hashes user passwords. It's designed to be computationally intensive, making brute-force attacks difficult.
*   **JSON Web Tokens (JWT):** A standard for securely transmitting information between parties as a JSON object. It is used here to transmit user identity and authorization information from the server to the client after successful login. JWTs are signed to prevent tampering.
*   **Passport.js:** An authentication middleware for Node.js. We will use specific "strategies" for handling local username/password authentication and JWT verification.
*   **PostgreSQL Database:** Stores user credentials (hashed passwords), emails, and other necessary user information.

### **3. User Registration Flow**

**Endpoint:** `POST /api/auth/signup`

**Process:**

1.  **Receive Request:** The frontend sends a request to `/api/auth/signup` with user details (email, password, optional name).
2.  **Input Validation:** The backend validates the incoming data:
    *   Ensures email is in a valid format.
    *   Ensures password meets minimum complexity requirements (if any).
    *   Checks if required fields are present.
3.  **Check for Existing User:** Query the `users` table to see if a user with the provided email already exists. If so, return an error indicating the email is already taken.
4.  **Password Hashing:** Hash the provided password using `bcrypt.hash()`. This involves adding a salt (random data) to the password and then hashing the combination.
5.  **Store User:** Create a new record in the `users` table with the user's email, the hashed password, and any other provided details.
6.  **Response:** Return a success message upon successful registration, or an error message if any step fails.

**Database Schema (Relevant fields from `users` table):**

*   `user_id` (Primary Key)
*   `email` (Unique VARCHAR)
*   `password_hash` (VARCHAR)
*   `created_at` (TIMESTAMP)

### **4. User Login Flow**

**Endpoint:** `POST /api/auth/login`

**Process:**

1.  **Receive Request:** The frontend sends a request to `/api/auth/login` with the user's email and password.
2.  **Input Validation:** Basic validation on email and password presence.
3.  **Find User:** Query the `users` table to find a user by their email address. If no user is found, return an "invalid credentials" error.
4.  **Password Verification:** If a user is found, use `bcrypt.compare()` to compare the provided password with the `password_hash` stored in the database. This function handles the salt embedded in the hash and performs the comparison securely.
5.  **Generate JWT:** If the password matches:
    *   Create a JWT payload containing essential, non-sensitive user information like `user_id` and potentially a `role` (e.g., `user`).
    *   Sign the JWT using a **strong, secret key** stored securely in environment variables (e.g., `process.env.JWT_SECRET`). The JWT will also include an expiration time (`exp`).
6.  **Respond:** Return the generated JWT and basic user information (like email) to the frontend. The frontend will store this JWT securely (e.g., in HTTP-only cookies or local storage) for subsequent API requests.

### **5. API Authentication & Route Protection**

To ensure that only authenticated users can access protected resources, we implement JWT-based authentication on our API endpoints.

**Process:**

1.  **Frontend Request:** When the frontend needs to access a protected API endpoint (e.g., fetching transactions), it includes the JWT in the `Authorization` header, typically in the format: `Authorization: Bearer <your_jwt_token>`.
2.  **Passport.js JWT Strategy:**
    *   We configure Passport.js with a JWT strategy. This strategy is responsible for:
        *   Extracting the JWT from the `Authorization` header.
        *   Verifying the JWT's signature using the same secret key used during login.
        *   Validating the JWT's expiration (`exp`).
        *   (Optionally) Verifying the issuer (`iss`) and audience (`aud`).
        *   If the token is valid, Passport.js will query the database using the `user_id` from the JWT payload to find the user.
        *   The authenticated user object is then attached to the `request` object (e.g., `req.user`).
3.  **Protecting Routes:** Routes that require authentication are protected by Passport.js middleware.
    *   **Example:**
        ```javascript
        const jwtAuthMiddleware = passport.authenticate('jwt', { session: false });

        router.get('/transactions', jwtAuthMiddleware, async (req, res) => {
            // req.user is available here, containing the authenticated user's data
            const userId = req.user.user_id;
            // ... fetch transactions for userId ...
        });
        ```
4.  **Unauthenticated Access:** If a request arrives without a valid JWT, or if the JWT is invalid/expired, Passport.js will typically return a `401 Unauthorized` response.

### **6. Logout Flow**

JWTs are stateless, meaning the server doesn't inherently "know" when a user logs out if the token hasn't expired.

*   **Client-Side Token Handling:** The most common and simplest approach for MVP is to remove the JWT from client-side storage (e.g., localStorage, cookies) when the user clicks "Logout." This prevents the client from sending the token in future requests.
*   **Server-Side Blacklisting (Advanced):** For more immediate logout, a token blacklist (e.g., using Redis or a database table to store invalidated `jti` claims) can be implemented. When a user logs out, their JWT's unique ID (`jti`) is added to the blacklist. The JWT verification strategy then checks this blacklist before accepting the token. For MVP, client-side deletion is sufficient.

### **7. Security Considerations & Best Practices**

*   **Password Hashing:** Always use `bcrypt` (or a similar strong, modern hashing algorithm like Argon2). Never store passwords in plain text.
*   **JWT Secret Key:**
    *   Keep the JWT secret key highly confidential.
    *   Store it securely in environment variables (`.env` file) and **never** commit it to the code repository.
    *   Use a long, random, and complex string as the secret.
*   **Token Expiration:** Set a reasonable expiration time for JWTs (e.g., 1 hour to 24 hours) to limit the window of opportunity if a token is compromised. Consider implementing refresh tokens for longer-lived sessions.
*   **HTTPS:** Ensure all communication between the client and server occurs over HTTPS to encrypt data in transit.
*   **Input Sanitization:** Sanitize all user inputs on both the client and server sides to prevent XSS (Cross-Site Scripting) and SQL injection attacks.
*   **Rate Limiting:** Implement rate limiting on login and signup endpoints to protect against brute-force attacks.
*   **Avoid Storing Sensitive Data in JWT Payload:** The JWT payload should only contain essential identity information (like `user_id`), not sensitive credentials or PII that doesn't need to be constantly transmitted.
*   **Store `access_token` Securely:** On the frontend, consider using HTTP-only cookies for storing JWTs, as they are not accessible via JavaScript, mitigating XSS risks. If using localStorage, ensure proper security measures.

---
