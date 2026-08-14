import { useEffect, useState } from "react";
import { getDetails, loadDownloads, trailerUrl } from "../tmdb";

function shareLinks(title) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`Watch ${title} free on CKFLIX`);
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    whatsapp: `https://wa.me/?text=${text}%20${url}`,
  };
}

export default function MovieDetails({ movie, onClose, onPlay, favorite, onToggleFavorite, onSelectMovie }) {
  const [full, setFull] = useState(movie);
  const [downloads, setDownloads] = useState(null);
  const [dlLoading, setDlLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setFull(movie);
    getDetails(movie)
      .then((d) => active && setFull(d))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [movie]);

  useEffect(() => {
    let active = true;
    setDlLoading(true);
    setDownloads(null);
    loadDownloads(movie.title, movie.year)
      .then((d) => {
        if (active) {
          setDownloads(d);
          setDlLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setDownloads({ archive: [], torrents: [] });
          setDlLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [movie.id, movie.title, movie.year]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const share = shareLinks(full.title);
  const cast = full.cast || [];
  const similar = full.similar || [];
  const genres = full.genres || [];

  return (
    <div className="details-overlay" onClick={onClose}>
      <div
        className="details-hero"
        style={full.backdrop ? { backgroundImage: `url(${full.backdrop})` } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="details-hero-shade" />
        <button className="modal-close details-close" onClick={onClose} aria-label="Close details">
          ×
        </button>

        <div className="details-hero-content">
          <div className="details-poster-wrap">
            <img className="details-poster" src={full.poster} alt={full.title} />
          </div>
          <div className="details-info">
            <h1>{full.title}</h1>
            <div className="details-meta">
              <span>⭐ {(full.rating || 0).toFixed(1)}</span>
              <span>{full.year}</span>
              {full.duration && <span>{full.duration}</span>}
              <span className="details-type-badge">{full.media_type === "tv" ? "TV SHOW" : "MOVIE"}</span>
            </div>
            {genres.length > 0 && (
              <div className="details-genres">
                {genres.map((g) => (
                  <span className="genre-chip" key={g}>
                    {g}
                  </span>
                ))}
              </div>
            )}
            <p className="details-overview">{full.description}</p>
            <div className="details-actions">
              <button className="btn btn-primary" onClick={() => onPlay(full)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4.5v15l13-7.5-13-7.5Z" />
                </svg>
                Watch Full Movie
              </button>
              {onToggleFavorite && (
                <button className={`btn ${favorite ? "btn-fav" : "btn-outline"}`} onClick={onToggleFavorite}>
                  {favorite ? "✓ In Favorites" : "♡ Favorite"}
                </button>
              )}
              <a
                className="btn btn-outline"
                href="#downloads"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("downloads")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                ⬇ Downloads
              </a>
            </div>
            <div className="details-share">
              <span className="share-label">Share:</span>
              <a className="share-btn" href={share.facebook} target="_blank" rel="noreferrer" aria-label="Share on Facebook">
                f
              </a>
              <a className="share-btn" href={share.twitter} target="_blank" rel="noreferrer" aria-label="Share on X">
                𝕏
              </a>
              <a className="share-btn" href={share.whatsapp} target="_blank" rel="noreferrer" aria-label="Share on WhatsApp">
                ✆
              </a>
              <button
                className="share-btn"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                }}
                aria-label="Copy link"
              >
                ⧉
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="details-body" onClick={(e) => e.stopPropagation()}>
        {full.trailer && (
          <section className="details-section">
            <h2 className="row-title">Official Trailer</h2>
            <div className="trailer-frame">
              <iframe
                src={trailerUrl(full.trailer)}
                title={`${full.title} trailer`}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {cast.length > 0 && (
          <section className="details-section">
            <h2 className="row-title">Cast</h2>
            <div className="row-scroller cast-row">
              {cast.map((c) => (
                <div className="cast-card" key={c.id}>
                  {c.profile ? (
                    <img src={c.profile} alt={c.name} loading="lazy" />
                  ) : (
                    <div className="cast-avatar">🎭</div>
                  )}
                  <span className="cast-name">{c.name}</span>
                  <span className="cast-char">{c.character}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {similar.length > 0 && (
          <section className="details-section">
            <h2 className="row-title">More Like This</h2>
            <div className="row-scroller">
              {similar.map((s) => (
                <div className="row-item" key={`${s.media_type}-${s.id}`} onClick={() => onSelectMovie(s)}>
                  <div className="row-poster-wrap">
                    <img src={s.poster} alt={s.title} loading="lazy" />
                  </div>
                  <div className="row-info">
                    <h4>{s.title}</h4>
                    <span className="year">
                      {s.year} • ⭐ {s.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="details-section" id="downloads">
          <h2 className="row-title">⬇ Downloads</h2>
          {dlLoading ? (
            <div className="dl-loading">Searching archive.org & torrents…</div>
          ) : downloads ? (
            <>
              {downloads.archive.length === 0 && downloads.torrents.length === 0 && (
                <p className="dl-empty">No download sources found for this title.</p>
              )}
              {downloads.archive.length > 0 && (
                <div className="dl-group">
                  <h3>Archive.org</h3>
                  {downloads.archive.map((d, i) => (
                    <a className="dl-item" key={i} href={d.url} target="_blank" rel="noreferrer">
                      <span className="dl-name">{d.name}</span>
                      <span className="dl-meta">
                        {d.quality} • {d.size}
                      </span>
                    </a>
                  ))}
                </div>
              )}
              {downloads.torrents.length > 0 && (
                <div className="dl-group">
                  <h3>Torrents</h3>
                  {downloads.torrents.map((t, i) => (
                    <a className="dl-item" key={i} href={t.url} target="_blank" rel="noreferrer">
                      <span className="dl-name">{t.quality}</span>
                      <span className="dl-meta">
                        {t.size} • {t.seeds} seeds
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}
