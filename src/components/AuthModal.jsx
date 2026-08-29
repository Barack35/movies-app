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

  const handleGoogle = async () => {
    setError("");
    setBusy(true);
    try {
      await api.signInWithGoogle();
    } catch (err) {
      setError(err.message);
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
          <button
            type="button"
            className="auth-google-btn"
            onClick={handleGoogle}
            disabled={busy}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 48 48"
              aria-hidden="true"
              style={{ marginRight: 8, verticalAlign: "middle" }}
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
            Continue with Google
          </button>
          <div className="auth-divider">
            <span>or</span>
          </div>
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
                  background: "rgba(var(--primary-rgb),0.12)",
                  color: "var(--primary)",
                  borderRadius: 8,
                  marginBottom: "0.8rem",
                  fontSize: "0.8rem",
                  border: "1px solid rgba(var(--primary-rgb),0.15)",
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
            <button
              type="button"
              className="auth-guest-btn"
              style={{
                width: "100%",
                padding: "0.7rem",
                marginTop: "0.6rem",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                color: "#fff",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
              onClick={() => {
                onSuccess({ id: "guest", name: "Guest", email: "", isAdmin: false });
              }}
            >
              Continue as Guest
            </button>
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
