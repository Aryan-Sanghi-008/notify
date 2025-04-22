import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import { useState, useEffect } from "react";
import { Note } from "../types/Note";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

export const useNotes = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    if (!user) return;
    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc")
    );
    const snapshot = await getDocs(q);
    const notesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Note[];
    setNotes(notesData);
    setLoading(false);
  };

  const createNote = async (title: string, content: string) => {
    if (!user) return;
    const now = Date.now();
    await addDoc(collection(db, "notes"), {
      title,
      content,
      createdAt: now,
      updatedAt: now,
      userId: user.uid,
    });
    fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, "notes", id));
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const updateNote = async (id: string, title: string, content: string) => {
    const now = Date.now();
    await updateDoc(doc(db, "notes", id), {
      title,
      content,
      updatedAt: now,
    });
    fetchNotes();
  };

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  return { notes, loading, createNote, deleteNote, updateNote };
};
