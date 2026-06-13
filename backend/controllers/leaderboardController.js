const db = require("../config/db");

exports.getLeaderboard = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, first_name AS "firstName", last_name AS "lastName", points FROM users ORDER BY points DESC',
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Leaderboard compilation matrix error." });
  }
};
