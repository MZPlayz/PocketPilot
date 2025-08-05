"use strict";
// For MVP, we'll use a simple in-memory storage
// In production, this would connect to PostgreSQL or MongoDB
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.db = void 0;
class InMemoryDB {
    constructor() {
        this.users = [];
        this.transactions = [];
        this.plaidItems = [];
        this.budgets = [];
        this.goals = [];
    }
    // User methods
    createUser(user) {
        const newUser = {
            ...user,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date()
        };
        this.users.push(newUser);
        return newUser;
    }
    findUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }
    findUserById(id) {
        return this.users.find(user => user.id === id);
    }
    // Transaction methods
    createTransaction(transaction) {
        const newTransaction = {
            ...transaction,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date()
        };
        this.transactions.push(newTransaction);
        return newTransaction;
    }
    getTransactionsByUser(userId) {
        return this.transactions.filter(t => t.userId === userId);
    }
    // Plaid methods
    createPlaidItem(item) {
        const newItem = {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date()
        };
        this.plaidItems.push(newItem);
        return newItem;
    }
    getPlaidItemsByUser(userId) {
        return this.plaidItems.filter(item => item.userId === userId);
    }
    getPlaidItemByUserAndInstitution(userId, institutionId) {
        return this.plaidItems.find(item => item.userId === userId && item.institutionId === institutionId);
    }
    // Budget methods
    createBudget(budget) {
        const newBudget = {
            ...budget,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date()
        };
        this.budgets.push(newBudget);
        return newBudget;
    }
    getBudgetsByUser(userId) {
        return this.budgets.filter(b => b.userId === userId);
    }
    // Goal methods
    createGoal(goal) {
        const newGoal = {
            ...goal,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date()
        };
        this.goals.push(newGoal);
        return newGoal;
    }
    getGoalsByUser(userId) {
        return this.goals.filter(g => g.userId === userId);
    }
    updateGoal(id, updates) {
        const goalIndex = this.goals.findIndex(g => g.id === id);
        if (goalIndex === -1)
            return null;
        this.goals[goalIndex] = { ...this.goals[goalIndex], ...updates };
        return this.goals[goalIndex];
    }
}
exports.db = new InMemoryDB();
const connectDB = async () => {
    console.log('Connected to in-memory database (MVP mode)');
    return Promise.resolve();
};
exports.connectDB = connectDB;
//# sourceMappingURL=database.js.map