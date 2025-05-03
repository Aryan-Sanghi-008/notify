import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { Notification } from "../../types/Notifications"

// CREATE Notification
export const createNotification = async (
  userId: string,
  notification: Omit<Notification, "id" | "read" | "timestamp">
): Promise<Notification> => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, "notifications"), {
    ...notification,
    userId,
    read: false,
    timestamp: now,
  });

  return {
    id: docRef.id,
    ...notification,
    read: false,
    timestamp: now.toDate().toISOString(),
  };
};

// READ: Get all notifications for user
export const getNotifications = async (
  userId: string
): Promise<Notification[]> => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => parseNotification(doc));
};

// UPDATE: Mark as read
export const markAsRead = async (notificationId: string): Promise<void> => {
  const notificationRef = doc(db, "notifications", notificationId);
  await updateDoc(notificationRef, { read: true });
};

// UPDATE: Mark as unread
export const markAsUnread = async (notificationId: string): Promise<void> => {
  const notificationRef = doc(db, "notifications", notificationId);
  await updateDoc(notificationRef, { read: false });
};

// DELETE: Single notification
export const deleteNotification = async (
  notificationId: string
): Promise<void> => {
  const notificationRef = doc(db, "notifications", notificationId);
  await deleteDoc(notificationRef);
};

// DELETE: All notifications for user
export const deleteAllNotifications = async (userId: string): Promise<void> => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(q);

  const batch = writeBatch(db);
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
};

// Helper to parse Firestore document
const parseNotification = (doc: any): Notification => {
  const data = doc.data();
  return {
    id: doc.id,
    message: data.message,
    type: data.type,
    read: data.read,
    timestamp: data.timestamp.toDate().toISOString(),
    noteId: data.noteId || undefined,
    userId: data.userId,
  };
};
