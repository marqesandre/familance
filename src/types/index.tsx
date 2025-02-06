export interface User {
    name: string;
    email: string;
  }
  
  export interface Transaction {
    id: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
    description: string;
  }