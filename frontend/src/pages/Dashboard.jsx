import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, token, login } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [rank, setRank] = useState(null);

  useEffect(() => {
    if (!token || !user?.id) return;

    fetch("http://localhost:5000/api/leaderboard", {
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

    fetch("http://localhost:5000/api/submissions/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Ошибка загрузки решений");
        return r.json();
      })
      .then(setSubmissions)
      .catch((err) => console.error("Ошибка при получении решений:", err));
  }, [token]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Макс. размер 2MB");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64 = reader.result;

      try {
        const res = await fetch(
          "http://localhost:5000/api/users/update-avatar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ avatar: base64 }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Не удалось сохранить аватар на сервере",
          );
        }

        // Принудительно обновляем контекст авторизации новыми данными
        login(token, { ...user, avatar: base64 });
      } catch (error) {
        console.error("КРИТИЧЕСКАЯ ОШИБКА ЗАГРУЗКИ АВАТАРА:", error);
        alert(error.message || "Произошла ошибка при смене изображения");
      } finally {
        setUploading(false);
      }
    };
  };

  return (
    <div className="dash">
      {/* PROFILE */}
      <div className="profile-card">
        <label className="avatar-wrap">
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            disabled={uploading}
          />

          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="avatar-img" />
          ) : (
            <div className="avatar-fallback">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
          )}

          <div className="avatar-hover">
            {uploading ? "Загрузка..." : "Изменить"}
          </div>
        </label>

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
