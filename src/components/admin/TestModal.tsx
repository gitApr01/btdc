import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/appStore';
import { Test } from '../../types';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  test?: Test;
}

export const TestModal: React.FC<TestModalProps> = ({ isOpen, onClose, test }) => {
  const { addTest, updateTest } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    rate: 0,
    status: 'active' as const
  });

  useEffect(() => {
    if (test) {
      setFormData({
        name: test.name,
        rate: test.rate,
        status: test.status
      });
    } else {
      setFormData({
        name: '',
        rate: 0,
        status: 'active'
      });
    }
  }, [test, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (test) {
      updateTest(test.id, formData);
    } else {
      addTest(formData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={test ? 'Edit Test' : 'Add New Test'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Test Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Rate (₹)"
          type="number"
          min="0"
          value={formData.rate}
          onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
          required
        />
        <div className="flex justify-end space-x-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">{test ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  );
};
