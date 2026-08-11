import { useRef } from "react";

export default function MovieRow({ title, movies, onOpen, favoriteIds, onToggleFavorite }) {
  const scroller = useRef(null);

  if (!movies || !movies.length) return null;

  const scrollBy = (dir) => {
    scroller.current?.scrollBy({ left: dir * 500, behavior: "smooth" });
  };

  return (
    <section className="movie-row">
      <div className="row-header">
        <h2 className="row-title">{title}</h2>
        <div className="row-arrows">
          <button className="row-arrow" onClick={() => scrollBy(-1)} aria-label="Scroll left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="row-arrow" onClick={() => scrollBy(1)} aria-label="Scroll right">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className="row-scroller" ref={scroller}>
        {movies.map((movie) => (
          <div className="row-item" key={`${movie.media_type}-${movie.id}`} onClick={() => onOpen(movie)}>
            <div className="row-poster-wrap">
              <img
                src={movie.poster}
                alt={movie.title}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
              {movie.media_type === "tv" && <span className="row-tv-tag">TV</span>}
              {onToggleFavorite && (
                <button
                  className={`fav-btn ${favoriteIds?.has(movie.id) ? "fav-btn--active" : ""}`}
                  aria-label="Toggle favorite"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(movie);
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={favoriteIds?.has(movie.id) ? "currentColor" : "none"}>
                    <path
                      d="M12 21s-7.5-4.7-9.8-9C.6 8.6 2.7 5 6.2 5c2 0 3.4 1 5.8 3.5C14.4 6 15.8 5 17.8 5c3.5 0 5.6 3.6 4 7-2.3 4.3-9.8 9-9.8 9Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="row-info">
              <h4>{movie.title}</h4>
              <span className="year">
                {movie.year} • ⭐ {movie.rating}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
