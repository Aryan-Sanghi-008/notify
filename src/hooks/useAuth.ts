import { useEffect, useState } from "react";
import { auth, provider } from "../lib/firebase/firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((_result) => {
      })
      .catch((error) => {
        console.error("Popup Sign-in error:", error);
      });
  };

  const logout = () => signOut(auth);

  return { user, signIn, logout };
}
