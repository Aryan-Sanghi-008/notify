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
import { Notification } from "../../types/Notifications";

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
  const millisec =
    data.timestamp.seconds * 1000 + data.timestamp.nanoseconds / 1000000;
  const timestamp = new Date(millisec)?.toISOString();
  return {
    id: doc.id,
    message: data.message,
    type: data.type,
    read: data.read,
    timestamp,
    noteId: data.noteId || undefined,
    userId: data.userId,
  };
};

export const checkAndCreateReminderNotifications = async (): Promise<void> => {
  const now = Timestamp.now();
  const oneDayLater = new Date(now.toMillis() + 24 * 60 * 60 * 1000);
  const oneDayLaterTimestamp = Timestamp.fromDate(oneDayLater);

  // 1. Get all notes with reminders in the next 24 hours
  const notesQuery = query(
    collection(db, "notes"),
    where("reminder", "!=", null),
    where("reminder", ">=", now),
    where("reminder", "<=", oneDayLaterTimestamp),
    where("deleteMode", "==", "notDeleted")
  );

  const notesSnapshot = await getDocs(notesQuery);

  if (notesSnapshot.empty) {
    console.log("No upcoming reminders found");
    return;
  }

  // 2. Create notifications for each upcoming reminder
  const batch = writeBatch(db);
  const notificationsRef = collection(db, "notifications");

  notesSnapshot.forEach((noteDoc) => {
    const note = noteDoc.data();
    // Create a new document reference with auto-generated ID
    const newNotificationRef = doc(notificationsRef);
    batch.set(newNotificationRef, {
      userId: note.userId,
      type: "reminder",
      noteId: noteDoc.id,
      message: `Reminder: ${note.title || "Untitled note"}`,
      read: false,
      timestamp: Timestamp.now(),
    });
  });

  await batch.commit();
  console.log(`Created ${notesSnapshot.size} reminder notifications`);
};
