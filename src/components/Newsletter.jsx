import { useState } from "react";

export default function Newsletter({ onSubscribe }) {
  const [email, setEmail] = useState("");

  return (
    <section className="newsletter-section">
      <h3>
        <span style={{ color: "var(--primary)" }}>✉️</span> Stay Updated
      </h3>
      <p>Get the latest movie news and updates.</p>
      <form
        className="newsletter-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.trim()) return;
          onSubscribe(email);
          setEmail("");
        }}
      >
        <input
          type="email"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Subscribe
        </button>
      </form>
    </section>
  );
}
