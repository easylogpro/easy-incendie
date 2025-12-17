// src/services/numberingService.js
// Service de numérotation automatique des documents

import { 
  doc, 
  getDoc, 
  setDoc, 
  runTransaction
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ============================================
// TYPES DE DOCUMENTS ET TRIGRAMMES
// ============================================

export const DOCUMENT_TYPES = {
  SAV: { trigramme: 'SAV', counter: 'sav' },
  TRAVAUX: { trigramme: 'TRV', counter: 'travaux' },
  MES: { trigramme: 'MES', counter: 'mes' },
  AUDIT: { trigramme: 'AUD', counter: 'audit' },
  VISITE: { trigramme: 'VIS', counter: 'visite' },
  RECEPTION: { trigramme: 'REC', counter: 'reception' },
  DEVIS: { trigramme: 'DEV', counter: 'devis' },
  FACTURE: { trigramme: 'FAC', counter: 'factures' },
  RAPPORT: { trigramme: 'RAP', counter: 'rapports' }
};

// ============================================
// GÉNÉRATION DE NUMÉRO
// ============================================

/**
 * Générer le prochain numéro pour un type de document
 * Format: TYPE-CLIENT-AAMMJJ-XXX
 * Exemple: SAV-DUP-251216-001
 * 
 * @param {string} orgId - ID de l'organisation
 * @param {string} documentType - Type de document (SAV, DEVIS, etc.)
 * @param {string} clientCode - Code client (3-4 lettres)
 * @returns {Promise<string>} - Numéro généré
 */
export const generateDocumentNumber = async (orgId, documentType, clientCode) => {
  try {
    const typeConfig = DOCUMENT_TYPES[documentType];
    
    if (!typeConfig) {
      throw new Error(`Type de document inconnu: ${documentType}`);
    }
    
    // Formater la date (AAMMJJ)
    const now = new Date();
    const dateStr = formatDateForNumber(now);
    
    // Clé du compteur: clientCode_AAMMJJ
    const counterKey = `${clientCode.toUpperCase()}_${dateStr}`;
    
    // Utiliser une transaction pour garantir l'unicité
    const counterRef = doc(db, `organizations/${orgId}/counters`, typeConfig.counter);
    
    const newNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      
      let counters = {};
      if (counterDoc.exists()) {
        counters = counterDoc.data();
      }
      
      // Incrémenter le compteur
      const currentCount = counters[counterKey] || 0;
      const nextCount = currentCount + 1;
      
      // Mettre à jour le compteur
      counters[counterKey] = nextCount;
      transaction.set(counterRef, counters);
      
      // Formater le numéro
      const increment = String(nextCount).padStart(3, '0');
      return `${typeConfig.trigramme}-${clientCode.toUpperCase()}-${dateStr}-${increment}`;
    });
    
    return newNumber;
  } catch (error) {
    console.error('Erreur génération numéro:', error);
    throw error;
  }
};

/**
 * Générer un numéro pour une intervention
 */
export const generateInterventionNumber = async (orgId, interventionType, clientCode) => {
  const typeMap = {
    'sav': 'SAV',
    'travaux': 'TRAVAUX',
    'mes': 'MES',
    'audit': 'AUDIT',
    'visite': 'VISITE',
    'reception': 'RECEPTION'
  };
  
  const docType = typeMap[interventionType] || 'SAV';
  return generateDocumentNumber(orgId, docType, clientCode);
};

/**
 * Générer un numéro de devis
 */
export const generateDevisNumber = async (orgId, clientCode) => {
  return generateDocumentNumber(orgId, 'DEVIS', clientCode);
};

/**
 * Générer un numéro de facture
 */
export const generateFactureNumber = async (orgId, clientCode) => {
  return generateDocumentNumber(orgId, 'FACTURE', clientCode);
};

/**
 * Générer un numéro de rapport
 */
export const generateRapportNumber = async (orgId, clientCode) => {
  return generateDocumentNumber(orgId, 'RAPPORT', clientCode);
};

