export interface Notification {
  id: string;
  message: string;
  type: "create" | "update" | "delete" | "reminder";
  read: boolean;
  timestamp: string;
  noteId?: string;
  userId?: string;
}
