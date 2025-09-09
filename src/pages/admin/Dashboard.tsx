import React from "react";
import { Users, TrendingUp, DollarSign, CreditCard } from "lucide-react";
import StatsCard from "../../components/StatsCard";
import {
  mockUsers,
  mockStocks,
  mockTransactions,
  mockPayments,
} from "../../data/mockData";

// Explicitly type mock data arrays
const typedMockTransactions: Transaction[] = mockTransactions as Transaction[];
const typedMockStocks: Stock[] = mockStocks as Stock[];
const typedMockPayments: Payment[] = mockPayments as Payment[];

type User = {
  id: string | number;
  name: string;
  email: string;
  walletBalance: number;
  kycStatus: "approved" | "pending" | "rejected";
  role: string;
};
const typedMockUsers: User[] = mockUsers as User[];

// Define the Transaction type
type Transaction = {
  id: string | number;
  userId: string | number;
  stockId: string | number;
  type: "buy" | "sell";
  amount: number;
  status: "pending" | "completed" | "failed";
  // add other fields as needed
};

type Stock = {
  id: string | number;
  name: string;
  // add other fields as needed
};

type Payment = {
  id: string | number;
  status: "pending" | "completed" | "failed";
  // add other fields as needed
};

const totalUsers = (mockUsers as User[]).filter(
  (u) => u.role === "user"
).length;
const totalStocks = typedMockStocks.length;
const pendingTransactions = typedMockTransactions.filter(
  (t) => t.status === "pending"
).length;
const pendingPayments = typedMockPayments.filter(
  (p) => p.status === "pending"
).length;

const totalInvestment = typedMockTransactions
  .filter((t) => t.type === "buy" && t.status === "completed")
  .reduce((sum, t) => sum + t.amount, 0);

const recentTransactions = typedMockTransactions.slice(0, 10);

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={totalUsers.toString()}
          icon={<Users className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="Total Stocks"
          value={totalStocks.toString()}
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
        />
        <StatsCard
          title="Pending Transactions"
          value={pendingTransactions.toString()}
          icon={<DollarSign className="h-6 w-6" />}
          color="orange"
        />
        <StatsCard
          title="Pending Payments"
          value={pendingPayments.toString()}
          icon={<CreditCard className="h-6 w-6" />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const user = typedMockUsers.find(
                (u) => u.id === transaction.userId
              );
              const stock = typedMockStocks.find(
                (s) => s.id === transaction.stockId
              );
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{stock?.name}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        transaction.type === "buy"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {transaction.type === "buy" ? "-" : "+"}₹
                      {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.type}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Overview
          </h3>
          <div className="space-y-4">
            {typedMockUsers
              .filter((u) => u.role === "user")
              .slice(0, 5)
              .map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ₹{user.walletBalance.toLocaleString()}
                    </p>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.kycStatus === "approved"
                          ? "bg-green-100 text-green-800"
                          : user.kycStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      KYC: {user.kycStatus}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
