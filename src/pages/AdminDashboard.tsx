import React, { useState } from 'react';
import { UserList } from '../components/admin/UserList';
import { TestList } from '../components/admin/TestList';
import { CaseList } from '../components/admin/CaseList';
import { CommissionList } from '../components/admin/CommissionList';
import { SummaryCards } from '../components/admin/SummaryCards';
import { clsx } from 'clsx';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/appStore';
import { LogOut } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAppStore();
  const [activeTab, setActiveTab] = useState<'users' | 'tests' | 'cases' | 'commissions'>('users');
  const [dateFilter, setDateFilter] = useState('this_month');
  const [userFilter, setUserFilter] = useState('all');

  const handleLogout = () => {
    logout();
    // Navigation handled by App.tsx based on state change
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome, {currentUser?.name}</p>
          </div>
          <div className="flex space-x-4 items-center">
            <select 
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="this_month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
            <select 
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="technicians">Technicians</option>
              <option value="agents">Collection Agents</option>
            </select>
            <Button variant="outline">Export Report</Button>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <SummaryCards />

        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('users')}
              className={clsx(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                activeTab === 'users'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Manage Users
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={clsx(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                activeTab === 'tests'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Manage Tests
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={clsx(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                activeTab === 'cases'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Manage Cases
            </button>
            <button
              onClick={() => setActiveTab('commissions')}
              className={clsx(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                activeTab === 'commissions'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Commissions
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'users' ? <UserList /> : 
           activeTab === 'tests' ? <TestList /> : 
           activeTab === 'cases' ? <CaseList /> :
           <CommissionList />}
        </div>
      </div>
    </div>
  );
};
