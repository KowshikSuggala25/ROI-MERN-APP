import React, { useState } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { mockStocks } from '../../data/mockData';
import AddStockModal from '../../components/AddStockModal';

const AdminStocks: React.FC = () => {
  const [stocks, setStocks] = useState(mockStocks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<any>(null);

  const handleAddStock = (stockData: any) => {
    const newStock = {
      ...stockData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setStocks([...stocks, newStock]);
    setIsModalOpen(false);
  };

  const handleEditStock = (stock: any) => {
    setEditingStock(stock);
    setIsModalOpen(true);
  };

  const handleUpdateStock = (stockData: any) => {
    setStocks(stocks.map(s => 
      s.id === editingStock.id 
        ? { ...editingStock, ...stockData, updatedAt: new Date().toISOString() }
        : s
    ));
    setEditingStock(null);
    setIsModalOpen(false);
  };

  const handleDeleteStock = (stockId: string) => {
    if (window.confirm('Are you sure you want to delete this stock?')) {
      setStocks(stocks.filter(s => s.id !== stockId));
    }
  };

  const toggleStockStatus = (stockId: string) => {
    setStocks(stocks.map(s => 
      s.id === stockId 
        ? { ...s, active: !s.active, updatedAt: new Date().toISOString() }
        : s
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Stocks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Stock</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-6 font-medium text-gray-900">Stock Name</th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">Price (₹)</th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">ROI %</th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">Last Updated</th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.id} className="border-b border-gray-100">
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-gray-900">{stock.name}</p>
                    <p className="text-sm text-gray-500">{stock.symbol}</p>
                  </div>
                </td>
                <td className="py-4 px-6">₹{stock.price.toLocaleString()}</td>
                <td className="py-4 px-6">
                  <span className={`font-medium ${
                    stock.roiPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.roiPercentage >= 0 ? '+' : ''}{stock.roiPercentage}%
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => toggleStockStatus(stock.id)}
                    className="flex items-center space-x-1"
                  >
                    {stock.active ? (
                      <>
                        <ToggleRight className="h-5 w-5 text-green-600" />
                        <span className="text-green-600 text-sm">Active</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-5 w-5 text-red-600" />
                        <span className="text-red-600 text-sm">Inactive</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {new Date(stock.updatedAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditStock(stock)}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStock(stock.id)}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddStockModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStock(null);
        }}
        onSubmit={editingStock ? handleUpdateStock : handleAddStock}
        initialData={editingStock}
        isEditing={!!editingStock}
      />
    </div>
  );
};

export default AdminStocks;