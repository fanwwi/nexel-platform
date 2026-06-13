const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    // Проверяем существование пользователя
    const userExist = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userExist.rows && userExist.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Вставляем данные напрямую через наш адаптер
    const result = await db.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
      [firstName, lastName, email, hashedPassword],
    );

    // Наш адаптер db.js для SQLite возвращает id через result.lastID
    const userId = result.lastID;
    const token = jwt.sign(
      { id: userId, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(201).json({
      token,
      user: {
        id: userId,
        firstName,
        lastName,
        email,
        points: 0,
        role: "student",
      },
    });
  } catch (error) {
    // Если что-то пойдет не так, ошибка ОБЯЗАТЕЛЬНО напечатается в терминале бэкенда
    console.error("CRITICAL REGISTER ERROR:", error);
    res
      .status(500)
      .json({ message: "Server registration error.", detail: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!result.rows || result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email credentials." });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password credentials." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        points: user.points,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("CRITICAL LOGIN ERROR:", error);
    res.status(500).json({ message: "Server login error." });
  }
};

exports.getMe = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, first_name AS "firstName", last_name AS "lastName", email, points, role FROM users WHERE id = $1',
      [req.user.id],
    );
    if (!result.rows || result.rows.length === 0)
      return res.status(404).json({ message: "User non-existent." });
    res.json(result.rows[0]);
  } catch (error) {
    console.error("CRITICAL GETME ERROR:", error);
    res.status(500).json({ message: "Server profile fetch error." });
  }
};
