import { ReactNode } from "react";
import { motion } from "framer-motion";

type InfoCardProps = {
  title: string;
  value: string | number | ReactNode;
  icon?: ReactNode;
  description?: string;
  progress?: number; // between 0 and 100
  theme?: "default" | "primary" | "success" | "warning" | "danger";
  onClick?: () => void;
  className?: string;
};

const themeStyles = {
  default: "text-gray-800 border-gray-200",
  primary: "text-blue-700 border-blue-200",
  success: "text-green-700 border-green-200",
  warning: "text-yellow-700 border-yellow-200",
  danger: "text-red-700 border-red-200",
};

const InfoCard = ({
  title,
  value,
  icon,
  description,
  progress,
  theme = "default",
  onClick,
  className = "",
}: InfoCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group bg-white rounded-xl border p-5 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md cursor-pointer ${themeStyles[theme]} ${className}`}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="text-3xl p-3 rounded-full bg-gray-100 group-hover:bg-violet-100 transition-colors duration-300">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {title}
          </h3>
          <div className="mt-2">
            <span className="text-xl text-wrap font-bold text-gray-900">{value}</span>
          </div>
          {description && (
            <p className="text-xs text-gray-500 mt-1 leading-snug break-words">
              {description}
            </p>
          )}
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
              className="h-2 bg-violet-600 rounded-full"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default InfoCard;
