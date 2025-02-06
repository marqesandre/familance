import { useState } from 'react';
import { Transaction } from '../types';

interface AddTransactionModalProps {
  onClose: () => void;
  onAdd: (transaction: Transaction) => Promise<void>;
}

export function AddTransactionModal({ onClose, onAdd }: AddTransactionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Omit<Transaction, 'id'>>({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: 'income'
  });


  const formatCurrency = (value: string) => {
    const numbers = value.replace(/[^\d.]/g, '');
    
    const amount = Number(numbers).toFixed(2);
    
    return amount === 'NaN' ? '0.00' : amount;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setForm(prev => ({ ...prev, amount: Number(formatted) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onAdd({
        ...form,
        id: crypto.randomUUID()
      });
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Nova Transação</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded-3xl bg-inherit border-neutral-600 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Valor</label>
            <input
              type="number"
              value={form.amount || ''}
              onChange={handleAmountChange}
              onFocus={(e) => e.target.select()}
              className="w-full p-2 border rounded-3xl bg-inherit border-neutral-600 text-white"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-2 border rounded-3xl bg-inherit border-neutral-600 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as 'income' | 'expense' })}
              className="w-full p-2 border rounded-3xl bg-inherit border-neutral-600 text-white"
              required
            >
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 hover:bg-neutral-700 rounded-md disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600"
            >
              {isSubmitting ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}