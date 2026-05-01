const express = require("express");
const router = express.Router();
const parentController = require("../controllers/parentController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/child-data", verifyToken, parentController.getChildData);

module.exports = router;
