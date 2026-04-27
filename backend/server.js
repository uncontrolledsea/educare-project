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
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

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

// Health check
app.get("/api/health", (req, res) => res.json({ status: "OK" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
