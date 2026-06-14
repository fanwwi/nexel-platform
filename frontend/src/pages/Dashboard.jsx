import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [rank, setRank] = useState(null);

  useEffect(() => {
    if (!token || !user?.id) return;

    fetch("https://nexel-platform.onrender.com/api/leaderboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const idx = data.findIndex((u) => u.id === user.id);
        setRank(idx !== -1 ? idx + 1 : null);
      })
      .catch(console.error);
  }, [token, user?.id]);

  useEffect(() => {
    if (!token) return;

    fetch("https://nexel-platform.onrender.com/api/submissions/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Ошибка загрузки решений");
        return r.json();
      })
      .then(setSubmissions)
      .catch((err) => console.error("Ошибка при получении решений:", err));
  }, [token]);

  return (
    <div className="dash">
      {/* PROFILE */}
      <div className="profile-card">
        <div className="avatar-fallback">
          {user?.firstName?.[0]}
          {user?.lastName?.[0]}
        </div>

        <div className="profile-info">
          <div className="name">
            {user?.firstName} {user?.lastName}
          </div>

          <div className="meta">
            {user?.country || "—"} · {user?.email}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat">
          <div className="label">Баллы</div>
          <div className="value accent">{user?.points || 0}</div>
        </div>

        <div className="stat">
          <div className="label">Место</div>
          <div className="value accent">#{rank || user?.rank || "—"}</div>
        </div>

        <div className="stat">
          <div className="label">Решения</div>
          <div className="value">{submissions.length}</div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid">
        {/* TRACKS */}
        <div className="card">
          <div className="title">Треки</div>

          <div className="track-list">
            <div className="track">Frontend</div>
            <div className="track">Backend</div>
            <div className="track">Project</div>
          </div>
        </div>

        {/* FLOW */}
        <div className="card">
          <div className="title">Система работы</div>

          <div className="flow">
            <div>01 · Задача</div>
            <div>02 · Решение</div>
            <div>03 · Отправка</div>
            <div>04 · Проверка</div>
          </div>

          <Link to="/tasks" className="btn">
            Перейти к задачам
          </Link>
        </div>
      </div>
    </div>
  );
}
