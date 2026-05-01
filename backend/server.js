const express = require("express");
const cors = require("cors");
require("dotenv").config(); // In case dotenv is used later
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const parentRoutes = require("./routes/parentRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes); // /api/register, /api/login, /api/set-role, etc.
app.use("/api/teacher", teacherRoutes); // Actually, the routes were flat. Let's stick to flat routes to match frontend or we can mount them individually.
// Wait, in server.js, the routes were:
// /api/register, /api/login, /api/set-role, /api/profile, /api/update-xp
// /api/students
// /api/announcements (GET and POST)
// /api/quests (GET and POST)
// /api/meetings (POST)
// /api/materials (POST)
// /api/reports/generate (POST)
// /api/attendance (POST)
// /api/complete-quest (POST)
// /api/parent/child-data (GET)
// /api/assignments (GET and POST and POST /submit)
// /api/messages (GET and POST)

// Let's mount them properly to match the previous paths exactly.
app.use("/api", authRoutes); // authRoutes has /register, /login, /set-role, /profile, /update-xp
app.use("/api", teacherRoutes); // teacherRoutes has /students, /announcements, /quests, /meetings, /materials, /reports/generate
app.use("/api", studentRoutes); // studentRoutes has /attendance, /complete-quest
app.use("/api/parent", parentRoutes); // parentRoutes has /child-data -> /api/parent/child-data
app.use("/api/assignments", assignmentRoutes); // assignmentRoutes has /, /submit
app.use("/api/messages", messageRoutes); // messageRoutes has /

// Health check
app.get("/api/health", (req, res) => res.json({ status: "OK" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
