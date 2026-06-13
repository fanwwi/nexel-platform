import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "", // Добавили поле страны в стейт
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.country) {
      setError("Пожалуйста, выберите страну");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          country: form.country, // Отправляем страну на бэкенд
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Ошибка регистрации");

      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  // Массив стран для выбора
  const countries = [
    "Узбекистан",
    "Казахстан",
    "Кыргызстан",
    "Таджикистан",
    "Туркменистан",
    "Россия",
  ];

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Создание аккаунта NEXEL</h2>
        <p className="auth-subtitle">Подключение к системе</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="row">
            <input
              required
              placeholder="Имя"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />

            <input
              required
              placeholder="Фамилия"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* ПОЛЕ ВЫБОРА СТРАНЫ */}
          <select
            required
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="auth-select"
          >
            <option value="" disabled>
              Выберите страну
            </option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* PASSWORD FIELD */}
          <div className="input-with-icon">
            <input
              required
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <span
              className="icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* CONFIRM PASSWORD FIELD */}
          <div className="input-with-icon">
            <input
              required
              type={showConfirm ? "text" : "password"}
              placeholder="Подтвердите пароль"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
            <span className="icon" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">Создать аккаунт</button>
        </form>

        <p className="auth-footer">
          Уже есть аккаунт? <Link to="/login">Войти в систему</Link>
        </p>
      </div>
    </div>
  );
}
