import { User, Test, PatientEntry } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'Admin User', username: 'admin', password: 'password123', role: 'admin', status: 'active', email: 'admin@lab.com', joinedDate: '2023-01-01' },
  { id: '2', name: 'John Tech', username: 'john', password: 'password123', role: 'technician', status: 'active', email: 'john@lab.com', joinedDate: '2023-02-15' },
  { id: '3', name: 'Sarah Agent', username: 'sarah', password: 'password123', role: 'collection_agent', status: 'active', email: 'sarah@lab.com', joinedDate: '2023-03-10' },
  { id: '4', name: 'Mike Suspended', username: 'mike', password: 'password123', role: 'technician', status: 'suspended', email: 'mike@lab.com', joinedDate: '2023-01-20' },
];

export const mockTests: Test[] = [
  { id: '1', name: 'CBC (Complete Blood Count)', rate: 500, status: 'active' },
  { id: '2', name: 'Lipid Profile', rate: 800, status: 'active' },
  { id: '3', name: 'Thyroid Profile (T3, T4, TSH)', rate: 600, status: 'active' },
  { id: '4', name: 'Blood Sugar Fasting', rate: 150, status: 'active' },
  { id: '5', name: 'Liver Function Test', rate: 900, status: 'suspended' },
];

// Mock entries for reports
export const mockEntries: PatientEntry[] = [
  {
    id: '101',
    patientName: 'Alice Smith',
    age: 30,
    sex: 'female',
    mobileNumber: '9876543210',
    testIds: ['1', '4'],
    totalAmount: 650,
    advanceAmount: 650,
    dueAmount: 0,
    commissionAmount: 260,
    commissionPaid: 0,
    commissionStatus: 'unpaid',
    status: 'paid',
    deliveryStatus: 'delivered',
    date: '2023-10-25',
    userId: '2',
    collectedByName: 'John Tech',
    testedByName: 'Lab A'
  },
  {
    id: '102',
    patientName: 'Bob Jones',
    age: 45,
    sex: 'male',
    mobileNumber: '9123456789',
    testIds: ['2'],
    totalAmount: 800,
    advanceAmount: 400,
    dueAmount: 400,
    commissionAmount: 320,
    commissionPaid: 0,
    commissionStatus: 'unpaid',
    status: 'partial',
    deliveryStatus: 'not_delivered',
    date: '2023-10-26',
    userId: '3',
    collectedByName: 'Sarah Agent',
    testedByName: 'Lab B'
  }
];
