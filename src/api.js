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

async function fetchProfile(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, is_admin")
    .eq("id", userId)
    .maybeSingle();
  if (error) return null;
  return data || null;
}

function userSession(u) {
  return {
    id: u.id,
    name: u.user_metadata?.name || "",
    email: u.email || "",
  };
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
    const profile = await fetchProfile(session.user.id);
    return { ...userSession(session.user), isAdmin: Boolean(profile?.is_admin) };
  },

  login: async (email, password) => {
    if (!supabase) throw notConfigured();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error("Invalid email or password.");
    await ensureProfile(data.user);
    const profile = await fetchProfile(data.user.id);
    return { ...userSession(data.user), isAdmin: Boolean(profile?.is_admin) };
  },

  signInWithGoogle: async () => {
    if (!supabase) throw notConfigured();
    const redirectTo = `${window.location.origin}/`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) throw new Error(error.message || "Could not start Google sign in.");
  },

  profile: fetchProfile,

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

  subscribers: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("subscribers")
      .select("id, email, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(mapError(error) || error.message);
    return data || [];
  },

  deleteComment: async (commentId) => {
    if (!supabase) throw notConfigured();
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    if (error) throw new Error(mapError(error) || error.message);
    return { deleted: commentId };
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
