# 🚀 PocketPilot: Your AI-Powered Personal Finance Manager

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

<p align="center">
  An intelligent personal finance platform designed to empower individuals to take control of their financial well-being. Leveraging AI and modern web technologies, PocketPilot analyzes spending patterns, provides personalized budgeting advice, and helps users track their financial goals effectively.
</p>

---

## ✨ Key Features

*   **Secure User Authentication:** Robust signup, login, and session management to protect user data.
*   **Bank Account Connectivity:** Seamless and secure integration with **Plaid API** for linking bank accounts.
*   **Automated Expense Categorization:** AI-powered analysis to automatically classify transactions.
*   **Spending Overview & Budgeting:** Visualizations of spending and tools to set monthly budgets.
*   **Financial Goal Tracking:** A user-friendly way to set and track progress towards financial goals.
*   **Modern UI/UX:** A sleek, dark-themed interface built with **Tailwind CSS** and ready for **Magic UI** enhancements.

## 🛠️ Tech Stack

*   **Frontend:** React.js, TypeScript, Tailwind CSS
*   **Backend:** Node.js, Express.js, TypeScript
*   **AI/ML:** Python (Scikit-learn for categorization model)
*   **Database:** PostgreSQL (or in-memory for MVP)
*   **Bank Connectivity:** Plaid API

## ⚙️ Local Setup & Installation

Follow these steps to get the PocketPilot application running on your local machine.

### **Prerequisites**

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [Git](https://git-scm.com/)

---

### **1. Clone the Repository**

First, clone the project from GitHub to your local machine.

```bash
git clone https://github.com/MZPlayz/PocketPilot.git
cd PocketPilot
```

---

### **2. Backend Setup**

The backend server handles API requests, user authentication, and Plaid integration.

1.  **Navigate to the backend directory:**
    ```bash
    cd pocketpilot-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `pocketpilot-backend` directory and add the following variables. You'll need to get your Plaid credentials from the [Plaid Dashboard](https://dashboard.plaid.com/).

    ```env
    PORT=5000
    JWT_SECRET=your-super-secret-jwt-key
    PLAID_CLIENT_ID=your_plaid_client_id
    PLAID_SECRET=your_plaid_secret
    PLAID_ENV=sandbox
    ```

4.  **Run the backend server:**
    ```bash
    npm start
    ```
    The backend will be running on `http://localhost:5000`.

---

### **3. Frontend Setup**

The frontend is the React application that users interact with.

1.  **Navigate to the frontend directory (from the root folder):**
    ```bash
    cd pocketpilot-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `pocketpilot-frontend` directory and add the following variable to point to your running backend.

    ```env
    REACT_APP_API_URL=http://localhost:5000
    ```

4.  **Run the frontend application:**
    ```bash
    npm start
    ```
    The frontend will open in your browser at `http://localhost:3000`.

---

## 💡 Usage

Once both the backend and frontend are running:

1.  **Open your browser** to `http://localhost:3000`.
2.  **Register** for a new account.
3.  **Login** with your new credentials.
4.  Explore the dashboard and navigate between the **Transactions**, **Budgets**, and **Goals** pages.

## ⚖️ License

This project is licensed under the **MIT License** - see the `LICENSE` file for details.
