import React, { useState } from 'react';
import { ArrowDownToLine, Calendar, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Withdraw: React.FC = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isWeekend) return;

    setIsSubmitting(true);
    // Mock submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Withdrawal request submitted successfully!');
    setAmount('');
    setAccountNumber('');
    setIfscCode('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Withdraw Funds</h1>
        <div className="text-sm text-gray-500">
          Available Balance: ₹{user?.walletBalance?.toLocaleString() || 0}
        </div>
      </div>

      {isWeekend && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <div>
            <h3 className="text-red-800 font-medium">Weekend Restriction</h3>
            <p className="text-red-600 text-sm">
              Withdrawals are only allowed on weekdays (Monday to Friday).
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Withdrawal Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ArrowDownToLine className="h-5 w-5 mr-2" />
            Request Withdrawal
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Withdrawal Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={user?.walletBalance || 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter withdrawal amount"
                disabled={isWeekend}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter account number"
                disabled={isWeekend}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter IFSC code"
                disabled={isWeekend}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isWeekend || !amount || !accountNumber || !ifscCode}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
            </button>
          </form>
        </div>

        {/* Withdrawal Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Withdrawal Guidelines
          </h3>

          <div className="space-y-4 text-sm text-gray-600">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Withdrawals are processed only on weekdays</li>
                <li>• Minimum withdrawal amount: ₹1,000</li>
                <li>• Processing time: 1-3 business days</li>
                <li>• No charges for withdrawals above ₹5,000</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Business Hours:</h4>
              <ul className="space-y-1">
                <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
                <li>Saturday - Sunday: Closed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Withdrawal Requests */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Withdrawal Requests</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Account</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock withdrawal history */}
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">2024-12-20</td>
                <td className="py-3 px-4">₹5,000</td>
                <td className="py-3 px-4">****1234</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    Processing
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">2024-12-18</td>
                <td className="py-3 px-4">₹10,000</td>
                <td className="py-3 px-4">****1234</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;