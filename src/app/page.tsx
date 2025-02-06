'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const { user, monthlyBalance, transactions } = useTransactions();
  const thisMonth = new Date().toLocaleString("pt-BR", { month: "long" });

  useEffect(() => {
    setIsClient(true);
    const savedVisibility = localStorage.getItem('balanceVisibility');
    if (savedVisibility !== null) {
      setIsBalanceVisible(savedVisibility === 'true');
    }
  }, []);

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
    <div className="flex flex-col h-screen gap-8 justify-center items-center">
      {user && (
        <div className="text-lg absolute top-8 font-light text-gray-500">
          Olá, {user.name}.
        </div>
      )}
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <span>Saldo previsto para {thisMonth}</span>
          <button
            onClick={toggleBalanceVisibility}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isBalanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
          >
            {isBalanceVisible ? (
              <EyeIcon className="w-5 h-5 text-gray-600" />
            ) : (
              <EyeSlashIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
        <span className={`text-4xl font-bold ${monthlyBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
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
      <div className="flex flex-col justify-center items-center gap-4">
        <Link 
          href="/transactions" 
          className="px-4 py-2 bg-neutral-600 text-white rounded-xl hover:bg-neutral-700 transition-colors"
        >
          Mais detalhes
        </Link>
      </div>
    </div>
  );
}
