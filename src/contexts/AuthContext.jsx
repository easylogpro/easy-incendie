// src/contexts/AuthContext.jsx
// Gestion authentification Supabase avec détection profil incomplet
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [orgSettings, setOrgSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);

  // Charger les données utilisateur depuis la table utilisateurs
  const loadUserData = async (authUser) => {
    if (!authUser) {
      setUserData(null);
      setOrgSettings(null);
      setNeedsProfile(false);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('utilisateurs')
        .select(`
          *,
          organisations (*)
        `)
        .eq('auth_id', authUser.id)
        .single();

      if (error) {
        // Si pas trouvé dans table utilisateurs = profil incomplet
        if (error.code === 'PGRST116') {
          console.log('Profil incomplet - redirection nécessaire');
          setNeedsProfile(true);
          setUserData(null);
          setOrgSettings(null);
          return null;
        }
        throw error;
      }

      setUserData(data);
      setOrgSettings(data.organisations);
      setNeedsProfile(false);
      return data;

    } catch (error) {
      console.error('Erreur chargement userData:', error);
      setNeedsProfile(true);
      return null;
    }
  };

  // Initialisation
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Récupérer la session actuelle
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await loadUserData(session.user);
        }
      } catch (error) {
        console.error('Erreur init auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadUserData(session.user);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserData(null);
          setOrgSettings(null);
          setNeedsProfile(false);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Inscription
  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) throw error;
    return data;
  };

  // Connexion
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Charger les données après connexion
    if (data.user) {
      await loadUserData(data.user);
    }
    
    return data;
  };

  // Déconnexion
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    setUser(null);
    setUserData(null);
    setOrgSettings(null);
    setNeedsProfile(false);
  };

  // Reset password
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  };

  // Rafraîchir les données
  const refreshUserData = async () => {
    if (user) {
      await loadUserData(user);
    }
  };

  // Vérifier si admin
  const isAdmin = () => {
    return userData?.role === 'admin';
  };

  const value = {
    user,
    userData,
    orgSettings,
    orgId: userData?.organisation_id,
    loading,
    needsProfile,
    isAuthenticated: !!user,
    isAdmin,
    signUp,
    signIn,
    logout,
    resetPassword,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
