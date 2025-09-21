import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const hasToken = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow flex items-center justify-between">
      <div className="font-bold text-lg">
        <Link to="/" className="hover:underline">BugReporter</Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/admin" className="hover:underline">Admin</Link>
        {!hasToken && <Link to="/login" className="hover:underline">Login</Link>}
        {!hasToken && <Link to="../" className="hover:underline">Sign Up</Link>}
        {hasToken && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
