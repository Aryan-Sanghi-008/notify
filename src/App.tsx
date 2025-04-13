// src/App.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./AppRoutes";

const App = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && window.location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [user]);

  return <AppRoutes />;
};

export default App;
