import React from "react";
import { Routes, Route } from "react-router";
import DashboardNavbar from "../Components/DashboardNavbar";
// import DashboardPage1 from "./DashboardPages/DashboardPage1";
import SoilDashboard from "./DashboardPages/SoilDashboard";
import DashboardPage2 from "./DashboardPages/DashboardPage2";
import DashboardPage3 from "./DashboardPages/DashboardPage3";
import DashboardPage4 from "./DashboardPages/DashboardPage4";
import UsersPage from "./UsersPage";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <DashboardNavbar />
      <main className="ml-64 bg-base-100 min-h-screen">
        <Routes>
          <Route path="/" element={<SoilDashboard />} />
          <Route path="1" element={<SoilDashboard />} />
          <Route path="2" element={<DashboardPage2 />} />
          <Route path="3" element={<DashboardPage3 />} />
          <Route path="4" element={<DashboardPage4 />} />
          <Route path="users" element={<UsersPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
