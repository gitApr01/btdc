import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { UserModal } from './UserModal';
import { User } from '../../types';

export const UserList: React.FC = () => {
  const { users, deleteUser, toggleUserStatus } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(undefined);
    setIsModalOpen(true);
  };

  return (
    <Card title="User Management" className="h-full">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>Add New User</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  } capitalize`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.joinedDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(user)}>Edit</Button>
                  <Button 
                    size="sm" 
                    variant={user.status === 'active' ? 'danger' : 'primary'} 
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteUser(user.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={editingUser} 
      />
    </Card>
  );
};
