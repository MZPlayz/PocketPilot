// For MVP, we'll use a simple in-memory storage
// In production, this would connect to PostgreSQL or MongoDB

interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
}

interface Transaction {
  id: string;
  userId: string;
  plaidTransactionId: string;
  accountId: string;
  amount: number;
  date: string;
  name: string;
  category: string;
  merchantName?: string;
  createdAt: Date;
}

interface PlaidItem {
  id: string;
  userId: string;
  accessToken: string;
  itemId: string;
  institutionId: string;
  institutionName: string;
  createdAt: Date;
}

interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  month: string;
  createdAt: Date;
}

interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  createdAt: Date;
}

class InMemoryDB {
  private users: User[] = [];
  private transactions: Transaction[] = [];
  private plaidItems: PlaidItem[] = [];
  private budgets: Budget[] = [];
  private goals: Goal[] = [];

  // User methods
  createUser(user: Omit<User, 'id' | 'createdAt'>) {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  findUserByEmail(email: string) {
    return this.users.find(user => user.email === email);
  }

  findUserById(id: string) {
    return this.users.find(user => user.id === id);
  }

  // Transaction methods
  createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>) {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  getTransactionsByUser(userId: string) {
    return this.transactions.filter(t => t.userId === userId);
  }

  // Plaid methods
  createPlaidItem(item: Omit<PlaidItem, 'id' | 'createdAt'>) {
    const newItem: PlaidItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    this.plaidItems.push(newItem);
    return newItem;
  }

  getPlaidItemsByUser(userId: string) {
    return this.plaidItems.filter(item => item.userId === userId);
  }

  getPlaidItemByUserAndInstitution(userId: string, institutionId: string) {
    return this.plaidItems.find(item => 
      item.userId === userId && item.institutionId === institutionId
    );
  }

  // Budget methods
  createBudget(budget: Omit<Budget, 'id' | 'createdAt'>) {
    const newBudget: Budget = {
      ...budget,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    this.budgets.push(newBudget);
    return newBudget;
  }

  getBudgetsByUser(userId: string) {
    return this.budgets.filter(b => b.userId === userId);
  }

  // Goal methods
  createGoal(goal: Omit<Goal, 'id' | 'createdAt'>) {
    const newGoal: Goal = {
      ...goal,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    this.goals.push(newGoal);
    return newGoal;
  }

  getGoalsByUser(userId: string) {
    return this.goals.filter(g => g.userId === userId);
  }

  updateGoal(id: string, updates: Partial<Goal>) {
    const goalIndex = this.goals.findIndex(g => g.id === id);
    if (goalIndex === -1) return null;
    
    this.goals[goalIndex] = { ...this.goals[goalIndex], ...updates };
    return this.goals[goalIndex];
  }
}

export const db = new InMemoryDB();

export const connectDB = async () => {
  console.log('Connected to in-memory database (MVP mode)');
  return Promise.resolve();
};
