export default function MovieCard({ movie, onOpen, favorite, onToggleFavorite }) {
  return (
    <div className="trending-card" onClick={() => onOpen(movie)}>
      <div className="card-media">
        <img
          className="card-poster"
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />
        <div className="card-overlay">
          <span className="card-play">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4.5v15l13-7.5-13-7.5Z" />
            </svg>
          </span>
          <span className="card-hint">Click to watch</span>
        </div>
      </div>
      <span className="movie-badge">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4.5v15l13-7.5-13-7.5Z" />
        </svg>
        CKFLIX
      </span>
      {movie.media_type === "tv" && <span className="row-tv-tag tv-grid">TV</span>}
      <span className="movie-rating">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.9 6.26 6.6.56-5 4.55 1.5 6.47L12 16.9l-6 3.94 1.5-6.47-5-4.55 6.6-.56L12 2Z" />
        </svg>
        {movie.rating.toFixed(1)}
      </span>
      {onToggleFavorite && (
        <button
          className={`fav-btn ${favorite ? "fav-btn--active" : ""}`}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie);
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={favorite ? "currentColor" : "none"}>
            <path
              d="M12 21s-7.5-4.7-9.8-9C.6 8.6 2.7 5 6.2 5c2 0 3.4 1 5.8 3.5C14.4 6 15.8 5 17.8 5c3.5 0 5.6 3.6 4 7-2.3 4.3-9.8 9-9.8 9Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <div className="trending-info">
        <h4>{movie.title}</h4>
        <span className="year">
          {movie.year} {movie.genres?.[0] ? `• ${movie.genres[0]}` : ""}
        </span>
      </div>
    </div>
  );
}
