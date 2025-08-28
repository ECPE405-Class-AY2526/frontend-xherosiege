import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardPage1 from "./pages/DashboardPage1.jsx";
import DashboardPage2 from "./pages/DashboardPage2.jsx";
import DashboardPage3 from "./pages/DashboardPage3.jsx";
import DashboardPage4 from "./pages/DashboardPage4.jsx";
import toast from "react-hot-toast";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App;
