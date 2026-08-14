const LINKS = [
  ["FAQ", "Help Center", "Account", "Ways to Watch"],
  ["Privacy", "Corporate Information", "Speed Test"],
  ["Movies", "Classics", "TV Shows", "Comedy", "Horror"],
  ["Legal Notices", "Contact Us", "Only on Ckflix"],
];

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-phone">
        Questions? Call <a href="tel:+10000000000">1-000-000-CKFLIX</a>
      </p>
      <div className="footer-links">
        {LINKS.map((col) => (
          <div key={col[0]}>
            {col.map((label) => (
              <a key={label} href="#">
                {label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <p className="footer-brand">
        <span>CKFLIX</span> — your free cinema, forever.
      </p>
      <p className="footer-note">
        © 2026 Ckflix • Movies stream freely from the Internet Archive
      </p>
    </footer>
  );
}
