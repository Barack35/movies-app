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

export default function Welcome({ movies, activeGenre, onGenre, onGetStarted, onBrowse, onWatch }) {
  const [slide, setSlide] = useState(0);
  const timer = useRef(null);

  const withBackdrop = movies.filter((m) => m.backdrop);
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

  const a = movies[0];

  const card = (m, className, showMeta) =>
    m ? (
      <div className={`bento-card ${className}`} onClick={() => onWatch(m)} role="button" tabIndex={0} aria-label={`Watch ${m.title}`}>
        <img src={m.poster} alt={m.title} loading="lazy" />
        <div className="bento-shade" />
        <div className="bento-info">
          {showMeta && <span className="bento-tag">Watch Now</span>}
          <strong>{m.title}</strong>
          <span className="bento-meta">
            {m.year} • ⭐ {(m.rating || 0).toFixed(1)}
          </span>
        </div>
        <span className="bento-play" aria-hidden="true">▶</span>
      </div>
    ) : null;

  return (
    <section className="welcome-section">
      <div className="welcome-vignette" />
      <div className="bg-gradient">
        <div className="gradient-1" />
        <div className="gradient-2" />
        <div className="gradient-3" />
      </div>
      <div className="welcome-noise" />

      <div className="bento">
        <div className="bento-head">
          <span className="bento-eyebrow">
            <span className="eyebrow-dot" />
            Ckflix · Free Cinema
          </span>
          <h1 className="bento-title">
            Cinema, <span className="brand-gradient">free</span> on every screen.
          </h1>
          <p className="bento-sub">
            A century of films, one click away. No account, no app, no card — just press play.
          </p>

          <div className="stats-badge">
            <Stat icon="🎬" color="var(--primary)" value={`${movies.length}+`} label="Movies" />
            <Stat icon="⭐" color="var(--warning)" value={avgRating} label="Avg Rating" />
            <Stat icon="♾️" color="var(--accent-2)" value="100%" label="Free" />
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
              Start Watching
              <span aria-hidden="true">›</span>
            </button>
            <button className="btn btn-glass" onClick={onBrowse}>
              Browse Movies
            </button>
          </div>
        </div>

        {card(a, "bento-card--feature", true)}

        <div className="bento-showcase" role="button" tabIndex={0} aria-label={`Watch ${show?.title || "featured movie"}`} onClick={() => onWatch(show)}>
          {show ? (
            <div className="hero-card" key={show.id}>
              <img className="hero-card-poster" src={show.poster} alt="" fetchPriority="high" />
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
              <span className="hero-card-floater hero-card-floater--a">▶ Watch Full</span>
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
