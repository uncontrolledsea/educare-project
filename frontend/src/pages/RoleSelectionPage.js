import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    id: "student",
    emoji: "🎓",
    label: "Student",
    desc: "Access quests, games, leaderboards & more",
    color: "#58a6ff",
    gradient: "linear-gradient(135deg, #58a6ff, #388bfd)",
  },
  {
    id: "teacher",
    emoji: "📚",
    label: "Teacher",
    desc: "Manage students, assignments & progress",
    color: "#a371f7",
    gradient: "linear-gradient(135deg, #a371f7, #7c3aed)",
  },
  {
    id: "parent",
    emoji: "👨‍👩‍👧",
    label: "Parent",
    desc: "Track your child's learning journey",
    color: "#3dd68c",
    gradient: "linear-gradient(135deg, #3dd68c, #059669)",
  },
];

export default function RoleSelectionPage() {
  const { setRole, user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await setRole(selected);
      navigate("/dashboard");
    } catch {
      alert("Failed to set role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-page">
      <div className="role-bg">
        <div className="aurora"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="role-content">
        <div className="role-header">
          <p className="role-greeting">👋 Welcome, <strong>{user?.name || "there"}!</strong></p>
          <h1 className="role-title">Who are you?</h1>
          <p className="role-sub">Choose your role to get the best experience</p>
        </div>

        <div className="role-cards">
          {roles.map((r) => (
            <div
              key={r.id}
              className={`role-card ${selected === r.id ? "selected" : ""}`}
              onClick={() => setSelected(r.id)}
              style={{ "--role-color": r.color, "--role-gradient": r.gradient }}
            >
              <div className="role-emoji">{r.emoji}</div>
              <h3 className="role-label">{r.label}</h3>
              <p className="role-desc">{r.desc}</p>
              {selected === r.id && <div className="role-check">✓</div>}
            </div>
          ))}
        </div>

        <button
          className="continue-btn"
          onClick={handleContinue}
          disabled={!selected || loading}
        >
          {loading ? "Setting up..." : "Continue as " + (roles.find(r => r.id === selected)?.label || "...")}
        </button>
      </div>

      <style>{`
        .role-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Poppins', sans-serif;
          background: #021028;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }
        .role-bg { position: fixed; inset: 0; z-index: 0; }
        .aurora {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 20% 15%, rgba(71,57,223,0.3) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 25%, rgba(233,34,173,0.5) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 90%, rgba(211,88,152,0.4) 0%, transparent 40%);
          animation: aurora-flow 30s ease-in-out infinite;
          background-size: 200% 200%;
        }
        .grid-overlay {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(to right, rgba(88,166,255,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(88,166,255,0.07) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        @keyframes aurora-flow {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .role-content {
          position: relative; z-index: 1;
          max-width: 900px; width: 100%;
          text-align: center;
          animation: slide-up 0.5s ease;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .role-header { margin-bottom: 40px; }
        .role-greeting { color: rgba(255,255,255,0.6); font-size: 1rem; margin-bottom: 8px; }
        .role-greeting strong { color: #58a6ff; }
        .role-title {
          font-size: 2.8rem; font-weight: 900; color: #fff; margin-bottom: 8px;
          background: linear-gradient(90deg, #58a6ff, #a371f7, #f778ba);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .role-sub { color: rgba(255,255,255,0.5); font-size: 1rem; }
        .role-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 36px;
        }
        .role-card {
          background: rgba(27,39,57,0.7);
          backdrop-filter: blur(12px);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 36px 24px;
          cursor: pointer;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }
        .role-card::before {
          content: '';
          position: absolute; inset: 0;
          background: var(--role-gradient);
          opacity: 0;
          transition: opacity 0.25s;
          border-radius: 18px;
        }
        .role-card:hover { border-color: var(--role-color); transform: translateY(-4px); }
        .role-card:hover::before { opacity: 0.08; }
        .role-card.selected {
          border-color: var(--role-color);
          box-shadow: 0 0 30px rgba(var(--role-color), 0.3), 0 8px 32px rgba(0,0,0,0.3);
          transform: translateY(-6px);
        }
        .role-card.selected::before { opacity: 0.15; }
        .role-emoji { font-size: 3rem; margin-bottom: 16px; position: relative; z-index: 1; }
        .role-label {
          font-size: 1.4rem; font-weight: 700; color: #fff;
          margin-bottom: 8px; position: relative; z-index: 1;
        }
        .role-desc {
          font-size: 0.85rem; color: rgba(255,255,255,0.55);
          position: relative; z-index: 1; line-height: 1.5;
        }
        .role-check {
          position: absolute; top: 14px; right: 14px;
          width: 28px; height: 28px;
          background: var(--role-gradient);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 0.85rem; font-weight: 700;
          z-index: 2;
        }
        .continue-btn {
          background: linear-gradient(135deg, #58a6ff, #a371f7);
          color: #fff; border: none; border-radius: 14px;
          padding: 16px 48px;
          font-size: 1.05rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Poppins', sans-serif;
          min-width: 280px;
        }
        .continue-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-2px); }
        .continue-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
      `}</style>
    </div>
  );
}
