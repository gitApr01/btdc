import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/appStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CaseModal } from './CaseModal';
import { Search, Filter, Edit, Trash2 } from 'lucide-react';
import { PatientEntry } from '../../types';

export const CaseList: React.FC = () => {
  const { entries, tests, currentUser, deleteEntry } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PatientEntry | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reportFilter, setReportFilter] = useState('all');

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Role-based Access Control
      if (currentUser?.role !== 'admin' && entry.userId !== currentUser?.id) {
        return false;
      }

      // Search Filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        entry.patientName.toLowerCase().includes(searchLower) ||
        entry.mobileNumber.includes(searchLower) ||
        entry.testIds.some(id => tests.find(t => t.id === id)?.name.toLowerCase().includes(searchLower));

      // Date Filter
      const matchesDate = dateFilter ? entry.date === dateFilter : true;

      // Status Filter
      const matchesStatus = statusFilter === 'all' ? true : entry.status === statusFilter;

      // Report Filter
      const matchesReport = reportFilter === 'all' ? true : entry.deliveryStatus === reportFilter;

      return matchesSearch && matchesDate && matchesStatus && matchesReport;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date desc
  }, [entries, searchTerm, dateFilter, statusFilter, reportFilter, tests]);

  const getTestNames = (ids: string[]) => {
    return ids.map(id => tests.find(t => t.id === id)?.name).filter(Boolean).join(', ');
  };

  const handleEdit = (entry: PatientEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingEntry(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      deleteEntry(id);
    }
  };

  return (
    <Card title="Case Management" className="h-full">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Name, Mobile, or Test..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAdd}>Add New Case</Button>
        </div>

        <div className="flex space-x-4 items-center bg-gray-50 p-3 rounded-md">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
          
          <input
            type="date"
            className="border-gray-300 rounded-md text-sm p-1.5"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />

          <select
            className="border-gray-300 rounded-md text-sm p-1.5"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="due">Due</option>
          </select>

          <select
            className="border-gray-300 rounded-md text-sm p-1.5"
            value={reportFilter}
            onChange={(e) => setReportFilter(e.target.value)}
          >
            <option value="all">All Report Status</option>
            <option value="delivered">Delivered</option>
            <option value="partial">Partially Delivered</option>
            <option value="not_delivered">Not Delivered</option>
          </select>

          {(searchTerm || dateFilter || statusFilter !== 'all' || reportFilter !== 'all') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setDateFilter('');
                setStatusFilter('all');
                setReportFilter('all');
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                    <div className="text-sm text-gray-500">{entry.age} / {entry.sex}</div>
                    <div className="text-xs text-gray-400">{entry.mobileNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={getTestNames(entry.testIds)}>
                      {getTestNames(entry.testIds)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{entry.totalAmount}</div>
                    <div className="text-xs text-gray-500">Paid: ₹{entry.advanceAmount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      entry.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      entry.status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    } capitalize`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      entry.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' : 
                      entry.deliveryStatus === 'partial' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'
                    } capitalize`}>
                      {entry.deliveryStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleEdit(entry)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    {currentUser?.role === 'admin' && (
                      <button 
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                  No cases found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <CaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        entry={editingEntry}
      />
    </Card>
  );
};
