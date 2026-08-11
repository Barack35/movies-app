import { useState } from "react";

export default function Comments({ comments, onAdd }) {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
  };

  return (
    <section className="comments-section">
      <h2 className="section-title">
        <span style={{ color: "var(--primary)" }}>💬</span> What Buddies Say
      </h2>
      <div className="comments-list">
        {comments.length === 0 && (
          <div className="comment-card">
            <strong>🎬 CKFLIX</strong>
            <p>No comments yet — be the first Buddy to share a thought!</p>
          </div>
        )}
        {comments.map((c) => (
          <div key={c.id} className="comment-card">
            <span className="comment-avatar">{c.name.charAt(0).toUpperCase()}</span>
            <div className="comment-body">
              <strong>{c.name}</strong>
              <p>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form className="comment-form" onSubmit={submit}>
        <input
          type="text"
          placeholder="Share your thoughts, Buddy..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" aria-label="Post comment">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </section>
  );
}
