import { useState } from "react";

export default function Header({ user, onLogin, onLogout, onSearch, onOpenLibrary, searching }) {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <header className="header">
      <a
        href="#"
        className="logo"
        onClick={(e) => {
          e.preventDefault();
          onSearch("");
        }}
      >
        <span className="logo-mark">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4.5v15l13-7.5-13-7.5Z" />
          </svg>
        </span>
        <span className="logo-text">Ckflix</span>
      </a>

      <form className="header-search" onSubmit={submit}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={value}
          placeholder="Search movies & TV shows..."
          onChange={(e) => setValue(e.target.value)}
        />
        {searching && (
          <button type="button" className="header-search-clear" onClick={() => { setValue(""); onSearch(""); }} aria-label="Clear search">
            ×
          </button>
        )}
      </form>

      <div className="header-actions">
        <button className="btn btn-outline header-btn" onClick={onOpenLibrary}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <span className="header-btn-label">My Library</span>
        </button>
        {user ? (
          <div className="header-user">
            <span className="header-user-name" title={user.name}>
              👋 {user.name}
            </span>
            <button className="btn btn-outline header-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn btn-outline header-btn" onClick={onLogin}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 3h3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-3M10 17l5-5-5-5M15 12H3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Login
          </button>
        )}
      </div>
    </header>
  );
}
