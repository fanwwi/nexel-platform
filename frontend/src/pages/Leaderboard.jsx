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
      .then(setBoard)
      .catch(console.error);
  }, [token]);

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h1>Execution Leaderboard</h1>
        <p>Real-time ranking based on system points performance</p>
      </div>

      <div className="leaderboard-table">
        <div className="leaderboard-row leaderboard-head">
          <div>#</div>
          <div>User</div>
          <div className="right">Points</div>
        </div>

        {board.map((row, idx) => {
          const isMe = row.id === user?.id;

          return (
            <div key={row.id} className={`leaderboard-row ${isMe ? "me" : ""}`}>
              <div className="rank">
                <span>{idx + 1}</span>
              </div>

              <div className="name">
                {row.firstName} {row.lastName}
                {isMe && <span className="badge">YOU</span>}
              </div>

              <div className="points">{row.points}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
