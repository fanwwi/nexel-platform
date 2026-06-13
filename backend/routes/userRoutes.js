const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Подключение к твоей базе данных
const authMiddleware = require("../middleware/authMiddleware"); // Проверка токена (Защита)

// Эндпоинт сохранения аватара: POST http://localhost:5000/api/users/update-avatar
router.post("/update-avatar", authMiddleware, async (req, res) => {
  const { avatar } = req.body;
  const userId = req.user.id; // Достаем ID пользователя из токена

  if (!avatar) {
    return res.status(400).json({ message: "Файл аватара не передан" });
  }

  try {
    // Обновляем текстовое поле аватарки у текущего пользователя
    await db.query("UPDATE users SET avatar = ? WHERE id = ?", [
      avatar,
      userId,
    ]);

    res.json({ success: true, message: "Аватар успешно обновлен в системе" });
  } catch (err) {
    console.error("AVATAR UPLOAD ERROR:", err);
    res.status(500).json({ message: "Ошибка сервера при сохранении аватара" });
  }
});

module.exports = router;
