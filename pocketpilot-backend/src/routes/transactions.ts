import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { db } from '../config/database';

const router = express.Router();

// Get all transactions for user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { limit = 50, offset = 0, category, startDate, endDate } = req.query;

    let transactions = db.getTransactionsByUser(userId!);

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
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get transaction by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const transactionId = req.params.id;

    const transaction = db.getTransactionById(transactionId);
    
    if (!transaction || transaction.userId !== userId) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Update transaction
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const transactionId = req.params.id;
    const { category, notes, tags } = req.body;

    const transaction = db.getTransactionById(transactionId);
    
    if (!transaction || transaction.userId !== userId) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const updatedTransaction = db.updateTransaction(transactionId, {
      category,
      notes,
      tags,
    });

    res.json({ transaction: updatedTransaction });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Get transaction categories
router.get('/categories/summary', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const transactions = db.getTransactionsByUser(userId!);

    const categorySummary = transactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Other';
      if (!acc[category]) {
        acc[category] = { total: 0, count: 0 };
      }
      acc[category].total += transaction.amount;
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    res.json({ categories: categorySummary });
  } catch (error) {
    console.error('Error fetching category summary:', error);
    res.status(500).json({ error: 'Failed to fetch category summary' });
  }
});

// Get spending trends
router.get('/trends', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { period = 'month' } = req.query;

    const transactions = db.getTransactionsByUser(userId!);
    
    // Group by period
    const trends = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      let key: string;
      
      if (period === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (period === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        // month
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!acc[key]) {
        acc[key] = { total: 0, count: 0 };
      }
      acc[key].total += transaction.amount;
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    res.json({ trends });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

export default router;
