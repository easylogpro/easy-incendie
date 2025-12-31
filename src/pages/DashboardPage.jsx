// src/pages/DashboardPage.jsx
// Easy Sécurité - Dashboard avec modules selon abonnement

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import OnboardingWizard from '../components/onboarding/OnboardingWizard';
import { 
  BarChart3, Building2, Users, FileText, Calendar, 
  AlertTriangle, CheckCircle2, Plus, ArrowRight,
  Shield, Gauge, Zap, Settings, Flame
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, orgId, orgSettings, subscription } = useAuth();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingProgress, setOnboardingProgress] = useState(null);
  const [stats, setStats] = useState({ clients: 0, sites: 0, rapports: 0, alertes: 3 });

  const justSubscribed = location.state?.subscriptionSuccess;
  const isFirstMonth = location.state?.firstMonth;

  useEffect(() => {
    if (orgId) {
      loadStats();
      checkOnboarding();
    }
  }, [orgId]);

  const loadStats = async () => {
    try {
      const [clients, sites] = await Promise.all([
        supabase.from('clients').select('id', { count: 'exact' }).eq('organisation_id', orgId),
        supabase.from('sites').select('id', { count: 'exact' }).eq('organisation_id', orgId)
      ]);
      setStats({ clients: clients.count || 0, sites: sites.count || 0, rapports: 0, alertes: 3 });
    } catch (e) {
      console.error(e);
    }
  };

  const checkOnboarding = async () => {
    try {
      const { data } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('organisation_id', orgId)
        .single();

      setOnboardingProgress(data);
      if (!data || !data.onboarding_complete) {
        setShowOnboarding(true);
      }
    } catch (e) {
      setShowOnboarding(true);
    }
  };

  // MODULES ACTIFS SELON L'ABONNEMENT
  const activeDomains = subscription?.domaines_actifs || orgSettings?.modules_actifs || ['ssi'];

  const domainConfig = {
    ssi: { label: 'SSI (Système Sécurité Incendie)', icon: Shield, color: 'bg-red-500', route: '/rapports-ssi' },
    dsf: { label: 'Désenfumage', icon: Gauge, color: 'bg-orange-500', route: '/rapports-dsf' },
    compartimentage: { label: 'Compartimentage', icon: Building2, color: 'bg-purple-500', route: '/rapports' },
    baes: { label: 'BAES / Éclairage sécurité', icon: Zap, color: 'bg-yellow-500', route: '/rapports-baes' },
    extincteurs: { label: 'Extincteurs', icon: Flame, color: 'bg-red-600', route: '/rapports-extincteurs' },
    ria: { label: 'RIA', icon: Shield, color: 'bg-cyan-500', route: '/rapports-ria' },
    colonnes_seches: { label: 'Colonnes sèches', icon: Settings, color: 'bg-gray-500', route: '/rapports-colonnes-seches' }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Message bienvenue */}
      {justSubscribed && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 flex items-center gap-4">
          <CheckCircle2 className="w-8 h-8" />
          <div>
            <h3 className="font-bold">🎉 Bienvenue sur Easy Sécurité !</h3>
            <p className="text-sm opacity-90">Votre abonnement est actif. {isFirstMonth && 'Profitez de -10% ce mois-ci !'}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour {userData?.prenom || 'Utilisateur'} 👋</h1>
          <p className="text-gray-500">{orgSettings?.nom || 'Votre entreprise'}</p>
        </div>
        <button
          onClick={() => navigate('/rapports')}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-orange-600"
        >
          <Plus className="w-4 h-4" />
          Nouveau rapport
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Clients</p>
              <p className="text-2xl font-bold">{stats.clients}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Sites</p>
              <p className="text-2xl font-bold">{stats.sites}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Rapports</p>
              <p className="text-2xl font-bold">{stats.rapports}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm">Alertes</p>
              <p className="text-2xl font-bold text-red-700">{stats.alertes}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* MODULES ACTIFS - TRÈS VISIBLE */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Vos modules actifs</h2>
            <p className="text-gray-500 text-sm">{activeDomains.length} domaine(s) selon votre abonnement</p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Gérer les modules →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDomains.map(domain => {
            const config = domainConfig[domain];
            if (!config) return null;

            return (
              <button
                key={domain}
                onClick={() => navigate(config.route)}
                className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left group"
              >
                <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center`}>
                  <config.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{config.label}</p>
                  <p className="text-sm text-gray-500">Créer un rapport</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </button>
            );
          })}
        </div>

        {/* Message si pas de modules */}
        {activeDomains.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun module actif. Souscrivez pour accéder aux rapports.</p>
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <button onClick={() => navigate('/clients')} className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Ajouter un client</p>
                <p className="text-sm text-gray-500">Nouveau client ou import Excel</p>
              </div>
            </button>
            <button onClick={() => navigate('/planning')} className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Planifier une intervention</p>
                <p className="text-sm text-gray-500">Maintenance, SAV, Travaux</p>
              </div>
            </button>
            <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Paramètres</p>
                <p className="text-sm text-gray-500">Configurer votre compte</p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Prochaines échéances</h2>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune échéance à venir</p>
          </div>
        </div>
      </div>

      {/* Onboarding progress */}
      {onboardingProgress && !onboardingProgress.onboarding_complete && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">Finalisez votre configuration</h3>
              <p className="text-sm text-gray-600">{onboardingProgress.progression_pct || 0}% complété</p>
            </div>
            <button onClick={() => setShowOnboarding(true)} className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium">
              Continuer
            </button>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: `${onboardingProgress.progression_pct || 0}%` }} />
          </div>
        </div>
      )}

      {/* Modal Onboarding */}
      {showOnboarding && (
        <OnboardingWizard onComplete={() => { setShowOnboarding(false); checkOnboarding(); }} />
      )}
    </div>
  );
};

export default DashboardPage;
