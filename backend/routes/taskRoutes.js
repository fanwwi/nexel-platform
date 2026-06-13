const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, taskController.getAllTasks);

module.exports = router;
