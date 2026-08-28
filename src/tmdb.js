const KEY = "96fa1114fe1ce2dbfd78bfc7d19d0291";
const API = "https://api.themoviedb.org/3";
const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";
const IMG_W500 = "https://image.tmdb.org/t/p/w500";
const IMG_W300 = "https://image.tmdb.org/t/p/w300";

let genreMapPromise = null;

const HOME_CACHE_KEY = "ckflix:home:v1";
const HOME_CACHE_TTL = 2 * 60 * 60 * 1000;

const GENRE_IDS = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  Horror: 27,
  Mystery: 9648,
  Romance: 10749,
  "Sci-Fi": 878,
  Thriller: 53,
  War: 10752,
};

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.t && Date.now() - parsed.t > HOME_CACHE_TTL) return null;
    return parsed.data ?? null;
  } catch {
    return null;
  }
}

function cacheSet(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), data }));
  } catch {}
}

function getGenres() {
  if (!genreMapPromise) {
    genreMapPromise = fetch(`${API}/genre/movie/list?api_key=${KEY}`)
      .then((r) => r.json())
      .then((d) => Object.fromEntries((d.genres || []).map((g) => [g.id, g.name])))
      .catch(() => ({}));
  }
  return genreMapPromise;
}

export function embedUrl(id, mediaType = "movie", source = "vidsrc") {
  const type = mediaType === "tv" ? "tv" : "movie";
  switch (source) {
    case "vidsrc":
      return `https://vidsrc.to/embed/${type}/${id}?autoplay=1`;
    case "vidfast":
      return type === "tv"
        ? `https://vidfast.pro/tv/${id}/1/1?autoPlay=true`
        : `https://vidfast.pro/movie/${id}?autoPlay=true`;
    case "vidlink":
      return `https://vidlink.pro/${type}/${id}`;
    case "2embed":
      return `https://www.2embed.cc/embed/${id}`;
    case "vidcore":
      return `https://vidcore.org/embed/${type}/${id}?autoPlay=true`;
    case "moviesapi":
      return `https://moviesapi.to/movie/${id}`;
    default:
      return `https://vidsrc.to/embed/${type}/${id}?autoplay=1`;
  }
}

export function trailerUrl(key) {
  return `https://www.youtube.com/embed/${key}?autoplay=1&mute=1&controls=1&rel=0`;
}

function toItem(m, genres) {
  const isTv = m.media_type === "tv" || m.name !== undefined;
  const poster = m.poster_path ? IMG_W500 + m.poster_path : "";
  return {
    id: m.id,
    media_type: isTv ? "tv" : "movie",
    title: isTv ? m.name : m.title,
    poster,
    backdrop: m.backdrop_path ? IMG_ORIGINAL + m.backdrop_path : poster,
    video: embedUrl(m.id, isTv ? "tv" : "movie", "vidsrc"),
    trailer: null,
    description: m.overview || "No description available.",
    genres: (m.genre_ids || []).map((id) => genres[id]).filter(Boolean),
    year: (m.first_air_date || m.release_date || "").split("-")[0] || "N/A",
    rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 0,
    duration: null,
    trending: true,
  };
}

async function mapItems(ms, mediaType) {
  const genres = await getGenres();
  return (ms || []).map((m) => toItem({ ...m, media_type: mediaType }, genres));
}

async function fetchList(path, mediaType = "movie", limit = 12, params = {}) {
  const qs = new URLSearchParams({ api_key: KEY, ...params });
  const d = await fetch(`${API}${path}?${qs}`).then((r) => r.json());
  return mapItems(d.results?.slice(0, limit), mediaType);
}

async function discoverGenre(genreId, limit = 18) {
  return fetchList("/discover/movie", "movie", limit, {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
    vote_count_gte: 50,
  });
}

export async function discoverByName(name, limit = 24) {
  const id = GENRE_IDS[name];
  if (!id) return [];
  return discoverGenre(id, limit);
}

async function fetchHomeData() {
  const [
    trending, popular, topRated, tv, newReleases, upcoming, classics,
    animation, family, action, comedy, scifi, horror,
  ] = await Promise.all([
    fetchList("/trending/movie/week", "movie", 24),
    fetchList("/movie/popular", "movie", 18),
    fetchList("/movie/top_rated", "movie", 18),
    fetchList("/trending/tv/week", "tv", 18),
    fetchList("/movie/now_playing", "movie", 18),
    fetchList("/movie/upcoming", "movie", 18),
    fetchList("/discover/movie", "movie", 18, {
      "primary_release_date.lte": "1969-12-31",
      "sort_by": "popularity.desc",
      "vote_count.gte": 50,
    }),
    discoverGenre(16),   // Animation / Cartoons
    discoverGenre(10751), // Family
    discoverGenre(28),   // Action
    discoverGenre(35),   // Comedy
    discoverGenre(878),  // Sci-Fi
    discoverGenre(27),   // Horror
  ]);
  return { trending, popular, topRated, tv, newReleases, upcoming, classics, animation, family, action, comedy, scifi, horror };
}

export async function getHomeData() {
  const cached = cacheGet(HOME_CACHE_KEY);
  if (cached) return cached;
  const data = await fetchHomeData();
  cacheSet(HOME_CACHE_KEY, data);
  return data;
}

