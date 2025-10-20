import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import useAuthStore from "./utils/authStore.js";
import toast from "react-hot-toast";

const App = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  //you can declare the specific navigation tabs here
  // e.g. if admin, you can show the management page.

  return (
    <div>
      <Routes>
        {/* You can declare a boolean expression here that once it is true, the component will be included in the UI */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
};

export default App;
