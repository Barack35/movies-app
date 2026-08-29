import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://thigrijubmfygfqhuqpg.supabase.co";
const DEFAULT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoaWdyaWp1Ym1meWdmcWh1cXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMTg4ODMsImV4cCI6MjEwMzU5NDg4M30.vnbTjH-EEeo1sR17ynWZpRVjpRATRR3r88GQKQ6R80w";

const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

export const supabase = createClient(url, anonKey);

export const isConfigured = () => Boolean(supabase);
