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
export const createNote = async (note: {
  title: string;
  content: string;
  userId: string;
  photoURL?: string;
  tags?: string[];
  color?: string;
  isPinned?: boolean;
  isFavorite?: boolean;
  reminder?: Date | null;
}) => {
  const now = Timestamp.now();
  await addDoc(collection(db, "notes"), {
    title: note.title,
    content: note.content,
    userId: note.userId,
    photoURL: note.photoURL || null,
    tags: note.tags || [],
    color: note.color || "#ffffff",
    isPinned: note.isPinned || false,
    isFavorite: note.isFavorite || false,
    reminder: note.reminder ?? null,
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

// Helper function to parse Firestore data
const parseNote = (doc: any): Note => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    content: data.content,
    userId: data.userId,
    photoURL: data.photoURL,
    tags: data.tags || [],
    color: data.color || "#ffffff",
    isPinned: data.isPinned || false,
    isFavorite: data.isFavorite || false,
    reminder: data?.reminder ? data.reminder?.toDate() : null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    attachments: data.attachments || [],
  };
};

// READ : Latest 10 Notes
export const getRecentNotes = async (userId: string): Promise<Note[]> => {
  const q = query(
    collection(db, "notes"),
    where("userId", "==", userId),
    orderBy("isPinned", "desc"),
    orderBy("createdAt", "desc"),
    limit(10)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => parseNote(doc)) as Note[];
};

// READ: All Notes
export const getUserNotes = async (userId: string): Promise<Note[]> => {
  const q = query(collection(db, "notes"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => parseNote(doc)) as Note[];
};

// UPDATE
export const updateNote = async (
  id: string,
  updateData: {
    title?: string;
    content?: string;
    photoURL?: string | null;
    tags?: string[];
    color?: string;
    isPinned?: boolean;
    isFavorite?: boolean;
    reminder?: Date | null;
  }
): Promise<void> => {
  const noteRef = doc(db, "notes", id);
  await updateDoc(noteRef, {
    ...updateData,
    updatedAt: Timestamp.now(),
  });
};

// DELETE
export const deleteNote = async (id: string): Promise<void> => {
  const noteRef = doc(db, "notes", id);
  await deleteDoc(noteRef);
};
