import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Loader = () => {
  const visible = useSelector((state: RootState) => state.loader.visible);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-emerald-50/80 backdrop-blur-md"
        >
          <div className="relative flex flex-col items-center gap-4">
            {/* Outer progress indicator */}
            <motion.div
              className="absolute -inset-4"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "linear",
              }}
            >
              <div className="w-full h-full border-[3px] border-dashed border-emerald-100 rounded-full" />
            </motion.div>

            {/* Main spinner */}
            <motion.div
              variants={{
                spin: { rotate: 360, scale: [1, 1.1, 1] },
              }}
              initial="spin"
              animate="spin"
              transition={{
                duration: 1.2,
                ease: "anticipate",
                repeat: Infinity,
              }}
              className="relative h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-100"
            >
              {/* Inner cutout */}
              <div className="absolute inset-1 bg-white/30 backdrop-blur-sm rounded-full" />
            </motion.div>

            {/* Text with animated dots */}
            <motion.div
              className="flex items-center gap-1 text-emerald-800 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Loading
              {[...Array(3)].map((_, i) => (
                <motion.span
                  key={i}
                  className="inline-block origin-bottom"
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    repeat: Infinity,
                    delay: i * 0.2,
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
