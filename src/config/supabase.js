// src/config/supabase.js
// EASY INCENDIE - Configuration Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ofoibgbrviywlqxrnxvq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mb2liZ2Jydml5d2xxeHJueHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MzUwODAsImV4cCI6MjA4MjUxMTA4MH0.-x37FsewR38YzmmJBupH_ms-HgEzuKFitwrLpYDp9S8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper pour gérer les erreurs
export const handleSupabaseError = (error) => {
  console.error('Supabase Error:', error)
  return { error: error.message || 'Une erreur est survenue' }
}

// Organisation ID (sera défini après connexion utilisateur)
export const getOrganisationId = () => {
  // À implémenter avec le contexte d'authentification
  return null
}
