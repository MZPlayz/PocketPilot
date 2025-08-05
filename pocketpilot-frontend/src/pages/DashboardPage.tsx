import React from 'react';

const DashboardPage = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to your financial dashboard! Here you'll see an overview of your spending, budgets, and goals.</p>
      {/* Placeholder for charts and summaries */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
        <div style={{ border: '1px solid #444', padding: '1rem', width: '45%' }}>
          <h3>Spending Overview</h3>
          <p>A chart showing spending by category will go here.</p>
        </div>
        <div style={{ border: '1px solid #444', padding: '1rem', width: '45%' }}>
          <h3>Budget Progress</h3>
          <p>A summary of your budget vs. actual spending will go here.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
