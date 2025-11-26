export type UserRole = 'admin' | 'technician' | 'collection_agent';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string; // Optional for display, required for auth
  role: UserRole;
  status: UserStatus;
  email: string;
  joinedDate: string;
}

export type TestStatus = 'active' | 'suspended';

export interface Test {
  id: string;
  name: string;
  rate: number;
  status: TestStatus;
}

export interface PatientEntry {
  id: string;
  patientName: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  mobileNumber: string;
  testIds: string[];
  totalAmount: number;
  advanceAmount: number;
  dueAmount: number;
  commissionAmount: number; // 40%
  commissionPaid: number;
  commissionStatus: 'paid' | 'partial' | 'unpaid';
  commissionPaidBy?: 'user' | 'admin';
  writeOffAmount?: number;
  notes?: string;
  status: 'paid' | 'due' | 'partial';
  deliveryStatus: 'delivered' | 'partial' | 'not_delivered';
  date: string;
  userId: string;
  collectedByName: string;
  testedByName: string;
}
