import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  CreditCard, 
  ArrowDownToLine,
  Users,
  Settings,
  FileText
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const userMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/stocks', label: 'Stocks', icon: TrendingUp },
    { path: '/payments', label: 'Payments', icon: CreditCard },
    { path: '/withdraw', label: 'Withdraw', icon: ArrowDownToLine },
  ];

  const adminMenuItems = [
    { path: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
    { path: '/admin/stocks', label: 'Manage Stocks', icon: TrendingUp },
    { path: '/admin/users', label: 'Manage Users', icon: Users },
    { path: '/admin/payments', label: 'Payment Requests', icon: CreditCard },
    { path: '/admin/withdrawals', label: 'Withdrawals', icon: ArrowDownToLine },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className="fixed left-0 top-16 h-screen w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;