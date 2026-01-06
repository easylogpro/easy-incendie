// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DemoProvider } from "./contexts/DemoContext";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";

import DashboardPage from "./pages/DashboardPage";
import ClientsPage from "./pages/ClientsPage";
import SitesPage from "./pages/SitesPage";
import TechniciensPage from "./pages/TechniciensPage";
import InterventionsPage from "./pages/InterventionsPage";
import PlanningPage from "./pages/PlanningPage";
import DevisPage from "./pages/DevisPage";
import FacturesPage from "./pages/FacturesPage";
import AlertesPage from "./pages/AlertesPage";
import SettingsPage from "./pages/SettingsPage";

import DemoPage from "./pages/DemoPage";
import DemoExpiredPage from "./pages/DemoExpiredPage";
import SubscriptionPage from "./pages/SubscriptionPage";

import MainLayout from "./layouts/MainLayout";
import DemoBanner from "./components/demo/DemoBanner";

import "./styles/index.css";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, needsProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (needsProfile) return <Navigate to="/complete-profile" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, needsProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    if (needsProfile) return <Navigate to="/complete-profile" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const ProfileRoute = ({ children }) => {
  const { isAuthenticated, loading, needsProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!needsProfile) return <Navigate to="/dashboard" replace />;
  return children;
};

const PlaceholderPage = ({ title }) => (
  <div className="p-6 flex items-center justify-center h-96">
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
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: "#1e293b", color: "#f1f5f9" },
            }}
          />

          <DemoBanner />

          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

            {/* CALLBACK */}
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* COMPLETE PROFILE */}
            <Route path="/complete-profile" element={<ProfileRoute><CompleteProfilePage /></ProfileRoute>} />

            {/* DEMO + SUBSCRIBE (protégés) */}
            <Route path="/demo" element={<ProtectedRoute><DemoPage /></ProtectedRoute>} />
            <Route path="/demo-expired" element={<ProtectedRoute><DemoExpiredPage /></ProtectedRoute>} />
            <Route path="/subscribe" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />

            {/* APP (protégé + layout) */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/sites" element={<SitesPage />} />
              <Route path="/techniciens" element={<TechniciensPage />} />
              <Route path="/planning" element={<PlanningPage />} />
              <Route path="/interventions" element={<InterventionsPage />} />
              <Route path="/devis" element={<DevisPage />} />
              <Route path="/factures" element={<FacturesPage />} />
              <Route path="/alertes" element={<AlertesPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              <Route path="/rapports" element={<PlaceholderPage title="Rapports" />} />
              <Route path="/rapports-ssi" element={<PlaceholderPage title="Rapports SSI" />} />
              <Route path="/rapports-dsf" element={<PlaceholderPage title="Rapports DSF" />} />
              <Route path="/rapports-extincteurs" element={<PlaceholderPage title="Rapports Extincteurs" />} />
              <Route path="/rapports-baes" element={<PlaceholderPage title="Rapports BAES" />} />
              <Route path="/rapports-ria" element={<PlaceholderPage title="Rapports RIA" />} />
              <Route path="/rapports-colonnes-seches" element={<PlaceholderPage title="Rapports Colonnes Sèches" />} />
              <Route path="/registre-securite" element={<PlaceholderPage title="Registre Sécurité" />} />
              <Route path="/utilisateurs" element={<PlaceholderPage title="Utilisateurs" />} />
              <Route path="/equipements" element={<PlaceholderPage title="Équipements" />} />
              <Route path="/export-comptable" element={<PlaceholderPage title="Export Comptable" />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DemoProvider>
    </AuthProvider>
  );
}

export default App;