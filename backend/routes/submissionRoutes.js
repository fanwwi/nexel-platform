const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, submissionController.submitTask);
router.get("/my", authMiddleware, submissionController.getUserSubmissions);

module.exports = router;
