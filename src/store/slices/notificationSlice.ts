// store/slices/notificationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  message: string;
  type: "create" | "update" | "delete" | "reminder";
  read: boolean;
  timestamp: string;
  noteId?: string;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, "id" | "read" | "timestamp">>) => {
      state.notifications.unshift({
        id: Date.now().toString(),
        read: false,
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) notification.read = true;
    },
    markAsUnread: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) notification.read = false;
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    deleteAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { 
  addNotification, 
  markAsRead, 
  markAsUnread, 
  deleteNotification, 
  deleteAllNotifications 
} = notificationSlice.actions;

export default notificationSlice.reducer;