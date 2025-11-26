import React from 'react';
import { useAppStore } from '../../store/appStore';
import { Card } from '../ui/Card';
import { Users, TestTube, DollarSign, Percent } from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { users, tests, entries } = useAppStore();

  const totalRevenue = entries.reduce((sum, entry) => sum + entry.totalAmount, 0);
  const totalCommission = entries.reduce((sum, entry) => sum + entry.commissionAmount, 0);

  const stats = [
    { 
      title: 'Total Users', 
      value: users.length, 
      icon: Users,
      color: 'bg-blue-500'
    },
    { 
      title: 'Active Tests', 
      value: tests.filter(t => t.status === 'active').length, 
      icon: TestTube,
      color: 'bg-green-500'
    },
    { 
      title: 'Total Revenue', 
      value: `₹${totalRevenue.toLocaleString()}`, 
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    { 
      title: 'Total Commission', 
      value: `₹${totalCommission.toLocaleString()}`, 
      icon: Percent,
      color: 'bg-orange-500'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${stat.color} bg-opacity-10 mr-4`}>
              <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
