import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { api } from "./api";
import { supabase } from "./supabase";
import { getHomeData, searchAll } from "./tmdb";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Welcome from "./components/Welcome";
import TrendingGrid from "./components/TrendingGrid";
import MovieRow from "./components/MovieRow";
import Reasons from "./components/Reasons";
import Faq from "./components/Faq";
import Cta from "./components/Cta";
import Newsletter from "./components/Newsletter";
import Comments from "./components/Comments";
import Footer from "./components/Footer";
import MovieModal from "./components/MovieModal";
import MovieDetails from "./components/MovieDetails";
import Player from "./components/Player";
import AuthModal from "./components/AuthModal";
import Toast from "./components/Toast";
import Library from "./components/Library";
import FeaturedSpotlight from "./components/FeaturedSpotlight";
import GenreBrowse from "./components/GenreBrowse";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import Reveal from "./components/Reveal";

const USER_KEY = "moviehub:user";
const HISTORY_KEY = "moviehub:history";
const FAVS_KEY = "moviehub:favs";

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function loadFavItems() {
  try {
    return JSON.parse(localStorage.getItem(FAVS_KEY)) || [];
  } catch {
    return [];
  }
}

function snapshot(movie) {
  return {
    id: movie.id,
    media_type: movie.media_type || "movie",
    title: movie.title,
    poster: movie.poster,
    backdrop: movie.backdrop,
    year: movie.year,
    rating: movie.rating,
  };
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [homeLoading, setHomeLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [genre, setGenre] = useState(null);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(loadUser);
  const [comments, setComments] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [tv, setTv] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [classics, setClassics] = useState([]);
  const [animation, setAnimation] = useState([]);
  const [family, setFamily] = useState([]);
  const [action, setAction] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [scifi, setScifi] = useState([]);
  const [horror, setHorror] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState(loadFavItems);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set(favoriteItems.map((m) => m.id)));
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let active = true;
    getHomeData()
      .then((d) => {
        if (!active) return;
        setTrending(d.trending);
        setPopular(d.popular);
        setTopRated(d.topRated);
        setTv(d.tv);
        setNewReleases(d.newReleases);
        setUpcoming(d.upcoming);
        setClassics(d.classics);
        setAnimation(d.animation);
        setFamily(d.family);
        setAction(d.action);
        setComedy(d.comedy);
        setScifi(d.scifi);
        setHorror(d.horror);
      })
      .catch(() => {
        if (active) setToast({ title: "Could not load movies", message: "Please try again later", type: "error" });
      })
      .finally(() => active && setHomeLoading(false));
    api.comments()
      .then((list) => active && setComments(list))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const showToast = (title, message, type = "info") => {
    setToast({ title, message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3500);
  };

  const allMovies = useMemo(
    () => [
      ...trending, ...popular, ...topRated, ...tv, ...newReleases, ...upcoming, ...classics,
      ...animation, ...family, ...action, ...comedy, ...scifi, ...horror,
    ],
    [trending, popular, topRated, tv, newReleases, upcoming, classics, animation, family, action, comedy, scifi, horror]
  );

  const visibleMovies = useMemo(
    () => (genre ? trending.filter((m) => m.genres?.includes(genre)) : trending),
    [trending, genre]
  );

  const handleSearch = async (value) => {
    if (!value) {
      setQuery("");
      setSearchResults([]);
      return;
    }
    setQuery(value);
    try {
      const results = await searchAll(value);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
      showToast("Search failed", "Please try again", "error");
    }
  };

  const openBrowse = () => {
    document.getElementById("trendingSection")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpen = (movie) => {
    setDetails(null);
    setLibraryOpen(false);
    setSelected(movie);
  };
  const handleClose = () => setSelected(null);

  const openDetails = (movie) => {
    setSelected(null);
    setDetails(movie);
  };
  const closeDetails = () => setDetails(null);
  const selectFromDetails = (movie) => setDetails(movie);

  const refreshFavorites = (userId) => {
    api.favorites(userId)
      .then((ids) => {
        setFavoriteIds(new Set(ids));
        setFavoriteItems(
          ids.map((id) => {
            const found = allMovies.find((m) => m.id === id);
            return found
              ? snapshot(found)
              : { id, media_type: "movie", title: `Movie #${id}`, poster: "", year: "", rating: 0 };
          })
        );
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) return;
      const u = data.user;
      const stored = loadUser();
      if (!stored || stored.id !== u.id) {
        const nu = {
          id: u.id,
          name: u.user_metadata?.name || "",
          email: u.email || "",
        };
        setUser(nu);
        localStorage.setItem(USER_KEY, JSON.stringify(nu));
        refreshFavorites(nu.id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWatch = (movie) => {
    if (!user) {
      setAuthOpen(true);
      showToast("Login required", "Sign in to watch full movies", "info");
      return;
    }
    api.play(movie.id).catch(() => {});
    setDetails(null);
    setSelected(null);
    setPlaying(movie);
    setHistory((prev) => {
      const snap = snapshot(movie);
      const next = [
        snap,
        ...prev.filter((m) => !(m.id === movie.id && m.media_type === movie.media_type)),
      ].slice(0, 30);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleFavorite = (movie) => {
    if (!user) {
      setAuthOpen(true);
      showToast("Login required", "Sign in to save favorites", "info");
      return;
    }
    const id = movie.id;
    const isFav = favoriteIds.has(id);
    api.toggleFavorite(user.id, id)
      .then(() => {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (isFav) next.delete(id);
          else next.add(id);
          return next;
        });
        setFavoriteItems((prev) => {
          const next = isFav ? prev.filter((m) => m.id !== id) : [snapshot(movie), ...prev];
          try {
            localStorage.setItem(FAVS_KEY, JSON.stringify(next));
          } catch {}
          return next;
        });
        showToast(isFav ? "Removed from favorites" : "Added to favorites!", "", isFav ? "info" : "success");
      })
      .catch(() => showToast("Could not update favorite", "Please try again", "error"));
  };

  const handleLogin = () => setAuthOpen(true);

  const handleAuthSuccess = (u) => {
    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    refreshFavorites(u.id);
    setAuthOpen(false);
    showToast(`Welcome, ${u.name}!`, "You are now signed in", "success");
  };

  const handleLogout = () => {
    supabase?.auth.signOut().catch(() => {});
    setUser(null);
    localStorage.removeItem(USER_KEY);
    setFavoriteIds(new Set());
    setFavoriteItems([]);
    setAuthOpen(false);
  };

  const handleComment = (text) => {
    if (!user) {
      setAuthOpen(true);
      showToast("Login required", "Sign in to post a comment", "info");
      return;
    }
    api.addComment(user.name, text)
      .then(() => api.comments())
      .then((list) => setComments(list))
      .catch(() => showToast("Could not post comment", "Please try again", "error"));
  };

  const handleSubscribe = (email) => {
    api.subscribe(email)
      .then(() => showToast("Subscribed!", "You're on the list", "success"))
      .catch(() => showToast("Could not subscribe", "Please try again", "error"));
  };

  const renderSections = () => {
    const searching = Boolean(query);
    return (
      <>
        <Welcome
          movies={visibleMovies}
          activeGenre={genre}
          onGenre={setGenre}
          onGetStarted={openBrowse}
          onBrowse={openBrowse}
        />

        {searching ? (
          <>
            <div className="search-header">
              <h2 className="section-title">
                <span style={{ color: "var(--primary)" }}>🔍</span> Results for “{query}”
              </h2>
              <button className="btn btn-outline" onClick={() => handleSearch("")}>
                Clear search
              </button>
            </div>
            <TrendingGrid
              movies={searchResults}
              onOpen={handleOpen}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
            />
          </>
        ) : (
          <>
            <Reveal>
              <FeaturedSpotlight movie={topRated[0]} onOpen={handleOpen} onPlay={handleWatch} />
            </Reveal>
            <Reveal>
              <TrendingGrid
                tabs={[
                  { id: "trending", label: "🔥 Trending", movies: visibleMovies },
                  { id: "new", label: "🆕 New Releases", movies: newReleases },
                  { id: "popular", label: "⭐ Popular", movies: popular },
                  { id: "top", label: "🏆 Top Rated", movies: topRated },
                  { id: "cartoons", label: "🎨 Cartoons", movies: animation },
                ]}
                onOpen={handleOpen}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
                loading={homeLoading}
              />
            </Reveal>
            <Reveal>
              <MovieRow
                title="🆕 New Releases"
                movies={newReleases}
                onOpen={handleOpen}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            </Reveal>
            <Reveal>
              <MovieRow
                title="Popular Movies"
                movies={popular}
                onOpen={handleOpen}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            </Reveal>
            <Reveal>
              <MovieRow
                title="Top Rated"
                movies={topRated}
                onOpen={handleOpen}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            </Reveal>
            <Reveal>
              <MovieRow
                title="Coming Soon"
                movies={upcoming}
                onOpen={handleOpen}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            </Reveal>
            <Reveal>
              <MovieRow
                title="TV Shows"
                movies={tv}
                onOpen={handleOpen}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            </Reveal>
            <Reveal>
              <MovieRow
                title="🎞️ Timeless Classics"
                movies={classics}
                onOpen={handleOpen}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            </Reveal>
            <Reveal>
              <MovieRow
                title="🎨 Cartoons & Animation"
                movies={animation}
                onOpen={handleOpen}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            </Reveal>
            <Reveal>
              <MovieRow
                title="👨‍👩‍👧 Family Movies"
                movies={family}
                onOpen={handleOpen}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            </Reveal>
            <Reveal>
              <MovieRow
                title="💥 Action"
                movies={action}
                onOpen={handleOpen}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            </Reveal>
            <Reveal>
              <MovieRow
                title="😂 Comedy"
                movies={comedy}
                onOpen={handleOpen}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            </Reveal>
            <Reveal>
              <MovieRow
                title="🚀 Sci-Fi"
                movies={scifi}
                onOpen={handleOpen}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            </Reveal>
            <Reveal>
              <MovieRow
                title="👻 Horror"
                movies={horror}
                onOpen={handleOpen}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            </Reveal>
          </>
        )}

        <Reveal>
          <GenreBrowse onGenre={setGenre} onBrowse={openBrowse} />
        </Reveal>
        <Reveal>
          <Reasons onGetStarted={openBrowse} />
        </Reveal>
        <Reveal>
          <Faq />
        </Reveal>
        <Reveal>
          <Cta onGetStarted={openBrowse} />
        </Reveal>
        <Reveal>
          <Newsletter onSubscribe={handleSubscribe} />
        </Reveal>
        <Reveal>
          <Comments comments={comments} onAdd={handleComment} />
        </Reveal>
        <Reveal>
          <Footer />
        </Reveal>
      </>
    );
  };

  return (
    <>
      <ScrollProgress />
      {!loading && (
        <Header
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onSearch={handleSearch}
          onOpenLibrary={() => setLibraryOpen(true)}
          searching={Boolean(query)}
        />
      )}
      {!loading && renderSections()}
      {!loading && (
        <>
          {selected && (
            <MovieModal
              movie={selected}
              onClose={handleClose}
              onPlay={handleWatch}
              onDetails={openDetails}
              favorite={favoriteIds.has(selected.id)}
              onToggleFavorite={() => toggleFavorite(selected)}
            />
          )}
          {details && (
            <MovieDetails
              movie={details}
              onClose={closeDetails}
              onPlay={handleWatch}
              favorite={favoriteIds.has(details.id)}
              onToggleFavorite={() => toggleFavorite(details)}
              onSelectMovie={selectFromDetails}
            />
          )}
          {playing && <Player movie={playing} onClose={() => setPlaying(null)} />}
          {libraryOpen && (
            <Library
              favorites={favoriteItems}
              history={history}
              onOpen={handleOpen}
              onClose={() => setLibraryOpen(false)}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
            />
          )}
          <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
          <Toast toast={toast} />
          <BackToTop />
        </>
      )}
      <Loader hidden={!loading} />
    </>
  );
}
