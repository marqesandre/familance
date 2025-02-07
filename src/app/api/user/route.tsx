import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';
import { ref, get } from 'firebase/database';

export async function GET() {
  try {
    const userRef = ref(db, 'user');
    const snapshot = await get(userRef);
    const data = snapshot.val();
    
    if (!data) {
      return NextResponse.json(null, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(null, { status: 500 });
  }
}