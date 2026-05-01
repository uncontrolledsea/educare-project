import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const GAMES = [
  { id: "grammar_galaxy", emoji: "🔤", title: "Grammar Galaxy", desc: "Master English grammar", file: "grammar_galaxy.html" },
  { id: "history_timeline", emoji: "📜", title: "History Timeline", desc: "Journey through time", file: "history_timeline.html" },
  { id: "maths_bullseye", emoji: "🎯", title: "Maths Bullseye", desc: "Hit the right answer", file: "maths_bullseye.html" },
  { id: "science_lab", emoji: "🔬", title: "Science Lab", desc: "Experiment & discover", file: "science_lab.html" },
  { id: "phy_game", emoji: "⚛️", title: "Physics Nexus", desc: "Laws of the universe", file: "phy_game.html" },
  { id: "village_quest", emoji: "🏘️", title: "Village Quest", desc: "Rural India stories", file: "village_quest.html" },
  { id: "teacher_resolve", emoji: "🧑‍🏫", title: "Teacher Resolve", desc: "Solve classroom puzzles", file: "teacher_resolve.html" },
  { id: "hindi", emoji: "🪔", title: "Hindi Adventure", desc: "Learn Hindi language", file: "hindi.html" },
  { id: "state_spotter", emoji: "🗺️", title: "State Spotter", desc: "Know India's states", file: "state_spotter.html" },
  { id: "shape_sorter", emoji: "🔷", title: "Shape Sorter", desc: "Geometry made fun", file: "shape_sorter.html" },
  { id: "mission_CET", emoji: "📝", title: "Mission CET", desc: "CET exam tactics", file: "mission_CET.html" },
];

const BADGES = [
  { emoji: "🏆", label: "Champion" },
  { emoji: "⭐", label: "Star Learner" },
  { emoji: "🔥", label: "On Fire" },
  { emoji: "💡", label: "Curious Mind" },
  { emoji: "📚", label: "Bookworm" },
  { emoji: "🎯", label: "Sharpshooter" },
];



