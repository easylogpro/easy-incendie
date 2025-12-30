// src/contexts/AuthContext.jsx
// Easy Sécurité - Contexte d'authentification avec vérification abonnement

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // États authentification
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [orgSettings, setOrgSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // États abonnement
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  // Écoute les changements d'état Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Charger les données utilisateur depuis Supabase
        await loadUserData(user.uid);
      } else {
        // Réinitialiser tout
        setUserData(null);
        setOrgId(null);
        setOrgSettings(null);
        setSubscription(null);
        setHasActiveSubscription(false);
        setLoading(false);
        setSubscriptionLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Charger les données utilisateur et organisation
  const loadUserData = async (firebaseUid) => {
    try {
      setLoading(true);
      setSubscriptionLoading(true);

      // 1. Récupérer l'utilisateur Supabase
      const { data: user, error: userError } = await supabase
        .from('utilisateurs')
        .select('*, organisations(*)')
        .eq('firebase_uid', firebaseUid)
        .single();

      if (userError || !user) {
        console.error('Erreur chargement utilisateur:', userError);
        setLoading(false);
        setSubscriptionLoading(false);
        return;
      }

      setUserData(user);
      setOrgId(user.organisation_id);
      setOrgSettings(user.organisations);

      // 2. Vérifier l'abonnement
      await checkSubscription(user.organisation_id);

      setLoading(false);
    } catch (error) {
      console.error('Erreur loadUserData:', error);
      setLoading(false);
      setSubscriptionLoading(false);
    }
  };

  // Vérifier si l'organisation a un abonnement actif
  const checkSubscription = async (organisationId) => {
    try {
      setSubscriptionLoading(true);

      const { data: sub, error } = await supabase
        .from('abonnements')
        .select('*')
        .eq('organisation_id', organisationId)
        .eq('statut', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned (pas d'erreur)
        console.error('Erreur vérification abonnement:', error);
      }

      if (sub) {
        setSubscription(sub);
        setHasActiveSubscription(true);
      } else {
        setSubscription(null);
        setHasActiveSubscription(false);
      }
    } catch (error) {
      console.error('Erreur checkSubscription:', error);
      setHasActiveSubscription(false);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Rafraîchir les données utilisateur
  const refreshUserData = async () => {
    if (currentUser) {
      await loadUserData(currentUser.uid);
    }
  };

  // Rafraîchir les paramètres organisation
  const refreshSettings = async () => {
    if (orgId) {
      const { data } = await supabase
        .from('organisations')
        .select('*')
        .eq('id', orgId)
        .single();
      
      if (data) {
        setOrgSettings(data);
      }
    }
  };

  // Rafraîchir l'abonnement
  const refreshSubscription = async () => {
    if (orgId) {
      await checkSubscription(orgId);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserData(null);
      setOrgId(null);
      setOrgSettings(null);
      setSubscription(null);
      setHasActiveSubscription(false);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      throw error;
    }
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = () => {
    return userData?.role === 'admin';
  };

  // Valeurs exposées
  const value = {
    // User
    currentUser,
    userData,
    isAuthenticated: !!currentUser,
    loading,
    
    // Organisation
    orgId,
    orgSettings,
    
    // Abonnement
    subscription,
    subscriptionLoading,
    hasActiveSubscription,
    
    // Méthodes
    logout,
    refreshUserData,
    refreshSettings,
    refreshSubscription,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
