export default function Loader({ hidden }) {
  return (
    <div className={`loader-overlay ${hidden ? "hidden" : ""}`} aria-hidden={hidden}>
      <div className="loader-logo">
        <span className="loader-m">C</span>KFLIX
      </div>
      <div className="loader-bar">
        <div className="loader-bar-fill" />
      </div>
      <div className="loader-text">Loading your movie experience...</div>
    </div>
  );
}
