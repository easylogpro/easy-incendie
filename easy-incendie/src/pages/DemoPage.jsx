// src/pages/DemoPage.jsx
// Easy Sécurité - Page de démo 3 minutes avec timer visible

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDemo } from '../contexts/DemoContext';
import { useAuth } from '../contexts/AuthContext';
import LockedFeatureModal from '../components/demo/LockedFeatureModal';
import { 
  Building2, Users, FileText, Calendar, Settings, 
  BarChart3, AlertTriangle, CheckCircle2, Clock, 
  Plus, Download, Edit, Eye, Lock, Zap, Shield,
  Gauge, Flame
} from 'lucide-react';

const DemoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { 
    isDemoMode, 
    startDemo, 
    demoExpired, 
    demoRequest,
    timeRemaining,
    formatTimeRemaining,
    DEMO_DURATION
  } = useDemo();

  const [lockedModal, setLockedModal] = useState({ open: false, feature: 'default' });
  const [demoStarted, setDemoStarted] = useState(false);

  // Récupérer les données
  const questionnaireData = location.state?.questionnaireData || null;
  const pricing = location.state?.pricing || null;

  // Démarrer la démo au chargement
  useEffect(() => {
    if (questionnaireData && !isDemoMode && !demoExpired && !demoStarted) {
      setDemoStarted(true);
      startDemo({
        email: currentUser?.email,
        prenom: currentUser?.displayName?.split(' ')[0] || '',
        nom: currentUser?.displayName?.split(' ')[1] || '',
        domaines: questionnaireData.modulesInteresses,
        profil: questionnaireData.typeActivite,
        nb_utilisateurs: questionnaireData.nombreTechniciens,
        tarif_final: pricing?.finalPrice,
        rapports_fournis: pricing?.availableReports || location.state?.rapportsFournis
      });
    }
  }, [questionnaireData, isDemoMode, demoExpired, demoStarted]);

  // Rediriger si démo expirée
  useEffect(() => {
    if (demoExpired) {
      navigate('/demo-expired', { state: { request: demoRequest || questionnaireData } });
    }
  }, [demoExpired, navigate]);

  const handleLockedFeature = (feature) => {
    setLockedModal({ open: true, feature });
  };

  const handleSubscribe = () => {
    navigate('/subscribe', { state: { fromDemo: true, request: demoRequest || questionnaireData, pricing } });
  };

  // Domaines actifs
  const activeDomains = demoRequest?.domaines || questionnaireData?.modulesInteresses || ['ssi'];

  // Config domaines
  const domainConfig = {
    ssi: { label: 'SSI', icon: Shield, color: 'red' },
    dsf: { label: 'Désenfumage', icon: Gauge, color: 'orange' },
    baes: { label: 'BAES', icon: Zap, color: 'yellow' },
    extincteurs: { label: 'Extincteurs', icon: Flame, color: 'red' },
    ria: { label: 'RIA', icon: Shield, color: 'blue' },
    colonnes_seches: { label: 'Colonnes sèches', icon: Settings, color: 'gray' },
    compartimentage: { label: 'Compartimentage', icon: Building2, color: 'purple' }
  };

  // Pourcentage pour la barre
  const percentage = (timeRemaining / DEMO_DURATION) * 100;
  const timerColor = timeRemaining <= 30 ? 'text-red-500' : timeRemaining <= 60 ? 'text-orange-500' : 'text-green-500';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER AVEC TIMER GROS */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="font-black">ES</span>
              </div>
              <div>
                <span className="font-bold">Easy Sécurité</span>
                <span className="ml-2 px-2 py-0.5 bg-orange-500 text-xs rounded font-bold">DÉMO</span>
              </div>
            </div>

            {/* TIMER CENTRAL - TRÈS VISIBLE */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs opacity-75">Temps restant</div>
                <div className={`text-4xl font-mono font-black ${timerColor} ${timeRemaining <= 30 ? 'animate-pulse' : ''}`}>
                  {formatTimeRemaining()}
                </div>
              </div>
              {/* Barre progression */}
              <div className="w-32 h-3 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 rounded-full ${timeRemaining <= 30 ? 'bg-red-500' : timeRemaining <= 60 ? 'bg-orange-400' : 'bg-green-400'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Bouton souscrire */}
            <button
              onClick={handleSubscribe}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 px-6 py-2 rounded-lg font-bold hover:from-red-600 hover:to-orange-600 transition-all shadow-lg"
            >
              <Zap className="w-4 h-4" />
              Souscrire -10%
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-60px)] p-4">
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Building2 className="w-5 h-5" />
              Clients
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5" />
              Planning
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5" />
              Rapports
            </a>
            <button 
              onClick={() => handleLockedFeature('settings')}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-50 rounded-lg"
            >
              <Settings className="w-5 h-5" />
              Paramètres
              <Lock className="w-4 h-4 ml-auto text-orange-500" />
            </button>
          </nav>

          {/* Modules actifs */}
          <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <p className="text-xs font-bold text-blue-800 mb-3">VOS MODULES ACTIFS</p>
            <div className="space-y-2">
              {activeDomains.map(domain => {
                const config = domainConfig[domain];
                if (!config) return null;
                return (
                  <div key={domain} className="flex items-center gap-2 text-sm">
                    <config.icon className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-700">{config.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Message démo */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <div>
                <p className="font-bold">🔥 Démo gratuite de 3 minutes</p>
                <p className="text-sm opacity-90">Explorez l'interface. Les actions de création sont verrouillées.</p>
              </div>
            </div>
            <div className={`text-3xl font-mono font-black ${timeRemaining <= 30 ? 'animate-pulse' : ''}`}>
              {formatTimeRemaining()}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Clients</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Sites</p>
                  <p className="text-2xl font-bold">28</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Rapports</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-red-200 bg-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm">Alertes</p>
                  <p className="text-2xl font-bold text-red-700">3</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Actions verrouillées */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Clients récents</h2>
                <button 
                  onClick={() => handleLockedFeature('add_client')}
                  className="flex items-center gap-1 text-orange-500 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                  <Lock className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {['Carrefour Béziers', 'Mairie Montpellier', 'Hôpital Saint-Roch'].map(client => (
                  <div key={client} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                    <span className="font-medium">{client}</span>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Rapports</h2>
                <button 
                  onClick={() => handleLockedFeature('create_report')}
                  className="flex items-center gap-1 text-orange-500 text-sm font-medium"
                >
                  <FileText className="w-4 h-4" />
                  Créer
                  <Lock className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {['Vérification SSI - Carrefour', 'Maintenance BAES - Mairie', 'SAV Extincteurs'].map(rapport => (
                  <div key={rapport} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                    <span className="font-medium text-sm">{rapport}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleLockedFeature('generate_pdf')} className="text-orange-500">
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleLockedFeature('edit_report')} className="text-orange-500">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      <LockedFeatureModal 
        isOpen={lockedModal.open}
        onClose={() => setLockedModal({ open: false, feature: 'default' })}
        featureType={lockedModal.feature}
      />
    </div>
  );
};

export default DemoPage;
