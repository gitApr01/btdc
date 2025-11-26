import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/appStore';
import { PatientEntry } from '../../types';

interface CommissionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: PatientEntry;
}

export const CommissionPaymentModal: React.FC<CommissionPaymentModalProps> = ({ isOpen, onClose, entry }) => {
  const { updateEntry } = useAppStore();
  const [amountToPay, setAmountToPay] = useState(0);
  const [commissionAmount, setCommissionAmount] = useState(entry.commissionAmount);

  useEffect(() => {
    setCommissionAmount(entry.commissionAmount);
    setAmountToPay(entry.commissionAmount - entry.commissionPaid);
  }, [entry, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPaid = entry.commissionPaid + amountToPay;
    const newStatus = newPaid >= commissionAmount ? 'paid' : newPaid > 0 ? 'partial' : 'unpaid';

    updateEntry(entry.id, {
      commissionAmount: commissionAmount,
      commissionPaid: newPaid,
      commissionStatus: newStatus
    });
    onClose();
  };

  const dueAmount = commissionAmount - entry.commissionPaid;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pay Commission">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Total Commission:</span>
            <span className="font-medium">₹{commissionAmount}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Already Paid:</span>
            <span className="font-medium text-green-600">₹{entry.commissionPaid}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="text-sm font-medium">Due Amount:</span>
            <span className="font-bold text-red-600">₹{dueAmount}</span>
          </div>
        </div>

        <Input
          label="Edit Total Commission (Optional)"
          type="number"
          value={commissionAmount}
          onChange={(e) => setCommissionAmount(Number(e.target.value))}
        />

        <Input
          label="Amount to Pay Now"
          type="number"
          max={commissionAmount - entry.commissionPaid}
          value={amountToPay}
          onChange={(e) => setAmountToPay(Number(e.target.value))}
          required
        />

        <div className="flex justify-end space-x-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Confirm Payment</Button>
        </div>
      </form>
    </Modal>
  );
};
