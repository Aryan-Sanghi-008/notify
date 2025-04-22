import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Loader = () => {
  const visible = useSelector((state: RootState) => state.loader.visible);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-md"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Paper Sheet Spinner */}
            <motion.div
              className="relative h-16 w-16 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-lg"
              animate={{
                rotate: [0, 5, -5, 0],
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Folded Corner */}
              <div className="absolute top-0 right-0 w-4 h-4 bg-indigo-100 rounded-tr-lg rounded-bl-sm" />
              
              {/* Animated Writing Line */}
              <motion.div
                className="absolute left-2 right-2 h-0.5 bg-indigo-300 top-6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "anticipate",
                }}
              />
            </motion.div>

            {/* Text with Animated Dots */}
            <motion.div
              className="flex items-center gap-1 text-indigo-800 font-medium"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Jotting Down
              {[...Array(3)].map((_, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    repeat: Infinity,
                    delay: i * 0.3,
                    duration: 0.8,
                  }}
                >
                  .
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;