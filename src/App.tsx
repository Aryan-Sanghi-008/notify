// src/App.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

const App = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && window.location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [user]);

  return <AppRoutes />;
};

export default App;
