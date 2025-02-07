import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

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
export const db = getDatabase(app);