// ============================================
// UTILITAIRES
// ============================================

/**
 * Formater la date pour le numéro (AAMMJJ)
 */
const formatDateForNumber = (date) => {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

/**
 * Parser un numéro de document
 * @param {string} number - Numéro au format TYPE-CLIENT-AAMMJJ-XXX
 * @returns {object} - { type, clientCode, date, increment }
 */
export const parseDocumentNumber = (number) => {
  const parts = number.split('-');
  
  if (parts.length !== 4) {
    throw new Error('Format de numéro invalide');
  }
  
  const [trigramme, clientCode, dateStr, increment] = parts;
  
  // Trouver le type
  const typeEntry = Object.entries(DOCUMENT_TYPES).find(([key, value]) => value.trigramme === trigramme);
  const type = typeEntry ? typeEntry[0] : null;
  
  // Parser la date
  const year = 2000 + parseInt(dateStr.slice(0, 2));
  const month = parseInt(dateStr.slice(2, 4)) - 1;
  const day = parseInt(dateStr.slice(4, 6));
  const date = new Date(year, month, day);
  
  return {
    type,
    trigramme,
    clientCode,
    dateStr,
    date,
    increment: parseInt(increment)
  };
};

/**
 * Vérifier si un numéro existe déjà
 */
export const checkNumberExists = async (orgId, collection, number) => {
  try {
    const { trigramme } = parseDocumentNumber(number);
    
    // Déterminer la collection Firestore
    let collectionPath;
    switch (trigramme) {
      case 'DEV':
        collectionPath = 'devis';
        break;
      case 'FAC':
        collectionPath = 'factures';
        break;
      case 'RAP':
        collectionPath = 'rapports';
        break;
      default:
        collectionPath = 'interventions';
    }
    
    // Rechercher le document
    const { query, where, getDocs, collection: firestoreCollection } = await import('firebase/firestore');
    const q = query(
      firestoreCollection(db, `organizations/${orgId}/${collectionPath}`),
      where('numero', '==', number)
    );
    
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Erreur vérification numéro:', error);
    return false;
  }
};

/**
 * Récupérer le dernier numéro utilisé pour un type et un client
 */
export const getLastNumber = async (orgId, documentType, clientCode) => {
  try {
    const typeConfig = DOCUMENT_TYPES[documentType];
    
    if (!typeConfig) {
      return null;
    }
    
    const now = new Date();
    const dateStr = formatDateForNumber(now);
    const counterKey = `${clientCode.toUpperCase()}_${dateStr}`;
    
    const counterRef = doc(db, `organizations/${orgId}/counters`, typeConfig.counter);
    const counterDoc = await getDoc(counterRef);
    
    if (!counterDoc.exists()) {
      return null;
    }
    
    const counters = counterDoc.data();
    const count = counters[counterKey] || 0;
    
    if (count === 0) {
      return null;
    }
    
    const increment = String(count).padStart(3, '0');
    return `${typeConfig.trigramme}-${clientCode.toUpperCase()}-${dateStr}-${increment}`;
  } catch (error) {
    console.error('Erreur récupération dernier numéro:', error);
    return null;
  }
};

/**
 * Réinitialiser les compteurs d'un jour (utilitaire admin)
 */
export const resetDayCounters = async (orgId, documentType, clientCode, dateStr) => {
  try {
    const typeConfig = DOCUMENT_TYPES[documentType];
    
    if (!typeConfig) {
      throw new Error(`Type de document inconnu: ${documentType}`);
    }
    
    const counterKey = `${clientCode.toUpperCase()}_${dateStr}`;
    const counterRef = doc(db, `organizations/${orgId}/counters`, typeConfig.counter);
    
    const counterDoc = await getDoc(counterRef);
    
    if (counterDoc.exists()) {
      const counters = counterDoc.data();
      delete counters[counterKey];
      await setDoc(counterRef, counters);
    }
    
    return true;
  } catch (error) {
    console.error('Erreur reset compteur:', error);
    throw error;
  }
};
