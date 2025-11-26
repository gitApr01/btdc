import React, { useState } from 'react';
import { CaseList } from '../components/admin/CaseList';
import { CommissionList } from '../components/admin/CommissionList';
import { useAppStore } from '../store/appStore';
import { Button } from '../components/ui/Button';
import { LogOut, FileText, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';

export const UserDashboard: React.FC = () => {
  const { currentUser, logout } = useAppStore();
  const [activeTab, setActiveTab] = useState<'cases' | 'commissions'>('cases');

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome, {currentUser?.name} ({currentUser?.role.replace('_', ' ')})</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('cases')}
              className={clsx(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center",
                activeTab === 'cases'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <FileText className="h-5 w-5 mr-2" />
              My Cases
            </button>
            <button
              onClick={() => setActiveTab('commissions')}
              className={clsx(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center",
                activeTab === 'commissions'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <DollarSign className="h-5 w-5 mr-2" />
              My Commissions
            </button>
          </nav>
        </div>

        {activeTab === 'cases' ? <CaseList /> : <CommissionList />}
      </div>
    </div>
  );
};
