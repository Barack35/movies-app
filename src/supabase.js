import { createClient } from "@supabase/supabase-js";

export const SB_URL = "https://thigrijubmfygfqhuqpg.supabase.co";
export const SB_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoaWdyaWp1Ym1meWdmcWh1cXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMTg4ODMsImV4cCI6MjEwMzU5NDg4M30.vnbTjH-EEeo1sR17ynWZpRVjpRATRR3r88GQKQ6R80w";

export const supabase = createClient(SB_URL, SB_ANON_KEY);

export const isConfigured = () => Boolean(supabase);
