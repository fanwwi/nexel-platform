const db = require("../config/db");

exports.getAllTasks = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, title, description, category, points, difficulty FROM tasks",
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch platform tasks." });
  }
};
