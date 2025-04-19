// src/types/Note.ts
import { Timestamp } from "firebase/firestore";

export type Note = {
  id: string;
  title: string;
  content: string;
  photoURL?: string;
  tags?: string[];
  isPinned: boolean;
  isFavorite: boolean;
  color?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  reminder?: Date | null;
  attachments?: string[];
  userId: string;
};
