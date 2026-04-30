import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-FGDzEVf4ROxJZ33Bd40VK2s6H-cXr0Y",
  authDomain: "hazel-pharmacy-ph.firebaseapp.com",
  projectId: "hazel-pharmacy-ph",
  storageBucket: "hazel-pharmacy-ph.firebasestorage.app",
  messagingSenderId: "195661486512",
  appId: "1:195661486512:web:4365d70238382e93659e75"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

export const ADMIN_EMAIL = 'admin@gmail.com';
export const isAdmin    = (user) => user?.email === ADMIN_EMAIL;
export const isCashier  = (user) => user && !isAdmin(user);
