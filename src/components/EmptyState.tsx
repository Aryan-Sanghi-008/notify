// src/components/EmptyState.tsx
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto"
    >
      <div className="text-6xl mb-4 animate-bounce">{icon}</div>

      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>

      <p className="text-gray-500 text-lg">{description}</p>

      <motion.div
        className="mt-6 w-16 h-1 bg-gray-200 rounded-full"
        animate={{ scaleX: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </motion.div>
  );
};
