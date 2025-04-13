// src/components/Sidebar.tsx
import {
  FaUser,
  FaTachometerAlt,
  FaStickyNote,
  FaSignOutAlt,
  FaCog,
  FaQuestionCircle,
  FaBars, // Hamburger icon
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "./Button";
import { useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    {
      section: "Main",
      items: [
        {
          label: "Dashboard",
          icon: <FaTachometerAlt />,
          onClick: () => navigate("/dashboard"),
        },
        {
          label: "Notes",
          icon: <FaStickyNote />,
          onClick: () => navigate("/notes"),
        },
      ],
    },
    {
      section: "Account",
      items: [
        {
          label: "Profile",
          icon: <FaUser />,
          onClick: () => navigate("/profile"),
        },
      ],
    },
    {
      section: "Settings",
      items: [
        {
          label: "Change Password",
          icon: <FaCog />,
          onClick: () => navigate("/settings/password"),
        },
        {
          label: "Notifications",
          icon: <FaCog />,
          onClick: () => navigate("/settings/notifications"),
        },
      ],
    },
    {
      section: "Help",
      items: [
        {
          label: "FAQ",
          icon: <FaQuestionCircle />,
          onClick: () => navigate("/help/faq"),
        },
        {
          label: "Contact Support",
          icon: <FaQuestionCircle />,
          onClick: () => navigate("/help/contact"),
        },
      ],
    },
  ];

  return (
    <div className="flex relative">
      {/* Sidebar */}
      <div
        className={`fixed z-[999999] top-0 left-0 h-screen bg-white shadow-lg p-4 flex flex-col justify-between transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div>
          {/* Hamburger Icon */}
          <div className="flex">
            <div
              className="text-xl mb-8 mt-[0.4rem] mr-4 text-purple-600 cursor-pointer"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FaBars />
            </div>

            <h2
              className={`text-2xl font-bold text-purple-600 transition-all duration-300 ${
                isSidebarOpen ? "block" : "hidden"
              }`}
            >
              Stickify
            </h2>
          </div>

          {/* Sidebar Navigation */}
          {navigationItems.map((group, idx) => (
            <div key={idx} className="mb-6">
              <h3
                className={`text-xs font-semibold text-gray-400 uppercase mb-2 transition-all duration-300 ${
                  isSidebarOpen ? "block" : "hidden"
                }`}
              >
                {group.section}
              </h3>
              <div className="flex flex-col gap-2">
                {group.items.map((item, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="flex items-center gap-3 text-left text-gray-700 hover:text-purple-600 transition duration-300"
                    onClick={item.onClick}
                  >
                    {/* Icon always visible */}
                    <span className="block">{item.icon}</span>

                    {/* Text label only visible when sidebar is open */}
                    <span
                      className={`transition-all duration-300 ${
                        isSidebarOpen ? "block" : "hidden"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-red-500 hover:text-red-700 transition duration-300"
          onClick={logout}
        >
          <FaSignOutAlt />
          <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
            Logout
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
