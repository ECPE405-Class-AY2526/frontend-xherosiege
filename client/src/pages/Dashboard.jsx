import React from "react";
import { Routes, Route } from "react-router";
import DashboardNavbar from "../Components/DashboardNavbar";
import DashboardPage1 from "./DashboardPages/DashboardPage1";
import DashboardPage2 from "./DashboardPages/DashboardPage2";
import DashboardPage3 from "./DashboardPages/DashboardPage3";
import DashboardPage4 from "./DashboardPages/DashboardPage4";
import UsersPage from "./UsersPage";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <DashboardNavbar />
      <main className="flex-1 bg-base-100">
        <Routes>
          <Route path="/" element={<DashboardPage1 />} />
          <Route path="1" element={<DashboardPage1 />} />
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
