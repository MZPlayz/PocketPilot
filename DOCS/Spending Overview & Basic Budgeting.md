
---

## **PocketPilot: Spending Overview & Basic Budgeting Strategy Document**

This document outlines the strategy and technical implementation for the Spending Overview and Basic Budgeting features of PocketPilot. These features will allow users to visualize their spending patterns, set monthly budgets for different categories, and track their progress against these budgets.

---

### **1. Introduction & Feature Goals**

*   **Spending Overview:** To provide users with a clear, visual representation of where their money is going. This includes breaking down expenses by category, showing trends over time, and offering quick insights into spending habits.
*   **Basic Budgeting:** To enable users to set financial goals by allocating specific amounts to different spending categories on a monthly basis. The system will then help them monitor their adherence to these budgets.

### **2. Key Components**

*   **Backend (Node.js/Express.js):**
    *   API endpoints for creating, reading, updating, and deleting user budgets (`/api/budgets`).
    *   API endpoint to generate budget summaries, calculating actual spending against budgeted amounts (`/api/budgets/summary`).
    *   Ensuring transaction data processed from Plaid is correctly categorized and available for aggregation.
*   **Frontend (React.js):**
    *   User interface for setting and managing budgets (selecting categories, entering amounts, specifying months/years).
    *   Dashboard components to display spending overviews (charts).
    *   Components to show budget vs. actual spending comparisons, highlighting progress or overspending.
*   **Database (PostgreSQL):**
    *   `categories` table: Stores predefined spending categories.
    *   `budgets` table: Stores user-defined budgets, linking them to users, categories, and time periods.
    *   `transactions` table: Stores all fetched transactions, including their `category_id`, to enable spending aggregation.

### **3. Backend Implementation Strategy**

**A. Budget Management (CRUD Operations)**

We will implement RESTful API endpoints for managing user budgets:

*   **`POST /api/budgets`**:
    *   **Purpose:** Create a new budget entry.
    *   **Request Body:** `{ categoryId: number, amount: number, month: number, year: number }` (Authenticated user context).
    *   **Logic:** Validate inputs, check if a budget for this category/month/year already exists, and insert a new record into the `budgets` table.
*   **`GET /api/budgets`**:
    *   **Purpose:** Retrieve all budgets for the authenticated user.
    *   **Logic:** Fetch records from the `budgets` table associated with the authenticated user. Join with the `categories` table to include category names.
*   **`PUT /api/budgets/:budgetId`**:
    *   **Purpose:** Update an existing budget.
    *   **Request Body:** `{ amount: number }` (or allow updating category, month, year if needed, but primarily amount for MVP).
    *   **Logic:** Find the budget by `budgetId` and update the specified fields. Ensure the budget belongs to the authenticated user.
*   **`DELETE /api/budgets/:budgetId`**:
    *   **Purpose:** Remove a budget.
    *   **Logic:** Delete the budget record by `budgetId`. Ensure it belongs to the authenticated user.

**B. Budget Summary Calculation**

*   **`GET /api/budgets/summary`**:
    *   **Purpose:** Provide a consolidated view of budgets and actual spending for a given period.
    *   **Query Parameters:** `month` (integer, 1-12), `year` (integer).
    *   **Logic:**
        1.  Authenticate the user.
        2.  Fetch all budget entries for the authenticated user for the specified `month` and `year` from the `budgets` table.
        3.  For each budget entry:
            a.  Query the `transactions` table to sum the `amount` of all transactions belonging to that `category_id` and `user_id` within the specified `month` and `year`. Ensure amounts are handled correctly (e.g., sum absolute values for expenses, or sum positive amounts for income categories if budgeting for income). *For expense budgeting, we’ll sum expenses (negative amounts treated as positive).*
            b.  Join with the `categories` table to get the category name.
        4.  Calculate `actualSpent`, `budgetedAmount`, and `remainingAmount` (or `overspentAmount`).
        5.  Return an array of summary objects: `[{ categoryId, categoryName, budgetedAmount, actualSpent, remainingAmount }]`.

### **4. Frontend Implementation Strategy**

**A. Budget Setting UI**

*   **Page/Modal:** Create a dedicated section (e.g., a modal or a new page) for managing budgets.
*   **Budget List:** Display existing budgets for the current user, showing category, budgeted amount, and month/year.
*   **Add/Edit Budget Form:**
    *   **Category Selection:** A dropdown or select component populated with categories from `GET /api/categories` (if available, otherwise hardcoded initially).
    *   **Amount Input:** A number input for the budget amount.
    *   **Date Selection:** Month and Year selectors (dropdowns or date picker).
    *   **Buttons:** Save/Update and Delete buttons.
*   **Logic:** Frontend calls backend CRUD endpoints to manage budgets.

**B. Spending Overview & Budget vs. Actual UI**

*   **Dashboard Section:** Integrate this into the main dashboard or a dedicated "Budget" page.
*   **Spending Breakdown:**
    *   Use charting libraries (e.g., `Recharts`, `Nivo`) to display a pie chart or bar chart showing spending distribution across categories for the selected period (defaulting to the current month).
*   **Budget Performance:**
    *   Display a table or list of budget summaries (fetched from `/api/budgets/summary`).
    *   Columns: Category, Budgeted, Spent, Remaining/Overspent.
    *   Visual indicators (e.g., color coding bars or text) for categories that are close to or exceeding their budget.
    *   Allow users to switch between months/years to view different budget periods.

### **5. Data Flow Example (Budget Summary)**

1.  **User Request:** User lands on the dashboard, which displays the current month's spending overview and budgets.
2.  **Frontend Call:** The dashboard component makes a `GET /api/budgets/summary?month=<current_month>&year=<current_year>` request.
3.  **Backend Processing:**
    *   User authentication occurs.
    *   Budgets for the user/month/year are fetched.
    *   Transactions for that user/month/year are aggregated per category.
    *   Summary data is calculated.
4.  **Frontend Display:** The frontend receives the summary data and populates charts and a table, showing users their budget status at a glance.

### **6. Security & Data Handling**

*   **Authorization:** All budget-related API endpoints must be protected by JWT authentication to ensure users can only access and modify their own budgets.
*   **Data Integrity:** Ensure transaction amounts are correctly aggregated and compared to budgeted amounts. Handle edge cases like zero-amount transactions or different currencies if applicable.
*   **Input Validation:** Rigorous validation of all inputs for budget creation/updates to prevent malicious data entry.

---
