import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);

  const determineRankMatrix = (pts) => {
    if (!pts || pts < 50) return "Junior System Sandbox Dev";
    if (pts < 150) return "Intermediate Kernel Operator";
    return "Senior Core Principal Architect";
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="bg-[#121212] border border-[#222222] rounded-lg p-8 space-y-6">
        <div className="flex items-center space-x-6 border-b border-[#222222] pb-6">
          <div className="w-16 h-16 rounded-full bg-[#1c1c1c] border border-[#ff6600] flex items-center justify-center text-xl font-black text-[#ff6600]">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-xs font-mono text-gray-400 tracking-wider mt-0.5">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1c1c1c] border border-[#2d2d2d] p-4 rounded">
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Assigned Privilege Tier
            </span>
            <span className="text-sm font-semibold text-white uppercase tracking-widest">
              {user?.role || "student"}
            </span>
          </div>
          <div className="bg-[#1c1c1c] border border-[#2d2d2d] p-4 rounded">
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Aggregated Points Inventory
            </span>
            <span className="text-lg font-black text-[#ff6600]">
              {user?.points || 0} PTS
            </span>
          </div>
        </div>

        <div className="bg-[#1c1c1c] border border-[#2d2d2d] p-4 rounded">
          <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
            Platform Structural Rank Meta
          </span>
          <span className="text-md font-bold text-emerald-400">
            {determineRankMatrix(user?.points)}
          </span>
        </div>
      </div>
    </div>
  );
}
