const { Pool } = require("pg");

// Инициализация пула соединений с БД (ссылка берется из переменной окружения)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Обязательно для облачных БД (Neon, Supabase)
  },
});

// Функция для инициализации структуры таблиц и дефолтных данных
const initDb = async () => {
  try {
    // 1. Создание таблиц
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        country TEXT,
        avatar TEXT,
        points INTEGER DEFAULT 0,
        role TEXT DEFAULT 'student'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        points INTEGER NOT NULL,
        difficulty TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        score INTEGER NOT NULL,
        feedback TEXT NOT NULL,
        strengths TEXT NOT NULL,
        weaknesses TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Наполнение стартовыми задачами, если таблица пуста
    const checkTasks = await pool.query("SELECT COUNT(*) as count FROM tasks");
    if (parseInt(checkTasks.rows[0].count) === 0) {
      const insertQuery = `
        INSERT INTO tasks (title, description, category, points, difficulty) 
        VALUES ($1, $2, $3, $4, $5)
      `;
      await pool.query(insertQuery, [
        "Build a Responsive Navbar",
        "Create a highly responsive navigation bar using React and Tailwind CSS.",
        "frontend",
        50,
        "Easy",
      ]);
      await pool.query(insertQuery, [
        "JWT Authentication API",
        "Implement a secure Express.js backend API with JWT register and login endpoints.",
        "backend",
        100,
        "Medium",
      ]);
      await pool.query(insertQuery, [
        "Create an Agile Sprint Roadmap",
        "Draft a comprehensive 2-week sprint plan and product backlog for a SaaS platform.",
        "pm",
        75,
        "Medium",
      ]);
      console.log("🚀 Стартовые задачи успешно добавлены в PostgreSQL.");
    }
  } catch (err) {
    console.error("🚨 Ошибка инициализации таблиц базы данных:", err);
  }
};

// Запуск инициализации при старте сервера
initDb();

// Обертка для совместимости с вашим текущим кодом контроллеров
module.exports = {
  query: async (text, params = []) => {
    // В Postgres параметры уже пишутся как $1, $2, поэтому замена регуляркой больше не нужна

    // Если это INSERT запрос, добавляем RETURNING id, чтобы методы типа result.rows[0].id или result.lastID не ломались
    let sql = text;
    if (
      sql.trim().toUpperCase().startsWith("INSERT") &&
      !sql.toUpperCase().includes("RETURNING")
    ) {
      sql += " RETURNING id";
    }

    const result = await pool.query(sql, params);

    // Эмулируем структуру ответа, которую ожидали ваши контроллеры
    return {
      rows: result.rows,
      lastID: result.rows[0]?.id || null, // Для совместимости с result.lastID
      changes: result.rowCount,
    };
  },
};
