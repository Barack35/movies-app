import { useEffect, useState } from "react";
import { getTrailer, trailerUrl } from "../tmdb";

export default function MovieModal({ movie, onClose, onPlay, onDetails, favorite, onToggleFavorite }) {
  const [trailer, setTrailer] = useState(movie.trailer);

  useEffect(() => {
    let active = true;
    setTrailer(movie.trailer);
    if (!movie.trailer) {
      getTrailer(movie.id, movie.media_type)
        .then((key) => active && setTrailer(key))
        .catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [movie]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="movie-modal" onClick={onClose}>
      <div className="movie-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="movie-modal-header">
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
          {trailer ? (
            <iframe
              src={trailerUrl(trailer)}
              title={`${movie.title} trailer`}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : (
            <img
              className="poster-fallback"
              src={movie.backdrop || movie.poster}
              alt={movie.title}
            />
          )}
        </div>
        <div className="movie-modal-body">
          <h2>{movie.title}</h2>
          <div className="modal-meta">
            <span>{movie.year}</span>
            <span>⭐ {movie.rating.toFixed(1)}</span>
            <span>{movie.genres.join(" • ")}</span>
            <span className="modal-type">{movie.media_type === "tv" ? "TV Show" : "Movie"}</span>
          </div>
          <p className="modal-overview">{movie.description}</p>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={() => onPlay(movie)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4.5v15l13-7.5-13-7.5Z" />
              </svg>
              Watch Full Movie
            </button>
            {onToggleFavorite && (
              <button className={`btn ${favorite ? "btn-fav" : "btn-outline"}`} onClick={onToggleFavorite}>
                {favorite ? "✓ In Favorites" : "♡ Add to Favorites"}
              </button>
            )}
            {onDetails && (
              <button className="btn btn-outline" onClick={() => onDetails(movie)}>
                ℹ More Info
              </button>
            )}
            <button className="btn btn-outline" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
