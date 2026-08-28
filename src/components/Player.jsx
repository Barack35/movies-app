import { useEffect, useState, useRef } from "react";
import { embedUrl, loadDownloads } from "../tmdb";

const SOURCES = [
  { id: "vidcore", label: "VidCore", url: (id, type) => embedUrl(id, type, "vidcore") },
  { id: "vidfast", label: "VidFast", url: (id, type) => embedUrl(id, type, "vidfast") },
  { id: "vidsrc", label: "VidSrc", url: (id, type) => embedUrl(id, type, "vidsrc") },
  { id: "vidlink", label: "VidLink", url: (id, type) => embedUrl(id, type, "vidlink") },
  { id: "moviesapi", label: "MoviesAPI", url: (id, type) => embedUrl(id, type, "moviesapi") },
  { id: "2embed", label: "2Embed", url: (id, type) => embedUrl(id, type, "2embed") },
];

export default function Player({ movie, onClose }) {
  const [sourceIdx, setSourceIdx] = useState(0);
  const [archive, setArchive] = useState(null);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [archiveMsg, setArchiveMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const failCount = useRef(0);
  const timerRef = useRef(null);

  const source = SOURCES[sourceIdx];

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    failCount.current = 0;
    setSourceIdx(0);
    setErrorMsg("");
  }, [movie.id]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!archive) setErrorMsg("");
    }, 5000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [sourceIdx, archive]);

  const type = movie.media_type === "tv" ? "tv" : "movie";

  const tryArchive = async () => {
    if (movie.media_type === "tv") {
      setArchiveMsg("Archive.org only hosts movies — try an embed source instead.");
      return;
    }
    setArchiveLoading(true);
    setArchiveMsg("Searching Internet Archive for a free copy...");
    try {
      const { archive: results } = await loadDownloads(movie.title, movie.year);
      if (results.length > 0) {
        setArchive(results[0]);
        setArchiveMsg("");
      } else {
        setArchiveMsg("No free copy found. Try another embed source.");
      }
    } catch {
      setArchiveMsg("Archive search failed. Try another source.");
    } finally {
      setArchiveLoading(false);
    }
  };

  const selectSource = (idx) => {
    setSourceIdx(idx);
    setArchive(null);
    setArchiveMsg("");
    setErrorMsg("");
    failCount.current = 0;
  };

  return (
    <div className="player" onClick={onClose}>
      <div className="player__inner" onClick={(e) => e.stopPropagation()}>
        <div className="player__top">
          <span className="player__title">▶ {movie.title}</span>
          <button className="modal-close" onClick={onClose} aria-label="Close player">
            ×
          </button>
        </div>
        <div className="source-selector">
          <span className="source-label">Source:</span>
          {SOURCES.map((s, i) => (
            <button
              key={s.id}
              className={`source-btn ${!archive && sourceIdx === i ? "active" : ""}`}
              onClick={() => selectSource(i)}
            >
              {s.label}
            </button>
          ))}
          <button
            className={`source-btn ${archive ? "active" : ""}`}
            onClick={tryArchive}
            disabled={archiveLoading}
          >
            {archiveLoading ? "Searching..." : "Archive.org"}
          </button>
        </div>

        {archive ? (
          <div className="player__video">
            <video
              className="player__video-native"
              src={archive.url}
              controls
              autoPlay
              poster={movie.backdrop || movie.poster}
            />
          </div>
        ) : (
          <div className="player__video">
            <iframe
              key={source.url(movie.id, type)}
              src={source.url(movie.id, type)}
              title={`${movie.title} - ${source.label}`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="no-referrer"
              allowFullScreen
              onLoad={() => setErrorMsg("")}
            />
          </div>
        )}

        {errorMsg && <p className="player-note">{errorMsg}</p>}
        {archiveMsg && <p className="player-note">{archiveMsg}</p>}
        {!errorMsg && !archiveMsg && (
          <p className="player-note">
            Not playing? Click a different source above, or try Archive.org
          </p>
        )}
      </div>
    </div>
  );
}
