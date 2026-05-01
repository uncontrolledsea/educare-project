const mongoose = require("mongoose");

const questSchema = new mongoose.Schema({
  title: { type: String, required: true },
  xp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Quest", questSchema);
