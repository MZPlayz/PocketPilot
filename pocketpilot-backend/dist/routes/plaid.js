"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const plaid_1 = require("plaid");
const auth_1 = require("../middleware/auth");
const database_1 = require("../config/database");
const router = express_1.default.Router();
// Initialize Plaid client
const configuration = new plaid_1.Configuration({
    basePath: plaid_1.PlaidEnvironments.sandbox, // Use sandbox for development
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});
const plaidClient = new plaid_1.PlaidApi(configuration);
// Create link token
router.post('/create_link_token', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const response = await plaidClient.linkTokenCreate({
            user: {
                client_user_id: userId,
            },
            client_name: 'PocketPilot',
            products: [plaid_1.Products.Transactions],
            country_codes: [plaid_1.CountryCode.Us],
            language: 'en',
        });
        res.json({ link_token: response.data.link_token });
    }
    catch (error) {
        console.error('Error creating link token:', error);
        res.status(500).json({ error: 'Failed to create link token' });
    }
});
// Exchange public token for access token
router.post('/exchange_public_token', auth_1.authenticateToken, async (req, res) => {
    try {
        const { public_token, institution_id, institution_name } = req.body;
        const userId = req.user?.id;
        if (!public_token || !institution_id || !institution_name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const response = await plaidClient.itemPublicTokenExchange({
            public_token,
        });
        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;
        // Store the Plaid item
        const plaidItem = database_1.db.createPlaidItem({
            userId: userId,
            accessToken,
            itemId,
            institutionId: institution_id,
            institutionName: institution_name,
        });
        res.json({
            message: 'Account linked successfully',
            item: plaidItem,
        });
    }
    catch (error) {
        console.error('Error exchanging public token:', error);
        res.status(500).json({ error: 'Failed to link account' });
    }
});
// Get accounts
router.get('/accounts', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const plaidItems = database_1.db.getPlaidItemsByUser(userId);
        if (plaidItems.length === 0) {
            return res.json({ accounts: [] });
        }
        const allAccounts = [];
        for (const item of plaidItems) {
            const response = await plaidClient.accountsGet({
                access_token: item.accessToken,
            });
            const accounts = response.data.accounts.map(account => ({
                ...account,
                institutionName: item.institutionName,
                itemId: item.itemId,
            }));
            allAccounts.push(...accounts);
        }
        res.json({ accounts: allAccounts });
    }
    catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
});
// Sync transactions
router.post('/sync_transactions', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const plaidItems = database_1.db.getPlaidItemsByUser(userId);
        if (plaidItems.length === 0) {
            return res.json({ message: 'No linked accounts found' });
        }
        let totalTransactions = 0;
        for (const item of plaidItems) {
            const response = await plaidClient.transactionsGet({
                access_token: item.accessToken,
                start_date: '2024-01-01',
                end_date: new Date().toISOString().split('T')[0],
                options: {
                    count: 500,
                },
            });
            const transactions = response.data.transactions;
            // Store transactions in database
            for (const transaction of transactions) {
                // Check if transaction already exists
                const existingTransaction = database_1.db.getTransactionsByUser(userId)
                    .find(t => t.plaidTransactionId === transaction.transaction_id);
                if (!existingTransaction) {
                    database_1.db.createTransaction({
                        userId: userId,
                        plaidTransactionId: transaction.transaction_id,
                        accountId: transaction.account_id,
                        amount: transaction.amount,
                        date: transaction.date,
                        name: transaction.name,
                        category: transaction.category?.[0] || 'Other',
                        merchantName: transaction.merchant_name || undefined,
                    });
                    totalTransactions++;
                }
            }
        }
        res.json({
            message: `Synced ${totalTransactions} new transactions`,
            totalTransactions
        });
    }
    catch (error) {
        console.error('Error syncing transactions:', error);
        res.status(500).json({ error: 'Failed to sync transactions' });
    }
});
exports.default = router;
//# sourceMappingURL=plaid.js.map