// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages publiques
import ConfigurateurEasyLog from './pages/ConfigurateurEasyLog';

// Pages protégées
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import SettingsPage from './pages/SettingsPage';

// Layouts & Composants
import MainLayout from './layouts/MainLayout';
import UpdateBanner from './components/UpdateBanner';
import AnnouncementBanner from './components/AnnouncementBanner';

import './styles/index.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-100"><div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500">En cours de développement</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <UpdateBanner />
      <AnnouncementBanner />
      
      <Router>
        <Routes>
          {/* Page d'accueil = Configurateur commercial */}
          <Route path="/" element={<PublicRoute><ConfigurateurEasyLog /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><ConfigurateurEasyLog /></PublicRoute>} />
          
          {/* Routes protégées */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/planning" element={<PlaceholderPage title="Planning" />} />
            <Route path="/interventions" element={<PlaceholderPage title="Interventions" />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/sites" element={<PlaceholderPage title="Sites" />} />
            <Route path="/devis" element={<PlaceholderPage title="Devis" />} />
            <Route path="/factures" element={<PlaceholderPage title="Factures" />} />
            <Route path="/utilisateurs" element={<PlaceholderPage title="Utilisateurs" />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/export-comptable" element={<PlaceholderPage title="Export Comptable" />} />
            <Route path="/donnees-client" element={<PlaceholderPage title="Données Client" />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
