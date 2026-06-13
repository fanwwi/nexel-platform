const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = path.resolve(__dirname, "../database.sqlite");
const db = new sqlite3.Database(dbPath);

// Автоматическая инициализация таблиц (вместо ручного запуска скрипта)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      country TEXT,
      avatar TEXT,
      points INTEGER DEFAULT 0,
      role TEXT DEFAULT 'student'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      points INTEGER NOT NULL,
      difficulty TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      score INTEGER NOT NULL,
      feedback TEXT NOT NULL,
      strengths TEXT NOT NULL,
      weaknesses TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Заливаем стартовые задачи, если их еще нет
  db.get("SELECT COUNT(*) as count FROM tasks", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare(
        "INSERT INTO tasks (title, description, category, points, difficulty) VALUES (?, ?, ?, ?, ?)",
      );
      stmt.run(
        "Build a Responsive Navbar",
        "Create a highly responsive navigation bar using React and Tailwind CSS.",
        "frontend",
        50,
        "Easy",
      );
      stmt.run(
        "JWT Authentication API",
        "Implement a secure Express.js backend API with JWT register and login endpoints.",
        "backend",
        100,
        "Medium",
      );
      stmt.run(
        "Create an Agile Sprint Roadmap",
        "Draft a comprehensive 2-week sprint plan and product backlog for a SaaS platform.",
        "pm",
        75,
        "Medium",
      );
      stmt.finalize();
    }
  });
});

// Обертка для совместимости с кодом контроллеров (эмуляция pg)
module.exports = {
  query: (text, params = []) => {
    // Переводим синтаксис параметров из $1, $2 в знаки вопроса ? для SQLite
    const sql = text.replace(/\$\d+/g, "?");

    return new Promise((resolve, reject) => {
      if (sql.trim().startsWith("SELECT")) {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve({ rows });
        });
      } else {
        db.run(sql, params, function (err) {
          if (err) reject(err);
          else
            resolve({
              rows: [{ id: this.lastID }],
              lastID: this.lastID,
              changes: this.changes,
            });
        });
      }
    });
  },
};
