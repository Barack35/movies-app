import { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminPanel() {
  const [subscribers, setSubscribers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [subs, comms] = await Promise.all([api.subscribers(), api.comments()]);
      setSubscribers(subs || []);
      setComments(comms || []);
    } catch (e) {
      setError(e.message || "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeComment = async (id) => {
    setBusy(true);
    try {
      await api.deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError(e.message || "Could not delete comment.");
    } finally {
      setBusy(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return "";
    }
  };

  return (
    <section id="adminPanel" className="admin-panel">
      <div className="admin-panel__head">
        <h2 className="section-title">
          <span style={{ color: "var(--primary)" }}>🛡️</span> Admin Panel
        </h2>
        <div className="admin-panel__actions">
          {error && <span className="admin-error">{error}</span>}
          <button className="btn btn-outline" onClick={load} disabled={loading}>
            {loading ? "Loading…" : "↻ Refresh"}
          </button>
        </div>
      </div>

      {loading && <div className="admin-empty">Loading admin data…</div>}

      {!loading && (
        <>
          <div className="admin-grid">
            <div className="admin-card">
              <h3>📧 Subscribers ({subscribers.length})</h3>
              {subscribers.length === 0 ? (
                <p className="admin-empty">No subscribers yet.</p>
              ) : (
                <ul className="admin-list">
                  {subscribers.map((s) => (
                    <li key={s.id} className="admin-row">
                      <span>{s.email}</span>
                      <span className="admin-date">{formatDate(s.created_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="admin-card">
              <h3>💬 Comments ({comments.length})</h3>
              {comments.length === 0 ? (
                <p className="admin-empty">No comments yet.</p>
              ) : (
                <ul className="admin-list">
                  {comments.map((c) => (
                    <li key={c.id} className="admin-row">
                      <span className="admin-row__main">
                        <strong>{c.name}</strong>
                        <span className="admin-comment-text">{c.text}</span>
                        <span className="admin-date">{formatDate(c.created_at)}</span>
                      </span>
                      <button
                        className="btn btn-danger"
                        onClick={() => removeComment(c.id)}
                        disabled={busy}
                        aria-label={`Delete comment by ${c.name}`}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <p className="admin-hint">
            👑 You are signed in as the owner. Sign-ups land in <code>profiles</code>, favorites in{" "}
            <code>favorites</code>, and plays are counted in <code>classics.plays</code>.
          </p>
        </>
      )}
    </section>
  );
}
