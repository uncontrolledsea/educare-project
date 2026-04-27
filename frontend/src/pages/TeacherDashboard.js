import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const STUDENTS = [
  { id: 1, name: "Aarav Sharma", grade: "7A", xp: 320, attendance: "92%", lastActive: "Today" },
  { id: 2, name: "Priya Patel", grade: "7A", xp: 450, attendance: "88%", lastActive: "Today" },
  { id: 3, name: "Rahul Desai", grade: "7B", xp: 210, attendance: "75%", lastActive: "Yesterday" },
  { id: 4, name: "Sneha Kulkarni", grade: "7B", xp: 580, attendance: "97%", lastActive: "Today" },
  { id: 5, name: "Arjun Mehta", grade: "8A", xp: 160, attendance: "68%", lastActive: "3 days ago" },
];

const ASSIGNMENTS = [
  { id: 1, title: "Math: Algebra Quiz", subject: "Math", due: "Tomorrow", submitted: 3, total: 5 },
  { id: 2, title: "Science: Lab Report", subject: "Science", due: "3 days", submitted: 5, total: 5 },
  { id: 3, title: "History: Essay", subject: "History", due: "1 week", submitted: 1, total: 5 },
];

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState(ASSIGNMENTS);
  const [newAssignment, setNewAssignment] = useState({ title: "", subject: "", due: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  const addAssignment = () => {
    if (!newAssignment.title || !newAssignment.subject) return;
    setAssignments(prev => [...prev, {
      id: Date.now(), ...newAssignment, due: newAssignment.due || "1 week", submitted: 0, total: 5
    }]);
    setNewAssignment({ title: "", subject: "", due: "" });
    setShowAddForm(false);
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#0a0e1a", minHeight: "100vh", color: "#fff" }}>
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(100,57,223,0.2) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(88,166,255,0.15) 0%, transparent 50%)", backgroundImage: "linear-gradient(to right, rgba(88,166,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(88,166,255,0.05) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

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
                { label: "Students", value: STUDENTS.length, color: "#58a6ff" },
                { label: "Assignments", value: assignments.length, color: "#a371f7" },
                { label: "Avg Attendance", value: "84%", color: "#3dd68c" },
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
                  {STUDENTS.map(s => (
                    <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "12px 14px", fontWeight: 600 }}>{s.name}</td>
                      <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.6)" }}>{s.grade}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ color: "#ffc107", fontWeight: 700 }}>⭐ {s.xp}</span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ color: parseInt(s.attendance) > 85 ? "#3dd68c" : parseInt(s.attendance) > 70 ? "#ffc107" : "#ff8080", fontWeight: 700 }}>{s.attendance}</span>
                      </td>
                      <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>{s.lastActive}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <button style={{ ...btn("rgba(88,166,255,0.15)", "#58a6ff"), padding: "6px 12px", fontSize: "0.78rem" }}>View</button>
                      </td>
                    </tr>
                  ))}
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

            {assignments.map(a => (
              <div key={a.id} style={{ padding: "14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontWeight: 700, margin: 0 }}>{a.title}</p>
                    <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", margin: "4px 0 0" }}>{a.subject} • Due: {a.due}</p>
                  </div>
                  <span style={{ fontSize: "0.8rem", color: a.submitted === a.total ? "#3dd68c" : "#ffc107", fontWeight: 700 }}>
                    {a.submitted}/{a.total} submitted
                  </span>
                </div>
                <div style={{ marginTop: 10, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
                  <div style={{ height: "100%", borderRadius: 3, width: `${(a.submitted / a.total) * 100}%`, background: "linear-gradient(90deg,#a371f7,#f778ba)", transition: "width 0.5s" }} />
                </div>
              </div>
            ))}
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
              <button key={i} style={{
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
        </div>
      </div>
    </div>
  );
}

const card = { background: "rgba(27,39,57,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(163,113,247,0.1)", borderRadius: 20, padding: 28 };
const secTitle = { fontSize: "1.1rem", fontWeight: 800, marginTop: 0, marginBottom: 20 };
const btn = (bg, color = "#fff") => ({ background: bg, color, border: `1px solid ${color}33`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", fontFamily: "'Poppins', sans-serif", transition: "all 0.15s" });
