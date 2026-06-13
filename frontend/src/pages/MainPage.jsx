import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function MainPage() {
  const { token } = useContext(AuthContext);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="main-wrapper">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="main-container">
        <div className="hero">
          <p className="badge">NEXEL</p>

          <h1>
            Система развития <span>инженерных навыков</span>
          </h1>

          <p className="subtitle">
            NEXEL — среда, где ты решаешь реальные задачи, работаешь с
            инженерными сценариями и прокачиваешься через практику.
          </p>

          <div className="cta">
            <Link to="/login" className="btn-primary">
              Войти в систему
            </Link>
            <Link to="/register" className="btn-secondary">
              Создать аккаунт
            </Link>
          </div>
        </div>

        <div className="grid">
          <div className="card">
            <h3>Задачи уровня продукта</h3>
            <p>
              Реальные инженерные кейсы: API, логика, архитектура и интерфейсы.
            </p>
          </div>

          <div className="card">
            <h3>AI-проверка решений</h3>
            <p>
              Анализ кода по качеству, структуре и логике с автоматической
              обратной связью.
            </p>
          </div>

          <div className="card">
            <h3>Соревновательная среда</h3>
            <p>Баллы, прогресс и лидерборд для измеримого роста навыков.</p>
          </div>
        </div>

        <p className="footer-note">Минимум теории. Максимум практики.</p>
      </div>
    </div>
  );
}
