const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, assignmentController.addAssignment);
router.get("/", verifyToken, assignmentController.getAssignments);
router.post("/submit", verifyToken, assignmentController.submitAssignment);

module.exports = router;
