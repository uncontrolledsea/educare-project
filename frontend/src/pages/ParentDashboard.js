import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CHILD_DATA = {
  name: "Aarav Sharma",
  grade: "Class 7A",
  xp: 320,
  level: 4,
  attendance: 92,
  homeworkDone: 8,
  homeworkTotal: 10,
  badges: ["🏆", "⭐", "🔥", "💡"],
  recentActivity: [
    { day: "Mon", activity: "Completed Math Quiz", xp: 50, time: "10:30 AM" },
    { day: "Tue", activity: "Played Grammar Galaxy", xp: 30, time: "2:15 PM" },
    { day: "Wed", activity: "Attended Science Lab", xp: 40, time: "11:00 AM" },
    { day: "Thu", activity: "Finished History Essay", xp: 60, time: "4:00 PM" },
    { day: "Fri", activity: "Physics Nexus Game", xp: 35, time: "3:30 PM" },
  ],
  subjects: [
    { name: "Mathematics", progress: 75, grade: "A" },
    { name: "Science", progress: 82, grade: "A+" },
    { name: "English", progress: 68, grade: "B" },
    { name: "History", progress: 60, grade: "B+" },
    { name: "Hindi", progress: 88, grade: "A+" },
  ]
};

export default function ParentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [msgSent, setMsgSent] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#021028", minHeight: "100vh", color: "#fff" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "radial-gradient(ellipse at 10% 10%, rgba(61,214,140,0.15) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(88,166,255,0.1) 0%, transparent 50%)" }} />

      <nav style={{ position: "relative", zIndex: 10, background: "rgba(27,39,57,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(61,214,140,0.2)", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "1.5rem" }}>👨‍👩‍👧</span>
          <span style={{ fontWeight: 900, fontSize: "1.3rem", background: "linear-gradient(90deg,#3dd68c,#58a6ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>EduCare — Parent</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => navigate("/select-role")} style={btn("#30363d")}>Switch Role</button>
          <button onClick={logout} style={btn("rgba(255,80,80,0.2)", "#ff8080")}>Logout</button>
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
        {/* Welcome */}
        <div style={card}>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Welcome back, {user?.name || "Parent"}!</p>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 900, margin: "0 0 4px" }}>👧 {CHILD_DATA.name}'s Learning Report</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>{CHILD_DATA.grade} • Active Learner</p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginTop: 20 }}>
          {[
            { label: "Total XP", value: `⭐ ${CHILD_DATA.xp}`, color: "#ffc107" },
            { label: "Level", value: `🏅 ${CHILD_DATA.level}`, color: "#58a6ff" },
            { label: "Attendance", value: `📅 ${CHILD_DATA.attendance}%`, color: "#3dd68c" },
            { label: "Homework", value: `📝 ${CHILD_DATA.homeworkDone}/${CHILD_DATA.homeworkTotal}`, color: "#a371f7" },
            { label: "Badges", value: `🏆 ${CHILD_DATA.badges.length}`, color: "#f778ba" },
          ].map(s => (
            <div key={s.label} style={{ ...card, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
          {/* Subject Progress */}
          <div style={card}>
            <h3 style={{ ...st, color: "#58a6ff" }}>📊 Subject Progress</h3>
            {CHILD_DATA.subjects.map(s => (
              <div key={s.name} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.name}</span>
                  <span style={{ color: "#ffc107", fontWeight: 700, fontSize: "0.85rem" }}>{s.grade}</span>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>
                  <div style={{ height: "100%", borderRadius: 4, width: `${s.progress}%`, background: "linear-gradient(90deg,#58a6ff,#3dd68c)", transition: "width 0.8s" }} />
                </div>
                <div style={{ textAlign: "right", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{s.progress}%</div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div style={card}>
            <h3 style={{ ...st, color: "#3dd68c" }}>⚡ This Week's Activity</h3>
            {CHILD_DATA.recentActivity.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(61,214,140,0.15)", border: "1px solid rgba(61,214,140,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem", color: "#3dd68c", flexShrink: 0 }}>{a.day}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>{a.activity}</p>
                  <p style={{ margin: "3px 0 0", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>{a.time} • <span style={{ color: "#ffc107" }}>+{a.xp} XP</span></p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Teacher */}
          <div style={{ ...card, gridColumn: "1/-1" }}>
            <h3 style={{ ...st, color: "#a371f7" }}>💬 Message the Teacher</h3>
            {msgSent ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#3dd68c", fontWeight: 700 }}>✅ Message sent successfully!</div>
            ) : (
              <div style={{ display: "flex", gap: 12 }}>
                <input value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Type your message to the teacher..."
                  style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(163,113,247,0.3)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontFamily: "'Poppins',sans-serif", outline: "none", fontSize: "0.9rem" }}
                />
                <button onClick={() => { if (message.trim()) setMsgSent(true); }} style={{ ...btn("rgba(163,113,247,0.3)", "#a371f7"), padding: "12px 24px" }}>Send</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const card = { background: "rgba(27,39,57,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(61,214,140,0.1)", borderRadius: 20, padding: 28 };
const st = { fontSize: "1.1rem", fontWeight: 800, marginTop: 0, marginBottom: 20 };
const btn = (bg, color = "#fff") => ({ background: bg, color, border: `1px solid ${color}33`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", fontFamily: "'Poppins', sans-serif" });
