const Assignment = require("../models/Assignment");

exports.addAssignment = async (req, res) => {
  try {
    const { title, subject, due, total } = req.body;
    if (!title || !subject || !due) return res.status(400).json({ message: "Missing fields" });

    const assignment = new Assignment({ title, subject, due, total: total || 10 });
    await assignment.save();
    res.json({ message: "Assignment added successfully", data: assignment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    if (!assignmentId) return res.status(400).json({ message: "Assignment ID required" });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

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
};
