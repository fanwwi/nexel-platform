import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="border-b border-[#222222] bg-[#121212] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <Link
          to={token ? "/dashboard" : "/"}
          className="text-2xl font-black tracking-wider text-white"
        >
          NEX<span className="text-[#ff6600]">EL</span>
        </Link>
        {token && (
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-400">
            <Link to="/dashboard" className="hover:text-white transition">
              Dashboard
            </Link>
            <Link to="/tasks" className="hover:text-white transition">
              Tasks
            </Link>
            <Link to="/leaderboard" className="hover:text-white transition">
              Leaderboard
            </Link>
            <Link to="/profile" className="hover:text-white transition">
              Profile
            </Link>
          </nav>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {token ? (
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-sm font-semibold border border-[#333333] hover:border-red-600 px-4 py-2 rounded bg-transparent text-gray-300 hover:text-red-500 transition"
          >
            Sign Out
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-semibold text-gray-300 hover:text-white transition py-2 px-3"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-[#ff6600] text-black px-4 py-2 rounded hover:bg-[#e65c00] transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
