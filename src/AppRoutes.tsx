// src/routes.tsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { AuthPage } from "./pages/AuthPage";
import NotesPage from "./pages/NotesPage";
import AppLayout from "./layouts/AppLayout";
import { RecycleBin } from "./pages/RecycleBin";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

const AppRoutes = () => {
  const user = useSelector((state: RootState) => state.auth.user);
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
      <Route
        path="/bin"
        element={
          <AppLayout>
            <RecycleBin />
          </AppLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
