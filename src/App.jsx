// src/App.jsx
// Easy Sécurité - Application principale V5

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DemoProvider } from './contexts/DemoContext';

// Pages publiques
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Pages démo & abonnement
import DemoPage from './pages/DemoPage';
import DemoExpiredPage from './pages/DemoExpiredPage';
import SubscriptionPage from './pages/SubscriptionPage';

// Pages protégées
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import SettingsPage from './pages/SettingsPage';

// Layout
import MainLayout from './layouts/MainLayout';

// Composants démo
import DemoBanner from './components/demo/DemoBanner';

import './styles/index.css';

// Route protégée
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Route publique
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Placeholder pour pages en développement
const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500">Module en cours de développement</p>
      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        Bientôt disponible
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <DemoProvider>
        <Router>
          {/* Bannière démo DANS le Router */}
          <DemoBanner />
          
          <Routes>
            {/* ROUTES PUBLIQUES */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            
            {/* ROUTES DÉMO & ABONNEMENT */}
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/demo-expired" element={<DemoExpiredPage />} />
            <Route path="/subscribe" element={<SubscriptionPage />} />
            
            {/* ROUTES PROTÉGÉES */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/sites" element={<PlaceholderPage title="Sites" />} />
              <Route path="/equipements" element={<PlaceholderPage title="Équipements" />} />
              <Route path="/planning" element={<PlaceholderPage title="Planning" />} />
              <Route path="/interventions" element={<PlaceholderPage title="Interventions" />} />
              <Route path="/devis" element={<PlaceholderPage title="Devis" />} />
              <Route path="/factures" element={<PlaceholderPage title="Factures" />} />
              <Route path="/rapports" element={<PlaceholderPage title="Rapports" />} />
              <Route path="/rapports-ssi" element={<PlaceholderPage title="Rapports SSI" />} />
              <Route path="/rapports-dsf" element={<PlaceholderPage title="Rapports DSF" />} />
              <Route path="/rapports-extincteurs" element={<PlaceholderPage title="Rapports Extincteurs" />} />
              <Route path="/rapports-baes" element={<PlaceholderPage title="Rapports BAES" />} />
              <Route path="/rapports-ria" element={<PlaceholderPage title="Rapports RIA" />} />
              <Route path="/rapports-colonnes-seches" element={<PlaceholderPage title="Rapports Colonnes Sèches" />} />
              <Route path="/registre-securite" element={<PlaceholderPage title="Registre Sécurité" />} />
              <Route path="/techniciens" element={<PlaceholderPage title="Techniciens" />} />
              <Route path="/utilisateurs" element={<PlaceholderPage title="Utilisateurs" />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/export-comptable" element={<PlaceholderPage title="Export Comptable" />} />
            </Route>
            
            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DemoProvider>
    </AuthProvider>
  );
}

export default App;
