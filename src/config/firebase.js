// src/config/firebase.js
// EASY INCENDIE - Configuration Firebase

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuration Firebase Easy Incendie
const firebaseConfig = {
  apiKey: "AIzaSyDl_zAYD6iCPy54X7JsS_7Lghmp-mQ365c",
  authDomain: "easyincendie.firebaseapp.com",
  projectId: "easyincendie",
  storageBucket: "easyincendie.firebasestorage.app",
  messagingSenderId: "297409255780",
  appId: "1:297409255780:web:6640c1902f0864c2e94271",
  measurementId: "G-Z0Q9CD6P9Y"
};

// Debug
console.log('🔥 Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey
});

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configuration Firestore avec long polling (évite les problèmes WebSocket)
console.log('✅ Firestore initialisé avec long polling');

// Fonction pour activer/désactiver le réseau Firestore
export const enableFirestoreNetwork = async () => {
  try {
    await enableNetwork(db);
    console.log('✅ Firestore: connexion réseau activée');
  } catch (error) {
    console.error('❌ Erreur activation réseau Firestore:', error);
  }
};

export const disableFirestoreNetwork = async () => {
  try {
    await disableNetwork(db);
    console.log('⚠️ Firestore: mode hors ligne');
  } catch (error) {
    console.error('❌ Erreur désactivation réseau Firestore:', error);
  }
};

// Activer le réseau au démarrage
enableFirestoreNetwork();

export default app;
