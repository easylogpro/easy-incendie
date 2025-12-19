// src/App.jsx
// Easy Renov - Application principale
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages publiques
import ConfigurateurEasyRenov from './pages/ConfigurateurEasyRenov';

// Pages protégées
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import SettingsPage from './pages/SettingsPage';

// Layouts & Composants
import MainLayout from './layouts/MainLayout';
import UpdateBanner from './components/UpdateBanner';
import AnnouncementBanner from './components/AnnouncementBanner';

import './styles/index.css';

// Route protégée - redirige vers landing si non connecté
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Route publique - redirige vers dashboard si connecté
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Page placeholder pour les modules en développement
const PlaceholderPage = ({ title, icon: Icon }) => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      {Icon && <Icon className="w-16 h-16 text-slate-300 mx-auto mb-4" />}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500">Module en cours de développement</p>
      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        Bientôt disponible
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      {/* Bannières système */}
      <UpdateBanner />
      <AnnouncementBanner />
      
      <Router>
        <Routes>
          {/* ═══════════════════════════════════════════════════════════
              ROUTES PUBLIQUES
              ═══════════════════════════════════════════════════════════ */}
          
          {/* Page d'accueil = Configurateur commercial Easy Renov */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <ConfigurateurEasyRenov />
              </PublicRoute>
            } 
          />
          
          {/* Alias pour /login */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <ConfigurateurEasyRenov />
              </PublicRoute>
            } 
          />
          
          {/* ═══════════════════════════════════════════════════════════
              ROUTES PROTÉGÉES (après connexion)
              ═══════════════════════════════════════════════════════════ */}
          
          <Route 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Gestion */}
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/sites" element={<PlaceholderPage title="Sites" />} />
            <Route path="/equipements" element={<PlaceholderPage title="Équipements" />} />
            
            {/* Planning & Interventions */}
            <Route path="/planning" element={<PlaceholderPage title="Planning" />} />
            <Route path="/interventions" element={<PlaceholderPage title="Interventions" />} />
            
            {/* Commercial */}
            <Route path="/devis" element={<PlaceholderPage title="Devis" />} />
            <Route path="/factures" element={<PlaceholderPage title="Factures" />} />
            
            {/* Rapports */}
            <Route path="/rapports" element={<PlaceholderPage title="Rapports" />} />
            
            {/* Modules spécifiques Easy Renov */}
            <Route path="/simulateur-primes" element={<PlaceholderPage title="Simulateur Primes CEE / MaPrimeRénov" />} />
            <Route path="/veille-reglementaire" element={<PlaceholderPage title="Veille Réglementaire" />} />
            
            {/* Administration */}
            <Route path="/utilisateurs" element={<PlaceholderPage title="Utilisateurs" />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* Packs additionnels */}
            <Route path="/export-comptable" element={<PlaceholderPage title="Export Comptable" />} />
          </Route>
          
          {/* ═══════════════════════════════════════════════════════════
              FALLBACK - Redirection vers accueil
              ═══════════════════════════════════════════════════════════ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
