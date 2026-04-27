import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
        alert("Registered successfully! Please login.");
        setIsRegister(false);
        setForm({ name: "", email: "", password: "" });
      } else {
        const userData = await login(form.email, form.password);
        // If user already has a role, go to dashboard; else role selection
        if (userData.role) {
          navigate("/dashboard");
        } else {
          navigate("/select-role");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="aurora"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="login-card">
        <div className="login-logo">
          <span className="logo-star">🌟</span>
          <h1>EduCare</h1>
          <span className="logo-star">🌟</span>
        </div>
        <p className="login-subtitle">Your gateway to gamified learning</p>

        <h2 className="form-title">{isRegister ? "Create Account" : "Welcome Back"}</h2>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="login-input"
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="login-input"
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="toggle-text" onClick={() => { setIsRegister(!isRegister); setError(""); }}>
          {isRegister ? "Already have an account? Login" : "New user? Register here"}
        </p>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Poppins', sans-serif;
          position: relative;
          overflow: hidden;
          background: #021028;
        }
        .login-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
        }
        .aurora {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 20% 15%, rgba(71,57,223,0.3) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 25%, rgba(233,34,173,0.5) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 90%, rgba(211,88,152,0.4) 0%, transparent 40%);
          animation: aurora-flow 30s ease-in-out infinite;
          background-size: 200% 200%;
        }
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(88,166,255,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(88,166,255,0.07) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        @keyframes aurora-flow {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .login-card {
          position: relative;
          z-index: 1;
          background: rgba(27,39,57,0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(88,166,255,0.2);
          border-radius: 24px;
          padding: 48px 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 0 60px rgba(88,166,255,0.1);
          animation: slide-up 0.5s ease;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .login-logo h1 {
          font-size: 2.2rem;
          font-weight: 900;
          background: linear-gradient(90deg, #58a6ff, #a371f7, #f778ba);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .logo-star { font-size: 1.5rem; }
        .login-subtitle {
          text-align: center;
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
          margin-bottom: 32px;
        }
        .form-title {
          color: #fff;
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 20px;
          text-align: center;
        }
        .error-msg {
          background: rgba(255,80,80,0.15);
          border: 1px solid rgba(255,80,80,0.3);
          color: #ff8080;
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 16px;
          font-size: 0.9rem;
          text-align: center;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .login-input {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(88,166,255,0.25);
          border-radius: 12px;
          padding: 14px 16px;
          color: #fff;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
          font-family: 'Poppins', sans-serif;
        }
        .login-input::placeholder { color: rgba(255,255,255,0.35); }
        .login-input:focus { border-color: #58a6ff; }
        .login-btn {
          background: linear-gradient(135deg, #58a6ff, #a371f7);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
          font-family: 'Poppins', sans-serif;
          margin-top: 4px;
        }
        .login-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .toggle-text {
          color: #58a6ff;
          text-align: center;
          margin-top: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .toggle-text:hover { color: #a371f7; }
      `}</style>
    </div>
  );
}
