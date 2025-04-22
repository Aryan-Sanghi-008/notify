import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addNotification } from "../store/slices/notificationSlice";
import { getNotesWithRemindersDue } from "../lib/firebase/notes";
import { Timestamp } from "firebase/firestore";

const useReminderNotifications = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  useEffect(() => {
    if (!user) return;

    const checkReminders = async () => {
      const now = new Date();
      const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      try {
        const notes = await getNotesWithRemindersDue(
          user.uid,
          Timestamp.fromDate(now),
          Timestamp.fromDate(oneDayLater)
        );

        notes.forEach((note) => {
          if (note.reminder) {
            const reminderTime = note.reminder;
            const timeDiff = reminderTime.getTime() - now.getTime();

            if (timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000) {
              const existingNotification = notifications.find(
                (n) =>
                  n.noteId === note.id &&
                  n.type === "reminder" &&
                  !n.read &&
                  n.message.includes(note.title)
              );

              if (!existingNotification) {
                const hoursRemaining = Math.ceil(timeDiff / (60 * 60 * 1000));
                dispatch(
                  addNotification({
                    message: `Reminder: "${note.title}" due in ${hoursRemaining} hour${
                      hoursRemaining !== 1 ? "s" : ""
                    }`,
                    type: "reminder",
                    noteId: note.id,
                  })
                );
              }
            }
          }
        });
      } catch (error) {
        console.error("Error checking reminders:", error);
      }
    };

    // Run immediately and every hour
    checkReminders();
    const intervalId = setInterval(checkReminders, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [dispatch, user, notifications]);
};

export default useReminderNotifications;