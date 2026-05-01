const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/attendance", verifyToken, studentController.markAttendance);
router.post("/complete-quest", verifyToken, studentController.completeQuest);

module.exports = router;
