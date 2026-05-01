const mongoose = require("mongoose");

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

module.exports = mongoose.model("Assignment", assignmentSchema);
