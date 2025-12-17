// src/services/organizationService.js
// Service de gestion des organisations

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// ============================================
// ORGANISATION - SETTINGS
// ============================================

/**
 * Récupérer les paramètres de l'organisation
 */
export const getOrganizationSettings = async (orgId) => {
  try {
    const settingsDoc = await getDoc(doc(db, `organizations/${orgId}/settings`, 'main'));
    
    if (settingsDoc.exists()) {
      return settingsDoc.data();
    }
    
    // Retourner des settings par défaut si non trouvé
    return {
      nom: 'EasyLog Pro',
      licence: {
        statut: 'actif',
        plan: 'pro',
        modules_actifs: ['energie', 'incendie']
      }
    };
  } catch (error) {
    console.error('Erreur récupération settings:', error);
    // Retourner des settings par défaut en cas d'erreur
    return {
      nom: 'EasyLog Pro',
      licence: {
        statut: 'actif',
        plan: 'pro',
        modules_actifs: ['energie', 'incendie']
      }
    };
  }
};

/**
 * Mettre à jour les paramètres de l'organisation
 */
export const updateOrganizationSettings = async (orgId, userId, settings) => {
  try {
    const settingsRef = doc(db, `organizations/${orgId}/settings`, 'main');
    
    const updatedSettings = {
      ...settings,
      updated_at: serverTimestamp()
    };
    
    await updateDoc(settingsRef, updatedSettings);
    
    return updatedSettings;
  } catch (error) {
    console.error('Erreur mise à jour settings:', error);
    throw error;
  }
};

/**
 * Uploader le logo de l'organisation
 */
export const uploadLogo = async (orgId, userId, file) => {
  try {
    if (!file.type.startsWith('image/')) {
      throw new Error('Le fichier doit être une image');
    }
    
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Le fichier ne doit pas dépasser 2 Mo');
    }
    
    const extension = file.name.split('.').pop();
    const fileName = `logo_${Date.now()}.${extension}`;
    const filePath = `organizations/${orgId}/logo/${fileName}`;
    
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    
    const downloadURL = await getDownloadURL(storageRef);
    
    await updateOrganizationSettings(orgId, userId, {
      logo_url: downloadURL
    });
    
    return downloadURL;
  } catch (error) {
    console.error('Erreur upload logo:', error);
    throw error;
  }
};

// ============================================
// VÉRIFICATION LICENCE
// ============================================

/**
 * Vérifier si la licence est valide
 */
export const checkLicence = async (orgId) => {
  try {
    const settings = await getOrganizationSettings(orgId);
    
    if (!settings || !settings.licence) {
      // Pas de licence = valide par défaut pour ne pas bloquer
      return { 
        valid: true, 
        licence: { 
          plan: 'pro', 
          statut: 'actif',
          modules_actifs: ['energie', 'incendie']
        } 
      };
    }
    
    const licence = settings.licence;
    
    // Vérifier le statut
    if (licence.statut === 'suspendu') {
      return { valid: false, reason: 'Licence suspendue' };
    }
    
    // Si pas de date d'expiration, licence valide
    if (!licence.date_expiration) {
      return { valid: true, licence };
    }
    
    // Vérifier l'expiration
    const now = new Date();
    let expiration;
    
    try {
      if (licence.date_expiration?.toDate) {
        expiration = licence.date_expiration.toDate();
      } else if (licence.date_expiration?.seconds) {
        expiration = new Date(licence.date_expiration.seconds * 1000);
      } else {
        expiration = new Date(licence.date_expiration);
      }
      
      if (isNaN(expiration.getTime())) {
        // Date invalide = licence valide par défaut
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
    } catch (dateError) {
      console.error('Erreur parsing date expiration:', dateError);
      return { valid: true, licence };
    }
  } catch (error) {
    console.error('Erreur vérification licence:', error);
    // En cas d'erreur, on laisse passer
    return { 
      valid: true, 
      licence: { 
        plan: 'pro', 
        statut: 'actif',
        modules_actifs: ['energie', 'incendie']
      } 
    };
  }
};

/**
 * Vérifier si un module est actif
 */
export const isModuleActive = async (orgId, moduleId) => {
  try {
    const settings = await getOrganizationSettings(orgId);
    return settings?.licence?.modules_actifs?.includes(moduleId) || false;
  } catch (error) {
    console.error('Erreur vérification module:', error);
    return true; // Par défaut actif en cas d'erreur
  }
};

/**
 * Récupérer les modules disponibles
 */
export const getAvailableModules = () => {
  return [
    {
      id: 'energie',
      nom: 'Énergie',
      description: 'PAC, Climatisation, Fluides frigorigènes',
      lots: ['pac', 'clim', 'fluides']
    },
    {
      id: 'chauffage',
      nom: 'Chauffage',
      description: 'Chaudières gaz, fioul, électrique, plancher chauffant',
      lots: ['chaudiere_gaz', 'chaudiere_fioul', 'chaudiere_elec', 'plancher_chauffant']
    },
    {
      id: 'incendie',
      nom: 'Incendie',
      description: 'SSI, BAES, Extincteurs, RIA, Désenfumage, Compartimentage',
      lots: ['ssi', 'baes', 'extincteurs', 'ria', 'desenfumage', 'compartimentage']
    },
    {
      id: 'isolation',
      nom: 'Isolation',
      description: 'Combles, Murs, Menuiserie extérieure',
      lots: ['combles', 'murs', 'menuiserie']
    }
  ];
};