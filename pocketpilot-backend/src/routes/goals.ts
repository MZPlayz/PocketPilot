import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { db } from '../config/database';

const router = express.Router();

// Get all goals for user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const goals = db.getGoalsByUser(userId!);
    res.json({ goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Create goal
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { name, targetAmount, targetDate } = req.body;

    if (!name || !targetAmount || !targetDate) {
      return res.status(400).json({ error: 'Name, targetAmount, and targetDate are required' });
    }

    const goal = db.createGoal({
      userId: userId!,
      name,
      targetAmount,
      targetDate,
      currentAmount: 0,
    });

    res.status(201).json({ goal });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Update goal progress
router.put('/:id/progress', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const goalId = req.params.id;
    const { amount } = req.body;

    if (!amount || amount < 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const goal = db.getGoalsByUser(userId!).find(g => g.id === goalId);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const updatedGoal = db.updateGoal(goalId, {
      currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount),
    });

    res.json({ goal: updatedGoal });
  } catch (error) {
    console.error('Error updating goal progress:', error);
    res.status(500).json({ error: 'Failed to update goal progress' });
  }
});

export default router;
