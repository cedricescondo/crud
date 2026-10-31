
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB3oq2SfO64oEEH0faJdzDt6t0iaEqXMuA",
  authDomain: "crud-a4d07.firebaseapp.com",
  projectId: "crud-a4d07",
  storageBucket: "crud-a4d07.firebasestorage.app",
  messagingSenderId: "441608830124",
  appId: "1:441608830124:web:308b5c4353879905173309",
  measurementId: "G-1VE92ZFY8W"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
