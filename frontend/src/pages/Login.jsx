import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed execution.");
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-[#0b0b0b]">
      <div className="w-full max-w-md bg-[#121212] p-8 rounded-lg border border-[#222222]">
        <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
          Engine Authentication
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-900/40 border border-red-700 text-red-200 text-sm rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1c1c1c] border border-[#333333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#ff6600]"
              placeholder="name@domain.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1c1c1c] border border-[#333333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#ff6600]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#ff6600] text-black font-bold py-3 rounded hover:bg-[#e65c00] transition mt-6"
          >
            Authenticate
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-6 text-center">
          New variant instance?{" "}
          <Link to="/register" className="text-[#ff6600] hover:underline">
            Register pipeline
          </Link>
        </p>
      </div>
    </div>
  );
}