export default function StudentDashboard() {
  const { user, logout, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [quests, setQuests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchQuests();
    fetchAnnouncements();
  }, []);

  const fetchQuests = async () => {
    try {
      const res = await axios.get(`${API}/api/quests`);
      setQuests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API}/api/announcements`);
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const xp = user?.xp || 0;

  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;
  const userName = user?.name || "Student";
  const initial = userName.charAt(0).toUpperCase();

  const completeQuest = async (id, xpReward) => {
    try {
      await axios.post(`${API}/api/complete-quest`, { questId: id, xpReward });
      fetchProfile(); // Update user state with new XP and completed quests
    } catch (err) {
      console.error("Error completing quest", err);
      alert(err.response?.data?.message || "Failed to complete quest");
    }
  };

  const openGame = (file) => {
    window.open(`/games/${file}`, "_blank");
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#021028", minHeight: "100vh", color: "#fff", position: "relative" }}>
      {/* Animated background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse at 20% 15%, rgba(71,57,223,0.25) 0%, transparent 40%), radial-gradient(ellipse at 80% 25%, rgba(233,34,173,0.4) 0%, transparent 40%), radial-gradient(ellipse at 50% 90%, rgba(88,166,255,0.2) 0%, transparent 40%)",
        backgroundSize: "200% 200%"
      }} />
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(to right, rgba(88,166,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(88,166,255,0.07) 1px, transparent 1px)",
        backgroundSize: "50px 50px"
      }} />

      {/* Top Bar */}
      <nav style={{
        position: "relative", zIndex: 10,
        background: "rgba(27,39,57,0.8)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(88,166,255,0.15)",
        padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "1.5rem" }}>🌟</span>
          <span style={{ fontWeight: 900, fontSize: "1.3rem", background: "linear-gradient(90deg,#58a6ff,#a371f7,#f778ba)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>EduCare</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => navigate("/select-role")} style={btnStyle("#30363d")}>Switch Role</button>
          <button onClick={logout} style={btnStyle("rgba(255,80,80,0.2)", "#ff8080")}>Logout</button>
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>

        {/* Profile Card */}
        <div style={card}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, #a371f7, #f778ba)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", fontWeight: 900, color: "#fff", flexShrink: 0
            }}>{initial}</div>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 900, margin: 0 }}>Hey, {userName}! 👋</h2>
              <p style={{ color: "rgba(255,255,255,0.5)", margin: "4px 0 0" }}>Keep learning, keep growing!</p>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,193,7,0.15)", border: "1px solid rgba(255,193,7,0.3)",
                borderRadius: 40, padding: "8px 20px"
              }}>
                <span style={{ fontSize: "1.2rem" }}>⭐</span>
                <span style={{ fontWeight: 700, color: "#ffc107" }}>Level {level}</span>
                <span style={{ fontWeight: 900, fontSize: "1.3rem", color: "#ffca28" }}>{xp} XP</span>
              </div>
              <div style={{ marginTop: 8, height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, width: 200 }}>
                <div style={{ height: "100%", borderRadius: 4, width: `${xpInLevel}%`, background: "linear-gradient(90deg,#58a6ff,#a371f7)", transition: "width 0.5s" }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
          {/* Daily Quests */}
          <div style={card}>
            <h3 style={sectionTitle("🎯", "#3dd68c")}>Daily Quests</h3>
            {quests.length === 0 && <p style={{ color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>No quests available right now.</p>}
            {quests.map(q => {
              const isDone = user?.completedQuests?.includes(q._id);
              return (
              <div key={q._id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 16px", borderRadius: 12, marginBottom: 10,
                background: isDone ? "rgba(61,214,140,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isDone ? "rgba(61,214,140,0.3)" : "rgba(255,255,255,0.08)"}`,
                transition: "all 0.2s"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span>{isDone ? "✅" : "⬜"}</span>
                  <span style={{ fontWeight: 600, textDecoration: isDone ? "line-through" : "none", opacity: isDone ? 0.5 : 1 }}>{q.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "#ffc107", fontWeight: 700, fontSize: "0.9rem" }}>+{q.xp} XP</span>
                  {!isDone && (
                    <button onClick={() => completeQuest(q._id, q.xp)} style={{ ...btnStyle("rgba(88,166,255,0.2)", "#58a6ff"), padding: "6px 14px", fontSize: "0.8rem" }}>
                      Complete
                    </button>
                  )}
                </div>
              </div>
            )})}
          </div>

          {/* Badges */}
          <div style={card}>
            <h3 style={sectionTitle("🏅", "#a371f7")}>Achievement Badges</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {BADGES.map((b, i) => (
                <div key={i} style={{
                  textAlign: "center", padding: "16px 8px", borderRadius: 12,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "default"
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: 6 }}>{b.emoji}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div style={{ ...card, marginTop: 24 }}>
          <h3 style={sectionTitle("🎮", "#f778ba")}>Learning Games</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
            {GAMES.map(g => (
              <div key={g.id} onClick={() => openGame(g.file)} style={{
                padding: "20px 14px", borderRadius: 14, textAlign: "center",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(88,166,255,0.15)",
                cursor: "pointer", transition: "all 0.2s"
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#58a6ff"; e.currentTarget.style.background = "rgba(88,166,255,0.1)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(88,166,255,0.15)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ fontSize: "2.2rem", marginBottom: 8 }}>{g.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 4 }}>{g.title}</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>{g.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance & Homework */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
          <div style={card}>
            <h3 style={sectionTitle("📅", "#58a6ff")}>Attendance</h3>
            <AttendanceSection />
          </div>
          <div style={card}>
            <h3 style={sectionTitle("📝", "#ffa726")}>Homework</h3>
            <HomeworkSection />
          </div>
        </div>
      </div>

      {/* Chat Bot Button */}
      <button
        onClick={() => setChatOpen(o => !o)}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 100,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg,#58a6ff,#a371f7)",
          border: "none", fontSize: "1.5rem", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(88,166,255,0.4)", transition: "transform 0.2s"
        }}
        title="AI Chatbot"
      >🤖</button>

      {chatOpen && (
        <div style={{
          position: "fixed", bottom: 100, right: 28, zIndex: 99,
          width: 350, height: 480, borderRadius: 16,
          background: "rgba(27,39,57,0.95)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(88,166,255,0.3)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
        }}>
          <iframe src="/games/chatbot.html" title="AI Chatbot" style={{ width: "100%", height: "100%", border: "none", borderRadius: 16 }} />
        </div>
      )}
    </div>
  );
}

function AttendanceSection() {
  const { user, fetchProfile } = useAuth();
  
  const todayStr = new Date().toDateString();
  const marked = user?.lastAttendanceDate && new Date(user.lastAttendanceDate).toDateString() === todayStr;
  
  const markAttendance = async () => {
    try {
      await axios.post(`${API}/api/attendance`);
      fetchProfile();
    } catch (err) {
      console.error("Error marking attendance", err);
    }
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return (
    <div>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 16, fontSize: "0.9rem" }}>{today}</p>
      {marked ? (
        <div style={{ textAlign: "center", padding: "20px", color: "#3dd68c", fontWeight: 700 }}>
          ✅ Attendance marked for today!
        </div>
      ) : (
        <button onClick={markAttendance} style={{
          width: "100%", padding: "14px",
          background: "linear-gradient(135deg,#58a6ff,#388bfd)",
          border: "none", borderRadius: 12, color: "#fff",
          fontWeight: 700, cursor: "pointer", fontSize: "1rem",
          fontFamily: "'Poppins', sans-serif"
        }}>
          Mark Attendance
        </button>
      )}
    </div>
  );
}

function HomeworkSection() {
  const { user } = useAuth();
  const [hw, setHw] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`${API}/api/assignments`);
      // map backend assignments to match the format used
      const mapped = res.data.map(a => {
        const submission = a.submissions?.find(s => s.studentId === user.id);
        return {
          id: a._id,
          title: a.title,
          due: a.due,
          status: submission ? submission.status : "Pending",
          marks: submission ? submission.marks : null
        };
      });
      setHw(mapped);
    } catch (err) {
      console.error("Error fetching assignments", err);
    }
  };

  const submit = async (id) => {
    try {
      await axios.post(`${API}/api/assignments/submit`, { assignmentId: id });
      fetchAssignments(); // refresh to show submitted status
    } catch (err) {
      console.error("Error submitting assignment", err);
      alert(err.response?.data?.message || "Failed to submit assignment");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {hw.map(h => (
        <div key={h.id} style={{
          padding: "12px 14px", borderRadius: 10,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>{h.title}</p>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", margin: "4px 0 0" }}>Due: {h.due}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {h.status === "Submitted" ? (
                <span style={{ color: "#3dd68c", fontWeight: 700, fontSize: "0.85rem" }}>✅ {h.marks}/10 marks</span>
              ) : (
                <button onClick={() => submit(h.id)} style={{
                  ...btnStyle("rgba(61,214,140,0.2)", "#3dd68c"), padding: "6px 12px", fontSize: "0.78rem"
                }}>Submit</button>
              )}
            </div>
          </div>
          <span style={{
            display: "inline-block", marginTop: 6,
            fontSize: "0.75rem", fontWeight: 600, padding: "2px 10px", borderRadius: 20,
            background: h.status === "Overdue" ? "rgba(255,80,80,0.15)" : h.status === "Submitted" ? "rgba(61,214,140,0.15)" : "rgba(255,193,7,0.15)",
            color: h.status === "Overdue" ? "#ff8080" : h.status === "Submitted" ? "#3dd68c" : "#ffc107"
          }}>{h.status}</span>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "rgba(27,39,57,0.7)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(88,166,255,0.12)",
  borderRadius: 20,
  padding: 28
};

const sectionTitle = (emoji, color) => ({
  fontSize: "1.2rem", fontWeight: 800, marginTop: 0, marginBottom: 20,
  display: "flex", alignItems: "center", gap: 10, color
});

const btnStyle = (bg, color = "#fff") => ({
  background: bg, color, border: `1px solid ${color}22`,
  borderRadius: 8, padding: "8px 16px", cursor: "pointer",
  fontWeight: 600, fontSize: "0.85rem", fontFamily: "'Poppins', sans-serif",
  transition: "all 0.15s"
});
