## **PocketPilot: Bank Account Connectivity Strategy Document**

This document outlines the strategy and technical implementation for integrating bank accounts into PocketPilot using the Plaid API. The goal is to provide a secure, seamless, and reliable way for users to link their financial institutions and access their transaction data.

---

### **1. Introduction & Purpose**

The ability to securely connect to users' bank accounts is fundamental for PocketPilot. Plaid acts as the secure intermediary, allowing our application to retrieve financial transaction data and account information without ever directly handling users' bank login credentials. This ensures a high level of security and compliance.

### **2. Plaid Overview**

Plaid is a developer-first platform that makes it easy for applications to connect to users' bank accounts. It provides APIs for:

*   **Identity Verification:** Confirming account holder identity.
*   **Account Balance Retrieval:** Accessing current and available balances.
*   **Transaction Data:** Fetching detailed transaction history.
*   **Data Synchronization:** Efficiently updating transaction data.

### **3. Plaid Workflow**

The typical Plaid integration workflow involves these key steps:

1.  **User Initiates Connection (Frontend):** The user clicks a "Connect Bank Account" button.
2.  **Generate Link Token (Backend):** The frontend requests a `link_token` from our backend API. The backend uses the Plaid SDK to create this token, specifying configuration like user ID and products needed (e.g., `transactions`, `auth`).
3.  **Launch Plaid Link (Frontend):** The frontend uses the received `link_token` to initialize and launch the Plaid Link module (a pre-built UI component provided by Plaid).
4.  **User Authenticates with Bank:** The user interacts with Plaid Link, selecting their institution, and entering their bank login credentials directly into Plaid's secure interface.
5.  **Plaid Exchanges Token (Backend):** Upon successful authentication by the user within Plaid Link, Plaid provides a `public_token` to the frontend. The frontend then sends this `public_token` to our backend API for exchange.
6.  **Backend Secures Access Token:** Our backend uses the `public_token` to call Plaid's `/item/public_token/exchange` endpoint, obtaining a persistent `access_token` and an `item_id`. These are critical for future data requests.
7.  **Store Sensitive Tokens:** The `access_token` and `item_id` are stored securely (encrypted) in our database, associated with the user.
8.  **Fetch Account & Transaction Data (Backend):** Using the stored `access_token`, our backend makes subsequent calls to Plaid endpoints (e.g., `/accounts/balance/get`, `/transactions/sync`) to retrieve account balances and transaction history.
9.  **Process & Store Data (Backend):** The fetched data is processed, categorized (later, by our ML models), and stored in our PostgreSQL database tables (`accounts`, `transactions`).

### **4. Technical Components & Implementation**

**A. Frontend (`React.js`)**

*   **Plaid Link Integration:**
    *   Use the `react-plaid-link` library for seamless integration.
    *   **Installation:** `npm install react-plaid-link`
    *   **Usage:** Wrap your button component with `<PlaidLink>` or use its `usePlaidLink` hook.
*   **Initiating Link Flow:**
    1.  On button click, call a backend endpoint to get a `link_token`: `POST /api/plaid/create_link_token`.
    2.  Store the received `link_token`.
    3.  Initialize Plaid Link with the `link_token` and configure the `onSuccess` callback.
*   **Handling `onSuccess`:**
    *   The `onSuccess` callback receives the `public_token` and `metadata` (including selected accounts).
    *   Send the `public_token` to your backend for exchange: `POST /api/plaid/exchange_public_token` with the token in the request body.
    *   Handle `onExit` callbacks for user cancellations or errors.
*   **Displaying Connected Accounts:**
    *   After successful token exchange, fetch user's linked accounts via `GET /api/plaid/accounts`.
    *   Display these accounts, their balances, and masked numbers.

**B. Backend (`Node.js`/`Express.js`/Plaid SDK)**

1.  **Plaid SDK Setup:**
    *   **Installation:** `npm install plaid`
    *   **Initialization:** Create a Plaid client instance using your Plaid `client_id`, `secret`, and `env` (e.g., `sandbox`, `development`, `production`).
        ```javascript
        const plaid = require('plaid');
        const client = new plaid.PlaidClient({
            clientID: process.env.PLAID_CLIENT_ID,
            secret: process.env.PLAID_SECRET,
            env: plaid.Environments.Sandbox, // Use Sandbox for testing initially
            options: { clientName: 'PocketPilot' }
        });
        ```
    *   **Environment Variables:** Store `PLAID_CLIENT_ID` and `PLAID_SECRET` in your `.env` file. Obtain these from your Plaid developer dashboard.

