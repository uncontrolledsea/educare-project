const mongoose = require("mongoose");

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

module.exports = mongoose.model("User", userSchema);
