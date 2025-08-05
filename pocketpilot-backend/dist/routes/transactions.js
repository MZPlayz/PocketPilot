"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const database_1 = require("../config/database");
const router = express_1.default.Router();
// Get all transactions for user
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { limit = 50, offset = 0, category, startDate, endDate } = req.query;
        let transactions = database_1.db.getTransactionsByUser(userId);
        // Apply filters
        if (category) {
            transactions = transactions.filter(t => t.category === category);
        }
        if (startDate) {
            transactions = transactions.filter(t => t.date >= startDate);
        }
        if (endDate) {
            transactions = transactions.filter(t => t.date <= endDate);
        }
        // Apply pagination
        const paginatedTransactions = transactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(Number(offset), Number(offset) + Number(limit));
        res.json({
            transactions: paginatedTransactions,
            total: transactions.length,
            limit: Number(limit),
            offset: Number(offset),
        });
    }
    catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});
// Update transaction category
router.put('/:id/category', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const transactionId = req.params.id;
        const { category } = req.body;
        const transactions = database_1.db.getTransactionsByUser(userId);
        const transactionIndex = transactions.findIndex(t => t.id === transactionId);
        if (transactionIndex === -1) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        // Update the transaction
        transactions[transactionIndex].category = category;
        res.json({ transaction: transactions[transactionIndex] });
    }
    catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});
// Get transaction categories
router.get('/categories/summary', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const transactions = database_1.db.getTransactionsByUser(userId);
        const categorySummary = transactions.reduce((acc, transaction) => {
            const category = transaction.category || 'Other';
            if (!acc[category]) {
                acc[category] = { total: 0, count: 0 };
            }
            acc[category].total += transaction.amount;
            acc[category].count += 1;
            return acc;
        }, {});
        res.json({ categories: categorySummary });
    }
    catch (error) {
        console.error('Error fetching category summary:', error);
        res.status(500).json({ error: 'Failed to fetch category summary' });
    }
});
// Get spending trends
router.get('/trends', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { period = 'month' } = req.query;
        const transactions = database_1.db.getTransactionsByUser(userId);
        // Group by period
        const trends = transactions.reduce((acc, transaction) => {
            const date = new Date(transaction.date);
            let key;
            if (period === 'day') {
                key = date.toISOString().split('T')[0];
            }
            else if (period === 'week') {
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = weekStart.toISOString().split('T')[0];
            }
            else {
                // month
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }
            if (!acc[key]) {
                acc[key] = { total: 0, count: 0 };
            }
            acc[key].total += transaction.amount;
            acc[key].count += 1;
            return acc;
        }, {});
        res.json({ trends });
    }
    catch (error) {
        console.error('Error fetching trends:', error);
        res.status(500).json({ error: 'Failed to fetch trends' });
    }
});
exports.default = router;
//# sourceMappingURL=transactions.js.map