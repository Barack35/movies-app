const GENRES = [
  { name: "Action", emoji: "💥", grad: "linear-gradient(135deg,#ff512f,#dd2476)" },
  { name: "Comedy", emoji: "😂", grad: "linear-gradient(135deg,#f7971e,#ffd200)" },
  { name: "Drama", emoji: "🎭", grad: "linear-gradient(135deg,#8e2de2,#4a00e0)" },
  { name: "Horror", emoji: "👻", grad: "linear-gradient(135deg,#232526,#2c5364)" },
  { name: "Sci-Fi", emoji: "🚀", grad: "linear-gradient(135deg,#00c6ff,#0072ff)" },
  { name: "Romance", emoji: "💘", grad: "linear-gradient(135deg,#ff758c,#ff7eb3)" },
  { name: "Adventure", emoji: "🧭", grad: "linear-gradient(135deg,#11998e,#38ef7d)" },
  { name: "Thriller", emoji: "🔪", grad: "linear-gradient(135deg,#f953c6,#b91d73)" },
];

export default function GenreBrowse({ onGenre, onBrowse }) {
  return (
    <section className="genre-section">
      <h2 className="section-title">🎪 Browse by Genre</h2>
      <div className="genre-grid">
        {GENRES.map((g) => (
          <button
            key={g.name}
            className="genre-tile"
            style={{ background: g.grad }}
            onClick={() => {
              onGenre(g.name);
              onBrowse();
            }}
          >
            <span className="genre-tile-emoji">{g.emoji}</span>
            <span className="genre-tile-name">{g.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
