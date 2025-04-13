// src/types/Note.ts
import { Timestamp } from "firebase/firestore";

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  user: {
    id: string;
    name: string;
    email: string;
  };
  userId: string;
};
