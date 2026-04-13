import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTdLMX4yGpDqeEkLDuTYAvJSxg77z3Az0",
  authDomain: "fantasy-for-cp.firebaseapp.com",
  projectId: "fantasy-for-cp",
  storageBucket: "fantasy-for-cp.firebasestorage.app",
  messagingSenderId: "143043732551",
  appId: "1:143043732551:web:0d6e8f91e3bcf2cebb7d62"
};

// Unique Build ID: 1713045600 (Forces Vercel Sync)
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_NEW_API_KEY";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, isFirebaseConfigured };
