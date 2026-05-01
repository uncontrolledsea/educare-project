const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/students", verifyToken, teacherController.getStudents);
router.get("/students/:id/progress", verifyToken, teacherController.getStudentProgress);
router.post("/announcements", verifyToken, teacherController.postAnnouncement);
router.get("/announcements", verifyToken, teacherController.getAnnouncements);
router.post("/quests", verifyToken, teacherController.addQuest);
router.get("/quests", verifyToken, teacherController.getQuests);
router.post("/meetings", verifyToken, teacherController.scheduleMeeting);
router.post("/materials", verifyToken, teacherController.uploadMaterial);
router.post("/reports/generate", verifyToken, teacherController.generateReport);

module.exports = router;
