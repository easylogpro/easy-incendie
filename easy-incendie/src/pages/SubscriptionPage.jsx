// src/pages/SubscriptionPage.jsx
// Easy Sécurité - Page de souscription et paiement

import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDemo } from '../contexts/DemoContext';
import { supabase } from '../config/supabase';
import { calculatePrice, getAvailableReports, getDomainLabels } from '../utils/pricingAlgorithm';
import { 
  CreditCard, CheckCircle2, Shield, Zap, Lock, 
  ArrowLeft, Loader2, FileText, Users, Building2
} from 'lucide-react';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orgId, refreshSubscription, userData } = useAuth();
  const { endDemo, demoRequest } = useDemo();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Récupérer les données de la demande
  const request = location.state?.request || demoRequest || {};
  const fromDemo = location.state?.fromDemo || false;

  // Calculer le prix
  const pricing = useMemo(() => {
    return calculatePrice(
      request.domaines || request.modulesInteresses || request.domaines_demandes || ['ssi'],
      request.nb_utilisateurs || request.nombreTechniciens || '1',
      selectedAddons
    );
  }, [request, selectedAddons]);

  // Rapports disponibles
  const availableReports = useMemo(() => {
    return getAvailableReports(
      request.profil || request.typeActivite || request.profil_demande || 'mainteneur',
      request.domaines || request.modulesInteresses || request.domaines_demandes || ['ssi']
    );
  }, [request]);

  // Options additionnelles
  const addons = [
    { id: 'ia', name: 'Module IA', description: 'Génération automatique de contenu', price: 9 },
    { id: 'export_compta', name: 'Export comptable', description: 'Export vers votre logiciel', price: 5 },
    { id: 'veille_reglementaire', name: 'Veille réglementaire', description: 'Alertes normes', price: 5 }
  ];

  const toggleAddon = (id) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  // Soumettre le paiement
  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Créer l'abonnement dans Supabase
      const { data: subscription, error: subError } = await supabase
        .from('abonnements')
        .insert({
          organisation_id: orgId,
          formule: 'custom',
          nb_utilisateurs_max: parseInt(request.nb_utilisateurs || request.nombreTechniciens || '1') || 1,
          domaines_actifs: request.domaines || request.modulesInteresses || request.domaines_demandes || ['ssi'],
          options_actives: selectedAddons,
          prix_base: pricing.basePrice,
          prix_options: pricing.addonsTotal,
          prix_total: pricing.totalPrice,
          statut: 'active',
          date_debut: new Date().toISOString(),
          premier_mois_remise: true,
          remise_appliquee: pricing.discount
        })
        .select()
        .single();

      if (subError) throw subError;

      // Marquer le prospect comme converti
      if (orgId) {
        await supabase
          .from('demandes_prospects')
          .update({ converti: true, converti_at: new Date().toISOString() })
          .eq('organisation_id', orgId);
      }

      // Mettre à jour les modules actifs de l'organisation
      await supabase
        .from('organisations')
        .update({ 
          modules_actifs: request.domaines || request.modulesInteresses || request.domaines_demandes || ['ssi'],
          formule: 'custom'
        })
        .eq('id', orgId);

      // Terminer la démo si on vient de là
      if (fromDemo) {
        await endDemo(true);
      }

      // Rafraîchir et rediriger
      await refreshSubscription();
      navigate('/dashboard', { state: { subscriptionSuccess: true, firstMonth: true } });

    } catch (err) {
      console.error('Erreur souscription:', err);
      setError(err.message || 'Erreur lors de la souscription');
    } finally {
      setLoading(false);
    }
  };

  const domainLabels = getDomainLabels();
  const domains = request.domaines || request.modulesInteresses || request.domaines_demandes || ['ssi'];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <h1 className="text-3xl font-black text-gray-900">Finaliser votre abonnement</h1>
          <p className="text-gray-500 mt-1">Profitez de -10% sur votre premier mois</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Récapitulatif */}
          <div className="lg:col-span-2 space-y-6">
            {/* Domaines inclus */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                Domaines inclus
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {domains.map(domain => (
                  <div key={domain} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{domainLabels[domain] || domain.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rapports disponibles */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Rapports inclus
              </h2>
              <div className="space-y-3">
                {Object.entries(availableReports).map(([domain, data]) => (
                  <div key={domain}>
                    <p className="text-sm font-medium text-gray-500 mb-2">{data.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {data.reports.map(report => (
                        <span key={report} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {report}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Options additionnelles */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Options additionnelles
              </h2>
              <div className="space-y-3">
                {addons.map(addon => (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      selectedAddons.includes(addon.id) 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{addon.name}</p>
                      <p className="text-sm text-gray-500">{addon.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-red-500">+{addon.price}€/mois</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAddons.includes(addon.id) ? 'border-red-500 bg-red-500' : 'border-gray-300'
                      }`}>
                        {selectedAddons.includes(addon.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite - Prix et paiement */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
              <h2 className="font-bold text-gray-900 mb-4">Récapitulatif</h2>
              
              <div className="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Abonnement ({domains.length} domaines)</span>
                  <span>{pricing.basePrice}€</span>
                </div>
                {selectedAddons.map(addonId => {
                  const addon = addons.find(a => a.id === addonId);
                  return (
                    <div key={addonId} className="flex justify-between">
                      <span className="text-gray-600">{addon?.name}</span>
                      <span>+{addon?.price}€</span>
                    </div>
                  );
                })}
                <div className="flex justify-between font-medium">
                  <span>Sous-total</span>
                  <span>{pricing.totalPrice}€/mois</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Remise 1er mois (-10%)</span>
                  <span>-{pricing.discount}€</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg">Premier mois</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                  {pricing.finalPrice}€
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-4">Puis {pricing.totalPrice}€/mois</p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-xl font-bold hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Payer {pricing.finalPrice}€
                  </>
                )}
              </button>

              {/* Garanties */}
              <div className="mt-6 space-y-2">
                {['Sans engagement', 'Résiliation à tout moment', 'Support inclus', 'Paiement sécurisé'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Lock className="w-3 h-3" />
                <span>Paiement sécurisé SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
