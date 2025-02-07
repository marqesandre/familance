import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';
import { ref, get, set } from 'firebase/database';

interface Transaction {
  amount: number;
  description: string;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

export async function GET() {
  try {
    const transactionsRef = ref(db, 'transactions');
    const snapshot = await get(transactionsRef);
    const data = snapshot.val();
    
    if (!data) return NextResponse.json([]);
    
    const transactions = Object.entries(data).map(([id, transaction]) => ({
      id,
      ...(transaction as Transaction)
    }));
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const transactions = await request.json();
    const transactionsRef = ref(db, 'transactions');
    await set(transactionsRef, transactions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}