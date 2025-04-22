import { useEffect } from "react";
import { auth, provider } from "../lib/firebase/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { resetAuth, setUser } from "../store/slices/authslice";
import { deleteAllNotifications } from "../store/slices/notificationSlice";

export function useAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const { uid, email, displayName, photoURL } = firebaseUser;
        dispatch(setUser({ uid, email, displayName, photoURL }));
      } else {
        dispatch(setUser(null));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  const signIn = () => {
    signInWithPopup(auth, provider).catch((error) => {
      console.error("Login error:", error);
    });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        dispatch(resetAuth());
        dispatch(deleteAllNotifications());
      })
      .catch(console.error);
  };
  return { signIn, logout };
}
