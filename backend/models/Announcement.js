const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., 'Announcement', 'Progress Report', 'Meeting', 'Quest', 'Material'
  content: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Announcement", announcementSchema);
