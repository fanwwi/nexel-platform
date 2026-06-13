import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <Link to={token ? "/dashboard" : "/"} className="logo">
          <span>NEXEL</span> Comunity
        </Link>

        {token && (
          <nav className="nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/tasks">Tasks</Link>
            <Link to="/leaderboard">Leaderboard</Link>
          </nav>
        )}
      </div>

      <div className="header-right">
        {token ? (
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="logout"
          >
            Sign out
          </button>
        ) : (
          <>
            <Link to="/login" className="link">
              Login
            </Link>
            <Link to="/register" className="btn">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
