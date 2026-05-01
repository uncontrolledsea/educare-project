const User = require("../models/User");

exports.getChildData = async (req, res) => {
  try {
    // For demo purposes, fetch the first student available
    // In a real app, this would use a childId reference stored in the parent's user document
    const child = await User.findOne({ role: "student" }).select("-password");
    if (!child) return res.status(404).json({ message: "No child assigned/found" });
    
    res.json(child);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
