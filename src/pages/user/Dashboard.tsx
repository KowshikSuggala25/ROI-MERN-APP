import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TrendingUp, Wallet, PieChart, ArrowUpRight } from 'lucide-react';
import StatsCard from '../../components/StatsCard';
import { transactionService } from '../../services/transactionService';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [holdingsResponse, transactionsResponse] = await Promise.all([
        transactionService.getUserHoldings(),
        transactionService.getUserTransactions({ limit: 5 })
      ]);
      
      setHoldings(holdingsResponse.holdings || []);
      setTransactions(transactionsResponse.transactions || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate portfolio statistics
  const totalInvested = holdings.reduce((sum: number, holding: any) => sum + holding.totalInvested, 0);
  const currentValue = holdings.reduce((sum: number, holding: any) => sum + holding.currentValue, 0);
  const totalProfit = currentValue - totalInvested;
  const profitPercentage = totalInvested > 0 ? ((totalProfit / totalInvested) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, {user?.name}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Wallet Balance"
          value={`₹${user?.walletBalance?.toLocaleString() || 0}`}
          icon={<Wallet className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="Total Invested"
          value={`₹${totalInvested.toLocaleString()}`}
          icon={<PieChart className="h-6 w-6" />}
          color="purple"
        />
        <StatsCard
          title="Current Value"
          value={`₹${currentValue.toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
        />
        <StatsCard
          title="Total Profit"
          value={`₹${totalProfit.toLocaleString()}`}
          change={`${profitPercentage >= 0 ? '+' : ''}${profitPercentage.toFixed(2)}%`}
          icon={<ArrowUpRight className="h-6 w-6" />}
          color={totalProfit >= 0 ? "green" : "red"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Holdings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Portfolio</h3>
          <div className="space-y-4">
            {holdings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No investments yet. Start investing in stocks!</p>
            ) : (
              holdings.slice(0, 5).map((holding: any) => (
                <div key={holding.stock._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{holding.stock.name}</h4>
                    <p className="text-sm text-gray-500">{holding.totalShares.toFixed(4)} shares</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{holding.currentValue.toLocaleString()}</p>
                    <p className={`text-sm ${holding.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {holding.profit >= 0 ? '+' : ''}₹{holding.profit.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No transactions yet.</p>
            ) : (
              transactions.map((transaction: any) => (
                <div key={transaction._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{transaction.stockId?.name}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()} • {transaction.shares.toFixed(4)} shares
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.type === 'buy' ? 'text-red-600' : 'text-green-600'}`}>
                      {transaction.type === 'buy' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                    </p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;