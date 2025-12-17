// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, Shield, Thermometer, Wind, Home, Zap,
  ChevronDown, ChevronUp, MessageCircle, Bug, 
  Mail, Lock, Eye, EyeOff, Send, X,
  Play, CreditCard, CheckCircle, AlertCircle, Trash2,
  Download, Upload, Link2, UserCheck, ArrowRight,
  Globe, ShieldCheck, Headphones, TrendingUp,
  Calendar, Wrench, FileText, Users, Bell, Smartphone,
  Award, Star, Monitor, ClipboardCheck, HelpCircle, MousePointer2, Building2, BookOpen
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [selectedPacks, setSelectedPacks] = useState([]);
  const [showPacks, setShowPacks] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [showFaqChat, setShowFaqChat] = useState(false);
  const [faqMessages, setFaqMessages] = useState([{ id: 1, type: 'system', text: 'Bienvenue ! Posez votre question.', time: new Date() }]);
  const [faqInput, setFaqInput] = useState('');
  const [showBugChat, setShowBugChat] = useState(false);
  const [bugMessages, setBugMessages] = useState([{ id: 1, type: 'system', text: 'Décrivez le bug rencontré.', time: new Date() }]);
  const [bugInput, setBugInput] = useState('');
  const [showDemoRequest, setShowDemoRequest] = useState(false);
  const [demoEmail, setDemoEmail] = useState('');
  const [demoSent, setDemoSent] = useState(false);
  const [demoPacks, setDemoPacks] = useState([]);
  const [showSubscribeTuto, setShowSubscribeTuto] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ company: '', email: '', phone: '', siret: '', address: '', password: '', confirmPassword: '' });
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [guideSection, setGuideSection] = useState(null);

  const packs = [
    { id: 'ssi', name: 'SSI', icon: Shield, gradient: 'from-red-500 to-rose-600' },
    { id: 'protection', name: 'Protection Incendie', icon: Flame, gradient: 'from-orange-500 to-amber-600' },
    { id: 'chauffage', name: 'Chauffage', icon: Thermometer, gradient: 'from-amber-500 to-yellow-500' },
    { id: 'clim', name: 'Climatisation', icon: Wind, gradient: 'from-cyan-500 to-blue-500' },
    { id: 'renovation', name: 'Rénovation Énergétique', icon: Home, gradient: 'from-emerald-500 to-green-600' },
    { id: 'energie', name: 'Énergie', icon: Zap, gradient: 'from-violet-500 to-purple-600' }
  ];

  const formulas = [
    { id: 1, name: 'Starter', price: 29, packs: 1, desc: '1 Pack au choix' },
    { id: 2, name: 'Pro', price: 39, packs: 2, desc: '2 Packs au choix', popular: true },
    { id: 3, name: 'ALL', price: 49, packs: 6, desc: '4 Packs au choix' }
  ];

  const features = [
    { icon: Calendar, title: 'Planning intelligent', desc: 'Planifiez facilement', color: 'bg-blue-500' },
    { icon: Wrench, title: 'Suivi interventions', desc: 'SAV, travaux, maintenance', color: 'bg-purple-500' },
    { icon: FileText, title: 'Devis & Factures', desc: 'Génération automatique', color: 'bg-blue-600' },
    { icon: Users, title: 'Gestion équipes', desc: 'Techniciens & STT', color: 'bg-orange-500' },
    { icon: Bell, title: 'Alertes auto', desc: 'Relances, échéances', color: 'bg-red-500' },
    { icon: Smartphone, title: '1 App Terrain', desc: '+ 1 logiciel interne', color: 'bg-blue-500', secondIcon: Monitor },
  ];

  const advantages = [
    { icon: Upload, title: 'Import facilité', desc: 'Fichiers Excel fournis pour importer clients, techniciens, STT', color: 'bg-emerald-500' },
    { icon: Download, title: 'Export complet', desc: 'Toutes vos données exportables (RGPD) + export comptable', color: 'bg-rose-500' },
    { icon: Link2, title: 'Interconnexion', desc: 'Donneurs d\'ordre et sous-traitants connectés en temps réel', color: 'bg-cyan-500' },
    { icon: UserCheck, title: 'Espace client', desc: 'Vos clients accèdent à leurs devis, factures et rapports', color: 'bg-orange-500' },
    { icon: ClipboardCheck, title: 'Rapports spécialisés', desc: 'Rapports d\'intervention par métier conçus par des pros', color: 'bg-violet-500' },
  ];

  const faqs = [
    { q: "Comment importer mes données ?", a: "Nous fournissons des fichiers Excel modèles prêts à remplir. L'import est guidé étape par étape avec vérification automatique des données." },
    { q: "Puis-je exporter mes données ?", a: "Oui, toutes vos données sont exportables à tout moment conformément au RGPD. Un export comptable automatique est également disponible." },
    { q: "Interconnexion sous-traitant ?", a: "Les sous-traitants disposent de leur propre accès sécurisé pour consulter uniquement leurs interventions. Les donneurs d'ordre ont également un accès dédié." },
    { q: "Espace client ?", a: "Oui, vos clients peuvent accéder à un espace dédié pour consulter leurs devis, factures et rapports d'intervention en temps réel." },
    { q: "Hors ligne ?", a: "L'application terrain fonctionne même sans connexion internet. La synchronisation se fait automatiquement dès le retour du réseau." },
    { q: "Support ?", a: "Support par chat et email inclus dans toutes les formules. Support téléphonique prioritaire disponible pour la formule Enterprise." },
  ];

  const subscribeSteps = [
    { step: 1, title: 'Choisissez votre formule', desc: 'Starter, Pro ou ALL', icon: CreditCard },
    { step: 2, title: 'Sélectionnez vos packs', desc: 'Modules métiers', icon: CheckCircle },
    { step: 3, title: 'Créez votre compte', desc: 'Infos entreprise', icon: Mail },
    { step: 4, title: 'Paiement sécurisé', desc: 'Via Stripe', icon: ShieldCheck },
    { step: 5, title: 'Accès immédiat', desc: 'Identifiants reçus', icon: Play },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try { await login(email, password); navigate('/dashboard'); } 
    catch (error) { setLoginError(error.message || 'Identifiants incorrects'); } 
    finally { setLoginLoading(false); }
  };

  const handleFormulaSelect = (f) => {
    if (selectedFormula?.id === f.id) {
      setShowPacks(!showPacks);
    } else {
      setSelectedFormula(f);
      setSelectedPacks(f.packs === 6 ? packs.map(p => p.id) : []);
      setShowPacks(true);
    }
  };

  const handlePackSelect = (packId) => {
    if (!selectedFormula) return;
    if (selectedFormula.packs === 6) { setSelectedPacks(packs.map(p => p.id)); return; }
    if (selectedPacks.includes(packId)) setSelectedPacks(selectedPacks.filter(id => id !== packId));
    else if (selectedPacks.length < selectedFormula.packs) setSelectedPacks([...selectedPacks, packId]);
  };

  const canPay = selectedFormula && (selectedFormula.packs === 6 || selectedPacks.length === selectedFormula.packs);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      
      {/* ==================== HEADER ==================== */}
      <header className="relative py-6 px-4 text-center flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-80 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-80 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Pastille "Sans engagement" en haut à droite en diagonale */}
        <div className="absolute top-4 right-6 z-20">
          <div className="relative transform rotate-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur opacity-70 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-xl border-2 border-white/30">
              <p className="text-xs">✓ Sans engagement</p>
              <p className="text-xs">✓ Résiliation gratuite</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          {/* Logo E + EasyLog */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-lg opacity-60"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                <span className="text-3xl font-black text-white">E</span>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-6xl font-black text-white tracking-tight">
                Easy<span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">Log</span>
              </h1>
            </div>
          </div>
          {/* La gestion Easy */}
          <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text mb-3">
            La gestion Easy
          </h2>
          {/* Phrase AGRANDIE + icône clic animée */}
          <div className="flex items-center justify-center gap-3">
            <p className="text-blue-100 text-2xl font-semibold">Simplifiez la gestion de vos activités en 1 clic</p>
            <div className="relative">
              <MousePointer2 className="w-8 h-8 text-cyan-400 animate-bounce" />
              <div className="absolute -inset-2 bg-cyan-400/40 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
      </header>

      {/* ==================== 3 COLONNES ==================== */}
      <div className="flex-1 flex flex-row min-h-0">
        
        {/* ========== COLONNE GAUCHE ========== */}
        <div className="w-[28%] flex flex-col p-4 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-blue-900/90 to-indigo-900/90"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* 6 Fonctionnalités EN HAUT - AGRANDIES + ANIMATION */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-all cursor-pointer group flex flex-col items-center text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className={`w-14 h-14 ${f.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform animate-pulse`}>
                      <f.icon className="w-7 h-7 text-white" />
                    </div>
                    {f.secondIcon && (
                      <div className="w-14 h-14 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                        <f.secondIcon className="w-7 h-7 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-lg">{f.title}</h3>
                  <p className="text-blue-200 text-base">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Pourquoi EasyLog EN BAS - POLICES ET ICÔNES AGRANDIES */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 mt-4">
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg animate-pulse">
                  <Award className="w-7 h-7 text-white" />
                </div>
                Pourquoi EasyLog ?
              </h3>
              <div className="space-y-2">
                {advantages.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className={`w-12 h-12 ${a.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <a.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{a.title}</h4>
                      <p className="text-blue-200 text-base">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========== COLONNE CENTRE ========== */}
        <div className="w-[44%] flex flex-col p-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Formules + Comment s'abonner COLLÉS - AGRANDI 40% */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-indigo-100">
              <h3 className="text-2xl font-bold text-slate-800 mb-5 flex items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                Nos formules
              </h3>
              <div className="grid grid-cols-3 gap-5 mb-4">
                {formulas.map(f => (
                  <button key={f.id} onClick={() => handleFormulaSelect(f)}
                    className={`relative p-5 rounded-xl border-2 text-center transition-all hover:scale-105 ${
                      selectedFormula?.id === f.id ? 'border-indigo-500 bg-indigo-50 shadow-lg' : 'border-slate-200 bg-white hover:border-indigo-300'
                    }`}>
                    {f.popular && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-[10px] font-bold text-white rounded-full">POPULAIRE</span>}
                    <p className="font-bold text-slate-800 text-lg">{f.name}</p>
                    <p className="text-4xl font-black text-slate-800">{f.price}€<span className="text-base font-normal text-slate-500">/mois</span></p>
                    <p className="text-sm text-slate-500">{f.desc}</p>
                  </button>
                ))}
              </div>
              {selectedFormula && showPacks && (
                <>
                  <button onClick={() => setShowPacks(false)} className="w-full flex items-center justify-center gap-1 py-2 text-sm text-indigo-600 hover:text-indigo-800 mb-2">
                    <ChevronUp className="w-5 h-5" /> Fermer les packs
                  </button>
                  <div className="grid grid-cols-6 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    {packs.map(p => {
                      const sel = selectedPacks.includes(p.id);
                      const dis = selectedFormula.packs !== 6 && !sel && selectedPacks.length >= selectedFormula.packs;
                      return (
                        <button key={p.id} onClick={() => handlePackSelect(p.id)} disabled={dis}
                          className={`p-3 rounded-lg border-2 text-center transition-all hover:scale-105 ${
                            sel ? 'border-emerald-500 bg-emerald-50' : dis ? 'opacity-30' : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}>
                          <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow mb-1`}>
                            <p.icon className="w-5 h-5 text-white" />
                          </div>
                          <p className="text-[10px] font-medium text-slate-700 truncate">{p.name}</p>
                        </button>
                      );
                    })}
                  </div>
                  <button disabled={!canPay} className={`w-full mt-4 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    canPay ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}>
                    <CreditCard className="w-6 h-6" /> Souscrire {selectedFormula.price}€/mois
                  </button>
                </>
              )}
              {/* Comment s'abonner COLLÉ */}
              <button onClick={() => setShowSubscribeTuto(true)} className="w-full mt-5 py-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                <HelpCircle className="w-6 h-6" /> Comment s'abonner ?
              </button>
            </div>

            {/* Connexion SÉPARÉ */}
            <div className="bg-white rounded-2xl p-5 shadow-xl border border-indigo-100 mt-4">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                Connexion
              </h3>
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email professionnel" 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-base focus:border-indigo-500 focus:outline-none" required />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" 
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-base focus:border-indigo-500 focus:outline-none" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {loginError && <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"><AlertCircle className="w-5 h-5" />{loginError}</div>}
                <button type="submit" disabled={loginLoading} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2">
                  {loginLoading ? 'Connexion...' : <>Se connecter <ArrowRight className="w-5 h-5" /></>}
                </button>
                {/* Créer un compte AGRANDI + couleur visible + entourage dynamique */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur opacity-50 animate-pulse"></div>
                  <button type="button" onClick={() => setShowCreateAccount(true)} className="relative w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-xl hover:shadow-xl flex items-center justify-center gap-2">
                    <UserCheck className="w-5 h-5" /> Créer un compte
                  </button>
                </div>
                <button type="button" onClick={() => setShowForgotPassword(true)} className="w-full text-center text-indigo-600 text-sm">Mot de passe oublié ?</button>
              </form>
              
              {/* Guide utilisateur COLLÉ - même style que Comment s'abonner */}
              <button onClick={() => setShowUserGuide(true)} className="w-full mt-4 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                <BookOpen className="w-6 h-6" /> Guide utilisateur
              </button>
            </div>

            {/* Essai gratuit SÉPARÉ avec espace */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 mt-4 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Play className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Essai gratuit 48h</h3>
                  <p className="text-emerald-100 text-xs">Sans engagement, sans carte bancaire</p>
                </div>
              </div>
              <button onClick={() => setShowDemoRequest(true)} className="w-full py-3 bg-white text-emerald-600 font-bold text-base rounded-xl hover:shadow-xl flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Demander un accès démo
              </button>
            </div>

            {/* Boutons Support + Footer */}
            <div className="flex gap-4">
              <button onClick={() => setShowFaqChat(true)} className="flex-1 py-3 bg-white rounded-xl font-semibold text-base text-slate-700 flex items-center justify-center gap-2 shadow-lg border border-slate-100 hover:bg-indigo-50">
                <MessageCircle className="w-5 h-5" /> Poser une question
              </button>
              <button onClick={() => setShowBugChat(true)} className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl font-semibold text-base text-white flex items-center justify-center gap-2 shadow-lg">
                <Bug className="w-5 h-5" /> Signaler un bug
              </button>
            </div>
            <div className="text-center text-slate-400 text-sm mt-4">
              © 2025 EasyLog · <a href="#" className="hover:text-indigo-600">Mentions légales</a> · <a href="#" className="hover:text-indigo-600">CGV</a> · <a href="#" className="hover:text-indigo-600">RGPD</a>
            </div>
          </div>
        </div>

        {/* ========== COLONNE DROITE ========== */}
        <div className="w-[28%] flex flex-col p-4 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-blue-900/90 to-indigo-900/90"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* 4 Stats EN HAUT - AGRANDIES + ANIMATION */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: Globe, val: '100%', label: 'Cloud', gradient: 'from-blue-500 to-indigo-600' },
                { icon: ShieldCheck, val: 'RGPD', label: 'Conforme', gradient: 'from-emerald-500 to-green-600' },
                { icon: Headphones, val: '24/7', label: 'Support', gradient: 'from-violet-500 to-purple-600' },
                { icon: TrendingUp, val: '99.9%', label: 'Uptime', gradient: 'from-amber-500 to-orange-600' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10 hover:bg-white/20 transition-all cursor-pointer group">
                  <div className={`w-14 h-14 mx-auto mb-2 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform animate-pulse`}>
                    <s.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="font-bold text-white text-xl">{s.val}</p>
                  <p className="text-base text-blue-200">{s.label}</p>
                </div>
              ))}
            </div>

            {/* FAQ AU MILIEU */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 my-4 flex-1">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                Questions fréquentes
              </h3>
              <div className="space-y-2">
                {faqs.map((f, i) => (
                  <div key={i} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-3 text-left">
                      <span className="font-medium text-base">{f.q}</span>
                      <ChevronDown className={`w-5 h-5 text-blue-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === i && <div className="px-3 pb-3 text-blue-200 text-sm">{f.a}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Avis EN BAS */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">MC</div>
                <div>
                  <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}</div>
                  <p className="text-blue-100 text-base italic leading-relaxed mb-2">"EasyLog a transformé notre gestion quotidienne. Tout est centralisé et accessible partout."</p>
                  <p className="font-bold text-white text-lg">Marc Civelli</p>
                  <p className="text-sm text-blue-300">Gérant - Civelli Énergies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MODALES ==================== */}
      
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Réinitialiser le mot de passe</h3>
              <button onClick={() => {setShowForgotPassword(false);setResetSent(false);}} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            {resetSent ? (
              <div className="text-center py-6">
                <CheckCircle className="w-14 h-14 mx-auto mb-3 text-emerald-500" />
                <p className="font-bold text-slate-800 text-lg">Email envoyé !</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setResetSent(true); }} className="space-y-4">
                <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="votre@email.com" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none" required />
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl">Envoyer le lien</button>
              </form>
            )}
          </div>
        </div>
      )}

      {showDemoRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Demander une démo</h3>
              <button onClick={() => { setShowDemoRequest(false); setDemoSent(false); }} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            {demoSent ? (
              <div className="text-center py-6">
                <CheckCircle className="w-14 h-14 mx-auto mb-3 text-emerald-500" />
                <p className="font-bold text-slate-800 text-lg">Demande envoyée !</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setDemoSent(true); }} className="space-y-4">
                <input type="email" value={demoEmail} onChange={(e) => setDemoEmail(e.target.value)} placeholder="votre@entreprise.com" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none" required />
                <p className="text-base text-slate-600 font-medium">Packs à tester :</p>
                <div className="grid grid-cols-3 gap-3">
                  {packs.map(p => (
                    <button key={p.id} type="button" onClick={() => demoPacks.includes(p.id) ? setDemoPacks(demoPacks.filter(x=>x!==p.id)) : setDemoPacks([...demoPacks, p.id])}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${demoPacks.includes(p.id) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
                      <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow mb-2`}><p.icon className="w-5 h-5 text-white" /></div>
                      <p className="text-xs font-medium text-slate-700">{p.name}</p>
                    </button>
                  ))}
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Play className="w-5 h-5" /> Demander l'accès</button>
              </form>
            )}
          </div>
        </div>
      )}

      {showSubscribeTuto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                Comment s'abonner ?
              </h3>
              <button onClick={() => setShowSubscribeTuto(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3">
              {subscribeSteps.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-black text-lg">{s.step}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <s.icon className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-bold text-slate-800">{s.title}</h4>
                    </div>
                    <p className="text-slate-600 text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <p className="text-emerald-800 text-sm flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Paiement 100% sécurisé. Résiliation possible.
              </p>
            </div>
            <button onClick={() => setShowSubscribeTuto(false)} className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl">J'ai compris !</button>
          </div>
        </div>
      )}

      {showFaqChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl flex flex-col h-[400px] shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <h3 className="font-bold flex items-center gap-2"><MessageCircle className="w-5 h-5" /> Support</h3>
              <button onClick={() => setShowFaqChat(false)} className="p-1 hover:bg-white/20 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">
              {faqMessages.map(m => (<div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.type === 'user' ? 'bg-indigo-600 text-white' : 'bg-white shadow text-slate-700'}`}>{m.text}</div></div>))}
            </div>
            <div className="p-4 border-t flex gap-2 bg-white">
              <input type="text" value={faqInput} onChange={(e) => setFaqInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && faqInput) { setFaqMessages([...faqMessages, { id: Date.now(), type: 'user', text: faqInput }]); setFaqInput(''); }}} placeholder="Votre question..." className="flex-1 px-4 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none" />
              <button onClick={() => { if (faqInput) { setFaqMessages([...faqMessages, { id: Date.now(), type: 'user', text: faqInput }]); setFaqInput(''); }}} className="p-2 bg-indigo-600 text-white rounded-xl"><Send className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      )}

      {showBugChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl flex flex-col h-[400px] shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white">
              <h3 className="font-bold flex items-center gap-2"><Bug className="w-5 h-5" /> Signaler un bug</h3>
              <div className="flex gap-2">
                <button onClick={() => setBugMessages([{ id: 1, type: 'system', text: 'Décrivez le bug.', time: new Date() }])} className="p-1 hover:bg-white/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                <button onClick={() => setShowBugChat(false)} className="p-1 hover:bg-white/20 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">
              {bugMessages.map(m => (<div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.type === 'user' ? 'bg-rose-500 text-white' : 'bg-white shadow text-slate-700'}`}>{m.text}</div></div>))}
            </div>
            <div className="p-4 border-t flex gap-2 bg-white">
              <input type="text" value={bugInput} onChange={(e) => setBugInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && bugInput) { setBugMessages([...bugMessages, { id: Date.now(), type: 'user', text: bugInput }]); setBugInput(''); }}} placeholder="Décrivez le bug..." className="flex-1 px-4 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none" />
              <button onClick={() => { if (bugInput) { setBugMessages([...bugMessages, { id: Date.now(), type: 'user', text: bugInput }]); setBugInput(''); }}} className="p-2 bg-rose-500 text-white rounded-xl"><Send className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Créer un compte */}
      {showCreateAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                Créer un compte
              </h3>
              <button onClick={() => setShowCreateAccount(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6 text-slate-400" /></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('Compte créé ! Redirection vers le paiement...'); }} className="space-y-4">
              {/* Infos entreprise */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  Informations entreprise
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-600 mb-1 block">Nom de l'entreprise *</label>
                    <input type="text" value={newAccount.company} onChange={(e) => setNewAccount({...newAccount, company: e.target.value})} placeholder="Votre entreprise" className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 mb-1 block">SIRET *</label>
                    <input type="text" value={newAccount.siret} onChange={(e) => setNewAccount({...newAccount, siret: e.target.value})} placeholder="123 456 789 00012" className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none" required />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-slate-600 mb-1 block">Adresse *</label>
                    <input type="text" value={newAccount.address} onChange={(e) => setNewAccount({...newAccount, address: e.target.value})} placeholder="Adresse complète" className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none" required />
                  </div>
                </div>
              </div>

              {/* Infos contact */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  Informations de contact
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-600 mb-1 block">Email professionnel *</label>
                    <input type="email" value={newAccount.email} onChange={(e) => setNewAccount({...newAccount, email: e.target.value})} placeholder="contact@entreprise.com" className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 mb-1 block">Téléphone *</label>
                    <input type="tel" value={newAccount.phone} onChange={(e) => setNewAccount({...newAccount, phone: e.target.value})} placeholder="06 12 34 56 78" className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none" required />
                  </div>
                </div>
              </div>

              {/* Mot de passe */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-600" />
                  Sécurité
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-600 mb-1 block">Mot de passe *</label>
                    <input type="password" value={newAccount.password} onChange={(e) => setNewAccount({...newAccount, password: e.target.value})} placeholder="••••••••" className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 mb-1 block">Confirmer *</label>
                    <input type="password" value={newAccount.confirmPassword} onChange={(e) => setNewAccount({...newAccount, confirmPassword: e.target.value})} placeholder="••••••••" className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none" required />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">8 caractères min., 1 majuscule, 1 chiffre</p>
              </div>

              {/* Paiement sécurisé */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  Paiement sécurisé
                </h4>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span>Paiement 100% sécurisé via Stripe</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span>Résiliation à tout moment</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                  Après validation de vos informations, vous serez redirigé vers notre plateforme de paiement sécurisée Stripe pour finaliser votre abonnement.
                </p>
              </div>

              {/* Bouton */}
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                <CreditCard className="w-6 h-6" />
                Créer mon compte et payer
              </button>

              <p className="text-center text-sm text-slate-500">
                En créant un compte, vous acceptez nos <a href="#" className="text-indigo-600 hover:underline">CGV</a> et notre <a href="#" className="text-indigo-600 hover:underline">politique de confidentialité</a>.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Modal Guide utilisateur */}
      {showUserGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                Guide utilisateur
              </h3>
              <button onClick={() => { setShowUserGuide(false); setGuideSection(null); }} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6 text-slate-400" /></button>
            </div>

            <p className="text-slate-600 mb-4">Sélectionnez une rubrique pour afficher le guide correspondant :</p>

            {/* Menu déroulant */}
            <div className="space-y-3">
              {/* Section 1 - Importer les données */}
              <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setGuideSection(guideSection === 'import' ? null : 'import')} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-slate-800 text-lg">Comment importer les données</span>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform ${guideSection === 'import' ? 'rotate-180' : ''}`} />
                </button>
                {guideSection === 'import' && (
                  <div className="p-4 bg-white border-t border-slate-200">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <h4 className="font-bold text-slate-800">Téléchargez les fichiers Excel modèles</h4>
                          <p className="text-slate-600 text-sm">Rendez-vous dans Paramètres → Import/Export → Télécharger les modèles. Vous obtiendrez des fichiers Excel pré-formatés pour vos clients, sites, équipements et techniciens.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <h4 className="font-bold text-slate-800">Remplissez les fichiers avec vos données</h4>
                          <p className="text-slate-600 text-sm">Complétez chaque fichier Excel avec vos données existantes. Respectez bien les colonnes et formats indiqués dans les en-têtes.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                          <h4 className="font-bold text-slate-800">Importez vos fichiers</h4>
                          <p className="text-slate-600 text-sm">Retournez dans Paramètres → Import/Export → Importer. Sélectionnez votre fichier, vérifiez l'aperçu et validez. L'import est vérifié automatiquement.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2 - Paramètres société */}
              <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setGuideSection(guideSection === 'params' ? null : 'params')} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-slate-800 text-lg">Saisir les paramètres de votre société</span>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform ${guideSection === 'params' ? 'rotate-180' : ''}`} />
                </button>
                {guideSection === 'params' && (
                  <div className="p-4 bg-white border-t border-slate-200">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <h4 className="font-bold text-slate-800">Accédez aux paramètres</h4>
                          <p className="text-slate-600 text-sm">Cliquez sur l'icône ⚙️ Paramètres dans le menu latéral, puis sélectionnez "Ma société".</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <h4 className="font-bold text-slate-800">Renseignez vos informations</h4>
                          <p className="text-slate-600 text-sm">Complétez : raison sociale, SIRET, adresse, téléphone, email, logo. Ces informations apparaîtront sur vos devis et factures.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                          <h4 className="font-bold text-slate-800">Configurez vos préférences</h4>
                          <p className="text-slate-600 text-sm">Définissez vos numéros de TVA, conditions de paiement, mentions légales et personnalisez vos modèles de documents.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3 - Créer client et site */}
              <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setGuideSection(guideSection === 'client' ? null : 'client')} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-slate-800 text-lg">Comment créer un client et un site</span>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform ${guideSection === 'client' ? 'rotate-180' : ''}`} />
                </button>
                {guideSection === 'client' && (
                  <div className="p-4 bg-white border-t border-slate-200">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <h4 className="font-bold text-slate-800">Créer un nouveau client</h4>
                          <p className="text-slate-600 text-sm">Allez dans Clients → + Nouveau client. Renseignez : nom, adresse de facturation, contact principal, email et téléphone. Cliquez sur Enregistrer.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <h4 className="font-bold text-slate-800">Ajouter un site au client</h4>
                          <p className="text-slate-600 text-sm">Dans la fiche client, cliquez sur l'onglet "Sites" puis "+ Ajouter un site". Un client peut avoir plusieurs sites d'intervention (adresses différentes).</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                          <h4 className="font-bold text-slate-800">Configurer le site</h4>
                          <p className="text-slate-600 text-sm">Pour chaque site, renseignez : adresse complète, contact sur site, codes d'accès, horaires d'ouverture et instructions particulières.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">4</div>
                        <div>
                          <h4 className="font-bold text-slate-800">Ajouter des équipements au site</h4>
                          <p className="text-slate-600 text-sm">Dans la fiche site, ajoutez les équipements à maintenir. Vous pourrez ensuite planifier des interventions et suivre l'historique par équipement.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-cyan-50 rounded-xl border border-cyan-200">
              <p className="text-cyan-800 text-sm flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-600" />
                D'autres guides seront ajoutés prochainement. Besoin d'aide ? Contactez le support.
              </p>
            </div>

            <button onClick={() => { setShowUserGuide(false); setGuideSection(null); }} className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:shadow-lg">
              Fermer le guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
