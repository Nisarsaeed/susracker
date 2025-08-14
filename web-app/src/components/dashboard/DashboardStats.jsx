import React from 'react';
import { FiUsers, FiCamera, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const DashboardStats = () => {
  const stats = [
    {
      id: 1,
      title: 'Total Criminals',
      value: '2 ',
      icon: <FiUsers className="h-6 w-6 text-blue-500" />,
      change: '+12%',
      changeType: 'increase',
      period: 'from last month'
    },
    {
      id: 2,
      title: 'Active Cameras',
      value: '2',
      icon: <FiCamera className="h-6 w-6 text-green-500" />,
      change: '1',
      changeType: 'increase',
      period: 'new this week'
    },
    {
      id: 3,
      title: 'Alerts Today',
      value: '17',
      icon: <FiAlertCircle className="h-6 w-6 text-red-500" />,
      change: '5',
      changeType: 'increase',
      period: 'from yesterday'
    },
    {
      id: 4,
      title: 'Identifications',
      value: '245',
      icon: <FiCheckCircle className="h-6 w-6 text-purple-500" />,
      change: '87%',
      changeType: 'neutral',
      period: 'accuracy rate'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div 
          key={stat.id} 
          className="bg-white rounded-lg shadow-md p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <div className="p-2 rounded-full bg-gray-100">
              {stat.icon}
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className={`mr-1 ${
              stat.changeType === 'increase' ? 'text-green-500' : 
              stat.changeType === 'decrease' ? 'text-red-500' : 
              'text-gray-500'
            }`}>
              {stat.change}
            </span>
            <span className="text-gray-500">{stat.period}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;