import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../utils/AuthContext";

const DashboardNavbar = () => {
  const { pathname } = useLocation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const btnClass = (path) =>
    `btn w-11/12 mx-auto ${pathname === path ? "btn-active btn-outline" : ""}`;

  return (
    <aside className="h-screen w-64 bg-base-200 flex flex-col justify-between shadow-lg">
      {/* Logo/Header section */}
      <div className="flex flex-col items-center py-8">
        <div className="w-16 h-16 bg-primary rounded-full mb-2"></div>
        <span className="text-xl font-bold text-base-content">
          Placeholder Title
        </span>
      </div>
      {/* Top section: 4 placeholder buttons */}
      <nav className="flex flex-col gap-2 mt-2">
        <Link to="/dashboard/1" className={btnClass("/dashboard/1")}>
          Placeholder 1
        </Link>
        <Link to="/dashboard/2" className={btnClass("/dashboard/2")}>
          Placeholder 2
        </Link>
        <Link to="/dashboard/3" className={btnClass("/dashboard/3")}>
          Placeholder 3
        </Link>
        <Link to="/dashboard/4" className={btnClass("/dashboard/4")}>
          Placeholder 4
        </Link>
      </nav>
      {/* Bottom section: Logout button */}
      <div className="mb-6">
        <button
          className="btn btn-error w-11/12 mx-auto flex"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardNavbar;
