const REASONS = [
  { icon: "📺", color: "#f6121d", title: "Enjoy on your TV", text: "Watch on Smart TVs, consoles, Chromecast and more — no player needed." },
  { icon: "📱", color: "#ff2c36", title: "Watch Everywhere", text: "Stream on your phone, tablet, laptop, or TV — anytime, anywhere." },
  { icon: "⚡", color: "#e50914", title: "Watch Instantly", text: "No sign-up, no app to install, no card required. Just click and press play." },
  { icon: "🎬", color: "#a40c10", title: "Classic & Free Forever", text: "Horror, comedy, sci-fi and drama spanning a century of filmmaking — at zero cost." },
];

export default function Reasons() {
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section className="reasons-section">
      <h2 className="section-title">More Reasons to Join Ckflix</h2>
      <div className="cards-container">
        {REASONS.map((r) => (
          <div key={r.title} className="reason-card" onMouseMove={handleMove}>
            <div className="reason-icon" style={{ color: r.color }}>
              <span style={{ fontSize: "2rem" }}>{r.icon}</span>
            </div>
            <h3>{r.title}</h3>
            <p>{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
