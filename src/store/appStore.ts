import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Test, PatientEntry } from '../types';
import { mockUsers, mockTests, mockEntries } from '../data/mockData';

interface AppState {
  currentUser: User | null;
  users: User[];
  tests: Test[];
  entries: PatientEntry[];
  
  // Auth Actions
  login: (username: string, password?: string) => boolean;
  logout: () => void;

  // User Actions
  addUser: (user: Omit<User, 'id' | 'joinedDate'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;

  // Test Actions
  addTest: (test: Omit<Test, 'id'>) => void;
  updateTest: (id: string, updates: Partial<Test>) => void;
  deleteTest: (id: string) => void;
  toggleTestStatus: (id: string) => void;

  // Entry Actions
  addEntry: (entry: Omit<PatientEntry, 'id'>) => void;
  updateEntry: (id: string, updates: Partial<PatientEntry>) => void;
  deleteEntry: (id: string) => void;
  markCommissionPaid: (id: string, amount: number, by: 'user' | 'admin') => void;
  writeOffDue: (id: string, amount: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: mockUsers,
      tests: mockTests,
      entries: mockEntries,

      // Auth Actions
      login: (username, password) => {
        const user = get().users.find(
          (u) => u.username === username && u.password === password && u.status === 'active'
        );
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null }),

      // User Actions
      addUser: (userData) => set((state) => ({
        users: [...state.users, { 
          ...userData, 
          id: Math.random().toString(36).substr(2, 9), 
          joinedDate: new Date().toISOString().split('T')[0] 
        }]
      })),
      updateUser: (id, updates) => set((state) => ({
        users: state.users.map((u) => u.id === id ? { ...u, ...updates } : u)
      })),
      deleteUser: (id) => set((state) => ({
        users: state.users.filter((u) => u.id !== id)
      })),
      toggleUserStatus: (id) => set((state) => ({
        users: state.users.map((u) => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u)
      })),

      // Test Actions
      addTest: (testData) => set((state) => ({
        tests: [...state.tests, { 
          ...testData, 
          id: Math.random().toString(36).substr(2, 9) 
        }]
      })),
      updateTest: (id, updates) => set((state) => ({
        tests: state.tests.map((t) => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTest: (id) => set((state) => ({
        tests: state.tests.filter((t) => t.id !== id)
      })),
      toggleTestStatus: (id) => set((state) => ({
        tests: state.tests.map((t) => t.id === id ? { ...t, status: t.status === 'active' ? 'suspended' : 'active' } : t)
      })),

      // Entry Actions
      addEntry: (entryData) => set((state) => ({
        entries: [...state.entries, {
          ...entryData,
          id: Math.random().toString(36).substr(2, 9)
        }]
      })),
      updateEntry: (id, updates) => set((state) => ({
        entries: state.entries.map((e) => e.id === id ? { ...e, ...updates } : e)
      })),
      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter((e) => e.id !== id)
      })),
      markCommissionPaid: (id, amount, by) => set((state) => ({
        entries: state.entries.map((e) => {
          if (e.id !== id) return e;
          const newPaid = e.commissionPaid + amount;
          const status = newPaid >= e.commissionAmount ? 'paid' : 'partial';
          return {
            ...e,
            commissionPaid: newPaid,
            commissionStatus: status,
            commissionPaidBy: by
          };
        })
      })),
      writeOffDue: (id, amount) => set((state) => ({
        entries: state.entries.map((e) => {
          if (e.id !== id) return e;
          return {
            ...e,
            dueAmount: 0,
            status: 'paid',
            writeOffAmount: amount,
            notes: `Written off: ₹${amount}`,
            // Recalculate commission based on actual paid amount (Total - WriteOff)
            commissionAmount: (e.totalAmount - amount) * 0.40
          };
        })
      })),
    }),
    {
      name: 'blood-test-app-storage',
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        // We persist everything for now since we don't have a backend
        users: state.users,
        tests: state.tests,
        entries: state.entries
      }),
    }
  )
);
