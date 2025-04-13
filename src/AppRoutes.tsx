// src/routes.tsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { AuthPage } from "./pages/AuthPage";
import { useAuth } from "./hooks/useAuth";
import NotesPage from "./pages/NotesPage";
import AppLayout from "./layouts/AppLayout";

const AppRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Handle redirects based on auth status
  if (user && location.pathname === "/") {
    return <Navigate to="/dashboard" replace />;
  }

  if (!user && location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<AuthPage />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <Dashboard />
          </AppLayout>
        }
      />
      <Route
        path="/notes"
        element={
          <AppLayout>
            <NotesPage />
          </AppLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
