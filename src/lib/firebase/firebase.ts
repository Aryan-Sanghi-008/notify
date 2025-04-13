// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuYRqAN6yqrujwlKXLfrQGGgxRPo_S45E",
  authDomain: "stickify-aryan-sanghi.firebaseapp.com",
  projectId: "stickify-aryan-sanghi",
  storageBucket: "stickify-aryan-sanghi.appspot.com",
  messagingSenderId: "601297238583",
  appId: "1:601297238583:web:6d9448012a747bf5cdddb2",
  measurementId: "G-9Z8MVC17PB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
