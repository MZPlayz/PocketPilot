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
declare class InMemoryDB {
    private users;
    private transactions;
    private plaidItems;
    private budgets;
    private goals;
    createUser(user: Omit<User, 'id' | 'createdAt'>): User;
    findUserByEmail(email: string): User | undefined;
    findUserById(id: string): User | undefined;
    createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction;
    getTransactionsByUser(userId: string): Transaction[];
    createPlaidItem(item: Omit<PlaidItem, 'id' | 'createdAt'>): PlaidItem;
    getPlaidItemsByUser(userId: string): PlaidItem[];
    getPlaidItemByUserAndInstitution(userId: string, institutionId: string): PlaidItem | undefined;
    createBudget(budget: Omit<Budget, 'id' | 'createdAt'>): Budget;
    getBudgetsByUser(userId: string): Budget[];
    createGoal(goal: Omit<Goal, 'id' | 'createdAt'>): Goal;
    getGoalsByUser(userId: string): Goal[];
    updateGoal(id: string, updates: Partial<Goal>): Goal | null;
}
export declare const db: InMemoryDB;
export declare const connectDB: () => Promise<void>;
export {};
//# sourceMappingURL=database.d.ts.map