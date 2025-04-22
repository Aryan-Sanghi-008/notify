// components/TimeFilter.tsx
import { useState } from "react";
import DatePicker from "react-datepicker";
import { startOfWeek, endOfWeek } from "date-fns";
import {
  ChevronDown,
  CalendarDays,
  Clock,
  Zap,
  Sun,
  Moon,
  ArrowLeftRight,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

interface TimeFilterProps {
  onChange: (filter: { type: string; startDate: Date; endDate: Date }) => void;
}

const TimeFilter = ({ onChange }: TimeFilterProps) => {
  const [filterType, setFilterType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [year, setYear] = useState<Date>(new Date());

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    const now = new Date();
    let startDate = now;
    let endDate = now;

    switch (type) {
      case "daily":
        startDate = now;
        endDate = now;
        break;
      case "weekly":
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
    }

    onChange({ type, startDate, endDate });
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/80 to-white/90 p-5 rounded-2xl shadow-lg border border-gray-200/60 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-4">
        {/* Modern Filter Selector */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-sm ring-1 ring-gray-200/70 hover:ring-indigo-400 transition-all">
            <ArrowLeftRight className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">
              {filterType
                ? filterType.charAt(0).toUpperCase() + filterType.slice(1)
                : "Time Range"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-hover:rotate-180" />
          </button>
          <div className="absolute z-[99] mt-2 w-48 bg-white rounded-xl shadow-lg py-1 ring-1 ring-gray-200/70 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top">
            <button
              onClick={() => handleFilterChange("")}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-indigo-50 ${
                !filterType
                  ? "text-indigo-600 bg-indigo-50/50"
                  : "text-gray-700"
              }`}
            >
              <Clock className="w-4 h-4" />
              All Time
            </button>
            <button
              onClick={() => handleFilterChange("daily")}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-indigo-50 ${
                filterType === "daily"
                  ? "text-indigo-600 bg-indigo-50/50"
                  : "text-gray-700"
              }`}
            >
              <Sun className="w-4 h-4" />
              Daily
            </button>
            <button
              onClick={() => handleFilterChange("weekly")}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-indigo-50 ${
                filterType === "weekly"
                  ? "text-indigo-600 bg-indigo-50/50"
                  : "text-gray-700"
              }`}
            >
              <Zap className="w-4 h-4" />
              Weekly
            </button>
            <button
              onClick={() => handleFilterChange("monthly")}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-indigo-50 ${
                filterType === "monthly"
                  ? "text-indigo-600 bg-indigo-50/50"
                  : "text-gray-700"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Monthly
            </button>
            <button
              onClick={() => handleFilterChange("yearly")}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-indigo-50 ${
                filterType === "yearly"
                  ? "text-indigo-600 bg-indigo-50/50"
                  : "text-gray-700"
              }`}
            >
              <Moon className="w-4 h-4" />
              Yearly
            </button>
          </div>
        </div>

        {/* Date Pickers with z-index */}
        {filterType === "daily" && (
          <div className="flex items-center gap-3 bg-white pl-3 pr-2 py-2 rounded-xl shadow-sm ring-1 ring-gray-200/70 hover:ring-indigo-400 transition-all">
            <span className="text-sm text-gray-600 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-indigo-600" />
              Day
            </span>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (!date) return;
                setSelectedDate(date);
                onChange({ type: "daily", startDate: date, endDate: date });
              }}
              className="px-3 py-2 border-0 text-sm font-medium text-gray-700 bg-transparent focus:ring-0"
              popperClassName="z-50 shadow-xl rounded-xl [&_.react-datepicker]:border-0 [&_.react-datepicker]:shadow-lg [&_.react-datepicker__header]:bg-gray-50 [&_.react-datepicker__day--selected]:bg-indigo-500"
              dateFormat="MMMM d, yyyy"
            />
          </div>
        )}

        {filterType === "weekly" && (
          <div className="flex items-center gap-3 bg-white pl-3 pr-2 py-2 rounded-xl shadow-sm ring-1 ring-gray-200/70 hover:ring-indigo-400 transition-all">
            <span className="text-sm text-gray-600 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-600" />
              Week
            </span>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (!date) return;
                setSelectedDate(date);
                onChange({
                  type: "weekly",
                  startDate: startOfWeek(date),
                  endDate: endOfWeek(date),
                });
              }}
              showWeekNumbers
              showWeekPicker
              className="px-3 py-2 border-0 text-sm font-medium text-gray-700 bg-transparent focus:ring-0"
              popperClassName="z-50 shadow-xl rounded-xl [&_.react-datepicker]:border-0 [&_.react-datepicker]:shadow-lg [&_.react-datepicker__header]:bg-gray-50 [&_.react-datepicker__day--selected]:bg-indigo-500"
              dateFormat="MMM yyyy"
            />
          </div>
        )}

        {filterType === "monthly" && (
          <div className="flex items-center gap-3 bg-white pl-3 pr-2 py-2 rounded-xl shadow-sm ring-1 ring-gray-200/70 hover:ring-indigo-400 transition-all">
            <span className="text-sm text-gray-600 flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              Month
            </span>
            <DatePicker
              selected={month}
              onChange={(date: Date | null) => {
                if (!date) return;
                setMonth(date);
                onChange({
                  type: "monthly",
                  startDate: new Date(date.getFullYear(), date.getMonth(), 1),
                  endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
                });
              }}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="px-3 py-2 border-0 text-sm font-medium text-gray-700 bg-transparent focus:ring-0"
              popperClassName="z-50 shadow-xl rounded-xl [&_.react-datepicker]:border-0 [&_.react-datepicker]:shadow-lg [&_.react-datepicker__header]:bg-gray-50 [&_.react-datepicker__month-text]:px-4 [&_.react-datepicker__month-text]:py-2 [&_.react-datepicker__month-text--selected]:bg-indigo-500"
            />
          </div>
        )}

        {filterType === "yearly" && (
          <div className="flex items-center gap-3 bg-white pl-3 pr-2 py-2 rounded-xl shadow-sm ring-1 ring-gray-200/70 hover:ring-indigo-400 transition-all">
            <span className="text-sm text-gray-600 flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-600" />
              Year
            </span>
            <DatePicker
              selected={year}
              onChange={(date: Date | null) => {
                if (!date) return;
                setYear(date);
                onChange({
                  type: "yearly",
                  startDate: new Date(date.getFullYear(), 0, 1),
                  endDate: new Date(date.getFullYear(), 11, 31),
                });
              }}
              showYearPicker
              dateFormat="yyyy"
              className="px-3 py-2 border-0 text-sm font-medium text-gray-700 bg-transparent focus:ring-0"
              popperClassName="z-50 shadow-xl rounded-xl [&_.react-datepicker]:border-0 [&_.react-datepicker]:shadow-lg [&_.react-datepicker__header]:bg-gray-50 [&_.react-datepicker__year-text]:px-4 [&_.react-datepicker__year-text]:py-2 [&_.react-datepicker__year-text--selected]:bg-indigo-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeFilter;
