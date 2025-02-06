import { useState, useEffect } from 'react';
import { User, Transaction } from '../types';

export function useTransactions() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyBalance, setMonthlyBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Calculate monthly balance whenever transactions change
  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getMonth() + 1 === currentMonth && 
             date.getFullYear() === currentYear;
    });

    const balance = monthlyTransactions.reduce((acc, transaction) => {
      return transaction.type === 'income' 
        ? acc + transaction.amount 
        : acc - transaction.amount;
    }, 0);

    setMonthlyBalance(balance);
  }, [transactions]);

  // Helper function to load data
  const loadData = async () => {
    try {
      const [userData, transactionsData] = await Promise.all([
        fetch('/api/user').then(res => res.json()),
        fetch('/api/transactions').then(res => res.json())
      ]);
      setUser(userData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to save transactions
  const saveTransactions = async (updatedTransactions: Transaction[]) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTransactions),
      });

      if (!response.ok) {
        throw new Error('Failed to save transactions');
      }

      return true;
    } catch (error) {
      console.error('Error saving transactions:', error);
      setError(error as Error);
      return false;
    }
  };

  const addTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    try {
      setIsLoading(true);
      const transactionWithId = {
        ...newTransaction,
        id: crypto.randomUUID()
      };

      const updatedTransactions = [...transactions, transactionWithId];
      const success = await saveTransactions(updatedTransactions);
      
      if (success) {
        setTransactions(updatedTransactions);
      }

      return success;
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError(error as Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransaction = async (updatedTransaction: Transaction) => {
    try {
      setIsLoading(true);
      const updatedTransactions = transactions.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      );
      
      const success = await saveTransactions(updatedTransactions);
      
      if (success) {
        setTransactions(updatedTransactions);
      }

      return success;
    } catch (error) {
      console.error('Error updating transaction:', error);
      setError(error as Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setIsLoading(true);
      const updatedTransactions = transactions.filter(t => t.id !== id);
      const success = await saveTransactions(updatedTransactions);
      
      if (success) {
        setTransactions(updatedTransactions);
      }

      return success;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError(error as Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    transactions,
    monthlyBalance,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading,
    error
  };
}