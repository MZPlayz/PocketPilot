"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const database_1 = require("../config/database");
const router = express_1.default.Router();
// Get all budgets for user
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const budgets = database_1.db.getBudgetsByUser(userId);
        res.json({ budgets });
    }
    catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ error: 'Failed to fetch budgets' });
    }
});
// Create budget
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { category, amount, month } = req.body;
        if (!category || !amount || !month) {
            return res.status(400).json({ error: 'Category, amount, and month are required' });
        }
        const budget = database_1.db.createBudget({
            userId: userId,
            category,
            amount,
            month,
        });
        res.status(201).json({ budget });
    }
    catch (error) {
        console.error('Error creating budget:', error);
        res.status(500).json({ error: 'Failed to create budget' });
    }
});
// Get budget vs actual spending
router.get('/vs-actual', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const monthQuery = req.query.month;
        if (!monthQuery || typeof monthQuery !== 'string') {
            return res.status(400).json({ error: 'Month parameter is required' });
        }
        const budgets = database_1.db.getBudgetsByUser(userId).filter(b => b.month === monthQuery);
        const transactions = database_1.db.getTransactionsByUser(userId).filter(t => t.date.startsWith(monthQuery));
        const budgetVsActual = budgets.map(budget => {
            const spent = transactions
                .filter(t => t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);
            return {
                category: budget.category,
                budgeted: budget.amount,
                spent,
                remaining: budget.amount - spent,
                percentage: budget.amount > 0 ? (spent / budget.amount) * 100 : 0,
            };
        });
        res.json({ budgetVsActual });
    }
    catch (error) {
        console.error('Error fetching budget vs actual:', error);
        res.status(500).json({ error: 'Failed to fetch budget vs actual' });
    }
});
exports.default = router;
//# sourceMappingURL=budgets.js.map