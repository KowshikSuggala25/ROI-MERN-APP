import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  change?: string;
}

const colorMap = {
  blue: 'bg-blue-600',
  green: 'bg-green-600', 
  purple: 'bg-purple-600',
  orange: 'bg-orange-600',
  red: 'bg-red-600'
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, change }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm font-medium mt-1 ${
              change.includes('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorMap[color]} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;