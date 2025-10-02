import React from "react";
import { Link } from "react-router";

const LandPageNav = () => {
  return (
    <header className="bg-base-100 border-b border-base-content/10">
      <div className="mx-auto max-w-10xl px-4 py-5 flex justify-between items-center mb-0">
        <div className="flex space-x-6">
          <button className="text-black font-medium">Home</button>
          <button className="text-black font-medium">About us</button>
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/register">
            <button className="bg-green-600 text-black rounded-full px-6 py-2 font-medium">
              Sign up
            </button>
          </Link>
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center"></div>
        </div>
      </div>
    </header>
  );
};
export default LandPageNav;