2.  **`/api/plaid/create_link_token` Endpoint:**
    *   **Method:** `POST`
    *   **Functionality:** Authenticate the user. Generate a `link_token` using `client.linkTokenCreate()`.
    *   **Parameters for `linkTokenCreate`:**
        *   `client_name`: 'PocketPilot'
        *   `user`: `{ client_user_id: userId }` (your internal user ID)
        *   `products`: `['transactions', 'auth']` (requesting necessary products)
        *   `country_codes`: `['US']` (or relevant country)
        *   `language`: `'en'`
    *   **Response:** Return the generated `link_token` to the frontend.

3.  **`/api/plaid/exchange_public_token` Endpoint:**
    *   **Method:** `POST`
    *   **Functionality:** Receive `public_token` from frontend.
    *   **Exchange Token:** Use `client.itemPublicTokenExchange({ public_token })`.
    *   **Secure Storage:** Extract `access_token` and `item_id`. Encrypt them (e.g., using AES) before saving to the `plaid_items` table, linked to the authenticated user. Also, store the `access_token` expiration date.
    *   **Store Accounts:** Optionally, immediately fetch accounts using the newly acquired `access_token` and save them.
    *   **Response:** Success message or error.

4.  **`/api/plaid/accounts` Endpoint:**
    *   **Method:** `GET`
    *   **Functionality:** Authenticate user. Retrieve `access_token` from the database for the user.
    *   **Fetch Balances:** Use `client.accountsBalanceGet({ access_token })`.
    *   **Database Storage:** Fetch stored account details from `accounts` table or update balances if new data comes in.
    *   **Response:** Array of accounts with balances.

5.  **`/api/transactions` Endpoint:**
    *   **Method:** `GET`
    *   **Functionality:** Authenticate user. Retrieve `access_token`.
    *   **Fetch Transactions:** Use `client.transactionsSync({ access_token, start_date, optional_cursor })`.
        *   `start_date`: Can be used for initial fetch.
        *   `optional_cursor`: Crucial for subsequent fetches to only get new/updated transactions efficiently. Store the cursor in `plaid_items` table.
    *   **Process Transactions:** Iterate through `added`, `modified`, `removed` transactions.
        *   Save new transactions into the `transactions` table, linking them to `user_id`, `account_id`, and assigning a `category_id` (will be null initially, then populated by ML model).
        *   Handle `PENDING` transactions appropriately (e.g., mark as pending).
    *   **Update Cursor:** After a successful sync, update the `optional_cursor` in the `plaid_items` table.
    *   **Response:** Paginated list of processed transactions.

**C. Database Schema Updates**

Ensure tables are ready:

*   **`plaid_items`:** `item_id`, `user_id` (FK), `access_token` (encrypted), `cursor` (for sync), `expiration_date`.
*   **`accounts`:** `account_id` (Plaid's ID), `user_id` (FK), `item_id` (FK), `name`, `mask`, `type`, `subtype`, `available_balance`, `current_balance`.
*   **`transactions`:** `transaction_id` (Plaid's ID), `user_id` (FK), `account_id` (FK), `category_id` (FK, nullable), `merchant`, `amount`, `date`, `pending`.

### **5. Security Considerations**

*   **`access_token` Encryption:** **Crucially**, encrypt `access_token` before storing it in the database using a strong, unique encryption key managed via environment variables. Use a robust AES-256 implementation.
*   **`link_token` and `public_token` Handling:** These tokens are sensitive and should only be transmitted over secure HTTPS connections.
*   **Plaid Webhooks:** Implement webhook handlers to receive real-time updates from Plaid (e.g., new transactions, item errors). Secure your webhook endpoint using Plaid's signature verification.
*   **Data Privacy:** Adhere to strict data privacy policies. Limit access to sensitive financial data only to authorized personnel or services.
*   **Error Handling:** Gracefully handle Plaid API errors and sync issues, providing informative feedback to users.

---
