'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTransactions } from '../../hooks/useTransactions';
import { Transaction } from '../../types';
import { EditTransactionModal } from '../../components/EditTransactionModal';
import { AddTransactionModal } from '../../components/AddTransactionModal';
import { PencilSquareIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Transactions() {
  const [isClient, setIsClient] = useState(false);
  const { monthlyBalance, transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const date = new Date(transaction.date);
    return date.getMonth() + 1 === selectedMonth &&
      date.getFullYear() === selectedYear;
  });

  const handleAdd = async (newTransaction: Omit<Transaction, 'id'>) => {
    try {
      const success = await addTransaction(newTransaction);
      if (success) {
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Erro ao adicionar transação');
    }
  };

  const handleUpdate = async (updatedTransaction: Transaction) => {
    try {
      const success = await updateTransaction(updatedTransaction);
      if (success) {
        setIsEditModalOpen(false);
        setSelectedTransaction(null);
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Erro ao atualizar transação');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm('Deseja realmente excluir esta transação?')) {
        const success = await deleteTransaction(id);
        if (!success) {
          alert('Erro ao excluir transação');
        }
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Erro ao excluir transação');
    }
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(prev => {
      const newState = !prev;
      localStorage.setItem('balanceVisibility', String(newState));
      return newState;
    });
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex flex-col gap-4 mb-6">
        <div className="grid grid-cols-3 justify-center items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-neutral-800 rounded-full transition-colors w-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
          <div className="flex flex-row w-full text-sm font-bold rounded-2xl bg-neutral-700 text-center">
            <button
              onClick={toggleBalanceVisibility}
              className="pl-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={isBalanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
            >
              {isBalanceVisible ? (
                <EyeIcon className="w-5 h-5" />
              ) : (
                <EyeSlashIcon className="w-5 h-5" />
              )}
            </button>
            <span className="text-sm font-bold rounded-2xl bg-neutral-700 p-2 text-center">
            {isBalanceVisible ? (
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(monthlyBalance)
            ) : (
              <span className="select-none">R$ •••••••</span>
            )}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="p-2 border rounded-md w-full sm:w-auto border-neutral-600 bg-transparent"
            style={{ colorScheme: 'normal' }}
          >
            {months.map((month, index) => (
              <option
                key={index + 1}
                value={index + 1}
                className="bg-[var(--background)]"
                style={{ color: 'inherit' }}
              >
                {month}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Nova Transação
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex flex-row sm:flex-row justify-around items-center sm:items-center p-4 border border-neutral-600 rounded-lg hover:bg-neutral-800"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">{transaction.description}</span>
              <span className="text-sm text-neutral-500">
                {new Date(transaction.date + 'T00:00:00').toLocaleDateString('pt-BR')}
              </span>
              <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex flex-col justify-center sm:flex-row items-center  sm:mt-0">
              <div className="flex flex-row justify-center items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setIsEditModalOpen(true);
                  }}
                  className="p-2 hover:bg-neutral-700 rounded-3xl"
                >
                  <PencilSquareIcon className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="p-2 text-red-600 hover:bg-red-700 rounded-3xl"
                >
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Nenhuma transação encontrada para este mês
          </div>
        )}
      </div>

      {isEditModalOpen && selectedTransaction && (
        <EditTransactionModal
          transaction={selectedTransaction}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTransaction(null);
          }}
          onSave={handleUpdate}
        />
      )}

      {isAddModalOpen && (
        <AddTransactionModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}