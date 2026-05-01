const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "educare_secret_key_2024";

exports.register = async (req, res) => {
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
};

exports.login = async (req, res) => {
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
};

exports.setRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "teacher", "parent"].includes(role))
      return res.status(400).json({ message: "Invalid role" });

    await User.findByIdAndUpdate(req.user.id, { role });
    res.json({ message: "Role updated", role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateXp = async (req, res) => {
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
};
