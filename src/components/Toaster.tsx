import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast, Toast } from "../store/slices/toastSlice";
import { RootState } from "../store/store";
import { CheckCircle, XCircle } from "lucide-react"; // Import icons
import { motion } from "framer-motion";

const Toaster: React.FC = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  // Automatically remove toast after 3 seconds
  useEffect(() => {
    const timeoutIds = toasts.map((toast: Toast) =>
      setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, 3000)
    );

    return () => {
      timeoutIds.forEach((id: NodeJS.Timeout) => clearTimeout(id));
    };
  }, [toasts, dispatch]);

  return (
    <div className="fixed top-4 right-4 space-y-4 z-50">
      {toasts.map((toast: Toast) => (
        <motion.div
          key={toast.id}
          className={`flex items-center p-5 rounded-lg shadow-lg text-white transition-all duration-300 ease-in-out ${
            toast.type === "success"
              ? "bg-green-500"
              : toast.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
          initial={{ opacity: 0, y: -20 }} // Animation to slide in from the top
          animate={{ opacity: 1, y: 0 }} // Final position
          exit={{ opacity: 0, y: 20 }} // Animation for exiting
        >
          {/* Toast Icon */}
          <div className="mr-4">
            {toast.type === "success" ? (
              <CheckCircle size={24} />
            ) : toast.type === "error" ? (
              <XCircle size={24} />
            ) : (
              <div className="w-6 h-6 bg-white rounded-full"></div> // Placeholder for other types
            )}
          </div>

          {/* Toast Message */}
          <div className="flex-1">{toast.message}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default Toaster;
