const db = require("../config/db");
const aiService = require("../services/aiService");

exports.submitTask = async (req, res) => {
  const { taskId, content } = req.body;
  const userId = req.user.id;

  try {
    const taskResult = await db.query("SELECT * FROM tasks WHERE id = $1", [
      taskId,
    ]);
    if (taskResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Target task context not found." });
    }
    const task = taskResult.rows[0];

    // Trigger AI Service layer assessment
    const evaluation = await aiService.evaluateSubmission(content, task.points);

    await db.query(
      "INSERT INTO submissions (user_id, task_id, content, score, feedback, strengths, weaknesses) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        userId,
        taskId,
        content,
        evaluation.score,
        evaluation.feedback,
        evaluation.strengths,
        evaluation.weaknesses,
      ],
    );

    // Update student aggregates
    await db.query("UPDATE users SET points = points + $1 WHERE id = $2", [
      evaluation.score,
      userId,
    ]);

    res.status(201).json({
      message: "Submission successfully evaluated.",
      score: evaluation.score,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Submission execution transaction crash." });
  }
};

exports.getUserSubmissions = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.id, s.score, s.feedback, s.strengths, s.weaknesses, s.created_at AS "createdAt", t.title AS "taskTitle"
       FROM submissions s
       JOIN tasks t ON s.task_id = t.id
       WHERE s.user_id = $1 ORDER BY s.created_at DESC`,
      [req.user.id],
    );
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch structural submissions history." });
  }
};
