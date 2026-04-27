import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import DashboardRouter from "./pages/DashboardRouter";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#021028", color: "#fff", fontFamily: "'Poppins',sans-serif", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: "2rem", animation: "spin 1s linear infinite" }}>🌟</div>
      <p>Loading EduCare...</p>
      <style>{`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/select-role" element={<PrivateRoute><RoleSelectionPage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardRouter /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
