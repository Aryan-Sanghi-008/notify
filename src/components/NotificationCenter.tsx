// components/NotificationCenter.tsx
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle,
  XCircle,
  Trash2,
  Mail,
  MailOpen,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  deleteAllNotifications,
  deleteNotification,
  markAsRead,
  markAsUnread,
  Notification,
} from "../store/slices/notificationSlice";
import { createSelector } from "@reduxjs/toolkit";

const getIcon = (type: string) => {
  switch (type) {
    case "create":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "update":
      return <Mail className="w-5 h-5 text-blue-500" />;
    case "delete":
      return <XCircle className="w-5 h-5 text-red-500" />;
    case "reminder":
      return <Clock className="w-5 h-5 text-purple-500" />;
    default:
      return <Mail className="w-5 h-5 text-gray-500" />;
  }
};

interface NotifactionItemProps {
  notification: Notification;
  onToggle: () => void;
  onDelete: () => void;
}

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const selectSortedNotifications = createSelector(
    [(state: RootState) => state.notifications.notifications],
    (notifications) => {
      return [...notifications].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }
  );
  const notifications = useSelector(selectSortedNotifications, shallowEqual);

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button[aria-label="Notifications"]')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={notificationRef}>
      <button
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full relative"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadNotifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 rounded-full">
            {unreadNotifications.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              <button
                onClick={() => dispatch(deleteAllNotifications())}
                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                <>
                  {unreadNotifications.length > 0 && (
                    <div className="p-2 bg-blue-50 text-sm font-medium text-blue-800">
                      Unread ({unreadNotifications.length})
                    </div>
                  )}
                  {unreadNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onToggle={() => dispatch(markAsRead(notification.id))}
                      onDelete={() =>
                        dispatch(deleteNotification(notification.id))
                      }
                    />
                  ))}

                  {readNotifications.length > 0 && (
                    <div className="p-2 bg-gray-50 text-sm font-medium text-gray-600">
                      Read ({readNotifications.length})
                    </div>
                  )}
                  {readNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onToggle={() =>
                        notification.read
                          ? dispatch(markAsUnread(notification.id))
                          : dispatch(markAsRead(notification.id))
                      }
                      onDelete={() =>
                        dispatch(deleteNotification(notification.id))
                      }
                    />
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NotificationItem: React.FC<NotifactionItemProps> = ({
  notification,
  onToggle,
  onDelete,
}) => (
  <div
    className={`p-4 border-b border-gray-100 hover:bg-gray-50 group ${
      !notification.read ? "bg-white" : "bg-gray-50"
    }`}
  >
    <div className="flex gap-3">
      <div className="mt-1">{getIcon(notification.type)}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium text-gray-900 mb-1">
            {notification.message}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(notification.timestamp))} ago{" "}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
          >
            {notification.read ? (
              <>
                <MailOpen className="w-3.5 h-3.5" /> Mark as unread
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5" /> Mark as read
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default NotificationCenter;
