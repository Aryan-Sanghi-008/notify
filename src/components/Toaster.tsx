import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast, Toast } from "../store/slices/toastSlice";
import { RootState } from "../store/store";
import { CheckCircle, XCircle, Info, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Toaster: React.FC = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  useEffect(() => {
    const timeoutIds = toasts.map((toast: Toast) =>
      setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, 2000)
    );

    return () => timeoutIds.forEach(clearTimeout);
  }, [toasts, dispatch]);

  const getToastConfig = (type: Toast["type"]) => {
    const config = {
      success: {
        icon: <CheckCircle size={20} className="text-emerald-600" />,
        border: "border-emerald-200",
        background: "bg-emerald-50",
        text: "text-emerald-800",
        progress: "bg-emerald-400",
      },
      error: {
        icon: <XCircle size={20} className="text-rose-600" />,
        border: "border-rose-200",
        background: "bg-rose-50",
        text: "text-rose-800",
        progress: "bg-rose-400",
      },
      info: {
        icon: <Info size={20} className="text-sky-600" />,
        border: "border-sky-200",
        background: "bg-sky-50",
        text: "text-sky-800",
        progress: "bg-sky-400",
      },
      warning: {
        icon: <AlertCircle size={20} className="text-amber-600" />,
        border: "border-amber-200",
        background: "bg-amber-50",
        text: "text-amber-800",
        progress: "bg-amber-400",
      },
    };

    return config[type] || config.info;
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 w-[320px]">
      <AnimatePresence>
        {toasts.map((toast: Toast) => {
          const { icon, border, background, text, progress } = getToastConfig(
            toast.type
          );

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
              className={`relative p-4 pr-10 rounded-lg shadow-lg border ${border} ${background} backdrop-blur-sm`}
              role="alert"
              aria-live="polite"
            >
              {/* Progress Bar */}
              <motion.div
                className={`absolute top-0 left-0 h-1 ${progress} rounded-t-lg`}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
              />

              <div className="flex items-start gap-3">
                <span className="shrink-0">{icon}</span>
                <p className={`text-sm font-medium ${text} leading-5`}>
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => dispatch(removeToast(toast.id))}
                className="absolute top-3 right-3 p-1 hover:bg-black/5 rounded-full transition-colors"
                aria-label="Close toast"
              >
                <X size={16} className={text} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toaster;
