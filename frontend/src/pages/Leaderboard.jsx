import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Leaderboard() {
  const { user, token } = useContext(AuthContext);
  const [board, setBoard] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/leaderboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBoard(data))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white">
          Live Execution Standings
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Real-time compilation sequence of top platform engineers based on
          scoring models.
        </p>
      </div>

      <div className="bg-[#121212] border border-[#222222] rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-[#1c1c1c] border-b border-[#222222] px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">
          <div className="col-span-2">Matrix Rank</div>
          <div className="col-span-7">Operator Candidate Identity</div>
          <div className="col-span-3 text-right">Yielded Scores</div>
        </div>
        <div className="divide-y divide-[#222222]">
          {board.map((row, idx) => {
            const isCurrentUser = row.id === user?.id;
            return (
              <div
                key={row.id}
                className={`grid grid-cols-12 px-6 py-4 items-center text-sm transition ${isCurrentUser ? "bg-[#ff6600]/10 text-[#ffaa66]" : "text-gray-300"}`}
              >
                <div className="col-span-2 font-black">
                  <span
                    className={`inline-block w-6 h-6 text-center leading-6 rounded text-xs ${isCurrentUser ? "bg-[#ff6600] text-black" : "bg-[#222222] text-gray-400"}`}
                  >
                    {idx + 1}
                  </span>
                </div>
                <div
                  className={`col-span-7 font-semibold ${isCurrentUser ? "text-[#ff6600]" : "text-gray-200"}`}
                >
                  {row.firstName} {row.lastName}{" "}
                  {isCurrentUser && (
                    <span className="text-[10px] font-bold uppercase border border-[#ff6600] text-[#ff6600] px-1.5 py-0.2 rounded ml-2">
                      Self Node
                    </span>
                  )}
                </div>
                <div
                  className={`col-span-3 text-right font-bold ${isCurrentUser ? "text-[#ff6600]" : "text-[#ff9955]"}`}
                >
                  {row.points}{" "}
                  <span className="text-[11px] font-normal text-gray-500">
                    pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
