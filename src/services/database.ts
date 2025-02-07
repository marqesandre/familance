import { ref, get, set, push, remove, query, orderByChild } from 'firebase/database';
import { db } from '../config/firebase';

export interface Transaction {
  id?: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

export interface User {
  name: string;
  email: string;
}

export const DatabaseService = {
  // User operations
  async getUser(): Promise<User | null> {
    const userRef = ref(db, 'user');
    const snapshot = await get(userRef);
    return snapshot.val();
  },

  async updateUser(user: User): Promise<void> {
    const userRef = ref(db, 'user');
    await set(userRef, user);
  },

  // Transaction operations
  async getTransactions(): Promise<Transaction[]> {
    const transactionsRef = ref(db, 'transactions');
    const snapshot = await get(transactionsRef);
    const data = snapshot.val();
    return data ? Object.entries(data).map(([id, transaction]) => ({
      id,
      ...(transaction as Omit<Transaction, 'id'>)
    })) : [];
  },

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<string> {
    const transactionsRef = ref(db, 'transactions');
    const newTransactionRef = push(transactionsRef);
    await set(newTransactionRef, transaction);
    return newTransactionRef.key!;
  },

  async updateTransaction(id: string, transaction: Omit<Transaction, 'id'>): Promise<void> {
    const transactionRef = ref(db, `transactions/${id}`);
    await set(transactionRef, transaction);
  },

  async deleteTransaction(id: string): Promise<void> {
    const transactionRef = ref(db, `transactions/${id}`);
    await remove(transactionRef);
  },

  async getTransactionsByMonth(year: number, month: number): Promise<Transaction[]> {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    
    const transactionsRef = ref(db, 'transactions');
    const transactionsQuery = query(transactionsRef, orderByChild('date'));
    const snapshot = await get(transactionsQuery);
    
    const data = snapshot.val();
    if (!data) return [];

    return Object.entries(data)
      .filter(([_, transaction]) => {
        const txDate = (transaction as Transaction).date;
        return txDate >= startDate && txDate <= endDate;
      })
      .map(([id, transaction]) => ({
        id,
        ...(transaction as Omit<Transaction, 'id'>)
      }));
  }
};
