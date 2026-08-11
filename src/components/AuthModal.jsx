import { useState } from "react";
import { api } from "../api";

export default function AuthModal({ open, onClose, onSuccess }) {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user =
        tab === "login"
          ? await api.login(email, password)
          : await api.register(name, email, password);
      onSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-mark">C</span> CKFLIX
          </div>
          <div className="auth-sub">
            {tab === "login"
              ? "Welcome back! Sign in to save favorites"
              : "Create your free account"}
          </div>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => {
              setTab("login");
              setError("");
            }}
          >
            Login
          </button>
          <button
            className={`auth-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => {
              setTab("register");
              setError("");
            }}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-body">
          <form onSubmit={submit}>
            {tab === "register" && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={tab === "register" ? 6 : undefined}
                required
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "0.6rem 1rem",
                  background: "rgba(229,9,20,0.12)",
                  color: "var(--primary)",
                  borderRadius: 8,
                  marginBottom: "0.8rem",
                  fontSize: "0.8rem",
                  border: "1px solid rgba(229,9,20,0.15)",
                }}
              >
                {error}
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? "Please wait..." : tab === "login" ? "Login" : "Create Account"}
            </button>
          </form>
          <div className="auth-switch">
            {tab === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <span
                  onClick={() => {
                    setTab("register");
                    setError("");
                  }}
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setTab("login");
                    setError("");
                  }}
                >
                  Login
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
