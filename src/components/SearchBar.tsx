// components/SearchBar.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string, filter?: string) => void;
  placeholder?: string;
  showFilters?: boolean;
  filterOptions?: { value: string; label: string }[];
  onFilterChange?: (filter: string) => void;
}

const SearchBar = ({
  onSearch,
  placeholder,
  showFilters = false,
  filterOptions = [],
  onFilterChange,
}: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>(
    filterOptions[0]?.value || ""
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(query.toLowerCase(), selectedFilter);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, selectedFilter, onSearch]);

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    onFilterChange?.(value);
  };

  return (
    <div className="relative w-full max-w-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="flex items-center rounded-xl border border-gray-200 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200 bg-white/95 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md focus-within:shadow-lg">
          {/* Search icon on the left */}
          <div className="pl-4">
            <Search className="w-5 h-5 text-gray-400" />
          </div>

          {/* Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={placeholder ?? "Search..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-2 pr-12 py-3 bg-transparent outline-none border-none"
            />

            {/* Clear button */}
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
          </div>

          {/* Filters on the right */}
          {showFilters && (
            <div className="relative border-l border-gray-200 pl-3 pr-2">
              <select
                value={selectedFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="pl-2 pr-6 py-3 appearance-none bg-transparent outline-none text-sm font-medium text-gray-600"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Animated underline */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: query ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        />
      </motion.div>
    </div>
  );
};

export default SearchBar;
