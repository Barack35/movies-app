export default function Loader({ hidden }) {
  return (
    <div className={`loader-overlay ${hidden ? "hidden" : ""}`} aria-hidden={hidden}>
      <div className="loader-logo">
        <span className="loader-m">CKFLIX</span>
      </div>
      <div className="loader-bar">
        <div className="loader-bar-fill" />
      </div>
      <div className="loader-text">Your cinema is loading...</div>
    </div>
  );
}
