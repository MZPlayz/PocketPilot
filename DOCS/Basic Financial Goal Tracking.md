

## **PocketPilot: Basic Financial Goal Tracking Strategy Document**

This document outlines the strategy and technical implementation for the Basic Financial Goal Tracking feature. This feature will allow users to set financial goals (e.g., saving for a down payment, paying off debt) and manually track their progress towards achieving them.

---

### **1. Introduction & Feature Goals**

The goal-tracking feature aims to empower users by providing a structured way to define financial aspirations and monitor their journey towards them. For the MVP, this will focus on manual progress updates and clear visualization, laying the groundwork for more automated tracking in future iterations.

### **2. Key Components**

*   **Backend (Node.js/Express.js):**
    *   API endpoints for CRUD (Create, Read, Update, Delete) operations on financial goals.
    *   Logic to manage goal progress updates.
*   **Frontend (React.js):**
    *   UI for users to create, view, edit, and delete financial goals.
    *   Components to visualize goal progress (e.g., progress bars, percentage complete).
*   **Database (PostgreSQL):**
    *   The `goals` table to store user-defined financial goals.

### **3. Backend Implementation Strategy**

We will implement RESTful API endpoints for managing user financial goals.

**A. Goal Management (CRUD Operations)**

*   **`POST /api/goals`**:
    *   **Purpose:** Create a new financial goal.
    *   **Request Body:** `{ name: string, targetAmount: number, dueDate: string (YYYY-MM-DD) }`
    *   **Logic:**
        *   Authenticate the user.
        *   Validate input parameters.
        *   Insert a new record into the `goals` table, associating it with the authenticated `user_id`. `currentAmount` will default to `0.00`.
    *   **Response:** The newly created goal object.

*   **`GET /api/goals`**:
    *   **Purpose:** Retrieve all financial goals for the authenticated user.
    *   **Logic:**
        *   Authenticate the user.
        *   Fetch all goals from the `goals` table belonging to the authenticated `user_id`.
    *   **Response:** An array of goal objects.

*   **`GET /api/goals/:goalId`**:
    *   **Purpose:** Retrieve a specific financial goal.
    *   **Logic:**
        *   Authenticate the user.
        *   Fetch the goal by `goalId` and ensure it belongs to the authenticated user.
    *   **Response:** The specific goal object.

*   **`PUT /api/goals/:goalId`**:
    *   **Purpose:** Update an existing financial goal. This includes updating goal details OR logging progress towards the goal.
    *   **Request Body:** Can include fields like `{ name, targetAmount, dueDate, currentAmount }` for updates, or specifically a progress update like `{ amountToAdd: number }`. For MVP, we'll focus on updating details and a specific progress update endpoint or method.
    *   **Logic (for updating goal details):**
        *   Authenticate user.
        *   Find the goal by `goalId` and ensure ownership.
        *   Update specified fields (`name`, `targetAmount`, `dueDate`).
        *   Ensure `currentAmount` is not greater than `targetAmount` if updated directly.
    *   **Logic (for logging progress):**
        *   Authenticate user.
        *   Find the goal by `goalId` and ensure ownership.
        *   Add `amountToAdd` to the existing `currentAmount`.
        *   **Validation:** Ensure `currentAmount` does not exceed `targetAmount` after addition. If it does, cap `currentAmount` at `targetAmount`.
    *   **Response:** The updated goal object.

*   **`DELETE /api/goals/:goalId`**:
    *   **Purpose:** Delete a financial goal.
    *   **Logic:**
        *   Authenticate user.
        *   Find the goal by `goalId` and ensure ownership.
        *   Delete the goal record.
    *   **Response:** Success message.

### **4. Database Schema Design (Update to `goals` table)**

The `goals` table should have the following structure:

*   `goal_id` (Primary Key, SERIAL)
*   `user_id` (Foreign Key to `users.user_id`, NOT NULL)
*   `name` (VARCHAR, NOT NULL) – e.g., "Emergency Fund", "New Car"
*   `target_amount` (DECIMAL, NOT NULL) – The total amount to be saved/achieved.
*   `current_amount` (DECIMAL, Default 0.00, NOT NULL) – Amount saved/achieved so far.
*   `due_date` (DATE, Optional) – Target completion date.
*   `created_at` (TIMESTAMP, Default NOW())
*   `updated_at` (TIMESTAMP, Default NOW())

