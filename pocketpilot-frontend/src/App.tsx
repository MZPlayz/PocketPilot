import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import GoalsPage from './pages/GoalsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-primary-dark text-white flex">
        <nav className="w-64 bg-secondary-dark p-5">
          <h1 className="text-2xl font-bold mb-10">PocketPilot</h1>
          <ul>
            <li className="mb-4"><NavLink to="/" end className={({ isActive }) => isActive ? "text-accent-green" : "hover:text-accent-green"}>Dashboard</NavLink></li>
            <li className="mb-4"><NavLink to="/transactions" className={({ isActive }) => isActive ? "text-accent-green" : "hover:text-accent-green"}>Transactions</NavLink></li>
            <li className="mb-4"><NavLink to="/budgets" className={({ isActive }) => isActive ? "text-accent-green" : "hover:text-accent-green"}>Budgets</NavLink></li>
            <li className="mb-4"><NavLink to="/goals" className={({ isActive }) => isActive ? "text-accent-green" : "hover:text-accent-green"}>Goals</NavLink></li>
            <li className="mb-4"><NavLink to="/login" className={({ isActive }) => isActive ? "text-accent-green" : "hover:text-accent-green"}>Login</NavLink></li>
            <li className="mb-4"><NavLink to="/register" className={({ isActive }) => isActive ? "text-accent-green" : "hover:text-accent-green"}>Register</NavLink></li>
          </ul>
        </nav>

        <main className="flex-1 p-10">
          <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
