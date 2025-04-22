// src/layouts/AppLayout.tsx
import Sidebar from "../components/Sidebar";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Toaster from "../components/Toaster";
import Loader from "../components/Loader";
import useReminderNotifications from "../hooks/useReminderNotifications";

const noSidebarRoutes = ["/"];

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const hideSidebar = noSidebarRoutes.includes(location.pathname);
  useReminderNotifications();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!hideSidebar && <Sidebar />}
      <main
        className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ease-in-out ${
          hideSidebar ? "w-full" : ""
        }`}
      >
        <Loader />
        <Toaster />
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
