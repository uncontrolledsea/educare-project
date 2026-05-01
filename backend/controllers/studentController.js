const User = require("../models/User");

exports.markAttendance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.lastAttendanceDate = new Date();
    await user.save();
    res.json({ message: "Attendance marked successfully", lastAttendanceDate: user.lastAttendanceDate });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.completeQuest = async (req, res) => {
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
    
    await user.save();
    
    res.json({ message: "Quest completed", xp: user.xp, completedQuests: user.completedQuests });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
