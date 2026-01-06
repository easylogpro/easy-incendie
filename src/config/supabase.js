// src/config/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://ofoibgbrviywlqxrnxvq.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mb2liZ2Jydml5d2xxeHJueHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MzUwODAsImV4cCI6MjA4MjUxMTA4MH0.-x37FsewR38YzmmJBupH_ms-HgEzuKFitwrLpYDp9S8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // indispensable pour garder la session après refresh
    persistSession: true,
    autoRefreshToken: true,

    // IMPORTANT : mode "manuel" => évite la double gestion (source d'instabilité)
    detectSessionInUrl: false,

    storage: window.localStorage,

    // Flow PKCE
    flowType: "pkce",
  },
});

export const handleSupabaseError = (error) => {
  console.error("Supabase Error:", error);
  return { error: error?.message || "Une erreur est survenue" };
};