// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, enableNetwork, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Debug: afficher la config (sans la clé API complète)
console.log('🔥 Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey
});

// Initialiser l'app
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Firestore - configuration optimisée pour éviter les problèmes offline
let db;
try {
  // Essayer d'initialiser avec les nouveaux paramètres de cache
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // Force long polling au lieu de WebSocket (plus stable)
  });
  console.log('✅ Firestore initialisé avec long polling');
} catch (e) {
  // Si déjà initialisé, récupérer l'instance existante
  db = getFirestore(app);
  console.log('✅ Firestore récupéré (déjà initialisé)');
}

// Forcer la connexion réseau au démarrage
enableNetwork(db)
  .then(() => console.log('✅ Firestore: connexion réseau activée'))
  .catch((err) => console.warn('⚠️ Firestore enableNetwork:', err.message));

// Storage
export const storage = getStorage(app);

export { db };
export default app;
