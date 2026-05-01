const User = require("../models/User");
const Announcement = require("../models/Announcement");
const Quest = require("../models/Quest");
const Meeting = require("../models/Meeting");
const Material = require("../models/Material");
const Assignment = require("../models/Assignment");

exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getStudentProgress = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await User.findById(studentId).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });

    const assignments = await Assignment.find();
    const studentAssignments = assignments.map(a => {
      const sub = (a.submissions || []).find(s => s.studentId && s.studentId.toString() === studentId);
      return {
        id: a._id,
        title: a.title,
        subject: a.subject,
        due: a.due,
        total: a.total,
        status: sub ? sub.status : "Pending",
        marks: sub ? sub.marks : null
      };
    });

    res.json({
      student,
      assignments: studentAssignments
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.postAnnouncement = async (req, res) => {
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
};

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(20);
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addQuest = async (req, res) => {
  try {
    const { title, xp } = req.body;
    if (!title || !xp) return res.status(400).json({ message: "Title and XP required" });
    const quest = new Quest({ title, xp });
    await quest.save();
    res.json({ message: "Quest created successfully", data: quest });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getQuests = async (req, res) => {
  try {
    const quests = await Quest.find().sort({ createdAt: -1 });
    res.json(quests);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.scheduleMeeting = async (req, res) => {
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
};

exports.uploadMaterial = async (req, res) => {
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
};

exports.generateReport = async (req, res) => {
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
};
