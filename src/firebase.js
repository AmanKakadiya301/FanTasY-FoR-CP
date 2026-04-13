import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAF8o3BGS3I0uh63TS3XXS3narEDjPA5nA",
  authDomain: "fantasy-dsa-roadmap.firebaseapp.com",
  databaseURL: "https://fantasy-dsa-roadmap-default-rtdb.firebaseio.com",
  projectId: "fantasy-dsa-roadmap",
  storageBucket: "fantasy-dsa-roadmap.firebasestorage.app",
  messagingSenderId: "37962795406",
  appId: "1:37962795406:web:c0c8243989fb6859a4bcdf",
  measurementId: "G-0E3LJKMTP3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