### **5. Frontend Implementation Strategy**

**A. Goal Management UI**

*   **Goals Page/Section:** A dedicated area to display all financial goals.
*   **"Add New Goal" Button:** Triggers a modal or form to create a new goal.
    *   **Form Fields:**
        *   Goal Name (text input)
        *   Target Amount (number input)
        *   Due Date (date picker/input)
    *   **Save Button:** Calls `POST /api/goals`.
*   **Goal Display:**
    *   Each goal displayed as a card or list item showing:
        *   Goal Name
        *   Target Amount
        *   Current Amount Saved
        *   Due Date
    *   **Progress Visualization:**
        *   A progress bar showing `(currentAmount / targetAmount) * 100%`.
        *   Display the percentage complete and the amount remaining.
*   **"Add Progress" Button (per goal):**
    *   Opens a small modal/input field to enter an amount to add to `currentAmount`.
    *   Calls `PUT /api/goals/:goalId` with `{ amountToAdd: number }`.
*   **"Edit Goal" Button (per goal):**
    *   Opens a form pre-filled with goal details, allowing updates via `PUT /api/goals/:goalId`.
*   **"Delete Goal" Button (per goal):**
    *   Confirms deletion and calls `DELETE /api/goals/:goalId`.

**B. Data Flow for Goals**

1.  **Fetch Goals:** When the user navigates to the Goals section, the frontend calls `GET /api/goals` to fetch all their goals.
2.  **Display Goals:** The fetched data is used to render the list of goals, including progress bars and remaining amounts.
3.  **Add Progress:** When the user adds progress to a goal:
    *   Frontend sends `{ amountToAdd: value }` to `PUT /api/goals/:goalId`.
    *   Backend updates `current_amount`, ensuring it doesn't exceed `target_amount`.
    *   Backend returns the updated goal.
    *   Frontend updates the display for that specific goal (progress bar, amounts).

### **6. Security Considerations**

*   **Authorization:** All goal-related API endpoints must be protected by JWT authentication to ensure users can only manage their own goals.
*   **Input Validation:** Robust validation of all input data for goal creation and progress updates is crucial to maintain data integrity and prevent errors or malicious entries.

### **7. Future Enhancements (Beyond MVP)**

*   **Automatic Goal Contribution:** Link goals to specific savings accounts and automatically update `current_amount` based on account balance changes or scheduled transfers.
*   **Goal Categorization:** Allow users to categorize goals (e.g., "Savings", "Debt Payoff", "Investment").
*   **More Sophisticated Visualizations:** Include charts showing goal progress over time.

---

This strategy covers the basic financial goal tracking feature.

**Your Command for Roo Code:**

"Roo Code, implement the basic financial goal tracking feature:

1.  **Backend (Node.js/Express.js):**
    *   **Database:** Ensure the `goals` table is correctly defined in PostgreSQL with fields: `goal_id`, `user_id` (FK), `name`, `target_amount`, `current_amount`, `due_date`.
    *   **API Endpoints:** Implement the full CRUD API endpoints for goals (`/api/goals`):
        *   `POST /api/goals`: For creating new goals.
        *   `GET /api/goals`: For retrieving all goals for the authenticated user.
        *   `GET /api/goals/:goalId`: For retrieving a single goal.
        *   `PUT /api/goals/:goalId`: For updating goal details and for adding progress (`amountToAdd` property in request body). Implement logic to update `current_amount` and cap it at `target_amount`.
        *   `DELETE /api/goals/:goalId`: For deleting a goal.
    *   **Authentication & Validation:** Secure all endpoints with JWT authentication and add necessary input validation.
    *   **JSDoc:** Add comprehensive JSDoc comments for all new backend functions, routes, and controllers.
2.  **Frontend (React.js):**
    *   **Goals UI:** Create components to:
        *   Display a list of all financial goals.
        *   Show goal name, target amount, current amount saved, and due date.
        *   Include a progress bar visualization calculated from `currentAmount` and `targetAmount`.
        *   Display percentage complete and amount remaining.
        *   Implement the "Add Progress" functionality (a simple input and button per goal).
        *   Implement a form/modal for creating new goals.
        *   Implement basic editing functionality for goal details.
        *   Implement deletion of goals.
    *   **Integration:** Connect these UI components to the backend API endpoints.

Let's start building the functionality to track user goals."