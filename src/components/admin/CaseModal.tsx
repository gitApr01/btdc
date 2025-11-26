import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/appStore';
import { PatientEntry } from '../../types';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry?: PatientEntry;
}

export const CaseModal: React.FC<CaseModalProps> = ({ isOpen, onClose, entry }) => {
  const { tests, currentUser, users, addEntry, updateEntry } = useAppStore();
  const [formData, setFormData] = useState({
    patientName: '',
    age: '' as unknown as number,
    sex: 'male' as 'male' | 'female' | 'other',
    mobileNumber: '',
    testIds: [] as string[],
    totalAmount: 0,
    advanceAmount: 0,
    collectedByName: currentUser?.name || '',
    userId: currentUser?.id || '',
    testedByName: '',
    deliveryStatus: 'not_delivered' as 'delivered' | 'partial' | 'not_delivered',
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        patientName: entry.patientName,
        age: entry.age,
        sex: entry.sex,
        mobileNumber: entry.mobileNumber,
        testIds: entry.testIds,
        totalAmount: entry.totalAmount,
        advanceAmount: entry.advanceAmount,
        collectedByName: entry.collectedByName,
        userId: entry.userId,
        testedByName: entry.testedByName,
        deliveryStatus: entry.deliveryStatus,
      });
    } else {
      setFormData({
        patientName: '',
        age: '' as unknown as number,
        sex: 'male',
        mobileNumber: '',
        testIds: [],
        totalAmount: 0,
        advanceAmount: 0,
        collectedByName: currentUser?.name || '',
        userId: currentUser?.id || '',
        testedByName: '',
        deliveryStatus: 'not_delivered',
      });
    }
  }, [entry, isOpen, currentUser]);

  // Auto-calculate total amount when tests change, only if adding new case or if user wants to recalculate
  // For editing, we might want to keep the existing total unless tests change
  useEffect(() => {
    if (!entry) {
      const calculatedTotal = formData.testIds.reduce((sum, testId) => {
        const test = tests.find((t) => t.id === testId);
        return sum + (test ? test.rate : 0);
      }, 0);
      setFormData((prev) => ({ ...prev, totalAmount: calculatedTotal }));
    }
  }, [formData.testIds, tests, entry]);

  const handleTestToggle = (testId: string) => {
    setFormData((prev) => {
      const newTestIds = prev.testIds.includes(testId)
        ? prev.testIds.filter((id) => id !== testId)
        : [...prev.testIds, testId];
      return { ...prev, testIds: newTestIds };
    });
  };

  const handleCollectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = e.target.value;
    const selectedUser = users.find(u => u.id === selectedUserId);
    if (selectedUser) {
      setFormData(prev => ({
        ...prev,
        userId: selectedUser.id,
        collectedByName: selectedUser.name || selectedUser.username
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dueAmount = formData.totalAmount - formData.advanceAmount;
    const status = dueAmount <= 0 ? 'paid' : formData.advanceAmount > 0 ? 'partial' : 'due';
    // Commission is 40% of Advance Paid (Amount Paid so far)
    const commissionAmount = formData.advanceAmount * 0.40;

    if (entry) {
      updateEntry(entry.id, {
        ...formData,
        age: Number(formData.age),
        totalAmount: Number(formData.totalAmount),
        advanceAmount: Number(formData.advanceAmount),
        dueAmount,
        commissionAmount,
        status,
      });
    } else {
      const newEntry: Omit<PatientEntry, 'id'> = {
        patientName: formData.patientName,
        age: Number(formData.age),
        sex: formData.sex,
        mobileNumber: formData.mobileNumber,
        testIds: formData.testIds,
        totalAmount: Number(formData.totalAmount),
        advanceAmount: Number(formData.advanceAmount),
        dueAmount: dueAmount,
        commissionAmount: commissionAmount,
        commissionPaid: 0,
        commissionStatus: 'unpaid',
        status: status,
        deliveryStatus: formData.deliveryStatus,
        date: new Date().toISOString().split('T')[0],
        userId: formData.userId || currentUser?.id || 'unknown',
        collectedByName: formData.collectedByName,
        testedByName: formData.testedByName,
      };
      addEntry(newEntry);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={entry ? "Edit Case" : "Add New Case"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Patient Name"
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            required
          />
          <Input
            label="Mobile Number (Optional)"
            value={formData.mobileNumber}
            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Age (Optional)"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sex (Optional)</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={formData.sex}
              onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Tests (Optional)</label>
          <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
            {tests.filter(t => t.status === 'active').map((test) => (
              <div key={test.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`test-${test.id}`}
                  checked={formData.testIds.includes(test.id)}
                  onChange={() => handleTestToggle(test.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`test-${test.id}`} className="ml-2 block text-sm text-gray-900">
                  {test.name} (₹{test.rate})
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Total Amount (₹) (Optional)"
            type="number"
            value={formData.totalAmount}
            onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
          />
          <Input
            label="Amount Paid (₹) (Optional)"
            type="number"
            value={formData.advanceAmount}
            onChange={(e) => setFormData({ ...formData, advanceAmount: Number(e.target.value) })}
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {currentUser?.role === 'admin' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collected By</label>
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                value={formData.userId}
                onChange={handleCollectorChange}
              >
                {users
                  .filter(u => u.status === 'active' && (u.role === 'technician' || u.role === 'collection_agent' || u.role === 'admin'))
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.username} ({user.role})
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <Input
              label="Collected By (Optional)"
              value={formData.collectedByName}
              onChange={(e) => setFormData({ ...formData, collectedByName: e.target.value })}
              readOnly
              className="bg-gray-100"
            />
          )}
          <Input
            label="Tested By (Optional)"
            value={formData.testedByName}
            onChange={(e) => setFormData({ ...formData, testedByName: e.target.value })}
          />
        </div>

        {entry && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Delivery Status</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={formData.deliveryStatus}
              onChange={(e) => setFormData({ ...formData, deliveryStatus: e.target.value as any })}
            >
              <option value="not_delivered">Not Delivered</option>
              <option value="partial">Partially Delivered</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">{entry ? "Update Case" : "Save Case"}</Button>
        </div>
      </form>
    </Modal>
  );
};
