Understood. A robust backend is the backbone of PocketPilot, handling all the critical data processing, AI integrations, and security. Here's a comprehensive document detailing our backend building strategy and instructions.

This document outlines the backend strategy for PocketPilot, detailing the technical stack, architecture, core functionalities, API design, database management, and essential security considerations. The focus is on building a stable, scalable, and secure foundation for our AI-powered personal finance platform.

## **PocketPilot: Backend MVP Strategy & Instruction Document**

---

### **1. Introduction & Vision**

The backend of PocketPilot will be responsible for managing user data, orchestrating interactions with external services like Plaid, serving AI/ML models for financial analysis, and exposing a secure API for the frontend. Our primary goal for the MVP is to build a functional and secure core that reliably handles user authentication, data fetching and processing, and the initial AI-driven expense categorization.

### **2. Technology Stack**

*   **Runtime Environment:** **Node.js** – chosen for its event-driven, non-blocking I/O model, making it efficient for handling concurrent requests.
*   **Web Framework:** **Express.js** – a minimalist and flexible Node.js web application framework, providing a robust set of features for web and mobile applications.
*   **AI/ML Language:** **Python** – the standard for machine learning, used to host our Scikit-learn models. We will expose these models via a Python web framework (like Flask or FastAPI) as a separate service or integrate them directly into the Node.js backend if feasible and manageable for the MVP.
*   **Database:** **PostgreSQL** – a powerful, open-source relational database system. Its reliability, ACID compliance, and support for complex queries make it suitable for financial data.
    *   *Alternative (Considered):* MongoDB for its flexibility, but PostgreSQL's structure is often preferred for financial data to ensure consistency. For MVP, let's stick with PostgreSQL.
*   **API Communication:** **RESTful API** design principles will be followed.
*   **Data Fetching/Integration:** **Plaid API**.

### **3. Architecture Strategy**

*   **Monolithic Architecture (MVP):** For the MVP, we will adopt a monolithic architecture. This simplifies initial development, deployment, and debugging. All core backend services (authentication, data processing, Plaid integration, serving ML predictions) will reside within a single Node.js/Express application.
*   **Microservices (Future Consideration):** As the project scales, we may refactor into microservices, particularly for isolating the AI/ML model serving or handling real-time data streams. For now, we focus on a well-structured monolith.
*   **Layered Structure:** The backend will be structured into distinct layers to promote maintainability and separation of concerns:
    *   **Routes:** Define API endpoints.
    *   **Controllers:** Handle request/response logic, delegating business logic to services.
    *   **Services:** Contain core business logic, interact with the database and external APIs.
    *   **Data Access Layer (DAL) / Models:** Interact directly with the database (e.g., using an ORM like Sequelize for PostgreSQL).
    *   **Utilities/Helpers:** Common utility functions.

### **4. Database Design (PostgreSQL Schema)**

We will design tables to store core entities:

*   **`users` table:**
    *   `user_id` (Primary Key, UUID/SERIAL)
    *   `email` (Unique, VARCHAR)
    *   `password_hash` (VARCHAR)
    *   `created_at`, `updated_at` (TIMESTAMP)
    *   `first_name`, `last_name` (VARCHAR, Optional)

*   **`plaid_items` table:**
    *   `item_id` (Primary Key, VARCHAR) – The `item_id` from Plaid.
    *   `user_id` (Foreign Key to `users.user_id`)
    *   `access_token` (VARCHAR, securely encrypted)
    *   `institution_id` (VARCHAR, Optional)
    *   `institution_name` (VARCHAR, Optional)
    *   `created_at`, `updated_at` (TIMESTAMP)

*   **`accounts` table:**
    *   `account_id` (Primary Key, VARCHAR) – Plaid's `account_id`.
    *   `item_id` (Foreign Key to `plaid_items.item_id`)
    *   `user_id` (Foreign Key to `users.user_id`)
    *   `name` (VARCHAR)
    *   `official_name` (VARCHAR, Optional)
    *   `mask` (VARCHAR, last 4 digits of account number)
    *   `type` (VARCHAR: `depository`, `credit`, etc.)
    *   `subtype` (VARCHAR: `checking`, `savings`, `credit card`, etc.)
    *   `available_balance` (DECIMAL)
    *   `current_balance` (DECIMAL)
    *   `currency` (VARCHAR)
    *   `created_at`, `updated_at` (TIMESTAMP)

