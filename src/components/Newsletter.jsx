import { useState } from "react";

export default function Newsletter({ onSubscribe }) {
  const [email, setEmail] = useState("");

  return (
    <section className="newsletter-section">
      <h3>
        <span style={{ color: "var(--primary)" }}>✉️</span> Ready to watch?
      </h3>
      <p>Enter your email to get new movies, updates, and more.</p>
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
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">
          Get Started
          <span aria-hidden="true">›</span>
        </button>
      </form>
    </section>
  );
}
