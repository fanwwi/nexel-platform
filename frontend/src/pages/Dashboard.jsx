import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/submissions/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSubmissions(data))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="bg-gradient-to-r from-[#121212] to-[#1c1c1c] border border-[#222222] p-8 rounded-lg mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            Welcome back, {user?.firstName || "Operator"}
          </h1>
          <p className="text-gray-400">
            Track task matrices, structural performance loops, and autonomous
            evaluation nodes.
          </p>
        </div>
        <div className="bg-[#222222] border border-[#333333] p-4 rounded-md text-center min-w-[140px]">
          <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
            Aggregate Scores
          </span>
          <span className="text-3xl font-extrabold text-[#ff6600]">
            {user?.points || 0} pts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-[#222222] pb-2">
            Recent AI Evaluations Log
          </h2>
          {submissions.length === 0 ? (
            <div className="bg-[#121212] border border-[#222222] p-6 rounded text-center text-gray-500 text-sm">
              No processing submissions logs indexed. Head over to the{" "}
              <Link to="/tasks" className="text-[#ff6600] underline">
                Tasks matrix
              </Link>{" "}
              to start deployment.
            </div>
          ) : (
            submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-[#121212] border border-[#222222] p-6 rounded-lg space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">
                    {sub.taskTitle}
                  </h3>
                  <span className="bg-emerald-950 border border-emerald-700 text-emerald-400 font-bold px-2.5 py-1 rounded text-xs">
                    +{sub.score} Pts
                  </span>
                </div>
                <p className="text-sm text-gray-400">{sub.feedback}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="bg-[#1c1c1c] p-2 rounded border border-[#2d2d2d]">
                    <span className="text-emerald-400 font-bold">
                      Strength:
                    </span>{" "}
                    {sub.strengths}
                  </div>
                  <div className="bg-[#1c1c1c] p-2 rounded border border-[#2d2d2d]">
                    <span className="text-[#ff6600] font-bold">Weakness:</span>{" "}
                    {sub.weaknesses}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-[#222222] pb-2">
            Quick Commands
          </h2>
          <div className="bg-[#121212] border border-[#222222] p-4 rounded-lg flex flex-col space-y-3">
            <Link
              to="/tasks"
              className="w-full bg-[#1c1c1c] hover:bg-[#252525] text-center border border-[#333333] text-white font-medium py-2.5 rounded transition"
            >
              Execute Platform Tasks
            </Link>
            <Link
              to="/leaderboard"
              className="w-full bg-[#ff6600] hover:bg-[#e65c00] text-center text-black font-bold py-2.5 rounded transition"
            >
              Global Matrix Standings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
