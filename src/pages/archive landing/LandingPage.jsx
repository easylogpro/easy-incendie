import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Flame, FileText, BarChart3, Users, Building2, 
  CheckCircle2, ArrowRight, Star, ChevronDown, ChevronUp,
  Zap, Clock, Cloud, Lock, Phone, Mail, MapPin,
  AlertTriangle, Gauge, ClipboardCheck, Settings
} from 'lucide-react';

// ============================================================
// LANDING PAGE - EASY SÉCURITÉ (Incendie)
// ============================================================

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    typeActivite: '',
    nombreTechniciens: '',
    nombreSites: '',
    logicielActuel: '',
    modulesInteresses: []
  });
  const [openFaq, setOpenFaq] = useState(null);
  const [isVisible, setIsVisible] = useState({});

  // Animation d'apparition au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Logo animé avec flamme
  const AnimatedLogo = () => (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
          <span className="text-white font-black text-xl">E</span>
          <span className="text-white font-black text-xl animate-pulse">S</span>
        </div>
        {/* Flamme animée */}
        <div className="absolute -top-2 -right-2">
          <Flame className="w-6 h-6 text-orange-500 animate-bounce" style={{ animationDuration: '1s' }} />
        </div>
      </div>
      <div>
        <span className="text-2xl font-black text-white">Easy</span>
        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400"> Sécurité</span>
      </div>
    </div>
  );

  // Flamme décorative animée
  const AnimatedFlame = ({ className = "" }) => (
    <div className={`relative ${className}`}>
      <Flame 
        className="w-8 h-8 text-orange-500 animate-pulse" 
        style={{ 
          filter: 'drop-shadow(0 0 10px rgba(249, 115, 22, 0.5))',
          animation: 'flicker 1.5s infinite alternate'
        }} 
      />
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1) rotate(-5deg); }
          50% { opacity: 0.8; transform: scale(1.1) rotate(5deg); }
        }
      `}</style>
    </div>
  );

  // Questions du formulaire
  const questions = [
    {
      id: 'typeActivite',
      question: 'Quelle est votre activité principale ?',
      options: [
        { value: 'installateur_mainteneur', label: 'Installateur / Mainteneur', icon: Settings },
        { value: 'mainteneur', label: 'Mainteneur', icon: ClipboardCheck },
        { value: 'installateur', label: 'Installateur', icon: Zap },
        { value: 'sous_traitant', label: 'Sous-traitant', icon: Users },
        { value: 'artisan', label: 'Artisan', icon: Building2 }
      ]
    },
    {
      id: 'nombreTechniciens',
      question: 'Combien de techniciens avez-vous ?',
      options: [
        { value: '1', label: '1 technicien', icon: Users },
        { value: '2-5', label: '2 à 5 techniciens', icon: Users },
        { value: '6-10', label: '6 à 10 techniciens', icon: Users },
        { value: '11-20', label: '11 à 20 techniciens', icon: Users },
        { value: '20+', label: 'Plus de 20 techniciens', icon: Users }
      ]
    },
    {
      id: 'nombreSites',
      question: 'Combien de sites gérez-vous ?',
      options: [
        { value: '1-50', label: '1 à 50 sites', icon: Building2 },
        { value: '51-100', label: '51 à 100 sites', icon: Building2 },
        { value: '101-500', label: '101 à 500 sites', icon: Building2 },
        { value: '500+', label: 'Plus de 500 sites', icon: Building2 }
      ]
    },
    {
      id: 'logicielActuel',
      question: 'Utilisez-vous déjà un logiciel de gestion ?',
      options: [
        { value: 'aucun', label: 'Non, papier / Excel', icon: FileText },
        { value: 'autre', label: 'Oui, un autre logiciel', icon: Settings },
        { value: 'crm', label: 'CRM généraliste', icon: BarChart3 }
      ]
    },
    {
      id: 'modulesInteresses',
      question: 'Quels domaines vous intéressent ?',
      multiple: true,
      options: [
        { value: 'ssi', label: 'SSI (Système Sécurité Incendie)', icon: Shield },
        { value: 'dsf', label: 'DSF Naturel / Mécanique', icon: Gauge },
        { value: 'compartimentage', label: 'Compartimentage', icon: Building2 },
        { value: 'baes', label: 'BAES / Éclairage sécurité', icon: Zap },
        { value: 'extincteurs', label: 'Extincteurs', icon: AlertTriangle },
        { value: 'colonnes_seches', label: 'Colonnes sèches', icon: Settings },
        { value: 'ria', label: 'RIA', icon: Shield }
      ]
    }
  ];

  // Gestion des réponses
  const handleAnswer = (value) => {
    const currentQuestion = questions[currentStep];
    
    if (currentQuestion.multiple) {
      const currentValues = formData[currentQuestion.id] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      setFormData({ ...formData, [currentQuestion.id]: newValues });
    } else {
      setFormData({ ...formData, [currentQuestion.id]: value });
      if (currentStep < questions.length - 1) {
        setTimeout(() => setCurrentStep(currentStep + 1), 300);
      }
    }
  };

  // Fonctionnalités principales
  const features = [
    {
      icon: FileText,
      title: 'Rapports Spécialisés',
      description: 'SSI, DSF, BAES, Extincteurs... Rapports conformes aux normes en quelques clics',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: BarChart3,
      title: 'Tableau de Bord',
      description: 'Statistiques en temps réel, suivi des interventions et conformité instantanée',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: Users,
      title: 'Gestion Techniciens',
      description: 'Planning, qualifications, géolocalisation et suivi des interventions terrain',
      color: 'from-yellow-500 to-red-500'
    },
    {
      icon: Building2,
      title: 'Gestion Sites & Clients',
      description: 'Base complète ERP, IGH, habitations avec historique et équipements',
      color: 'from-red-600 to-red-400'
    },
    {
      icon: ClipboardCheck,
      title: 'Checklists Normatives',
      description: 'Vérifications APSAD, NF S61-933, NF S62-200... toujours à jour',
      color: 'from-orange-600 to-orange-400'
    },
    {
      icon: Cloud,
      title: '100% Cloud',
      description: 'Accessible partout, synchronisation temps réel, sauvegarde automatique',
      color: 'from-red-500 to-yellow-500'
    }
  ];

  // Plans tarifaires
  const plans = [
    {
      name: 'Starter',
      price: '79',
      period: '/mois',
      techniciens: '1 technicien inclus',
      extra: '+10€/tech supplémentaire',
      features: [
        'Gestion clients & sites',
        'Planning interventions',
        'Rapports SSI & Extincteurs',
        'Application mobile',
        'Support email'
      ],
      popular: false,
      cta: 'Commencer'
    },
    {
      name: 'Pro',
      price: '149',
      period: '/mois',
      techniciens: '5 techniciens inclus',
      extra: '+10€/tech supplémentaire',
      features: [
        'Tout Starter +',
        'Rapports DSF & BAES',
        'Devis & Facturation',
        'Portail client',
        'Checklists personnalisées',
        'Support prioritaire'
      ],
      popular: true,
      cta: 'Essai gratuit 14 jours'
    },
    {
      name: 'Premium',
      price: '299',
      period: '/mois',
      techniciens: '15 techniciens inclus',
      extra: '+10€/tech supplémentaire',
      features: [
        'Tout Pro +',
        'Tous les modules inclus',
        'API & Intégrations',
        'Multi-établissements',
        'Formation dédiée',
        'Support téléphonique 24/7'
      ],
      popular: false,
      cta: 'Contacter les ventes'
    }
  ];

  // FAQ
  const faqs = [
    {
      question: "Quels types de rapports puis-je générer ?",
      answer: "Easy Sécurité génère tous les rapports réglementaires : vérifications SSI (ECS, CMSI), DSF naturel et mécanique, BAES, extincteurs, RIA, colonnes sèches, portes coupe-feu. Tous conformes aux normes APSAD et NF en vigueur."
    },
    {
      question: "L'application fonctionne-t-elle hors connexion ?",
      answer: "Oui ! L'application mobile fonctionne en mode hors ligne. Toutes les données sont synchronisées automatiquement dès que la connexion est rétablie."
    },
    {
      question: "Puis-je importer mes données existantes ?",
      answer: "Absolument. Nous proposons un import Excel/CSV de vos clients, sites et équipements. Notre équipe peut également vous accompagner dans la migration de vos données."
    },
    {
      question: "Comment fonctionne le système de QR codes ?",
      answer: "Chaque équipement peut avoir un QR code unique. En le scannant, vos clients accèdent à l'historique des interventions et peuvent signaler un problème directement."
    },
    {
      question: "Y a-t-il un engagement de durée ?",
      answer: "Non, tous nos abonnements sont sans engagement. Vous pouvez résilier à tout moment. Nous proposons également une remise de 20% pour un paiement annuel."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-red-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <AnimatedLogo />
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-red-400 transition-colors">Fonctionnalités</a>
              <a href="#pricing" className="text-gray-300 hover:text-red-400 transition-colors">Tarifs</a>
              <a href="#faq" className="text-gray-300 hover:text-red-400 transition-colors">FAQ</a>
            </nav>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Connexion
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
              >
                Essai gratuit
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-orange-900/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2 mb-8">
              <Flame className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-red-300 text-sm font-medium">Nouveau : Module DSF Mécanique disponible</span>
            </div>

            {/* Titre principal */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-white">La plateforme</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">
                tout-en-un
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Pour les professionnels de la <span className="text-red-400 font-semibold">sécurité incendie</span>
            </p>

            {/* Sous-titre */}
            <p className="text-gray-400 mb-12 max-w-xl mx-auto">
              SSI, DSF, BAES, Extincteurs, RIA, Colonnes sèches... 
              Gérez toutes vos interventions et rapports depuis une seule plateforme.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('questionnaire').scrollIntoView({ behavior: 'smooth' })}
                className="group bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 flex items-center justify-center gap-2"
              >
                Démarrer l'essai gratuit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/5 hover:bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                Découvrir les fonctionnalités
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>14 jours d'essai gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Support français</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Tout ce dont vous avez <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">besoin</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Une solution complète pour gérer votre activité de sécurité incendie
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-red-500/50 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-red-500/10"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Questionnaire Section */}
      <section id="questionnaire" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              Trouvez la formule <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">adaptée</span>
            </h2>
            <p className="text-gray-400">Répondez à quelques questions pour une recommandation personnalisée</p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Question {currentStep + 1} sur {questions.length}</span>
              <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <AnimatedFlame />
              {questions[currentStep].question}
            </h3>

            <div className="grid gap-4">
              {questions[currentStep].options.map((option) => {
                const isSelected = questions[currentStep].multiple
                  ? (formData[questions[currentStep].id] || []).includes(option.value)
                  : formData[questions[currentStep].id] === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-red-500 bg-red-500/10 text-white'
                        : 'border-gray-700 hover:border-red-500/50 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-red-500' : 'bg-gray-700'
                    }`}>
                      <option.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">{option.label}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-red-400 ml-auto" />}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Précédent
              </button>
              
              {currentStep === questions.length - 1 ? (
                <button
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/25 flex items-center gap-2"
                >
                  Voir mon offre personnalisée
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!formData[questions[currentStep].id] || (Array.isArray(formData[questions[currentStep].id]) && formData[questions[currentStep].id].length === 0)}
                  className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  Suivant <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Tarifs <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">transparents</span>
            </h2>
            <p className="text-gray-400 text-lg">Sans surprise, sans engagement</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-8 border ${
                  plan.popular 
                    ? 'border-red-500 shadow-2xl shadow-red-500/20' 
                    : 'border-gray-700/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                      Le plus populaire
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.techniciens}</p>
                
                <div className="mb-2">
                  <span className="text-5xl font-black text-white">{plan.price}€</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-sm text-red-400 mb-6">{plan.extra}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => navigate('/register')}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg shadow-red-500/25'
                      : 'bg-white/5 hover:bg-white/10 border border-white/20 text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              Questions <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">fréquentes</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-red-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-gray-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 border border-red-500/30 rounded-3xl p-12">
            <Flame className="w-16 h-16 text-orange-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl font-black mb-4">
              Prêt à simplifier votre gestion ?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Rejoignez les professionnels qui font confiance à Easy Sécurité
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-2xl shadow-red-500/30 hover:shadow-red-500/50"
            >
              Démarrer mon essai gratuit
            </button>
            <p className="text-gray-400 mt-4 text-sm">14 jours gratuits • Sans carte bancaire • Sans engagement</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <AnimatedLogo />
              <p className="text-gray-400 mt-4 text-sm">
                La solution de gestion pour les professionnels de la sécurité incendie.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-red-400 transition-colors">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-red-400 transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Application mobile</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Ressources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Blog</a></li>
                <li><a href="#faq" className="hover:text-red-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  contact@easy-securite.fr
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  01 23 45 67 89
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Paris, France
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 Easy Sécurité. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-gray-500 text-sm">
              <a href="#" className="hover:text-red-400 transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-red-400 transition-colors">CGV</a>
              <a href="#" className="hover:text-red-400 transition-colors">Confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
