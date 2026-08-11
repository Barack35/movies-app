import { useEffect } from "react";
import MovieCard from "./MovieCard";

export default function Library({ favorites, history, onOpen, onClose, favoriteIds, onToggleFavorite }) {
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
    <div className="library-overlay" onClick={onClose}>
      <div className="library-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close library-close" onClick={onClose} aria-label="Close library">
          ×
        </button>
        <h1 className="library-title">📚 My Library</h1>

        <h2 className="row-title">Favorites</h2>
        {favorites.length === 0 ? (
          <p className="dl-empty">No favorites yet — tap the ♡ on any movie to save it.</p>
        ) : (
          <div className="trending-grid library-grid">
            {favorites.map((m) => (
              <MovieCard
                key={`${m.media_type}-${m.id}`}
                movie={m}
                onOpen={onOpen}
                favorite={favoriteIds?.has(m.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}

        <h2 className="row-title">Watch History</h2>
        {history.length === 0 ? (
          <p className="dl-empty">Nothing watched yet.</p>
        ) : (
          <div className="trending-grid library-grid">
            {history.map((m) => (
              <MovieCard key={`${m.media_type}-${m.id}`} movie={m} onOpen={onOpen} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
