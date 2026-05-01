import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";



const ASSIGNMENTS = [
  { id: 1, title: "Math: Algebra Quiz", subject: "Math", due: "Tomorrow", submitted: 3, total: 5 },
  { id: 2, title: "Science: Lab Report", subject: "Science", due: "3 days", submitted: 5, total: 5 },
  { id: 3, title: "History: Essay", subject: "History", due: "1 week", submitted: 1, total: 5 },
];

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ title: "", subject: "", due: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    fetchStudents();
    fetchAssignments();
    fetchMessages();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API}/api/students`);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`${API}/api/assignments`);
      setAssignments(res.data);
    } catch (err) {
      console.error("Error fetching assignments", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/api/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  const addAssignment = async () => {
    if (!newAssignment.title || !newAssignment.subject) return;
    try {
      const res = await axios.post(`${API}/api/assignments`, {
        ...newAssignment,
        total: 10
      });
      setAssignments(prev => [res.data.data, ...prev]);
      setNewAssignment({ title: "", subject: "", due: "" });
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding assignment", err);
    }
  };

  const handleQuickAction = async (type) => {
    try {
      if (type === "Create New Quest") {
        const title = window.prompt("Enter Quest Title:");
        if (!title) return;
        const xp = window.prompt("Enter XP Reward (e.g., 50):");
        if (!xp) return;
        await axios.post(`${API}/api/quests`, { title, xp: Number(xp) });
        showToast("Quest created successfully!");
      } else if (type === "Send Announcement") {
        const content = window.prompt("Enter your announcement message:");
        if (!content) return;
        await axios.post(`${API}/api/announcements`, { type, content });
        showToast("Announcement sent successfully!");
      } else if (type === "Generate Progress Report") {
        const confirm = window.confirm("Do you want to generate a class progress report and announce it?");
        if (!confirm) return;
        await axios.post(`${API}/api/reports/generate`);
        showToast("Progress report generated successfully!");
      } else if (type === "Schedule Parent Meeting") {
        const date = window.prompt("Enter meeting date (e.g., 2024-11-20):");
        if (!date) return;
        const time = window.prompt("Enter meeting time (e.g., 10:00 AM):");
        if (!time) return;
        const topic = window.prompt("Enter meeting topic:");
        if (!topic) return;
        await axios.post(`${API}/api/meetings`, { date, time, topic });
        showToast("Meeting scheduled successfully!");
      } else if (type === "Upload Study Material") {
        const title = window.prompt("Enter material title:");
        if (!title) return;
        const subject = window.prompt("Enter subject:");
        if (!subject) return;
        const link = window.prompt("Enter material link/URL:");
        if (!link) return;
        await axios.post(`${API}/api/materials`, { title, subject, link });
        showToast("Material uploaded successfully!");
      } else {
        await axios.post(`${API}/api/announcements`, { type, content: `Teacher generated a new ${type}` });
        showToast(`Successfully triggered: ${type}`);
      }
    } catch (err) {
      console.error("Error with quick action", err);
      showToast("Failed to perform action");
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#0a0e1a", minHeight: "100vh", color: "#fff" }}>
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(100,57,223,0.2) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(88,166,255,0.15) 0%, transparent 50%)", backgroundImage: "linear-gradient(to right, rgba(88,166,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(88,166,255,0.05) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      {toastMsg && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 999, background: "#3dd68c", color: "#000", padding: "12px 24px", borderRadius: 8, fontWeight: 700, boxShadow: "0 4px 12px rgba(61,214,140,0.4)" }}>
          ✅ {toastMsg}
        </div>
      )}

      {/* Nav */}
      <nav style={{ position: "relative", zIndex: 10, background: "rgba(27,39,57,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(163,113,247,0.2)", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "1.5rem" }}>📚</span>
          <span style={{ fontWeight: 900, fontSize: "1.3rem", background: "linear-gradient(90deg,#a371f7,#f778ba)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>EduCare — Teacher</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => navigate("/select-role")} style={btn("#30363d")}>Switch Role</button>
          <button onClick={logout} style={btn("rgba(255,80,80,0.2)", "#ff8080")}>Logout</button>
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>

        {/* Welcome */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#a371f7,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: 900, color: "#fff" }}>
              {(user?.name || "T").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 900, margin: 0 }}>Good day, {user?.name || "Teacher"}! 🧑‍🏫</h2>
              <p style={{ color: "rgba(255,255,255,0.5)", margin: "4px 0 0" }}>Here's your classroom overview for today</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
              {[
                { label: "Students", value: students.length, color: "#58a6ff" },
                { label: "Assignments", value: assignments.length, color: "#a371f7" },
                { label: "Avg Attendance", value: students.length > 0 ? `${Math.round((students.filter(s => s.lastAttendanceDate && new Date(s.lastAttendanceDate).toDateString() === new Date().toDateString()).length / students.length) * 100)}%` : "0%", color: "#3dd68c" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center", padding: "12px 20px", background: "rgba(255,255,255,0.05)", borderRadius: 12 }}>
                  <div style={{ fontSize: "1.6rem", fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
          {/* Students Table */}
          <div style={{ ...card, gridColumn: "1/-1" }}>
            <h3 style={{ ...secTitle, color: "#58a6ff" }}>👨‍🎓 Student Progress</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr>
                    {["Name", "Class", "XP", "Attendance", "Last Active", "Action"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "rgba(255,255,255,0.45)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => {
                    const attendedToday = s.lastAttendanceDate && new Date(s.lastAttendanceDate).toDateString() === new Date().toDateString();
                    return (
                      <tr key={s._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 600 }}>{s.name}</td>
                        <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.6)" }}>Class 7</td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ color: "#ffc107", fontWeight: 700 }}>⭐ {s.xp}</span>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ color: attendedToday ? "#3dd68c" : "#ff8080", fontWeight: 700 }}>{attendedToday ? "Present" : "Absent"}</span>
                        </td>
                        <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>{s.lastAttendanceDate ? new Date(s.lastAttendanceDate).toLocaleDateString() : "Never"}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <button style={{ ...btn("rgba(88,166,255,0.15)", "#58a6ff"), padding: "6px 12px", fontSize: "0.78rem" }}>View</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assignments */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ ...secTitle, color: "#a371f7", marginBottom: 0 }}>📋 Assignments</h3>
              <button onClick={() => setShowAddForm(v => !v)} style={btn("rgba(163,113,247,0.2)", "#a371f7")}>+ Add</button>
            </div>

            {showAddForm && (
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                {["title", "subject", "due"].map(field => (
                  <input key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={newAssignment[field]} onChange={e => setNewAssignment(p => ({ ...p, [field]: e.target.value }))}
                    style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "10px 12px", color: "#fff", fontFamily: "'Poppins',sans-serif", marginBottom: 8, boxSizing: "border-box", outline: "none" }}
                  />
                ))}
                <button onClick={addAssignment} style={{ ...btn("rgba(163,113,247,0.3)", "#a371f7"), width: "100%", padding: "10px" }}>Add Assignment</button>
              </div>
            )}

            {assignments.map(a => {
              const submittedCount = a.submissions ? a.submissions.length : 0;
              const totalStudents = students.length || 1;
              return (
                <div key={a._id || a.id} style={{ padding: "14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontWeight: 700, margin: 0 }}>{a.title}</p>
                      <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", margin: "4px 0 0" }}>{a.subject} • Due: {a.due}</p>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: submittedCount === totalStudents ? "#3dd68c" : "#ffc107", fontWeight: 700 }}>
                      {submittedCount}/{totalStudents} submitted
                    </span>
                  </div>
                  <div style={{ marginTop: 10, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${(submittedCount / totalStudents) * 100}%`, background: "linear-gradient(90deg,#a371f7,#f778ba)", transition: "width 0.5s" }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div style={card}>
            <h3 style={{ ...secTitle, color: "#3dd68c" }}>⚡ Quick Actions</h3>
            {[
              { emoji: "📢", label: "Send Announcement", color: "#58a6ff" },
              { emoji: "📊", label: "Generate Progress Report", color: "#a371f7" },
              { emoji: "📅", label: "Schedule Parent Meeting", color: "#3dd68c" },
              { emoji: "🎯", label: "Create New Quest", color: "#ffa726" },
              { emoji: "📝", label: "Upload Study Material", color: "#f778ba" },
            ].map((a, i) => (
              <button key={i} onClick={() => handleQuickAction(a.label)} style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                background: "rgba(255,255,255,0.04)", border: `1px solid ${a.color}22`,
                borderRadius: 10, padding: "14px 16px", marginBottom: 10,
                cursor: "pointer", color: "#fff", fontFamily: "'Poppins',sans-serif",
                fontWeight: 600, transition: "all 0.2s", fontSize: "0.9rem"
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${a.color}15`; e.currentTarget.style.borderColor = a.color; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = `${a.color}22`; }}
              >
                <span style={{ fontSize: "1.2rem" }}>{a.emoji}</span>
                <span>{a.label}</span>
              </button>
            ))}
          </div>

          {/* Messages from Parents */}
          <div style={{ ...card, gridColumn: "1/-1" }}>
            <h3 style={{ ...secTitle, color: "#f778ba" }}>💬 Messages from Parents</h3>
            {messages.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>No new messages.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {messages.map(m => (
                  <div key={m._id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(247,120,186,0.2)", borderRadius: 12, padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, color: "#f778ba" }}>{m.senderName} (Parent)</span>
                      <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                        {new Date(m.createdAt).toLocaleDateString()} {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>{m.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const card = { background: "rgba(27,39,57,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(163,113,247,0.1)", borderRadius: 20, padding: 28 };
const secTitle = { fontSize: "1.1rem", fontWeight: 800, marginTop: 0, marginBottom: 20 };
const btn = (bg, color = "#fff") => ({ background: bg, color, border: `1px solid ${color}33`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", fontFamily: "'Poppins', sans-serif", transition: "all 0.15s" });



// in teacher dashboard some feature are still unaddressed lik handlequickaction function  please analyse it and generate actual accurate backend for it and add it backend folder 