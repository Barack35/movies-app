import { supabase, isConfigured } from "./supabase";

function notConfigured() {
  throw new Error("Backend not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.");
}

function mapError(error) {
  if (!error) return null;
  if (error.message && /duplicate key/i.test(error.message)) return null;
  return error.message || "Something went wrong.";
}

async function ensureProfile(user) {
  const name = user.user_metadata?.name || "";
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    name,
    email: user.email || "",
  });
  if (error) throw new Error(mapError(error) || "Could not save profile.");
}

export const api = {
  movies: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from("classics").select("*").order("rating", { ascending: false });
    if (error) return [];
    return (data || []).map((m) => ({
      id: m.id,
      title: m.title,
      poster: m.poster,
      backdrop: m.backdrop,
      video: m.video,
      description: m.description,
      genres: m.genres || [],
      year: m.year,
      rating: Number(m.rating || 0),
      duration: m.duration,
      trending: Boolean(m.trending),
      plays: m.plays || 0,
    }));
  },

  register: async (name, email, password) => {
    if (!supabase) throw notConfigured();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw new Error(mapError(error) || error.message);
    let session = data.session;
    if (!session) {
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (res.error) throw new Error("Account created. Check your email to confirm, then log in.");
      session = res.data.session;
    }
    await ensureProfile(session.user);
    return {
      id: session.user.id,
      name: session.user.user_metadata?.name || name,
      email: session.user.email || email,
    };
  },

  login: async (email, password) => {
    if (!supabase) throw notConfigured();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error("Invalid email or password.");
    await ensureProfile(data.user);
    return {
      id: data.user.id,
      name: data.user.user_metadata?.name || "",
      email: data.user.email || email,
    };
  },

  comments: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("comments")
      .select("id, name, text, created_at")
      .order("id", { ascending: false })
      .limit(100);
    if (error) throw new Error(mapError(error) || error.message);
    return data || [];
  },

  addComment: async (name, text) => {
    if (!supabase) throw notConfigured();
    const { data: auth } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("comments")
      .insert({ user_id: auth.user?.id || null, name, text })
      .select()
      .single();
    if (error) throw new Error(mapError(error) || error.message);
    return data;
  },

  subscribe: async (email) => {
    if (!supabase) throw notConfigured();
    const { error } = await supabase.from("subscribers").insert({ email });
    if (error && !/duplicate/i.test(error.message)) throw new Error(mapError(error) || error.message);
    return { email };
  },

  favorites: async (userId) => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("favorites")
      .select("movie_id")
      .eq("user_id", userId);
    if (error) throw new Error(mapError(error) || error.message);
    return (data || []).map((r) => r.movie_id);
  },

  toggleFavorite: async (userId, movieId) => {
    if (!supabase) throw notConfigured();
    const { data: existing } = await supabase
      .from("favorites")
      .select("movie_id")
      .eq("user_id", userId)
      .eq("movie_id", movieId)
      .maybeSingle();
    if (existing) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("movie_id", movieId);
      if (error) throw new Error(mapError(error) || error.message);
      return { favorite: false };
    }
    const { error } = await supabase.from("favorites").insert({ user_id: userId, movie_id: movieId });
    if (error) throw new Error(mapError(error) || error.message);
    return { favorite: true };
  },

  play: async (movieId) => {
    if (!supabase) return { id: movieId };
    const { error } = await supabase.rpc("increment_play", { p_movie_id: movieId });
    if (error) return { id: movieId };
    return { id: movieId };
  },
};

export const isApiReachable = async () => {
  if (!isConfigured()) return false;
  try {
    const { error } = await supabase.from("comments").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
};
