const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "educare_secret_key_2024";
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://shuham:shubham123@cluster0.edrt2ka.mongodb.net/gamifiedDB";

// Connect MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "parent"], default: "student" },
  xp: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  lastAttendanceDate: { type: Date, default: null },
  completedQuests: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

// Assignment Schema
const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  due: { type: String, required: true },
  total: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now },
  submissions: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Pending', 'Submitted', 'Overdue'], default: 'Submitted' },
    marks: { type: Number, default: null }
  }]
});
const Assignment = mongoose.model("Assignment", assignmentSchema);

// Announcement Schema
const announcementSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., 'Announcement', 'Progress Report', 'Meeting', 'Quest', 'Material'
  content: { type: String },
  createdAt: { type: Date, default: Date.now }
});
const Announcement = mongoose.model("Announcement", announcementSchema);

// Quest Schema
const questSchema = new mongoose.Schema({
  title: { type: String, required: true },
  xp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Quest = mongoose.model("Quest", questSchema);

// Meeting Schema
const meetingSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  topic: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Meeting = mongoose.model("Meeting", meetingSchema);

// Material Schema
const materialSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  link: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Material = mongoose.model("Material", materialSchema);

// Middleware: verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ─── AUTH ROUTES ─────────────────────────────────────────────────────────────

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login success",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, xp: user.xp }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Set Role after login
app.post("/api/set-role", verifyToken, async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "teacher", "parent"].includes(role))
      return res.status(400).json({ message: "Invalid role" });

    await User.findByIdAndUpdate(req.user.id, { role });
    res.json({ message: "Role updated", role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get profile
app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update XP
app.post("/api/update-xp", verifyToken, async (req, res) => {
  try {
    const { xp } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { xp: xp || 0 } },
      { new: true }
    ).select("-password");
    res.json({ xp: user.xp });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── NEW FUNCTIONAL ROUTES ───────────────────────────────────────────────────

// Send a Message (Parent -> Teacher)
app.post("/api/messages", verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Message content required" });

    const message = new Message({
      senderId: req.user.id,
      senderName: req.user.name,
      content
    });
    await message.save();
    res.json({ message: "Message sent successfully", data: message });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get Messages (For Teacher)
app.get("/api/messages", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add Assignment (Teacher)
app.post("/api/assignments", verifyToken, async (req, res) => {
  try {
    const { title, subject, due, total } = req.body;
    if (!title || !subject || !due) return res.status(400).json({ message: "Missing fields" });

    const assignment = new Assignment({ title, subject, due, total: total || 10 });
    await assignment.save();
    res.json({ message: "Assignment added successfully", data: assignment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get Assignments
app.get("/api/assignments", verifyToken, async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Submit Assignment (Student)
app.post("/api/assignments/submit", verifyToken, async (req, res) => {
  try {
    const { assignmentId } = req.body;
    if (!assignmentId) return res.status(400).json({ message: "Assignment ID required" });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(s => s.studentId.toString() === req.user.id);
    if (existingSubmission) {
      return res.status(400).json({ message: "Already submitted" });
    }

    assignment.submissions.push({
      studentId: req.user.id,
      status: 'Submitted',
      marks: assignment.total // Giving full marks for simplicity
    });
    
    await assignment.save();
    res.json({ message: "Assignment submitted successfully", data: assignment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Post Announcement / Quick Action (Teacher)
app.post("/api/announcements", verifyToken, async (req, res) => {
  try {
    const { type, content } = req.body;
    if (!type) return res.status(400).json({ message: "Type is required" });

    const announcement = new Announcement({
      teacherId: req.user.id,
      type,
      content: content || `New ${type} posted`
    });
    await announcement.save();
    res.json({ message: `${type} created successfully`, data: announcement });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get Announcements
app.get("/api/announcements", verifyToken, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(20);
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add Quest (Teacher)
app.post("/api/quests", verifyToken, async (req, res) => {
  try {
    const { title, xp } = req.body;
    if (!title || !xp) return res.status(400).json({ message: "Title and XP required" });
    const quest = new Quest({ title, xp });
    await quest.save();
    res.json({ message: "Quest created successfully", data: quest });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get Quests
app.get("/api/quests", verifyToken, async (req, res) => {
  try {
    const quests = await Quest.find().sort({ createdAt: -1 });
    res.json(quests);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Schedule Meeting (Teacher)
app.post("/api/meetings", verifyToken, async (req, res) => {
  try {
    const { date, time, topic } = req.body;
    if (!date || !time || !topic) return res.status(400).json({ message: "Missing fields" });
    const meeting = new Meeting({ teacherId: req.user.id, date, time, topic });
    await meeting.save();
    
    const announcement = new Announcement({
      teacherId: req.user.id,
      type: "Meeting",
      content: `Parent Meeting Scheduled for ${date} at ${time}. Topic: ${topic}`
    });
    await announcement.save();

    res.json({ message: "Meeting scheduled successfully", data: meeting });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Upload Material (Teacher)
app.post("/api/materials", verifyToken, async (req, res) => {
  try {
    const { title, subject, link } = req.body;
    if (!title || !subject || !link) return res.status(400).json({ message: "Missing fields" });
    const material = new Material({ teacherId: req.user.id, title, subject, link });
    await material.save();

    const announcement = new Announcement({
      teacherId: req.user.id,
      type: "Material",
      content: `New Study Material added: ${title} (${subject}). Link: ${link}`
    });
    await announcement.save();

    res.json({ message: "Material uploaded successfully", data: material });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Generate Progress Report (Teacher)
app.post("/api/reports/generate", verifyToken, async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    const totalStudents = students.length;
    const avgXp = totalStudents > 0 ? students.reduce((acc, s) => acc + s.xp, 0) / totalStudents : 0;
    
    const reportContent = `Class Progress Report Generated. Total Students: ${totalStudents}. Average XP: ${avgXp.toFixed(2)}.`;
    
    const announcement = new Announcement({
      teacherId: req.user.id,
      type: "Progress Report",
      content: reportContent
    });
    await announcement.save();
    
    res.json({ message: "Progress Report generated successfully", data: announcement });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─── ADDED FUNCTIONAL ROUTES ─────────────────────────────────────────────────

// Get Students (For Teacher Dashboard)
app.get("/api/students", verifyToken, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Mark Attendance (For Student Dashboard)
app.post("/api/attendance", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.lastAttendanceDate = new Date();
    await user.save();
    res.json({ message: "Attendance marked successfully", lastAttendanceDate: user.lastAttendanceDate });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Complete Quest (For Student Dashboard)
app.post("/api/complete-quest", verifyToken, async (req, res) => {
  try {
    const { questId, xpReward } = req.body;
    if (!questId) return res.status(400).json({ message: "Quest ID required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.completedQuests.includes(questId)) {
      return res.status(400).json({ message: "Quest already completed" });
    }

    user.completedQuests.push(questId);
    user.xp += xpReward || 0;
    
    // Check level up or assign new badges if needed (optional logic)
    // For demo, just save
    await user.save();
    
    res.json({ message: "Quest completed", xp: user.xp, completedQuests: user.completedQuests });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get Child Data (For Parent Dashboard)
app.get("/api/parent/child-data", verifyToken, async (req, res) => {
  try {
    // For demo purposes, fetch the first student available
    // In a real app, this would use a childId reference stored in the parent's user document
    const child = await User.findOne({ role: "student" }).select("-password");
    if (!child) return res.status(404).json({ message: "No child assigned/found" });
    
    res.json(child);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Health check
app.get("/api/health", (req, res) => res.json({ status: "OK" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
