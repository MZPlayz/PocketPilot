import React from 'react';
import { MagicCard, MagicContainer } from 'magic-ui-react';

const DashboardPage = () => {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
      <p className="text-lg text-gray-400 mb-8">Welcome to your financial dashboard! Here you'll see an overview of your spending, budgets, and goals.</p>
      
      <MagicContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MagicCard className="p-6 bg-secondary-dark border border-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Spending Overview</h3>
            <p className="text-gray-400">A chart showing spending by category will go here.</p>
          </MagicCard>
          <MagicCard className="p-6 bg-secondary-dark border border-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Budget Progress</h3>
            <p className="text-gray-400">A summary of your budget vs. actual spending will go here.</p>
          </MagicCard>
        </div>
      </MagicContainer>
    </div>
  );
};

export default DashboardPage;
