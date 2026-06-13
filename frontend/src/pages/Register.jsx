import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failure.");
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
          Create System Instance
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-900/40 border border-red-700 text-red-200 text-sm rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                First Name
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                required
                className="w-full bg-[#1c1c1c] border border-[#333333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#ff6600]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
                className="w-full bg-[#1c1c1c] border border-[#333333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#ff6600]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full bg-[#1c1c1c] border border-[#333333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#ff6600]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#ff6600] text-black font-bold py-3 rounded hover:bg-[#e65c00] transition mt-6"
          >
            Initialize Account
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-6 text-center">
          Already configured?{" "}
          <Link to="/login" className="text-[#ff6600] hover:underline">
            Execute access session
          </Link>
        </p>
      </div>
    </div>
  );
}
