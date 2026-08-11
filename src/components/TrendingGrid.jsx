import { useState } from "react";
import MovieCard from "./MovieCard";
import CardSkeleton from "./CardSkeleton";

export default function TrendingGrid({
  movies,
  tabs,
  onOpen,
  favoriteIds,
  onToggleFavorite,
  title = "Trending Now",
  loading = false,
}) {
  const [active, setActive] = useState(0);
  const list = tabs ? tabs[active]?.movies || [] : movies;

  return (
    <section className="trending-section" id="trendingSection">
      <h2 className="section-title">
        <span style={{ color: "var(--primary)" }}>🔥</span> {tabs ? tabs[active].label : title}
      </h2>

      {tabs && (
        <div className="grid-tabs" role="tablist">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={i === active}
              className={`grid-tab ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="trending-grid">
        {loading
          ? <CardSkeleton count={12} />
          : list.map((movie) => (
              <MovieCard
                key={`${movie.media_type}-${movie.id}`}
                movie={movie}
                onOpen={onOpen}
                favorite={favoriteIds?.has(movie.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
      </div>
    </section>
  );
}
