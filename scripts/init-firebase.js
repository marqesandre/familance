const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyB9wC974-weR3oiE2IH-nfs0CfbwjSC-z0",
  authDomain: "familance-4673d.firebaseapp.com",
  databaseURL: "https://familance-4673d-default-rtdb.firebaseio.com",
  projectId: "familance-4673d",
  storageBucket: "familance-4673d.firebasestorage.app",
  messagingSenderId: "910795774065",
  appId: "1:910795774065:web:b77618c3628901bbf923d0",
  measurementId: "G-RXG7JET6T3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Dados iniciais
const initialData = {
  user: {
    name: "André Marques",
    email: "marqesandre@gmail.com"
  },
  transactions: {
    // Exemplo de transação
    "transaction1": {
      description: "Exemplo de Transação",
      amount: 100,
      date: "2025-02-06",
      category: "Outros",
      type: "income"
    }
  }
};

async function initializeDatabase() {
  try {
    // Inicializa os dados do usuário
    await set(ref(db, 'user'), initialData.user);
    
    // Inicializa as transações
    await set(ref(db, 'transactions'), initialData.transactions);
    
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
