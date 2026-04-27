import React from "react";
import { useAuth } from "../context/AuthContext";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import ParentDashboard from "./ParentDashboard";
import { useNavigate } from "react-router-dom";

export default function DashboardRouter() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user?.role) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#021028", color: "#fff", fontFamily: "'Poppins',sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p>No role selected.</p>
          <button onClick={() => navigate("/select-role")} style={{ marginTop: 16, padding: "12px 24px", background: "linear-gradient(135deg,#58a6ff,#a371f7)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            Select Role
          </button>
        </div>
      </div>
    );
  }

  if (user.role === "teacher") return <TeacherDashboard />;
  if (user.role === "parent") return <ParentDashboard />;
  return <StudentDashboard />;
}
