import { useState } from "react";

const FAQS = [
  { q: "What is Ckflix?", a: "A free collection of classic films, cult favorites and public-domain movies — all watchable in your browser." },
  { q: "How much does it cost?", a: "Nothing! No subscriptions, no hidden fees, no sign-up required to watch." },
  { q: "Can I watch on my phone?", a: "Yes! The site is fully responsive and works on any device." },
  { q: "Do I need an account?", a: "No. Movies play instantly. An account is optional for future features like favorites." },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="faq-section">
      <h2 className="section-title">❓ FAQ</h2>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {FAQS.map((f, i) => (
          <div
            key={f.q}
            className={`faq-item ${open === i ? "active" : ""}`}
            onClick={() => setOpen(open === i ? -1 : i)}
          >
            <div className="faq-question">
              {f.q}
              <span className="faq-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <div className="faq-answer">{f.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
