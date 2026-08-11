export default function Cta({ onGetStarted }) {
  return (
    <section className="cta-section">
      <h2>
        Ready to <span>Watch</span>?
      </h2>
      <p>Pick a movie and start streaming right now — no sign-up needed.</p>
      <button className="btn btn-primary" onClick={onGetStarted}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4.5v15l13-7.5-13-7.5Z" />
        </svg>
        Start Watching
      </button>
    </section>
  );
}
