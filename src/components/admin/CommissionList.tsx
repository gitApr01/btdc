import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/appStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CommissionPaymentModal } from './CommissionPaymentModal';
import { Filter, DollarSign } from 'lucide-react';
import { PatientEntry } from '../../types';

export const CommissionList: React.FC = () => {
  const { entries, users, currentUser } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PatientEntry | null>(null);
  const [dateFilter, setDateFilter] = useState('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [userFilter, setUserFilter] = useState('all');

  const filteredEntries = useMemo(() => {
    const now = new Date();
    return entries.filter((entry) => {
      // Role-based Access Control
      if (currentUser?.role !== 'admin' && entry.userId !== currentUser?.id) {
        return false;
      }

      const entryDate = new Date(entry.date);
      
      // Date Filter
      let matchesDate = true;
      if (dateFilter === 'today') {
        matchesDate = entry.date === now.toISOString().split('T')[0];
      } else if (dateFilter === 'this_week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = entryDate >= weekAgo;
      } else if (dateFilter === 'this_month') {
        matchesDate = entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
      } else if (dateFilter === 'custom' && customStartDate && customEndDate) {
        matchesDate = entryDate >= new Date(customStartDate) && entryDate <= new Date(customEndDate);
      }

      // User Filter
      let matchesUser = true;
      if (userFilter !== 'all') {
        matchesUser = entry.collectedByName === userFilter;
      }

      return matchesDate && matchesUser;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries, dateFilter, customStartDate, customEndDate, userFilter]);

  const totalCommission = filteredEntries.reduce((sum, e) => sum + e.commissionAmount, 0);
  const totalPaid = filteredEntries.reduce((sum, e) => sum + e.commissionPaid, 0);
  const totalDue = totalCommission - totalPaid;

  const handlePay = (entry: PatientEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleUserMarkPaid = (entry: PatientEntry) => {
    if (window.confirm('Mark this commission as paid?')) {
      // Assuming full payment for simplicity in this action
      const amountToPay = entry.commissionAmount - entry.commissionPaid;
      useAppStore.getState().markCommissionPaid(entry.id, amountToPay, 'user');
    }
  };

  const handleWriteOff = (entry: PatientEntry) => {
    const amount = entry.dueAmount;
    if (window.confirm(`Write off due amount of ₹${amount}? This will mark the case as paid.`)) {
      useAppStore.getState().writeOffDue(entry.id, amount);
    }
  };

  // Get unique list of users who have collected payments
  const collectors = useMemo(() => {
    const collectorNames = new Set(entries.map(e => e.collectedByName).filter(Boolean));
    return Array.from(collectorNames);
  }, [entries]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Total Commission</p>
              <p className="text-2xl font-bold text-blue-900">₹{totalCommission.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-green-50 border-green-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">Commission Paid</p>
              <p className="text-2xl font-bold text-green-900">₹{totalPaid.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-600">Commission Due</p>
              <p className="text-2xl font-bold text-red-900">₹{totalDue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Commission Management" className="h-full">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex space-x-4 items-center bg-gray-50 p-3 rounded-md flex-wrap gap-y-2">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              className="border-gray-300 rounded-md text-sm p-1.5"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="this_week">Last 7 Days</option>
              <option value="this_month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateFilter === 'custom' && (
              <>
                <input
                  type="date"
                  className="border-gray-300 rounded-md text-sm p-1.5"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  className="border-gray-300 rounded-md text-sm p-1.5"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </>
            )}

            {currentUser?.role === 'admin' && (
              <select
                className="border-gray-300 rounded-md text-sm p-1.5"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              >
                <option value="all">All Users</option>
                {collectors.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission (40%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entry.patientName}</div>
                      <div className="text-xs text-gray-500">By: {entry.collectedByName}</div>
                      {entry.notes && <div className="text-xs text-orange-600 italic">{entry.notes}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{entry.totalAmount}
                      {entry.writeOffAmount ? <span className="text-xs text-gray-500 block">(-₹{entry.writeOffAmount} off)</span> : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      ₹{entry.commissionAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      ₹{entry.commissionPaid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                      ₹{entry.commissionAmount - entry.commissionPaid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entry.commissionStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                        entry.commissionStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      } capitalize`}>
                        {entry.commissionStatus === 'paid' ? (
                          entry.commissionPaidBy === 'user' ? 'Paid (User)' : 
                          entry.commissionPaidBy === 'admin' ? 'Paid (Admin)' : 'Paid'
                        ) : (entry.commissionStatus || 'unpaid')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {(entry.commissionAmount - entry.commissionPaid) > 0 && (
                        <>
                          {currentUser?.role === 'admin' ? (
                            <>
                              <Button size="sm" onClick={() => handlePay(entry)}>
                                Pay
                              </Button>
                              {entry.dueAmount > 0 && (
                                <Button size="sm" variant="secondary" onClick={() => handleWriteOff(entry)} className="text-xs">
                                  Write Off
                                </Button>
                              )}
                            </>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => handleUserMarkPaid(entry)}>
                              Mark Paid
                            </Button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                    No records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {selectedEntry && (
          <CommissionPaymentModal 
            isOpen={isModalOpen} 
            onClose={() => {
              setIsModalOpen(false);
              setSelectedEntry(null);
            }} 
            entry={selectedEntry}
          />
        )}
      </Card>
    </div>
  );
};