*   **`transactions` table:**
    *   `transaction_id` (Primary Key, VARCHAR) – Plaid's `transaction_id`.
    *   `account_id` (Foreign Key to `accounts.account_id`)
    *   `user_id` (Foreign Key to `users.user_id`)
    *   `category_id` (Foreign Key to `categories.category_id`, Optional, NULLable)
    *   `merchant` (VARCHAR)
    *   `description` (VARCHAR)
    *   `amount` (DECIMAL – positive for income, negative for expenses)
    *   `date` (DATE)
    *   `pending` (BOOLEAN)
    *   `created_at`, `updated_at` (TIMESTAMP)

*   **`categories` table:**
    *   `category_id` (Primary Key, SERIAL)
    *   `name` (VARCHAR, Unique) – e.g., "Groceries", "Utilities", "Salary"
    *   `type` (VARCHAR: `expense`, `income`)

*   **`budgets` table:**
    *   `budget_id` (Primary Key, SERIAL)
    *   `user_id` (Foreign Key to `users.user_id`)
    *   `category_id` (Foreign Key to `categories.category_id`)
    *   `amount` (DECIMAL)
    *   `month` (INTEGER) – e.g., 1 for January, 12 for December
    *   `year` (INTEGER)
    *   `created_at`, `updated_at` (TIMESTAMP)

*   **`goals` table:**
    *   `goal_id` (Primary Key, SERIAL)
    *   `user_id` (Foreign Key to `users.user_id`)
    *   `name` (VARCHAR)
    *   `target_amount` (DECIMAL)
    *   `current_amount` (DECIMAL, default 0)
    *   `due_date` (DATE)
    *   `created_at`, `updated_at` (TIMESTAMP)

### **5. Core Backend Functionalities & Implementation Plan**

**Task 1: Project Setup & Dependencies**
*   Initialize a new Node.js project: `npm init -y`
*   Install Express: `npm install express`
*   Install ORM for PostgreSQL: `npm install sequelize pg pg-monitor` (or Knex.js)
*   Install authentication middleware: `npm install bcrypt jsonwebtoken passport passport-jwt`
*   Install Plaid Node.js SDK: `npm install plaid`
*   Install Python SDK (if running Python ML as a separate process, otherwise handled during Python setup): `pip install Flask scikit-learn pandas`

**Task 2: User Authentication & Authorization**
*   Implement password hashing using `bcrypt`.
*   Implement JWT (JSON Web Tokens) for session management. Upon successful login, issue a token, which the frontend will send with subsequent requests.
*   Create middleware to protect routes, verifying the JWT on incoming requests.
*   Implement signup, login, and logout endpoints.

**Task 3: Plaid Integration**
*   **Public Token Exchange:**
    *   Create a route (`/api/create_link_token`) to generate a `link_token` from Plaid. This token is used by the frontend Plaid Link.
    *   Create a route (`/api/exchange_public_token`) that accepts the `public_token` from the frontend.
    *   Use the `plaid.exchangePublicToken` method to exchange the `public_token` for an `access_token` and `item_id`.
    *   Store the `access_token` and `item_id` securely (encrypted) in the `plaid_items` table, linked to the authenticated user.
*   **Fetching Data:**
    *   Implement services to fetch accounts (`plaid.accounts.balance.get`) and transactions (`plaid.transactions.sync` or `plaid.transactions.get`) using the stored `access_token`.
    *   Process fetched data:
        *   Store new accounts in the `accounts` table.
        *   Store new transactions in the `transactions` table.
        *   Handle `PENDING` transactions.
        *   Store data with correct foreign keys (`user_id`, `item_id`, `account_id`).

**Task 4: AI/ML Model Integration (Expense Categorization)**
*   **Model Serving:**
    *   Develop a Python script (e.g., using Flask or FastAPI) that loads the trained Scikit-learn model.
    *   Expose an endpoint (e.g., `/predict/category`) that accepts transaction details (merchant, description) and returns a predicted category ID.
