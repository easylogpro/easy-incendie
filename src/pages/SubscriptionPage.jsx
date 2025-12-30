// src/pages/SubscriptionPage.jsx
// Easy Sécurité - Page de choix d'abonnement et paiement Stripe

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import {
  Flame, Check, Crown, Zap, Building2, Users, Shield,
  CreditCard, Loader2, AlertCircle, Sparkles, ArrowRight,
  BadgePercent, Calendar, Lock
} from 'lucide-react';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { userData, orgId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly ou yearly
  const [selectedModules, setSelectedModules] = useState([]);

  // Vérifier si déjà abonné
  useEffect(() => {
    const checkSubscription = async () => {
      if (orgId) {
        const { data } = await supabase
          .from('abonnements')
          .select('*')
          .eq('organisation_id', orgId)
          .eq('statut', 'active')
          .single();
        
        if (data) {
          navigate('/dashboard');
        }
      }
    };
    checkSubscription();
  }, [orgId, navigate]);

  // Plans disponibles
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Pour démarrer votre activité',
      priceMonthly: 79,
      priceYearly: 758, // -20% = 63€/mois
      firstMonthPrice: 71, // -10%
      techniciens: 1,
      features: [
        'Gestion clients & sites',
        'Rapports SSI, DSF, BAES, Extincteurs',
        'Planning interventions',
        'Devis & Factures',
        'Application mobile',
        '1 utilisateur inclus'
      ],
      popular: false,
      icon: Zap,
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Pour les équipes en croissance',
      priceMonthly: 149,
      priceYearly: 1430, // -20% = 119€/mois
      firstMonthPrice: 134, // -10%
      techniciens: 5,
      features: [
        'Tout Starter +',
        'Jusqu\'à 5 techniciens',
        'Gestion sous-traitants',
        'Registre de sécurité',
        'Alertes automatiques',
        'Export Excel avancé',
        'Support prioritaire'
      ],
      popular: true,
      icon: Crown,
      color: 'red'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Pour les grandes structures',
      priceMonthly: 299,
      priceYearly: 2870, // -20% = 239€/mois
      firstMonthPrice: 269, // -10%
      techniciens: 15,
      features: [
        'Tout Pro +',
        'Jusqu\'à 15 techniciens',
        'Multi-établissements',
        'API personnalisée',
        'Tableaux de bord avancés',
        'Formation personnalisée',
        'Account manager dédié'
      ],
      popular: false,
      icon: Building2,
      color: 'purple'
    }
  ];

  // Modules additionnels
  const modules = [
    {
      id: 'ia',
      name: 'Module IA',
      description: 'Analyse prédictive & suggestions intelligentes',
      price: 29,
      icon: Sparkles
    },
    {
      id: 'veille',
      name: 'Veille réglementaire',
      description: 'Alertes sur les évolutions normatives',
      price: 19,
      icon: Shield
    },
    {
      id: 'export_comptable',
      name: 'Export comptable',
      description: 'Export vers votre logiciel comptable',
      price: 15,
      icon: CreditCard
    }
  ];

  // Calcul du prix
  const calculatePrice = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    let basePrice = billingCycle === 'monthly' ? plan.firstMonthPrice : plan.priceYearly;
    
    const modulesPrice = selectedModules.reduce((acc, modId) => {
      const mod = modules.find(m => m.id === modId);
      return acc + (mod ? mod.price : 0);
    }, 0);

    if (billingCycle === 'monthly') {
      return {
        base: plan.firstMonthPrice,
        regular: plan.priceMonthly,
        modules: modulesPrice,
        total: plan.firstMonthPrice + modulesPrice,
        savings: plan.priceMonthly - plan.firstMonthPrice
      };
    } else {
      return {
        base: plan.priceYearly,
        regular: plan.priceMonthly * 12,
        modules: modulesPrice * 12,
        total: plan.priceYearly + (modulesPrice * 12),
        savings: (plan.priceMonthly * 12) - plan.priceYearly
      };
    }
  };

  const price = calculatePrice();

  // Toggle module
  const toggleModule = (moduleId) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Paiement Stripe
  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Créer l'abonnement dans Supabase (statut pending)
      const { data: subscription, error: subError } = await supabase
        .from('abonnements')
        .insert({
          organisation_id: orgId,
          plan: selectedPlan,
          billing_cycle: billingCycle,
          modules: selectedModules,
          prix_mensuel: plans.find(p => p.id === selectedPlan).priceMonthly,
          prix_premier_mois: plans.find(p => p.id === selectedPlan).firstMonthPrice,
          statut: 'pending'
        })
        .select()
        .single();

      if (subError) throw subError;

      // 2. Créer la session Stripe Checkout
      // NOTE: En production, cela devrait appeler votre backend
      // Pour l'instant, on simule le paiement réussi
      
      // Simulation paiement réussi (à remplacer par vraie intégration Stripe)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Mettre à jour le statut de l'abonnement
      const { error: updateError } = await supabase
        .from('abonnements')
        .update({
          statut: 'active',
          date_debut: new Date().toISOString(),
          date_fin: billingCycle === 'monthly' 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          stripe_payment_id: 'sim_' + Date.now() // Simulé
        })
        .eq('id', subscription.id);

      if (updateError) throw updateError;

      // 4. Mettre à jour la formule de l'organisation
      await supabase
        .from('organisations')
        .update({ 
          formule: selectedPlan,
          modules_actifs: selectedModules
        })
        .eq('id', orgId);

      // 5. TODO: Envoyer email de bienvenue via webhook/fonction

      // 6. Rediriger vers le dashboard
      navigate('/dashboard', { 
        state: { 
          welcomeMessage: true,
          plan: selectedPlan
        } 
      });

    } catch (err) {
      console.error('Erreur paiement:', err);
      setError(err.message || 'Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Logo animé
  const AnimatedLogo = () => (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
          <span className="text-white font-black text-lg">ES</span>
        </div>
        <div className="absolute -top-1 -right-1">
          <Flame className="w-4 h-4 text-orange-500 animate-bounce" style={{ animationDuration: '1s' }} />
        </div>
      </div>
      <div>
        <span className="text-xl font-black text-white">Easy</span>
        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400"> Sécurité</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <AnimatedLogo />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Choisissez votre formule
          </h1>
          <p className="text-gray-400">
            Bienvenue {userData?.prenom} ! Sélectionnez le plan adapté à votre activité.
          </p>
        </div>

        {/* Offre premier mois */}
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-4 mb-8 flex items-center justify-center gap-3">
          <BadgePercent className="w-6 h-6 text-red-400" />
          <p className="text-white font-medium">
            🎉 Offre de lancement : <span className="text-red-400 font-bold">-10% sur le premier mois</span> !
          </p>
        </div>

        {/* Toggle Mensuel/Annuel */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annuel
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            const displayPrice = billingCycle === 'monthly' ? plan.firstMonthPrice : Math.round(plan.priceYearly / 12);
            const regularPrice = plan.priceMonthly;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-gray-800/50 rounded-2xl p-6 cursor-pointer transition-all border-2 ${
                  isSelected 
                    ? 'border-red-500 shadow-lg shadow-red-500/20' 
                    : 'border-gray-700 hover:border-gray-600'
                } ${plan.popular ? 'ring-2 ring-red-500/50' : ''}`}
              >
                {/* Badge Populaire */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                      POPULAIRE
                    </span>
                  </div>
                )}

                {/* Header plan */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.color === 'blue' ? 'bg-blue-500/20' :
                    plan.color === 'red' ? 'bg-red-500/20' :
                    'bg-purple-500/20'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      plan.color === 'blue' ? 'text-blue-400' :
                      plan.color === 'red' ? 'text-red-400' :
                      'text-purple-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-sm text-gray-400">{plan.description}</p>
                  </div>
                </div>

                {/* Prix */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{displayPrice}€</span>
                    <span className="text-gray-400">/mois</span>
                  </div>
                  {billingCycle === 'monthly' && (
                    <p className="text-sm text-gray-500 line-through">
                      {regularPrice}€/mois ensuite
                    </p>
                  )}
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-green-400">
                      Économisez {(regularPrice * 12) - plan.priceYearly}€/an
                    </p>
                  )}
                </div>

                {/* Techniciens */}
                <div className="flex items-center gap-2 mb-4 text-gray-300">
                  <Users className="w-4 h-4" />
                  <span>{plan.techniciens} technicien{plan.techniciens > 1 ? 's' : ''} inclus</span>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Indicateur sélection */}
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'border-red-500 bg-red-500' 
                    : 'border-gray-600'
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modules additionnels */}
        <div className="bg-gray-800/30 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Modules additionnels
            <span className="text-sm font-normal text-gray-400">(optionnel)</span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {modules.map((module) => {
              const Icon = module.icon;
              const isSelected = selectedModules.includes(module.id);
              
              return (
                <div
                  key={module.id}
                  onClick={() => toggleModule(module.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-yellow-500/50 bg-yellow-500/10' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-yellow-400' : 'text-gray-400'}`} />
                      <div>
                        <h4 className="font-medium text-white">{module.name}</h4>
                        <p className="text-xs text-gray-400">{module.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold">+{module.price}€</span>
                      <span className="text-gray-400 text-sm">/mois</span>
                    </div>
                  </div>
                  
                  {/* Checkbox */}
                  <div className={`mt-3 w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected 
                      ? 'border-yellow-500 bg-yellow-500' 
                      : 'border-gray-600'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-black" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Récapitulatif et paiement */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Récap */}
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Récapitulatif</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <span>Plan {plans.find(p => p.id === selectedPlan)?.name}</span>
                  {billingCycle === 'monthly' && (
                    <span className="text-red-400">(-10% 1er mois)</span>
                  )}
                </div>
                {selectedModules.length > 0 && (
                  <div className="text-gray-400">
                    + {selectedModules.length} module(s) : {modules.filter(m => selectedModules.includes(m.id)).map(m => m.name).join(', ')}
                  </div>
                )}
                <div className="text-gray-400">
                  Facturation {billingCycle === 'monthly' ? 'mensuelle' : 'annuelle'}
                </div>
              </div>
            </div>

            {/* Prix total */}
            <div className="text-right">
              {price.savings > 0 && (
                <p className="text-sm text-green-400 mb-1">
                  Vous économisez {price.savings}€
                </p>
              )}
              <div className="flex items-baseline gap-2 justify-end">
                <span className="text-3xl font-black text-white">{price.total}€</span>
                <span className="text-gray-400">
                  {billingCycle === 'monthly' ? 'ce mois' : '/an'}
                </span>
              </div>
              {billingCycle === 'monthly' && (
                <p className="text-sm text-gray-500">
                  puis {plans.find(p => p.id === selectedPlan)?.priceMonthly + price.modules}€/mois
                </p>
              )}
            </div>

            {/* Bouton paiement */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Payer {price.total}€
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Garanties */}
          <div className="mt-6 pt-6 border-t border-gray-700 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Paiement sécurisé Stripe
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Satisfait ou remboursé 30 jours
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sans engagement, résiliable à tout moment
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          En continuant, vous acceptez nos{' '}
          <a href="#" className="text-gray-400 hover:text-white">CGV</a>
          {' '}et notre{' '}
          <a href="#" className="text-gray-400 hover:text-white">Politique de confidentialité</a>
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPage;
