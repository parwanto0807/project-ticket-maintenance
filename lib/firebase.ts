// lib/firebase.ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDZE_cqf5T99Hv43L3hDypLzmhkPTEEz-Q",
  authDomain: "ticket-maintenance-96997.firebaseapp.com",
  projectId: "ticket-maintenance-96997",
  storageBucket: "ticket-maintenance-96997.firebasestorage.app",
  messagingSenderId: "530521928884",
  appId: "1:530521928884:web:197057801958fbeca053e1",
  measurementId: "G-Q5D2NGESR0"
};

export const app = initializeApp(firebaseConfig);
export default app;