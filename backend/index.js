require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
// 1. ИМПОРТИРУЕМ РОУТ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ / АВАТАРОВ
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Main Core Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
// 2. ПОДКЛЮЧАЕМ ЕГО В СИСТЕМУ
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `NEXEL Engine executing live server context on internal port: ${PORT}`,
  );
});
