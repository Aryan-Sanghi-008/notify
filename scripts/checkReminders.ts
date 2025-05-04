// scripts/checkReminders.ts
import { Timestamp, getFirestore, query, collection, where, getDocs, writeBatch, doc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../src/lib/firebase/firebase";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const checkAndCreateReminderNotifications = async (): Promise<void> => {
  const now = Timestamp.now();
  const oneDayLater = new Date(now.toMillis() + 24 * 60 * 60 * 1000);
  const oneDayLaterTimestamp = Timestamp.fromDate(oneDayLater);

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

  const batch = writeBatch(db);
  const notificationsRef = collection(db, "notifications");

  notesSnapshot.forEach((noteDoc) => {
    const note = noteDoc.data();
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
