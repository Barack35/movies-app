import { useEffect, useRef, useState } from "react";

const GENRES = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Adventure", "Thriller"];

function Stat({ icon, color, value, label }) {
  return (
    <div className="stat-badge-item">
      <span className="stat-icon" style={{ color }}>
        {icon}
      </span>
      <span className="num">{value}</span> {label}
    </div>
  );
}

export default function Welcome({ movies, activeGenre, onGenre, onGetStarted, onBrowse }) {
  const [slide, setSlide] = useState(0);
  const timer = useRef(null);

  const withBackdrop = movies.filter((m) => m.backdrop);
  const backdrops = withBackdrop.map((m) => m.backdrop);
  const show = withBackdrop[slide % Math.max(withBackdrop.length, 1)] || movies[0];

  useEffect(() => {
    timer.current = setInterval(() => {
      setSlide((s) => (s + 1) % Math.max(withBackdrop.length, 1));
    }, 4500);
    return () => clearInterval(timer.current);
  }, [withBackdrop.length]);

  const avgRating = movies.length
    ? (movies.reduce((s, m) => s + (m.rating || 0), 0) / movies.length).toFixed(1)
    : "0";

  const marqueeTitles = movies.slice(0, 12).map((m) => m.title).filter(Boolean);

  return (
    <section className="welcome-section">
      {backdrops.length > 0 && (
        <div className="welcome-bg-stack">
          {backdrops.slice(0, 4).map((url, i) => (
            <div
              key={url + i}
              className={`welcome-bg ${i === slide % Math.min(backdrops.length, 4) ? "welcome-bg--active" : ""}`}
              style={{ backgroundImage: `url(${url})` }}
            />
          ))}
        </div>
      )}
      <div className="bg-gradient">
        <div className="gradient-1" />
        <div className="gradient-2" />
        <div className="gradient-3" />
      </div>
      <div className="welcome-noise" />

      <div className="welcome-content">
        <div className="welcome-main">
          <span className="welcome-eyebrow">
            <span className="eyebrow-dot" />
            Ckflix • {movies.length}+ Titles • Updated Daily
          </span>

          <h1 className="welcome-title">
            Unlimited movies, TV shows, and more
          </h1>
          <p className="welcome-sub">
            Watch anywhere. Cancel anytime. It&apos;s all <span className="brand-gradient">free</span> — no subscription, no app, no credit card.
          </p>

          <div className="stats-badge">
            <Stat icon="🎬" color="var(--primary)" value={`${movies.length}+`} label="Movies" />
            <Stat icon="🎥" color="var(--success)" value="HD" label="Free Streaming" />
            <Stat icon="⭐" color="var(--warning)" value={avgRating} label="Avg Rating" />
            <Stat icon="♾️" color="#ff2c36" value="100%" label="Free" />
          </div>

          <div className="featured-genres">
            {GENRES.map((g) => (
              <button
                key={g}
                className={`genre-chip ${activeGenre === g ? "active" : ""}`}
                onClick={() => onGenre(activeGenre === g ? null : g)}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="welcome-actions">
            <button className="btn btn-primary btn-glow" onClick={onGetStarted}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4.5v15l13-7.5-13-7.5Z" />
              </svg>
              Get Started
              <span aria-hidden="true">›</span>
            </button>
            <button className="btn btn-glass" onClick={onBrowse}>
              Browse Movies
            </button>
          </div>
        </div>

        <div className="welcome-showcase">
          {show ? (
            <div className="hero-card" key={show.id}>
              <img className="hero-card-poster" src={show.poster} alt={show.title} fetchPriority="high" />
              <div className="hero-card-glow" />
              <div className="hero-card-info">
                <span className="hero-card-badge">
                  {show.media_type === "tv" ? "TV SHOW" : "FEATURED"}
                </span>
                <strong className="hero-card-title">{show.title}</strong>
                <span className="hero-card-meta">
                  {show.year} • ⭐ {(show.rating || 0).toFixed(1)}
                </span>
              </div>
              <div className="hero-card-floater hero-card-floater--a">▶ HD</div>
              <div className="hero-card-floater hero-card-floater--b">
                {show.genres?.[0] || "Free"}
              </div>
            </div>
          ) : (
            <div className="hero-card hero-card--skeleton" />
          )}
        </div>
      </div>

      {marqueeTitles.length > 0 && (
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...marqueeTitles, ...marqueeTitles, ...marqueeTitles].map((t, i) => (
              <span className="marquee-item" key={i}>
                ✦ {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
