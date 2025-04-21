// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { FIREBASE_CONFIG } from "../../../env";

export const firebaseConfig = {
  apiKey: FIREBASE_CONFIG.VITE_FIREBASE_API_KEY,
  authDomain: FIREBASE_CONFIG.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_CONFIG.VITE_FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_CONFIG.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_CONFIG.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_CONFIG.VITE_FIREBASE_APP_ID,
  measurementId: FIREBASE_CONFIG.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
