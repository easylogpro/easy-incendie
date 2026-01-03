// src/contexts/AuthContext.jsx
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
        .select('*')
        .eq('auth_id', authUser.id)
        .maybeSingle();

      if (error) {
        console.error('Erreur loadUserData:', error);
        setNeedsProfile(true);
        setUserData(null);
        setOrgSettings(null);
        return null;
      }

      if (!data) {
        console.log('Profil incomplet - redirection nécessaire');
        setNeedsProfile(true);
        setUserData(null);
        setOrgSettings(null);
        return null;
      }

      if (data.organisation_id) {
        const { data: orgData } = await supabase
          .from('organisations')
          .select('*')
          .eq('id', data.organisation_id)
          .maybeSingle();
        
        setOrgSettings(orgData || null);
      }

      setUserData(data);
      setNeedsProfile(false);
      return data;

    } catch (error) {
      console.error('Erreur chargement userData:', error);
      setNeedsProfile(true);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
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

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    if (data.user) {
      await loadUserData(data.user);
    }
    
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    setUser(null);
    setUserData(null);
    setOrgSettings(null);
    setNeedsProfile(false);
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  };

  const refreshUserData = async () => {
    if (user) {
      await loadUserData(user);
    }
  };

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