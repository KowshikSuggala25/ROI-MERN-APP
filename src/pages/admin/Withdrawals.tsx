import React, { useState } from 'react';
import { ArrowDownToLine, Check, X, Calendar } from 'lucide-react';
import { mockUsers } from '../../data/mockData';

interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  accountNumber: string;
  ifscCode: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

const mockWithdrawals: WithdrawalRequest[] = [
  {
    id: '1',
    userId: '2',
    amount: 5000,
    accountNumber: '1234567890',
    ifscCode: 'HDFC0001234',
    status: 'pending',
    createdAt: '2024-12-22T10:00:00Z',
    updatedAt: '2024-12-22T10:00:00Z'
  },
  {
    id: '2',
    userId: '3',
    amount: 10000,
    accountNumber: '9876543210',
    ifscCode: 'ICIC0001234',
    status: 'approved',
    createdAt: '2024-12-21T15:30:00Z',
    updatedAt: '2024-12-22T09:15:00Z'
  }
];

const AdminWithdrawals: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState(mockWithdrawals);

  const handleApproveWithdrawal = (withdrawalId: string) => {
    setWithdrawals(withdrawals.map(w => 
      w.id === withdrawalId 
        ? { ...w, status: 'approved' as const, updatedAt: new Date().toISOString() }
        : w
    ));
    alert('Withdrawal approved! Amount will be transferred to user\'s account.');
  };

  const handleRejectWithdrawal = (withdrawalId: string) => {
    setWithdrawals(withdrawals.map(w => 
      w.id === withdrawalId 
        ? { ...w, status: 'rejected' as const, updatedAt: new Date().toISOString() }
        : w
    ));
    alert('Withdrawal rejected.');
  };

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const processedWithdrawals = withdrawals.filter(w => w.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Withdrawal Management</h1>
        <div className="text-sm text-gray-500">
          Pending Requests: {pendingWithdrawals.length}
        </div>
      </div>

      {/* Weekend Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3">
        <Calendar className="h-5 w-5 text-yellow-600" />
        <div>
          <h3 className="text-yellow-800 font-medium">Business Hours</h3>
          <p className="text-yellow-700 text-sm">
            Withdrawals are only processed on weekdays (Monday to Friday).
          </p>
        </div>
      </div>

      {/* Pending Withdrawals */}
      {pendingWithdrawals.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ArrowDownToLine className="h-5 w-5 mr-2" />
              Pending Withdrawal Requests
            </h3>
          </div>
          
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Account Details</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Requested</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingWithdrawals.map((withdrawal) => {
                const user = mockUsers.find(u => u.id === withdrawal.userId);
                return (
                  <tr key={withdrawal.id} className="border-b border-gray-100">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <p className="text-xs text-gray-400">Balance: ₹{user?.walletBalance.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-lg">₹{withdrawal.amount.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <p className="font-mono">****{withdrawal.accountNumber.slice(-4)}</p>
                        <p className="text-gray-500">{withdrawal.ifscCode}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApproveWithdrawal(withdrawal.id)}
                          className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          <Check className="h-3 w-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectWithdrawal(withdrawal.id)}
                          className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          <X className="h-3 w-3" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Processed Withdrawals */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Withdrawal History</h3>
        </div>
        
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-6 font-medium text-gray-900">User</th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">Amount</th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">Account</th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {processedWithdrawals.map((withdrawal) => {
              const user = mockUsers.find(u => u.id === withdrawal.userId);
              return (
                <tr key={withdrawal.id} className="border-b border-gray-100">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium">₹{withdrawal.amount.toLocaleString()}</td>
                  <td className="py-4 px-6 font-mono text-sm">****{withdrawal.accountNumber.slice(-4)}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {new Date(withdrawal.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      withdrawal.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {withdrawal.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminWithdrawals;