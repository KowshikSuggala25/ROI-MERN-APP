import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Wallet } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">ROI Investment App</h1>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Wallet className="h-4 w-4" />
            <span className="font-medium">Balance: ₹{user?.walletBalance?.toLocaleString() || 0}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{user?.name}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {user?.role}
            </span>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;