// src/components/Sidebar.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FaTachometerAlt,
  FaStickyNote,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import Button from "./Button";
import { GiNotebook } from "react-icons/gi";
import { IoTrashBin } from "react-icons/io5";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { label: "Notes", icon: <FaStickyNote />, path: "/notes" },
    { label : "Bin", icon: <IoTrashBin />, path: "/bin"    }
  ];

  return (
    <aside
      className={`fixed h-screen bg-white shadow-xl z-50 transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div className="flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 h-12">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <FaBars className="text-purple-600 text-xl" />
          </button>
          <span
            className={`text-xl flex font-bold text-purple-600 transition-opacity duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            <GiNotebook color="#fb7474" /> NotiFy
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => {
                navigate(item.path);
                setIsExpanded(false);
              }}
              className={`w-full flex items-center rounded-lg p-3 group transition-all duration-300 ${
                isExpanded ? "gap-3 justify-start" : "justify-center"
              }`}
            >
              <span className="text-purple-600 text-lg p-2 rounded-md bg-purple-50 group-hover:bg-purple-100 transition-colors">
                {item.icon}
              </span>
              <span
                className={`text-gray-600 font-medium transition-all duration-300 overflow-hidden ${
                  isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
                }`}
              >
                {item.label}
              </span>
            </Button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="border-t pt-4">
          <Button
            variant="ghost"
            onClick={logout}
            className={`w-full flex items-center rounded-lg p-3 transition-all duration-300 ${
              isExpanded ? "gap-3 justify-start" : "justify-center"
            }`}
          >
            <span className="text-red-500 text-lg p-2 rounded-md bg-red-50 hover:bg-red-100 transition-colors">
              <FaSignOutAlt />
            </span>
            <span
              className={`text-red-500 font-medium transition-all duration-300 overflow-hidden ${
                isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
              }`}
            >
              Logout
            </span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
