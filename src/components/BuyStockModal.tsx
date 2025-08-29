import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { transactionService } from '../services/transactionService';

interface BuyStockModalProps {
  stock: any;
  isOpen: boolean;
  onClose: () => void;
}

const BuyStockModal: React.FC<BuyStockModalProps> = ({ stock, isOpen, onClose }) => {
  const { user, updateWalletBalance } = useAuth();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !stock) return null;

  const shares = amount ? parseFloat(amount) / stock.price : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await transactionService.buyStock({
        stockId: stock._id || stock.id,
        amount: parseFloat(amount)
      });

      updateWalletBalance(-parseFloat(amount));
      alert('Stock purchased successfully!');
      onClose();
      setAmount('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to purchase stock');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Buy Stock</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900">{stock.name}</h4>
          <p className="text-sm text-blue-700">
            Current Price: ₹{stock.price?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-blue-700">
            Expected ROI: {stock.roiPercentage >= 0 ? '+' : ''}{stock.roiPercentage}%
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max={user?.walletBalance || 0}
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount to invest"
            />
          </div>

          {amount && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                You will receive: <span className="font-medium">{shares.toFixed(4)} shares</span>
              </p>
              <p className="text-sm text-gray-600">
                Available balance: ₹{user?.walletBalance?.toLocaleString() || 0}
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !amount || parseFloat(amount) > (user?.walletBalance || 0)}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <DollarSign className="h-4 w-4" />
              <span>{isLoading ? 'Buying...' : 'Buy Stock'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyStockModal;