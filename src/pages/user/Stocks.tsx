import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Shield } from 'lucide-react';
import { stockService } from '../../services/stockService';
import BuyStockModal from '../../components/BuyStockModal';

const Stocks: React.FC = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await stockService.getAllStocks({ active: true });
      setStocks(response.stocks || []);
    } catch (error) {
      console.error('Failed to fetch stocks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStocks = stocks.filter((stock: any) => {
    if (filter === 'all') return true;
    return stock.category === filter;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBuyStock = (stock: any) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Available Stocks</h1>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="energy">Energy</option>
            <option value="consumer">Consumer</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStocks.map((stock: any) => (
          <div
            key={stock._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
            onClick={() => handleBuyStock(stock)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{stock.name}</h3>
                  <p className="text-sm text-gray-500 uppercase">{stock.symbol}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {stock.roiPercentage >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    stock.roiPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.roiPercentage >= 0 ? '+' : ''}{stock.roiPercentage}%
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Price</span>
                  <span className="font-medium text-gray-900">₹{stock.price.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Expected ROI</span>
                  <span className={`font-medium ${
                    stock.roiPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.roiPercentage}% per year
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Min Investment</span>
                  <span className="text-sm text-gray-500">₹{stock.minInvestment?.toLocaleString() || '1,000'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Risk Level</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(stock.riskLevel)}`}>
                    {stock.riskLevel}
                  </span>
                </div>

                {stock.description && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600 line-clamp-2">{stock.description}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <button
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyStock(stock);
                    }}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Invest Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStocks.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stocks available</h3>
          <p className="text-gray-600">
            {filter === 'all' ? 'No stocks are currently available for investment.' : `No stocks found in the ${filter} category.`}
          </p>
        </div>
      )}

      <BuyStockModal
        stock={selectedStock}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Stocks;