
---

## **PocketPilot: Automated Expense Categorization Strategy Document**

This document details the strategy and technical implementation for the automated expense categorization feature in PocketPilot. Leveraging machine learning, this feature will automatically classify user transactions, providing valuable insights into spending habits and simplifying personal finance management.

---

### **1. Introduction & Feature Goal**

The primary goal of automated expense categorization is to reduce manual effort for users by intelligently assigning a category (e.g., "Groceries", "Utilities", "Entertainment", "Salary") to each transaction fetched from their linked bank accounts. This not only enhances the usability of financial data but also forms the basis for budgeting, trend analysis, and personalized financial advice.

### **2. Technical Approach**

We will employ a machine learning approach using Python and Scikit-learn, integrating a trained model into our backend architecture.

*   **Machine Learning Model:**
    *   **Algorithm:** We will utilize a supervised learning classification algorithm. Given the textual nature of merchant names and transaction descriptions, **Naive Bayes** (specifically `MultinomialNB` or `ComplementNB`) or a **Support Vector Machine (SVM)** with text vectorization are strong candidates. Other options like Logistic Regression could also be explored.
    *   **Text Preprocessing:** Raw transaction text (merchant name, description) will undergo preprocessing:
        *   **Lowercasing:** Convert all text to lowercase.
        *   **Punctuation Removal:** Remove common punctuation marks.
        *   **Stop Word Removal:** Eliminate common English words (e.g., "the", "a", "and") that do not add significant categorical meaning.
        *   **Stemming/Lemmatization (Optional but Recommended):** Reduce words to their root form (e.g., "running", "ran" -> "run").
    *   **Feature Extraction:**
        *   **TF-IDF (Term Frequency-Inverse Document Frequency):** This is a common technique to convert text data into numerical features. It reflects how important a word is to a document (transaction description) in a corpus (all transactions).
    *   **Training Data:** A labeled dataset will be crucial. This dataset will consist of historical transaction descriptions/merchant names paired with their correct categories. Initially, this data can be generated manually or by using sample datasets from Plaid and other sources. As users provide feedback (correcting miscategorizations), this data can be used to retrain and improve the model over time.
*   **Model Serving:**
    *   **Python Microservice:** The trained ML model will be wrapped in a Python web framework (like **Flask** or **FastAPI**) and exposed as a microservice. This service will have an endpoint (e.g., `POST /predict/category`) that accepts transaction text and returns a predicted category (or category ID).
    *   **Node.js Integration:** The Node.js backend will make HTTP requests to this Python microservice for each transaction requiring categorization.

### **3. Data Flow**

1.  **Plaid Fetch:** Transactions are fetched from Plaid by the Node.js backend.
2.  **Preprocessing:** Relevant text fields (merchant, description) from the fetched transactions are passed to the Python ML service.
3.  **ML Prediction:** The Python service preprocesses the text, applies TF-IDF, and uses the trained model to predict a category.
4.  **Backend Update:** The Node.js backend receives the predicted category ID from the Python service.
5.  **Database Storage:** The `category_id` is stored in the `transactions` table, linking it to the respective transaction.
6.  **Frontend Display:** The React frontend fetches transactions (which now include their `category_id`) and displays them, grouped or filterable by category.

### **4. Implementation Plan**

**A. Backend (Python ML Service)**

1.  **Setup:**
    *   Create a new Python project.
    *   Install dependencies: `pip install flask scikit-learn pandas nltk` (for text preprocessing).
    *   Download NLTK data if needed (e.g., for stop words).
2.  **Data Preparation:**
    *   Gather or create a labeled dataset of transactions (merchant/description + category).
    *   Write Python scripts to preprocess this data.
3.  **Model Training:**
    *   **Feature Engineering:** Use `TfidfVectorizer` from `sklearn.feature_extraction.text` to convert text into TF-IDF features.
    *   **Model Training:** Train a chosen classifier (e.g., `MultinomialNB` or `LinearSVC`) using the TF-IDF features and labels.
    *   **Evaluation:** Evaluate the model's accuracy, precision, recall, and F1-score using appropriate metrics.
4.  **Model Persistence:** Save the trained model (e.g., using `joblib` or `pickle`).
5.  **Model Serving (Flask/FastAPI):**
    *   Create a Flask/FastAPI application.
    *   Load the trained model and vectorizer on application startup.
    *   Define an endpoint (`POST /predict/category`) that:
        *   Accepts transaction text data (e.g., `{ "merchant": "Starbucks", "description": "COFFEE PURCHASE" }`).
        *   Preprocesses the input text.
        *   Applies the loaded TF-IDF vectorizer.
        *   Passes the features to the loaded ML model for prediction.
        *   Returns the predicted category ID or name.
6.  **Error Handling:** Implement try-catch blocks. If the model fails or returns low confidence, return a default category (e.g., `uncategorized`).

**B. Backend (Node.js - Integration)**

1.  **Transaction Processing Service:** When new transactions are fetched via Plaid (e.g., `transactionsSync` response), iterate through them.
2.  **Call ML Service:** For each transaction, make an HTTP POST request to the Python ML service's `/predict/category` endpoint with the transaction's merchant and description.
3.  **Handle Response:**
    *   If a category ID is received, store it in the `transactions` table for that transaction.
    *   If the ML service returns an error or a default/unknown category, store a placeholder (e.g., `NULL` or a specific `uncategorized_category_id`) and potentially flag it for manual review.
4.  **Category Mapping:** Ensure category IDs returned by the ML service correspond to our `categories` table.
5.  **Logging:** Log any errors encountered during the ML prediction process.

**C. Frontend (React.js)**

1.  **Display Transactions:** Fetch transactions from the backend, which will now include the `category_id` and category name.
2.  **Visualization:** Use charting libraries to display spending breakdowns by category (e.g., pie charts, bar charts).
3.  **UI for Uncategorized Items (Future Enhancement):** Design an interface where users can see transactions marked as "Uncategorized" and manually assign categories. This manual assignment can be used to collect data for future model retraining.

### **5. User Experience & Feedback Loop**

*   **Initial State:** Transactions will appear with their predicted categories immediately.
*   **Handling Mismatches:** For MVP, we accept that initial categorization might not be perfect. A clear UI element will show the assigned category. Future iterations will include a "Change Category" option that allows users to correct misclassifications. This feedback is invaluable for improving the ML model.
*   **"Uncategorized" Items:** Transactions that could not be categorized (e.g., due to poor text data or model limitations) will be clearly marked.

### **6. Security & Data Privacy**

*   **Data Transfer:** All data sent to and received from the ML service must be over secure HTTPS.
*   **Data Minimization:** Only send the necessary fields (merchant, description) to the ML service.

---