*   **Integration:**
    *   The Node.js backend will call this Python API endpoint for each new transaction fetched from Plaid.
    *   Store the returned `category_id` in the `transactions` table.
    *   Implement a fallback if the ML service is unavailable or returns an error (e.g., assign a default "Uncategorized" category or prompt user).

**Task 5: Transaction Processing & Categorization Logic**
*   Upon receiving new transactions via Plaid:
    *   Clean transaction data (merchant, description).
    *   Call the ML model for categorization.
    *   Save categorized transactions.
    *   Update account balances.

**Task 6: Budget & Goal Management**
*   Implement CRUD endpoints for `/api/budgets` and `/api/goals`.
*   **Budgets:**
    *   Allow users to set a budget amount for a specific `category_id` for a given month/year.
    *   Calculate current spending for a category within a budget period by querying the `transactions` table.
    *   Provide an endpoint to fetch budget status (budgeted amount vs. actual spending).
*   **Goals:**
    *   Allow users to create, update, and delete financial goals.
    *   Implement logic to update `current_amount` if manual contributions are logged or by tracking linked savings accounts (future enhancement).

**Task 7: Security & Compliance**
*   **End-to-End Encryption:** Ensure sensitive data in transit (HTTPS) and at rest (encrypted `access_token` and potentially other fields in the database) is handled. We will use AES-256 for encrypting `access_token` before storing it.
*   **OAuth 2.0:** While Plaid handles token exchange, our own API authentication is JWT-based, which is a standard for stateless API authentication.
*   **PCI DSS Compliance:** Since we are not handling credit card numbers directly but using Plaid for sensitive financial integrations, direct PCI DSS compliance is not our primary concern. However, we must follow general best practices for handling financial data securely (minimal data exposure, secure storage, access control).
*   **Input Validation:** Rigorous validation of all incoming API request data.
*   **Rate Limiting:** Implement rate limiting on API endpoints to prevent abuse.
*   **Environment Variables:** Use `.env` files for sensitive configurations like API keys, database credentials, and JWT secrets.

**Task 8: Error Handling & Logging**
*   Implement consistent error handling across all API endpoints.
*   Use a robust logging mechanism (e.g., Winston or Bunyan) to log errors, warnings, and key events for debugging and auditing.

### **6. API Design (Example Endpoints)**

*   **Authentication:**
    *   `POST /api/auth/signup`: Register a new user.
    *   `POST /api/auth/login`: Log in a user, return JWT.
    *   `POST /api/auth/logout`: Invalidate token (requires server-side token blacklist).
*   **Plaid:**
    *   `POST /api/plaid/create_link_token`: Generate Plaid Link token.
    *   `POST /api/plaid/exchange_public_token`: Exchange public token for access token.
    *   `GET /api/plaid/accounts`: Get user's linked accounts and their balances.
    *   `GET /api/transactions`: Get categorized transactions, with filters for date range, category, etc.
    *   `POST /api/webhook/plaid`: Endpoint to receive webhooks from Plaid for transaction updates.
*   **Budgets:**
    *   `POST /api/budgets`: Create or update a budget.
    *   `GET /api/budgets`: Get all budgets for the current user.
    *   `GET /api/budgets/summary`: Get budget summaries (budgeted vs. actual).
*   **Goals:**
    *   `POST /api/goals`: Create or update a financial goal.
    *   `GET /api/goals`: Get all goals for the user.
    *   `GET /api/goals/:id`: Get a specific goal.

### **7. Documentation & Code Quality**

*   **Backend Code:** Ensure all functions, classes, and modules have comprehensive **JSDoc** comments detailing purpose, parameters, return values, and any exceptions.
*   **API Documentation:** Generate OpenAPI (Swagger) specification. Libraries like `swagger-jsdoc` and `swagger-ui-express` can help generate this automatically from our JSDoc comments or manually.
*   **Code Style:** Adhere to Airbnb JavaScript style guide or similar, enforced via ESLint and Prettier.

---
