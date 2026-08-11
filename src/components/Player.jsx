import { useEffect, useState } from "react";
import { embedUrl, loadDownloads } from "../tmdb";

const SOURCES = [
  { id: "vidsrc", label: "VidSrc PM", url: (id, type) => embedUrl(id, type, "vidsrc") },
  { id: "vidlink", label: "VidLink", url: (id, type) => embedUrl(id, type, "vidlink") },
  { id: "embedder", label: "Embedder", url: (id, type) => embedUrl(id, type, "embedder") },
  { id: "2embed", label: "2Embed", url: (id, type) => embedUrl(id, type, "2embed") },
  { id: "vidsrcto", label: "VidSrc TO", url: (id, type) => embedUrl(id, type, "vidsrcto") },
  { id: "vidsrcrip", label: "VidSrc RIP", url: (id, type) => embedUrl(id, type, "vidsrcrip") },
];

export default function Player({ movie, onClose }) {
  const [source, setSource] = useState("vidsrc");
  const [archive, setArchive] = useState(null);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [archiveMsg, setArchiveMsg] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const type = movie.media_type === "tv" ? "tv" : "movie";

  const tryArchive = async () => {
    if (movie.media_type === "tv") {
      setArchiveMsg("Archive.org only hosts movies — try an embed source instead.");
      return;
    }
    setArchiveLoading(true);
    setArchiveMsg("Searching Internet Archive for a free copy…");
    try {
      const { archive } = await loadDownloads(movie.title, movie.year);
      if (archive.length > 0) {
        setArchive(archive[0]);
        setArchiveMsg("");
      } else {
        setArchiveMsg("No free copy on Internet Archive for this title. Try another source.");
      }
    } catch {
      setArchiveMsg("Archive search failed. Try another source.");
    } finally {
      setArchiveLoading(false);
    }
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
          {SOURCES.map((s) => (
            <button
              key={s.id}
              className={`source-btn ${!archive && source === s.id ? "active" : ""}`}
              onClick={() => {
                setSource(s.id);
                setArchive(null);
                setArchiveMsg("");
              }}
            >
              {s.label}
            </button>
          ))}
          <button
            className={`source-btn ${archive ? "active" : ""}`}
            onClick={tryArchive}
            disabled={archiveLoading}
          >
            {archiveLoading ? "Searching…" : "📚 Archive.org"}
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
              key={SOURCES.find((s) => s.id === source).url(movie.id, type)}
              src={SOURCES.find((s) => s.id === source).url(movie.id, type)}
              title={`${movie.title} player`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="no-referrer"
              allowFullScreen
            />
          </div>
        )}

        {archiveMsg && <p className="player-note">{archiveMsg}</p>}
      </div>
    </div>
  );
}
