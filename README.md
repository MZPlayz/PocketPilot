# 🚀 PocketPilot - AI-Powered Personal Finance Management MVP

**An intelligent personal finance platform that leverages AI to automate financial tracking, provide actionable insights, and streamline progress towards financial goals.**

## 🎯 MVP Status: **LIVE & READY**

### ✅ **Services Running:**
- **Frontend**: http://localhost:3000 (React Dashboard)
- **Backend API**: http://localhost:5000 (Node.js/Express)
- **Database**: In-memory (MVP mode)

## 🏗️ **Architecture Overview**

### **Tech Stack:**
- **Frontend**: React.js with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express.js, TypeScript
- **Database**: In-memory database (PostgreSQL ready for production)
- **AI/ML**: Python integration ready (Scikit-learn)
- **Bank Integration**: Plaid API
- **Authentication**: JWT tokens

### **Project Structure:**
```
PocketPilot/
├── pocketpilot-frontend/     # React frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript types
├── pocketpilot-backend/      # Node.js backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth middleware
│   │   ├── config/          # Database config
│   │   └── types/           # TypeScript types
└── DOCS/                    # Documentation
```

## 🚀 **Quick Start**

### **Prerequisites:**
- Node.js 18+
- npm or yarn

### **Installation & Setup:**

1. **Clone the repository:**
```bash
git clone https://github.com/MZPlayz/PocketPilot.git
cd PocketPilot
```

2. **Backend Setup:**
```bash
cd pocketpilot-backend
npm install
npm start
# Backend runs on http://localhost:5000
```

3. **Frontend Setup:**
```bash
cd pocketpilot-frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

## 📋 **MVP Features**

### **✅ Core Features Implemented:**

#### **1. User Authentication**
- Secure registration/login with JWT
- Password hashing with bcrypt
- Protected API routes

#### **2. Bank Account Connectivity**
- Plaid API integration for secure bank linking
- Real-time transaction fetching
- Sandbox mode for testing

#### **3. Transaction Management**
- Automatic transaction categorization
- Manual category editing
- Transaction filtering and search
- Spending trends analysis

#### **4. Budget Management**
- Monthly budget creation by category
- Real-time budget vs actual tracking
- Visual progress indicators
- Budget alerts and notifications

#### **5. Financial Goals**
- Goal creation with target amounts and dates
- Progress tracking with visual indicators
- Milestone achievements

#### **6. Analytics Dashboard**
- Spending by category charts
- Monthly spending trends
- Budget utilization visualization
- Goal progress tracking

## 🔗 **API Endpoints**

### **Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### **Plaid Integration:**
- `POST /api/plaid/link-token` - Create Plaid link token
- `POST /api/plaid/exchange-token` - Exchange public token for access
- `POST /api/plaid/transactions` - Fetch transactions from linked accounts

### **Transactions:**
- `GET /api/transactions` - Get user transactions
- `PUT /api/transactions/:id/category` - Update transaction category
- `GET /api/transactions/categories/summary` - Category spending summary
- `GET /api/transactions/trends` - Spending trends over time

### **Budgets:**
- `GET /api/budgets` - Get user budgets
- `POST /api/budgets` - Create new budget
- `GET /api/budgets/vs-actual` - Budget vs actual spending analysis

### **Goals:**
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id/progress` - Update goal progress

## 🧪 **Testing the MVP**

### **Test User Credentials:**
- **Email**: test@example.com
- **Password**: password123

### **Plaid Sandbox Testing:**
- Use Plaid's sandbox credentials
- Test with fake bank accounts
- No real bank credentials required

### **Demo Flow:**
1. **Register** at http://localhost:3000/register
2. **Login** with your credentials
3. **Connect Bank** using Plaid sandbox
4. **View Transactions** automatically categorized
5. **Create Budgets** for different categories
6. **Set Goals** and track progress
7. **View Analytics** dashboard

## 🎯 **Next Steps for Production**

### **Phase 1: Production Deployment**
- [ ] Set up PostgreSQL database
- [ ] Deploy to cloud provider (AWS/Heroku)
- [ ] Set up environment variables
- [ ] Configure SSL certificates

### **Phase 2: AI Enhancement**
- [ ] Integrate Python ML model for categorization
- [ ] Add predictive analytics
- [ ] Implement personalized recommendations

### **Phase 3: Advanced Features**
- [ ] Investment tracking
- [ ] Bill reminders
- [ ] Receipt scanning
- [ ] Multi-currency support

## 📚 **Development Commands**

### **Backend:**
```bash
cd pocketpilot-backend
npm run dev          # Development with nodemon
npm run build        # Build for production
npm run start        # Start production server
npm test            # Run tests
```

### **Frontend:**
```bash
cd pocketpilot-frontend
npm start           # Development server
npm run build       # Build for production
npm test            # Run tests
```

## 🔧 **Environment Variables**

### **Backend (.env):**
```bash
PORT=5000
JWT_SECRET=your-jwt-secret
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret
PLAID_ENV=sandbox
```

### **Frontend (.env):**
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_PLAID_ENV=sandbox
```

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

For support, email: support@pocketpilot.com or create an issue in the GitHub repository.

---

**Built with ❤️ using React, Node.js, and AI-powered financial intelligence**
