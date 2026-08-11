export default function FeaturedSpotlight({ movie, onOpen, onPlay }) {
  if (!movie) return null;

  return (
    <section className="spotlight">
      <div
        className="spotlight-bg"
        style={movie.backdrop ? { backgroundImage: `url(${movie.backdrop})` } : undefined}
      />
      <div className="spotlight-shade" />
      <div className="spotlight-content">
        <span className="spotlight-eyebrow">🏆 Editor&apos;s Pick</span>
        <h2 className="spotlight-title">{movie.title}</h2>
        <div className="spotlight-meta">
          <span className="spotlight-rating">⭐ {movie.rating.toFixed(1)}</span>
          <span>{movie.year}</span>
          {movie.duration && <span>{movie.duration}</span>}
          {movie.media_type === "tv" && <span className="details-type-badge">TV SHOW</span>}
        </div>
        {movie.genres?.length > 0 && (
          <div className="spotlight-genres">
            {movie.genres.map((g) => (
              <span key={g}>{g}</span>
            ))}
          </div>
        )}
        <p className="spotlight-desc">
          {movie.description || "No description available."}
        </p>
        <div className="spotlight-actions">
          <button className="btn btn-primary btn-glow" onClick={() => onPlay(movie)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4.5v15l13-7.5-13-7.5Z" />
            </svg>
            Watch Now
          </button>
          <button className="btn btn-glass" onClick={() => onOpen(movie)}>
            More Info
          </button>
        </div>
      </div>
    </section>
  );
}
