import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { TestModal } from './TestModal';
import { Test } from '../../types';

export const TestList: React.FC = () => {
  const { tests, deleteTest, toggleTestStatus } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | undefined>(undefined);

  const handleEdit = (test: Test) => {
    setEditingTest(test);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTest(undefined);
    setIsModalOpen(true);
  };

  return (
    <Card title="Test Management" className="h-full">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>Add New Test</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate (₹)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tests.map((test) => (
              <tr key={test.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{test.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹{test.rate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    test.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  } capitalize`}>
                    {test.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(test)}>Edit</Button>
                  <Button 
                    size="sm" 
                    variant={test.status === 'active' ? 'danger' : 'primary'} 
                    onClick={() => toggleTestStatus(test.id)}
                  >
                    {test.status === 'active' ? 'Suspend' : 'Activate'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteTest(test.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        test={editingTest} 
      />
    </Card>
  );
};
