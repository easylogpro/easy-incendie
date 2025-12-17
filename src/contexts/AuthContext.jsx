// src/contexts/AuthContext.jsx
// Context React pour la gestion de l'authentification - OPTIMISÉ

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Données par défaut (fallback rapide)
const DEFAULT_USER_DATA = {
  orgId: 'easylog_pro',
  role: 'admin',
  nom: 'Admin',
  prenom: 'User',
  actif: true
};

const DEFAULT_ORG_SETTINGS = {
  nom: 'EasyLog Pro',
  licence: {
    statut: 'actif',
    plan: 'pro',
    modules_actifs: ['energie', 'incendie']
  }
};

// Timeout pour les requêtes Firestore (3 secondes max)
const fetchWithTimeout = async (promise, timeoutMs = 3000) => {
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), timeoutMs)
  );
  return Promise.race([promise, timeout]);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [orgSettings, setOrgSettings] = useState(null);
  const [licence, setLicence] = useState({ valid: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthProvider: Initialisation...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔐 Auth state changed:', firebaseUser ? 'connecté' : 'déconnecté');
      
      if (firebaseUser) {
        setUser(firebaseUser);
        
        const orgId = localStorage.getItem('currentOrgId') || 'easylog_pro';
        localStorage.setItem('currentOrgId', orgId);

        // Charger userData et orgSettings EN PARALLÈLE avec timeout
        try {
          const [userResult, settingsResult] = await Promise.allSettled([
            fetchWithTimeout(getDoc(doc(db, `organizations/${orgId}/users`, firebaseUser.uid))),
            fetchWithTimeout(getDoc(doc(db, `organizations/${orgId}/settings`, 'main')))
          ]);

          // Traiter userData
          if (userResult.status === 'fulfilled' && userResult.value.exists()) {
            console.log('✅ UserData chargé depuis Firestore');
            setUserData({ orgId, ...userResult.value.data() });
          } else {
            console.log('⚠️ UserData: utilisation des valeurs par défaut');
            setUserData(DEFAULT_USER_DATA);
          }

          // Traiter orgSettings
          if (settingsResult.status === 'fulfilled' && settingsResult.value.exists()) {
            console.log('✅ OrgSettings chargé depuis Firestore');
            const settings = settingsResult.value.data();
            setOrgSettings(settings);
            
            // Calculer licence directement (pas de requête supplémentaire)
            setLicence(calculateLicence(settings));
          } else {
            console.log('⚠️ OrgSettings: utilisation des valeurs par défaut');
            setOrgSettings(DEFAULT_ORG_SETTINGS);
            setLicence({ valid: true, licence: DEFAULT_ORG_SETTINGS.licence });
          }

        } catch (error) {
          console.error('❌ Erreur chargement données:', error);
          setUserData(DEFAULT_USER_DATA);
          setOrgSettings(DEFAULT_ORG_SETTINGS);
          setLicence({ valid: true });
        }

      } else {
        // Déconnecté
        setUser(null);
        setUserData(null);
        setOrgSettings(null);
        setLicence({ valid: true });
      }

      setLoading(false);
      console.log('🔐 AuthProvider: Chargement terminé');
    });

    return () => unsubscribe();
  }, []);

  // Calculer la licence sans requête supplémentaire
  const calculateLicence = (settings) => {
    if (!settings?.licence) {
      return { valid: true, licence: DEFAULT_ORG_SETTINGS.licence };
    }

    const licence = settings.licence;

    if (licence.statut === 'suspendu') {
      return { valid: false, reason: 'Licence suspendue' };
    }

    if (!licence.date_expiration) {
      return { valid: true, licence };
    }

    try {
      const now = new Date();
      let expiration;

      if (licence.date_expiration?.toDate) {
        expiration = licence.date_expiration.toDate();
      } else if (licence.date_expiration?.seconds) {
        expiration = new Date(licence.date_expiration.seconds * 1000);
      } else {
        expiration = new Date(licence.date_expiration);
      }

      if (isNaN(expiration.getTime())) {
        return { valid: true, licence };
      }

      if (now > expiration) {
        return { valid: false, reason: 'Licence expirée', expired: true };
      }

      const joursRestants = Math.ceil((expiration - now) / (1000 * 60 * 60 * 24));

      return {
        valid: true,
        licence: {
          ...licence,
          jours_restants: joursRestants,
          expire_bientot: joursRestants <= 30
        }
      };
    } catch (e) {
      return { valid: true, licence };
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
      localStorage.removeItem('currentOrgId');
      setUser(null);
      setUserData(null);
      setOrgSettings(null);
      setLicence({ valid: true });
    } catch (err) {
      console.error('Erreur déconnexion:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = async () => {
    if (!userData?.orgId) return;
    try {
      const settingsDoc = await getDoc(doc(db, `organizations/${userData.orgId}/settings`, 'main'));
      if (settingsDoc.exists()) {
        setOrgSettings(settingsDoc.data());
      }
    } catch (err) {
      console.error('Erreur refresh settings:', err);
    }
  };

  const hasRole = (roles) => {
    if (!userData) return false;
    if (typeof roles === 'string') roles = [roles];
    return roles.includes(userData.role);
  };

  const isModuleActive = (moduleId) => {
    return orgSettings?.licence?.modules_actifs?.includes(moduleId) || false;
  };

  const value = {
    user,
    userData,
    orgSettings,
    orgId: userData?.orgId || 'easylog_pro',
    licence,
    loading,
    error: null,

    login: async (email, password) => {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const result = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('currentOrgId', 'easylog_pro');
      return result;
    },
    logout: handleLogout,
    resetPassword: async (email) => {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      return sendPasswordResetEmail(auth, email);
    },
    refreshSettings,

    hasRole,
    isAdmin: () => hasRole(['admin']),
    canManage: () => hasRole(['admin', 'gestionnaire']),
    isTechnicien: () => hasRole(['admin', 'gestionnaire', 'technicien']),
    isSTT: () => hasRole(['stt']),
    isClient: () => hasRole(['client_payeur', 'client_final']),
    isModuleActive,

    isAuthenticated: !!user,
    isLicenceValid: licence?.valid !== false,
    licenceExpireBientot: licence?.licence?.expire_bientot || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
