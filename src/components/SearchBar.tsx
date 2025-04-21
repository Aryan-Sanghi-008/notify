// components/SearchBar.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder }: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(query.toLowerCase());
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, onSearch]);

  return (
    <div className="relative w-full max-w-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <input
          type="text"
          placeholder={placeholder ?? "Search..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 bg-white/95 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg outline-none"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Animated underline */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: query ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      />
    </div>
  );
};

export default SearchBar;
