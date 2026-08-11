import { useEffect } from "react";

export default function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [toast, onDone]);

  if (!toast) return null;

  return (
    <div className={`toast show ${toast.type === "error" ? "error" : ""}`}>
      <span style={{ color: toast.type === "error" ? "#ef4444" : "var(--success)", fontSize: "1.2rem" }}>
        {toast.type === "error" ? "✕" : "✓"}
      </span>
      <div>
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>
    </div>
  );
}