export async function searchAll(query) {
  const q = encodeURIComponent(query);
  const genres = await getGenres();
  const [mr, tr] = await Promise.all([
    fetch(`${API}/search/movie?api_key=${KEY}&query=${q}&page=1`).then((r) => r.json()),
    fetch(`${API}/search/tv?api_key=${KEY}&query=${q}&page=1`).then((r) => r.json()),
  ]);
  const movies = (mr.results || []).map((m) => toItem({ ...m, media_type: "movie" }, genres));
  const tv = (tr.results || []).map((m) => toItem({ ...m, media_type: "tv" }, genres));
  return [...movies, ...tv].slice(0, 30);
}

export async function getTrailer(id, mediaType = "movie") {
  const type = mediaType === "tv" ? "tv" : "movie";
  try {
    const d = await fetch(`${API}/${type}/${id}/videos?api_key=${KEY}`).then((r) => r.json());
    const tr = (d.results || []).find((v) => v.type === "Trailer" && v.site === "YouTube");
    return tr ? tr.key : null;
  } catch {
    return null;
  }
}

export async function getDetails(item) {
  const type = item.media_type === "tv" ? "tv" : "movie";
  try {
    const d = await fetch(
      `${API}/${type}/${item.id}?api_key=${KEY}&append_to_response=videos,credits,similar`
    ).then((r) => r.json());
    if (!d || d.success === false) return { ...item, cast: [], similar: [] };
    const tr = (d.videos?.results || []).find((v) => v.type === "Trailer" && v.site === "YouTube");
    const genres = await getGenres();
    return {
      ...item,
      trailer: tr ? tr.key : null,
      description: d.overview || item.description,
      genres: (d.genres || []).map((g) => g.name),
      duration: d.runtime ? `${d.runtime} min` : item.duration,
      rating: d.vote_average ? Number(d.vote_average.toFixed(1)) : item.rating,
      year: (d.first_air_date || d.release_date || "").split("-")[0] || item.year,
      cast: (d.credits?.cast || [])
        .slice(0, 12)
        .map((c) => ({
          id: c.id,
          name: c.name,
          character: c.character || "",
          profile: c.profile_path ? IMG_W300 + c.profile_path : "",
        })),
      similar: (d.similar?.results || [])
        .slice(0, 12)
        .map((s) => toItem({ ...s, media_type: type }, genres)),
    };
  } catch {
    return { ...item, cast: [], similar: [] };
  }
}

export async function searchArchive(title, year) {
  const clean = title.replace(/[^a-zA-Z0-9]/g, " ").trim();
  const t = title.toLowerCase();
  const y = year && year !== "N/A" ? String(year) : null;
  const JUNK = /(soundtrack|ost|score|trailer|teaser|remix|reaction|compare|comparison|behind the scenes|bonus|interview|nino rota|godfather of)/i;

  const score = (doc) => {
    const dt = (doc.title || "").toLowerCase();
    if (!dt.includes(t)) return -Infinity;
    let s = 0;
    if (dt === t) s += 100;
    if (y && dt.includes(y)) s += 60;
    if (JUNK.test(dt)) s -= 50;
    s += Number(doc.avg_rating || 0) * 4;
    return s;
  };

  const queries = [
    `title:("${title}" OR "${clean}") AND mediatype:movies AND format:MPEG4`,
    `title:"${title}" AND mediatype:movies`,
    `${clean} mediatype:movies AND format:MPEG4`,
  ];
  for (const q of queries) {
    try {
      const r = await fetch(
        `https://archive.org/advancedsearch.php?q=${encodeURIComponent(q)}&fl[]=identifier,title,avg_rating&sort[]=avg_rating%20desc&rows=12&output=json`
      );
      const d = await r.json();
      const docs = (d.response?.docs || [])
        .map((doc) => ({ ...doc, _score: score(doc) }))
        .filter((doc) => doc._score > 0)
        .sort((a, b) => b._score - a._score);
      if (docs.length > 0) return docs.slice(0, 6);
    } catch {
      /* try next query */
    }
  }
  return [];
}

export async function getArchiveDownloads(identifier) {
  try {
    const d = await fetch(`https://archive.org/metadata/${identifier}`).then((r) => r.json());
    const files = d.files || [];
    return files
      .filter((f) => f.format === "MPEG4" || f.name?.toLowerCase().endsWith(".mp4"))
      .map((f) => ({
        name: f.name,
        size: f.size ? Math.round(f.size / 1048576) + " MB" : "Unknown",
        url: `https://archive.org/download/${identifier}/${encodeURI(f.name)}`,
        quality: f.name?.includes("720") ? "720p" : f.name?.includes("1080") ? "1080p" : f.name?.includes("480") ? "480p" : "Standard",
      }));
  } catch {
    return [];
  }
}

export async function searchTorrents(title) {
  try {
    const d = await fetch(
      `https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(title)}&limit=3`
    ).then((r) => r.json());
    const movies = d.data?.movies || [];
    return (movies[0]?.torrents || []).map((t) => ({
      quality: t.quality,
      size: t.size,
      seeds: t.seeds,
      url: t.url,
    }));
  } catch {
    return [];
  }
}

export async function loadDownloads(title, year) {
  const docs = await searchArchive(title, year);
  const archive = [];
  for (const doc of docs.slice(0, 3)) {
    const list = await getArchiveDownloads(doc.identifier);
    archive.push(...list.map((d) => ({ ...d, item: doc.identifier })));
  }
  const torrents = await searchTorrents(title);
  return { archive, torrents };
}
