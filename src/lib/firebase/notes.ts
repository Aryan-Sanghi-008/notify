import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Note } from "../../types/Note";

// CREATE
export const createNote = async ({
  title,
  content,
  userId,
}: {
  title: string;
  content: string;
  userId: string;
}) => {
  const now = Timestamp.now();
  await addDoc(collection(db, "notes"), {
    title,
    content,
    userId,
    createdAt: now,
    updatedAt: now,
  });
};

// READ: Count
export const getUserNotesCount = async (userId: string): Promise<number> => {
  const q = query(collection(db, "notes"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};

// READ: Last Created Note
export const getLastCreatedNote = async (
  userId: string
): Promise<Note | null> => {
  const q = query(
    collection(db, "notes"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;

  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Note;
};

// READ: All Notes
export const getUserNotes = async (userId: string): Promise<Note[]> => {
  const q = query(collection(db, "notes"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Note[];
};

// UPDATE
export const updateNote = async ({
  id,
  title,
  content,
}: {
  id: string;
  title: string;
  content: string;
}): Promise<void> => {
  const noteRef = doc(db, "notes", id);
  await updateDoc(noteRef, {
    title,
    content,
    updatedAt: Timestamp.now(),
  });
};

// DELETE
export const deleteNote = async (id: string): Promise<void> => {
  const noteRef = doc(db, "notes", id);
  await deleteDoc(noteRef);
};
