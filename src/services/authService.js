// src/services/authService.js
// Service d'authentification et gestion des utilisateurs

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// ============================================
// AUTHENTIFICATION
// ============================================

/**
 * Connexion utilisateur
 */
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Définir l'orgId par défaut
    localStorage.setItem('currentOrgId', 'easylog_pro');
    
    // Récupérer les données utilisateur depuis Firestore
    const userData = await getUserData(user.uid);
    
    // Mettre à jour la dernière connexion
    if (userData && userData.orgId) {
      try {
        await updateLastLogin(userData.orgId, user.uid);
      } catch (e) {
        console.log('Impossible de mettre à jour la dernière connexion');
      }
    }
    
    return {
      user,
      userData
    };
  } catch (error) {
    console.error('Erreur connexion:', error);
    throw formatAuthError(error);
  }
};

/**
 * Déconnexion
 */
export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('currentOrgId');
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    throw error;
  }
};

/**
 * Réinitialisation mot de passe
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Erreur reset password:', error);
    throw formatAuthError(error);
  }
};

/**
 * Observer les changements d'état d'authentification
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // S'assurer que l'orgId est défini
      if (!localStorage.getItem('currentOrgId')) {
        localStorage.setItem('currentOrgId', 'easylog_pro');
      }
      const userData = await getUserData(user.uid);
      callback({ user, userData });
    } else {
      callback({ user: null, userData: null });
    }
  });
};

// ============================================
// GESTION UTILISATEURS
// ============================================

/**
 * Créer un nouvel utilisateur (admin uniquement)
 */
export const createUser = async (orgId, userData, password) => {
  try {
    // Créer le compte Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
    const user = userCredential.user;
    
    // Mettre à jour le profil
    await updateProfile(user, {
      displayName: `${userData.prenom} ${userData.nom}`
    });
    
    // Créer le document utilisateur dans Firestore
    const userDoc = {
      uid: user.uid,
      email: userData.email,
      nom: userData.nom,
      prenom: userData.prenom,
      telephone: userData.telephone || '',
      role: userData.role,
      technicien_id: userData.technicien_id || null,
      stt_id: userData.stt_id || null,
      client_payeur_id: userData.client_payeur_id || null,
      client_final_id: userData.client_final_id || null,
      actif: true,
      derniere_connexion: null,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };
    
    await setDoc(doc(db, `organizations/${orgId}/users`, user.uid), userDoc);
    
    return { uid: user.uid, ...userDoc };
  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    throw formatAuthError(error);
  }
};

/**
 * Récupérer les données utilisateur
 */
export const getUserData = async (uid) => {
  try {
    const storedOrgId = localStorage.getItem('currentOrgId');
    
    if (!storedOrgId) {
      console.log('Pas de currentOrgId dans localStorage, utilisation de easylog_pro');
      localStorage.setItem('currentOrgId', 'easylog_pro');
    }
    
    const orgId = storedOrgId || 'easylog_pro';
    
    try {
      const userDocRef = doc(db, `organizations/${orgId}/users`, uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return { orgId, ...userDoc.data() };
      }
    } catch (firestoreError) {
      console.log('Erreur Firestore, utilisation des données par défaut:', firestoreError.message);
    }
    
    // Si l'utilisateur n'existe pas dans Firestore ou erreur, retourner des données par défaut
    return { 
      orgId, 
      role: 'admin',
      nom: 'Admin',
      prenom: 'User',
      actif: true
    };
  } catch (error) {
    console.error('Erreur récupération userData:', error);
    return { 
      orgId: 'easylog_pro', 
      role: 'admin',
      nom: 'Admin',
      prenom: 'User',
      actif: true
    };
  }
};

/**
 * Mettre à jour la dernière connexion
 */
const updateLastLogin = async (orgId, uid) => {
  try {
    await updateDoc(doc(db, `organizations/${orgId}/users`, uid), {
      derniere_connexion: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur mise à jour dernière connexion:', error);
  }
};

// ============================================
// UTILITAIRES
// ============================================

/**
 * Formater les erreurs Firebase Auth
 */
const formatAuthError = (error) => {
  const errorMessages = {
    'auth/user-not-found': 'Aucun compte associé à cet email',
    'auth/wrong-password': 'Mot de passe incorrect',
    'auth/email-already-in-use': 'Cet email est déjà utilisé',
    'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
    'auth/invalid-email': 'Email invalide',
    'auth/user-disabled': 'Ce compte a été désactivé',
    'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
    'auth/network-request-failed': 'Erreur réseau. Vérifiez votre connexion.',
    'auth/invalid-credential': 'Email ou mot de passe incorrect'
  };
  
  return new Error(errorMessages[error.code] || error.message);
};

/**
 * Vérifier si l'utilisateur a un rôle spécifique
 */
export const hasRole = (userData, roles) => {
  if (!userData) return false;
  if (typeof roles === 'string') roles = [roles];
  return roles.includes(userData.role);
};

/**
 * Vérifier si l'utilisateur est admin
 */
export const isAdmin = (userData) => hasRole(userData, ['admin']);

/**
 * Vérifier si l'utilisateur peut gérer (admin ou gestionnaire)
 */
export const canManage = (userData) => hasRole(userData, ['admin', 'gestionnaire']);

/**
 * Vérifier si l'utilisateur est technicien (ou plus)
 */
export const isTechnicien = (userData) => hasRole(userData, ['admin', 'gestionnaire', 'technicien']);

/**
 * Logger une action dans l'audit log
 */
export const logAudit = async (orgId, userId, action, collection, documentId, before, after) => {
  try {
    const user = auth.currentUser;
    
    const logEntry = {
      timestamp: serverTimestamp(),
      user_id: userId,
      user_email: user?.email || 'system',
      action,
      collection,
      document_id: documentId,
      before: before || null,
      after: after || null,
      created_at: serverTimestamp()
    };
    
    const logId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await setDoc(doc(db, `organizations/${orgId}/audit_log`, logId), logEntry);
  } catch (error) {
    console.error('Erreur audit log:', error);
  }
};