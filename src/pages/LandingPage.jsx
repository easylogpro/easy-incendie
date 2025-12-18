// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, Shield, Thermometer, Wind, Home, Zap,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MessageCircle, Bug, 
  Mail, Lock, Eye, EyeOff, Send, X,
  Play, CreditCard, CheckCircle, AlertCircle, Trash2,
  Download, Upload, Link2, UserCheck, ArrowRight,
  Globe, ShieldCheck, Headphones, TrendingUp,
  Calendar, Wrench, FileText, Users, Bell, Smartphone,
  Award, Star, Monitor, ClipboardCheck, HelpCircle, MousePointer2, Building2, BookOpen,
  MapPin, Server, RefreshCw, LayoutDashboard, Sparkles, Check
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showDemoPreview, setShowDemoPreview] = useState(false);
  const [demoScreen, setDemoScreen] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTestimonial((prev) => (prev + 1) % 3), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showDemoPreview) {
      const interval = setInterval(() => setDemoScreen((prev) => (prev + 1) % 3), 4000);
      return () => clearInterval(interval);
    }
  }, [showDemoPreview]);

  const packs = [
    { id: 'ssi', name: 'SSI', icon: Shield, gradient: 'from-red-500 to-rose-600' },
    { id: 'protection', name: 'Protection Incendie', icon: Flame, gradient: 'from-orange-500 to-amber-600' },
    { id: 'chauffage', name: 'Chauffage', icon: Thermometer, gradient: 'from-amber-500 to-yellow-500' },
    { id: 'clim', name: 'Climatisation', icon: Wind, gradient: 'from-cyan-500 to-blue-500' },
    { id: 'renovation', name: 'Rénovation Énergétique', icon: Home, gradient: 'from-emerald-500 to-green-600' },
    { id: 'energie', name: 'Énergie', icon: Zap, gradient: 'from-violet-500 to-purple-600' }
  ];

  const formulas = [
    { id: 1, name: 'Starter', price: 29, packs: 1, desc: '1 Pack au choix', users: 2, clients: 50, storage: '5 Go' },
    { id: 2, name: 'Pro', price: 39, packs: 2, desc: '2 Packs au choix', users: 5, clients: 200, storage: '20 Go', popular: true },
    { id: 3, name: 'ALL', price: 49, packs: 6, desc: 'Tous les packs', users: 'Illimité', clients: 'Illimité', storage: '100 Go' }
  ];

  const features = [
    { icon: Calendar, title: 'Planning intelligent', desc: 'Planifiez facilement', color: 'bg-blue-500' },
    { icon: Wrench, title: 'Suivi interventions', desc: 'SAV, travaux, maintenance', color: 'bg-purple-500' },
    { icon: FileText, title: 'Devis & Factures', desc: 'Génération automatique', color: 'bg-blue-600' },
    { icon: Users, title: 'Gestion équipes', desc: 'Techniciens & sous-traitants', color: 'bg-orange-500' },
    { icon: Bell, title: 'Alertes auto', desc: 'Relances, échéances', color: 'bg-red-500' },
    { icon: Smartphone, title: '1 App Terrain', desc: '+ 1 logiciel interne', color: 'bg-blue-500', secondIcon: Monitor }
  ];

  const advantages = [
    { icon: Upload, title: 'Import facilité', desc: 'Fichiers Excel fournis pour importer clients, techniciens, sous-traitants', color: 'bg-emerald-500' },
    { icon: Download, title: 'Export complet', desc: 'Toutes vos données exportables (RGPD) + export comptable', color: 'bg-rose-500' },
    { icon: Link2, title: 'Interconnexion', desc: 'Donneurs d\'ordre et sous-traitants connectés en temps réel', color: 'bg-cyan-500' },
    { icon: UserCheck, title: 'Espace client', desc: 'Vos clients accèdent à leurs devis, factures et rapports', color: 'bg-orange-500' },
    { icon: ClipboardCheck, title: 'Rapports spécialisés', desc: 'Rapports d\'intervention par métier conçus par des pros', color: 'bg-violet-500' }
  ];

  const testimonials = [
    { initials: 'MC', name: 'Marc Civelli', role: 'Gérant - Civelli Énergies', text: "EasyLog a transformé notre gestion quotidienne. Tout est centralisé et accessible partout.", color: 'from-indigo-500 to-purple-600' },
    { initials: 'SL', name: 'Sophie Laurent', role: 'Directrice - SSI Protect', text: "Enfin un logiciel pensé pour notre métier. Les rapports SSI sont parfaits, mes techniciens adorent l'app terrain.", color: 'from-rose-500 to-pink-600' },
    { initials: 'PD', name: 'Philippe Durand', role: 'Responsable - Thermo Services', text: "Le planning et les relances automatiques m'ont fait gagner 2h par jour. ROI immédiat !", color: 'from-amber-500 to-orange-600' }
  ];

  const faqs = [
    { q: "Comment importer mes données ?", a: "Nous fournissons des fichiers Excel modèles prêts à remplir pour vos clients, sites, équipements et techniciens. L'import est guidé étape par étape avec vérification automatique des données et rapport d'erreurs détaillé." },
    { q: "Puis-je exporter mes données ?", a: "Oui, toutes vos données sont exportables à tout moment conformément au RGPD. Vous pouvez exporter en Excel ou CSV. Un export comptable automatique est également disponible." },
    { q: "Interconnexion sous-traitant ?", a: "Les sous-traitants disposent de leur propre accès sécurisé pour consulter uniquement leurs interventions assignées. Ils peuvent saisir leurs rapports et vous êtes notifié en temps réel." },
    { q: "Espace client ?", a: "Vos clients accèdent à un espace dédié sécurisé pour consulter leurs devis, factures, rapports d'intervention et planning des visites à venir. Vous paramétrez ce qui est visible." },
    { q: "Mode hors ligne ?", a: "L'application terrain fonctionne même sans connexion internet. Vos techniciens peuvent saisir leurs interventions, prendre des photos et faire signer. Synchronisation automatique au retour du réseau." },
    { q: "Support ?", a: "Support par chat et email inclus dans toutes les formules avec réponse sous 24h. Support téléphonique prioritaire et formation personnalisée disponibles pour les formules Pro et ALL." }
  ];

  const subscribeSteps = [
    { step: 1, title: 'Choisissez votre formule', desc: 'Starter, Pro ou ALL', icon: CreditCard },
    { step: 2, title: 'Sélectionnez vos packs', desc: 'Modules métiers', icon: CheckCircle },
    { step: 3, title: 'Créez votre compte', desc: 'Infos entreprise', icon: Mail },
    { step: 4, title: 'Paiement sécurisé', desc: 'Via Stripe', icon: ShieldCheck },
    { step: 5, title: 'Accès immédiat', desc: 'Identifiants reçus', icon: Play }
  ];

  const demoScreens = [
    { title: 'Dashboard', desc: 'Vue d\'ensemble de votre activité', icon: LayoutDashboard },
    { title: 'Liste Clients', desc: 'Gérez tous vos clients et sites', icon: Users },
    { title: 'Planning', desc: 'Planifiez vos interventions', icon: Calendar }
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
    if (selectedFormula?.id === f.id) { setShowPacks(!showPacks); } 
    else { setSelectedFormula(f); setSelectedPacks(f.packs === 6 ? packs.map(p => p.id) : []); setShowPacks(true); }
  };

  const handlePackSelect = (packId) => {
    if (!selectedFormula) return;
    if (selectedFormula.packs === 6) { setSelectedPacks(packs.map(p => p.id)); return; }
    if (selectedPacks.includes(packId)) setSelectedPacks(selectedPacks.filter(id => id !== packId));
    else if (selectedPacks.length < selectedFormula.packs) setSelectedPacks([...selectedPacks, packId]);
  };

  const canPay = selectedFormula && (selectedFormula.packs === 6 || selectedPacks.length === selectedFormula.packs);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* HEADER - POLICES XXL */}
      <header className="relative py-6 md:py-10 px-4 text-center flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-48 md:w-96 h-24 md:h-48 bg-cyan-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-48 md:w-96 h-24 md:h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-4 md:mb-5">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border border-white/30 group-hover:scale-110 transition-transform">
                <span className="text-4xl md:text-5xl font-black text-white">E</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight">Easy<span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">Log</span></h1>
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 flex-wrap">
            {['Énergie', 'Incendie', 'Chauffage', 'Clim', 'Rénovation'].map((m, i) => (
              <span key={i} className="text-sm md:text-base text-blue-300 bg-white/10 px-4 py-1.5 rounded-full font-semibold">{m}</span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <p className="text-blue-100 text-xl md:text-4xl font-semibold">Simplifiez la gestion de vos activités en 1 clic</p>
            <div className="relative"><MousePointer2 className="w-8 h-8 md:w-12 md:h-12 text-cyan-400 animate-bounce" /><div className="absolute -inset-2 bg-cyan-400/40 rounded-full animate-ping"></div></div>
          </div>
          <div className="flex items-center justify-center gap-4 md:gap-6 mt-5 flex-wrap">
            <div className="flex items-center gap-2 text-emerald-400 text-sm md:text-base bg-emerald-500/10 px-4 py-2 rounded-full"><MapPin className="w-5 h-5" /><span>Données hébergées en France</span></div>
            <div className="flex items-center gap-2 text-amber-400 text-sm md:text-base bg-amber-500/10 px-4 py-2 rounded-full"><RefreshCw className="w-5 h-5" /><span>Annulation à tout moment</span></div>
            <div className="flex items-center gap-2 text-cyan-400 text-sm md:text-base bg-cyan-500/10 px-4 py-2 rounded-full"><ShieldCheck className="w-5 h-5" /><span>Paiement sécurisé</span></div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
      </header>

      {/* 3 COLONNES */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-auto lg:overflow-hidden">
        {/* COLONNE GAUCHE - POLICES XXL */}
        <div className="w-full lg:w-[28%] flex flex-col p-4 md:p-5 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-blue-900/90 to-indigo-900/90"></div>
          <div className="relative z-10 flex flex-col h-full gap-5">
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {features.map((f, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-white/10 hover:bg-white/20 hover:scale-105 transition-all cursor-pointer group flex flex-col items-center text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className={`w-16 h-16 md:w-20 md:h-20 ${f.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform animate-pulse`}>
                      <f.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    {f.secondIcon && (<div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse"><f.secondIcon className="w-8 h-8 md:w-10 md:h-10 text-white" /></div>)}
                  </div>
                  <h3 className="font-bold text-white text-lg md:text-2xl">{f.title}</h3>
                  <p className="text-blue-200 text-base md:text-xl">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-white/10 flex-1">
              <h3 className="text-2xl md:text-4xl font-bold mb-5 flex items-center gap-4">
                <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg animate-pulse"><Award className="w-8 h-8 md:w-10 md:h-10 text-white" /></div>
                Pourquoi EasyLog ?
              </h3>
              <div className="space-y-4">
                {advantages.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 md:p-5 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:translate-x-1 transition-all cursor-pointer group">
                    <div className={`w-14 h-14 md:w-16 md:h-16 ${a.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}><a.icon className="w-7 h-7 md:w-9 md:h-9 text-white" /></div>
                    <div><h4 className="font-bold text-white text-lg md:text-2xl">{a.title}</h4><p className="text-blue-200 text-base md:text-xl">{a.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE CENTRE - FOND PLUS FONCÉ + POLICES XXL */}
        <div className="w-full lg:w-[44%] flex flex-col p-4 md:p-5 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-blue-100 to-indigo-200"></div>
          <div className="relative z-10 flex flex-col h-full gap-4 md:gap-5">
            {/* Formules - POLICES XXL */}
            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-xl border border-indigo-200">
              <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 md:mb-10 flex items-center justify-center gap-5">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"><CreditCard className="w-9 h-9 md:w-11 md:h-11 text-white" /></div>
                Nos formules
              </h3>
              <div className="grid grid-cols-3 gap-5 md:gap-8 mb-6">
                {formulas.map(f => (
                  <button key={f.id} onClick={() => handleFormulaSelect(f)} className={`relative p-5 md:p-8 rounded-xl border-2 text-center transition-all hover:scale-105 hover:shadow-lg ${selectedFormula?.id === f.id ? 'border-indigo-500 bg-indigo-50 shadow-lg' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
                    {f.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 md:px-8 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-sm md:text-base font-bold text-white rounded-full">POPULAIRE</span>}
                    <p className="font-bold text-slate-800 text-xl md:text-3xl">{f.name}</p>
                    <p className="text-5xl md:text-7xl font-black text-slate-800">{f.price}€<span className="text-lg md:text-2xl font-normal text-slate-500">/mois</span></p>
                    <p className="text-base md:text-xl text-slate-500 mb-4">{f.desc}</p>
                    <div className="text-sm md:text-lg text-slate-400 space-y-2 border-t pt-4">
                      <p className="flex items-center justify-center gap-2"><Users className="w-6 h-6 md:w-7 md:h-7" />{f.users} utilisateurs</p>
                      <p className="flex items-center justify-center gap-2"><Building2 className="w-6 h-6 md:w-7 md:h-7" />{f.clients} clients</p>
                      <p className="flex items-center justify-center gap-2"><Server className="w-6 h-6 md:w-7 md:h-7" />{f.storage}</p>
                    </div>
                  </button>
                ))}
              </div>
              {selectedFormula && showPacks && (
                <>
                  <button onClick={() => setShowPacks(false)} className="w-full flex items-center justify-center gap-2 py-4 text-xl text-indigo-600 hover:text-indigo-800 mb-4"><ChevronUp className="w-8 h-8" /> Fermer les packs</button>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-5 p-5 md:p-6 bg-slate-50 rounded-xl border border-slate-200">
                    {packs.map(p => {
                      const sel = selectedPacks.includes(p.id);
                      const dis = selectedFormula.packs !== 6 && !sel && selectedPacks.length >= selectedFormula.packs;
                      return (
                        <button key={p.id} onClick={() => handlePackSelect(p.id)} disabled={dis} className={`p-4 md:p-5 rounded-lg border-2 text-center transition-all hover:scale-105 ${sel ? 'border-emerald-500 bg-emerald-50' : dis ? 'opacity-30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                          <div className={`w-14 h-14 md:w-16 md:h-16 mx-auto rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow mb-2`}><p.icon className="w-7 h-7 md:w-8 md:h-8 text-white" /></div>
                          <p className="text-sm md:text-base font-medium text-slate-700 truncate">{p.name}</p>
                        </button>
                      );
                    })}
                  </div>
                  <button disabled={!canPay} className={`w-full mt-6 py-5 md:py-6 rounded-xl font-bold text-2xl md:text-3xl flex items-center justify-center gap-3 transition-all ${canPay ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:scale-[1.02]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}><CreditCard className="w-8 h-8" /> Souscrire {selectedFormula.price}€/mois</button>
                </>
              )}
              {/* Comment s'abonner + Guide utilisateur sur la même ligne */}
              <div className="flex gap-5 mt-6">
                <button onClick={() => setShowSubscribeTuto(true)} className="flex-1 py-5 md:py-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl font-bold text-white text-xl md:text-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"><HelpCircle className="w-7 h-7 md:w-8 md:h-8" /> Comment s'abonner ?</button>
                <button onClick={() => setShowUserGuide(true)} className="flex-1 py-5 md:py-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white text-xl md:text-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"><BookOpen className="w-7 h-7 md:w-8 md:h-8" /> Guide utilisateur</button>
              </div>
            </div>
            
            {/* Connexion */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-indigo-200">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-5 flex items-center justify-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg"><Lock className="w-7 h-7 md:w-8 md:h-8 text-white" /></div>
                Connexion
              </h3>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative"><Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-400" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email professionnel" className="w-full pl-16 pr-5 py-5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xl focus:border-indigo-500 focus:outline-none" required /></div>
                <div className="relative"><Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-400" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" className="w-full pl-16 pr-16 py-5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xl focus:border-indigo-500 focus:outline-none" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff className="w-7 h-7" /> : <Eye className="w-7 h-7" />}</button></div>
                {loginError && <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-lg"><AlertCircle className="w-7 h-7" />{loginError}</div>}
                {/* Se connecter + Créer un compte sur la même ligne */}
                <div className="flex gap-4">
                  <button type="submit" disabled={loginLoading} className="flex-1 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xl md:text-2xl rounded-xl hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 transition-all flex items-center justify-center gap-3">{loginLoading ? 'Connexion...' : <>Se connecter <ArrowRight className="w-7 h-7" /></>}</button>
                  <button type="button" onClick={() => setShowCreateAccount(true)} className="flex-1 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xl md:text-2xl rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"><UserCheck className="w-7 h-7" /> Créer un compte</button>
                </div>
                <button type="button" onClick={() => setShowForgotPassword(true)} className="w-full text-center text-indigo-600 text-lg hover:underline">Mot de passe oublié ?</button>
              </form>
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => setShowFaqChat(true)} className="flex-1 py-5 bg-white rounded-xl font-semibold text-lg text-slate-700 flex items-center justify-center gap-3 shadow-lg border border-slate-200 hover:bg-indigo-50 hover:scale-[1.02] transition-all"><MessageCircle className="w-7 h-7" /> Question</button>
              <button onClick={() => setShowBugChat(true)} className="flex-1 py-5 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl font-semibold text-lg text-white flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] transition-all"><Bug className="w-7 h-7" /> Bug</button>
            </div>

            {/* TÉMOIGNAGES */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-xl border border-indigo-200">
              <div className="flex items-center justify-between mb-4"><h3 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-3"><Star className="w-7 h-7 text-amber-400 fill-amber-400" />Ils nous font confiance</h3><div className="flex gap-2">{testimonials.map((_, i) => (<button key={i} onClick={() => setCurrentTestimonial(i)} className={`w-3 h-3 rounded-full transition-all ${currentTestimonial === i ? 'bg-indigo-500 w-6' : 'bg-slate-300'}`}></button>))}</div></div>
              <div className="flex items-start gap-5">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br ${testimonials[currentTestimonial].color} flex items-center justify-center text-white font-bold text-2xl md:text-3xl shadow-lg flex-shrink-0`}>{testimonials[currentTestimonial].initials}</div>
                <div><div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 md:w-6 md:h-6 text-amber-400 fill-amber-400" />)}</div><p className="text-slate-600 text-base md:text-lg italic leading-relaxed mb-2">"{testimonials[currentTestimonial].text}"</p><p className="font-bold text-slate-800 text-lg md:text-xl">{testimonials[currentTestimonial].name}</p><p className="text-sm md:text-base text-slate-500">{testimonials[currentTestimonial].role}</p></div>
              </div>
              <div className="flex justify-between mt-4"><button onClick={() => setCurrentTestimonial((prev) => (prev - 1 + 3) % 3)} className="p-3 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"><ChevronLeft className="w-6 h-6 text-slate-600" /></button><button onClick={() => setCurrentTestimonial((prev) => (prev + 1) % 3)} className="p-3 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"><ChevronRight className="w-6 h-6 text-slate-600" /></button></div>
            </div>

            <div className="text-center text-slate-500 text-base">© 2025 EasyLog · <a href="#" className="hover:text-indigo-600">Mentions légales</a> · <a href="#" className="hover:text-indigo-600">CGV</a> · <a href="#" className="hover:text-indigo-600">RGPD</a></div>
          </div>
        </div>

        {/* COLONNE DROITE - POLICES XXL */}
        <div className="w-full lg:w-[28%] flex flex-col p-4 md:p-5 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-blue-900/90 to-indigo-900/90"></div>
          <div className="relative z-10 flex flex-col h-full gap-5 md:gap-6">
            
            {/* 1. Aperçu Démo EN PREMIER */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 md:p-6 shadow-xl text-white">
              <div className="flex items-center justify-between mb-4"><h3 className="text-xl md:text-2xl font-bold flex items-center gap-3"><Sparkles className="w-7 h-7 text-yellow-400" />Découvrez l'interface</h3><div className="flex gap-2">{demoScreens.map((_, i) => (<div key={i} className={`w-3 h-3 rounded-full transition-all ${demoScreen === i ? 'bg-white w-6' : 'bg-white/40'}`}></div>))}</div></div>
              <div className="bg-slate-900 rounded-xl p-4 md:p-5 mb-5 border border-white/20">
                <div className="flex items-center gap-3 mb-4"><div className="flex gap-2"><div className="w-3.5 h-3.5 rounded-full bg-red-500"></div><div className="w-3.5 h-3.5 rounded-full bg-yellow-500"></div><div className="w-3.5 h-3.5 rounded-full bg-green-500"></div></div><div className="flex-1 bg-slate-700 rounded text-sm text-slate-400 px-4 py-1.5 text-center">easylog-pro.web.app</div></div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-5 min-h-[120px] md:min-h-[140px] flex items-center justify-center"><div className="text-center"><div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">{React.createElement(demoScreens[demoScreen].icon, { className: "w-8 h-8 md:w-10 md:h-10 text-white" })}</div><p className="text-white font-bold text-lg md:text-xl">{demoScreens[demoScreen].title}</p><p className="text-slate-400 text-base md:text-lg">{demoScreens[demoScreen].desc}</p></div></div>
              </div>
              <button onClick={() => setShowDemoPreview(true)} className="w-full py-5 bg-white text-indigo-600 font-bold text-xl rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"><Play className="w-7 h-7" />Voir la démo interactive</button>
            </div>

            {/* 2. Essai gratuit EN DEUXIÈME */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-5 mb-4"><div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center"><Play className="w-7 h-7" /></div><div><h3 className="text-2xl font-bold">Essai gratuit 48h</h3><p className="text-emerald-100 text-base">Sans engagement, sans carte bancaire</p></div></div>
              <button onClick={() => setShowDemoRequest(true)} className="w-full py-5 bg-white text-emerald-600 font-bold text-xl rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"><Play className="w-7 h-7" /> Demander un accès démo</button>
            </div>

            {/* FAQ */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-white/10 flex-1">
              <h3 className="text-xl md:text-3xl font-bold mb-4 md:mb-5 flex items-center gap-4"><div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg"><MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white" /></div>Questions fréquentes</h3>
              <div className="space-y-3 md:space-y-4">
                {faqs.map((f, i) => (
                  <div key={i} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 md:p-5 text-left"><span className="font-medium text-base md:text-xl">{f.q}</span><ChevronDown className={`w-6 h-6 md:w-7 md:h-7 text-blue-400 transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} /></button>
                    {openFaq === i && <div className="px-4 md:px-5 pb-4 md:pb-5 text-blue-200 text-base md:text-lg">{f.a}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALES */}
      {showDemoPreview && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"><div className="w-full max-w-5xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"><div className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-600 to-purple-600"><h3 className="text-2xl font-bold text-white flex items-center gap-3"><Sparkles className="w-7 h-7 text-yellow-400" />Démo Interactive EasyLog</h3><button onClick={() => setShowDemoPreview(false)} className="p-2 hover:bg-white/20 rounded-xl text-white"><X className="w-7 h-7" /></button></div><div className="p-8"><div className="flex gap-3 mb-5">{demoScreens.map((screen, i) => (<button key={i} onClick={() => setDemoScreen(i)} className={`flex-1 py-4 px-5 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2 ${demoScreen === i ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{React.createElement(screen.icon, { className: "w-6 h-6" })}{screen.title}</button>))}</div><div className="bg-slate-800 rounded-xl p-5 min-h-[450px]"><div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-700"><div className="flex gap-1.5"><div className="w-4 h-4 rounded-full bg-red-500"></div><div className="w-4 h-4 rounded-full bg-yellow-500"></div><div className="w-4 h-4 rounded-full bg-green-500"></div></div><div className="flex-1 bg-slate-700 rounded text-base text-slate-400 px-4 py-2 text-center">easylog-pro.web.app</div></div>{demoScreen === 0 && (<div className="grid grid-cols-3 gap-5"><div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white"><p className="text-base opacity-80">Interventions du jour</p><p className="text-4xl font-bold">12</p></div><div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-5 text-white"><p className="text-base opacity-80">CA du mois</p><p className="text-4xl font-bold">47.8K€</p></div><div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 text-white"><p className="text-base opacity-80">Devis en attente</p><p className="text-4xl font-bold">8</p></div><div className="col-span-3 bg-slate-700 rounded-xl p-5"><h4 className="text-white font-bold text-xl mb-4">Activité récente</h4><div className="space-y-3">{['Intervention terminée - Dupont SA', 'Nouveau devis créé - Martin SARL', 'Facture payée - Tech Solutions'].map((a, i) => (<div key={i} className="flex items-center gap-3 text-slate-300 text-base bg-slate-600 rounded-lg p-3"><Check className="w-5 h-5 text-emerald-400" />{a}</div>))}</div></div></div>)}{demoScreen === 1 && (<div className="space-y-4"><div className="flex items-center justify-between mb-5"><input type="text" placeholder="Rechercher un client..." className="bg-slate-700 text-white px-5 py-3 rounded-lg w-72 text-lg" /><button className="bg-indigo-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 text-lg"><Users className="w-5 h-5" /> Nouveau client</button></div>{['Dupont SA - 3 sites - Paris', 'Martin SARL - 1 site - Lyon', 'Tech Solutions - 5 sites - Marseille', 'Énergie Plus - 2 sites - Bordeaux'].map((c, i) => (<div key={i} className="flex items-center justify-between bg-slate-700 rounded-lg p-4 hover:bg-slate-600 cursor-pointer"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">{c[0]}</div><span className="text-white text-lg">{c}</span></div><ChevronRight className="w-6 h-6 text-slate-400" /></div>))}</div>)}{demoScreen === 2 && (<div className="space-y-4"><div className="flex items-center justify-between mb-5"><div className="flex gap-3"><button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-base">Semaine</button><button className="bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-base">Mois</button></div><button className="bg-emerald-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 text-lg"><Calendar className="w-5 h-5" /> Nouvelle intervention</button></div><div className="grid grid-cols-5 gap-3">{['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'].map((j, i) => (<div key={i} className="text-center"><p className="text-slate-400 text-base mb-3">{j}</p><div className="bg-slate-700 rounded-lg p-3 min-h-[180px] space-y-2">{i === 0 && <div className="bg-blue-600 text-white text-sm p-2 rounded">9h - SAV Dupont</div>}{i === 0 && <div className="bg-emerald-600 text-white text-sm p-2 rounded">14h - Maintenance</div>}{i === 1 && <div className="bg-orange-600 text-white text-sm p-2 rounded">10h - Audit SSI</div>}{i === 2 && <div className="bg-purple-600 text-white text-sm p-2 rounded">9h - Installation</div>}{i === 3 && <div className="bg-blue-600 text-white text-sm p-2 rounded">11h - SAV Martin</div>}{i === 4 && <div className="bg-rose-600 text-white text-sm p-2 rounded">15h - Réception</div>}</div></div>))}</div></div>)}</div><p className="text-center text-slate-400 text-base mt-5">Navigation automatique ou cliquez sur les onglets pour explorer</p></div></div></div>)}
      {showForgotPassword && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-2xl"><div className="flex justify-between items-center mb-5"><h3 className="text-2xl font-bold text-slate-800">Réinitialiser le mot de passe</h3><button onClick={() => {setShowForgotPassword(false);setResetSent(false);}} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6 text-slate-400" /></button></div>{resetSent ? (<div className="text-center py-8"><CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-500" /><p className="font-bold text-slate-800 text-xl">Email envoyé !</p></div>) : (<form onSubmit={(e) => { e.preventDefault(); setResetSent(true); }} className="space-y-5"><input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="votre@email.com" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none" required /><button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xl rounded-xl hover:shadow-xl transition-all">Envoyer le lien</button></form>)}</div></div>)}
      {showDemoRequest && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div className="w-full max-w-xl bg-white rounded-2xl p-8 shadow-2xl max-h-[85vh] overflow-y-auto"><div className="flex justify-between items-center mb-5"><h3 className="text-2xl font-bold text-slate-800">Demander une démo</h3><button onClick={() => { setShowDemoRequest(false); setDemoSent(false); }} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6 text-slate-400" /></button></div>{demoSent ? (<div className="text-center py-8"><CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-500" /><p className="font-bold text-slate-800 text-xl">Demande envoyée !</p><p className="text-slate-600 mt-3 text-lg">Vous recevrez vos accès sous 24h.</p></div>) : (<form onSubmit={(e) => { e.preventDefault(); setDemoSent(true); }} className="space-y-5"><input type="email" value={demoEmail} onChange={(e) => setDemoEmail(e.target.value)} placeholder="votre@entreprise.com" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg focus:border-emerald-500 focus:outline-none" required /><p className="text-lg text-slate-600 font-medium">Packs à tester :</p><div className="grid grid-cols-3 gap-4">{packs.map(p => (<button key={p.id} type="button" onClick={() => demoPacks.includes(p.id) ? setDemoPacks(demoPacks.filter(x=>x!==p.id)) : setDemoPacks([...demoPacks, p.id])} className={`p-4 rounded-xl border-2 text-center transition-all hover:scale-105 ${demoPacks.includes(p.id) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}><div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow mb-2`}><p.icon className="w-6 h-6 text-white" /></div><p className="text-sm font-medium text-slate-700">{p.name}</p></button>))}</div><button type="submit" className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xl rounded-xl flex items-center justify-center gap-2 hover:shadow-xl transition-all"><Play className="w-6 h-6" /> Demander l'accès</button></form>)}</div></div>)}
      {showSubscribeTuto && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-2xl max-h-[85vh] overflow-y-auto"><div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold text-slate-800 flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"><HelpCircle className="w-6 h-6 text-white" /></div>Comment s'abonner ?</h3><button onClick={() => setShowSubscribeTuto(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6 text-slate-400" /></button></div><div className="space-y-4">{subscribeSteps.map((s, i) => (<div key={i} className="flex items-center gap-5 p-5 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"><div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0"><span className="text-white font-black text-xl">{s.step}</span></div><div><div className="flex items-center gap-3 mb-1"><s.icon className="w-6 h-6 text-indigo-600" /><h4 className="font-bold text-slate-800 text-lg">{s.title}</h4></div><p className="text-slate-600 text-base">{s.desc}</p></div></div>))}</div><div className="mt-5 p-4 bg-emerald-50 rounded-xl border border-emerald-200"><p className="text-emerald-800 text-base flex items-center gap-3"><CheckCircle className="w-6 h-6 text-emerald-600" />Paiement 100% sécurisé. Annulation à tout moment.</p></div><button onClick={() => setShowSubscribeTuto(false)} className="w-full mt-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl rounded-xl hover:shadow-lg transition-all">J'ai compris !</button></div></div>)}
      {showFaqChat && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div className="w-full max-w-lg bg-white rounded-2xl flex flex-col h-[450px] shadow-2xl overflow-hidden"><div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><h3 className="font-bold text-xl flex items-center gap-3"><MessageCircle className="w-6 h-6" /> Support</h3><button onClick={() => setShowFaqChat(false)} className="p-2 hover:bg-white/20 rounded-lg"><X className="w-6 h-6" /></button></div><div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50">{faqMessages.map(m => (<div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] p-4 rounded-xl text-base ${m.type === 'user' ? 'bg-indigo-600 text-white' : 'bg-white shadow text-slate-700'}`}>{m.text}</div></div>))}</div><div className="p-5 border-t flex gap-3 bg-white"><input type="text" value={faqInput} onChange={(e) => setFaqInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && faqInput) { setFaqMessages([...faqMessages, { id: Date.now(), type: 'user', text: faqInput }]); setFaqInput(''); }}} placeholder="Votre question..." className="flex-1 px-5 py-3 bg-slate-100 rounded-xl text-base focus:outline-none" /><button onClick={() => { if (faqInput) { setFaqMessages([...faqMessages, { id: Date.now(), type: 'user', text: faqInput }]); setFaqInput(''); }}} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"><Send className="w-6 h-6" /></button></div></div></div>)}
      {showBugChat && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div className="w-full max-w-lg bg-white rounded-2xl flex flex-col h-[450px] shadow-2xl overflow-hidden"><div className="flex justify-between items-center p-5 bg-gradient-to-r from-rose-500 to-orange-500 text-white"><h3 className="font-bold text-xl flex items-center gap-3"><Bug className="w-6 h-6" /> Signaler un bug</h3><div className="flex gap-3"><button onClick={() => setBugMessages([{ id: 1, type: 'system', text: 'Décrivez le bug.', time: new Date() }])} className="p-2 hover:bg-white/20 rounded-lg"><Trash2 className="w-5 h-5" /></button><button onClick={() => setShowBugChat(false)} className="p-2 hover:bg-white/20 rounded-lg"><X className="w-6 h-6" /></button></div></div><div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50">{bugMessages.map(m => (<div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] p-4 rounded-xl text-base ${m.type === 'user' ? 'bg-rose-500 text-white' : 'bg-white shadow text-slate-700'}`}>{m.text}</div></div>))}</div><div className="p-5 border-t flex gap-3 bg-white"><input type="text" value={bugInput} onChange={(e) => setBugInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && bugInput) { setBugMessages([...bugMessages, { id: Date.now(), type: 'user', text: bugInput }]); setBugInput(''); }}} placeholder="Décrivez le bug..." className="flex-1 px-5 py-3 bg-slate-100 rounded-xl text-base focus:outline-none" /><button onClick={() => { if (bugInput) { setBugMessages([...bugMessages, { id: Date.now(), type: 'user', text: bugInput }]); setBugInput(''); }}} className="p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"><Send className="w-6 h-6" /></button></div></div></div>)}
      {showCreateAccount && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div className="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"><div className="flex justify-between items-center mb-8"><h3 className="text-3xl font-bold text-slate-800 flex items-center gap-4"><div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg"><UserCheck className="w-7 h-7 text-white" /></div>Créer un compte</h3><button onClick={() => setShowCreateAccount(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-7 h-7 text-slate-400" /></button></div><form onSubmit={(e) => { e.preventDefault(); alert('Compte créé ! Redirection vers le paiement...'); }} className="space-y-5"><div className="bg-slate-50 rounded-xl p-5 border border-slate-200"><h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-3"><Building2 className="w-6 h-6 text-indigo-600" />Informations entreprise</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="text" value={newAccount.company} onChange={(e) => setNewAccount({...newAccount, company: e.target.value})} placeholder="Nom de l'entreprise *" className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none" required /><input type="text" value={newAccount.siret} onChange={(e) => setNewAccount({...newAccount, siret: e.target.value})} placeholder="SIRET *" className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none" required /><input type="text" value={newAccount.address} onChange={(e) => setNewAccount({...newAccount, address: e.target.value})} placeholder="Adresse complète *" className="md:col-span-2 w-full px-5 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none" required /></div></div><div className="bg-slate-50 rounded-xl p-5 border border-slate-200"><h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-3"><Mail className="w-6 h-6 text-indigo-600" />Informations de contact</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="email" value={newAccount.email} onChange={(e) => setNewAccount({...newAccount, email: e.target.value})} placeholder="Email professionnel *" className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none" required /><input type="tel" value={newAccount.phone} onChange={(e) => setNewAccount({...newAccount, phone: e.target.value})} placeholder="Téléphone *" className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none" required /></div></div><div className="bg-slate-50 rounded-xl p-5 border border-slate-200"><h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-3"><Lock className="w-6 h-6 text-indigo-600" />Sécurité</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="password" value={newAccount.password} onChange={(e) => setNewAccount({...newAccount, password: e.target.value})} placeholder="Mot de passe *" className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none" required /><input type="password" value={newAccount.confirmPassword} onChange={(e) => setNewAccount({...newAccount, confirmPassword: e.target.value})} placeholder="Confirmer *" className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none" required /></div><p className="text-sm text-slate-500 mt-3">8 caractères min., 1 majuscule, 1 chiffre</p></div><div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200"><h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-3"><CreditCard className="w-6 h-6 text-indigo-600" />Paiement sécurisé</h4><div className="flex flex-wrap items-center gap-5 mb-4"><div className="flex items-center gap-3 text-base text-slate-600"><ShieldCheck className="w-6 h-6 text-emerald-500" /><span>Paiement 100% sécurisé via Stripe</span></div><div className="flex items-center gap-3 text-base text-slate-600"><CheckCircle className="w-6 h-6 text-emerald-500" /><span>Annulation à tout moment</span></div></div><p className="text-base text-slate-600 bg-white p-4 rounded-lg border border-slate-200">Après validation, vous serez redirigé vers notre plateforme de paiement sécurisée Stripe.</p></div><button type="submit" className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xl rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"><CreditCard className="w-7 h-7" />Créer mon compte et payer</button><p className="text-center text-base text-slate-500">En créant un compte, vous acceptez nos <a href="#" className="text-indigo-600 hover:underline">CGV</a> et notre <a href="#" className="text-indigo-600 hover:underline">politique de confidentialité</a>.</p></form></div></div>)}
      {showUserGuide && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div className="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"><div className="flex justify-between items-center mb-8"><h3 className="text-3xl font-bold text-slate-800 flex items-center gap-4"><div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg"><BookOpen className="w-7 h-7 text-white" /></div>Guide utilisateur</h3><button onClick={() => { setShowUserGuide(false); setGuideSection(null); }} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-7 h-7 text-slate-400" /></button></div><p className="text-slate-600 text-lg mb-5">Sélectionnez une rubrique pour afficher le guide correspondant :</p><div className="space-y-4"><div className="border-2 border-slate-200 rounded-xl overflow-hidden"><button onClick={() => setGuideSection(guideSection === 'import' ? null : 'import')} className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-all"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow"><Upload className="w-6 h-6 text-white" /></div><span className="font-bold text-slate-800 text-xl">Comment importer les données</span></div><ChevronDown className={`w-7 h-7 text-slate-400 transition-transform ${guideSection === 'import' ? 'rotate-180' : ''}`} /></button>{guideSection === 'import' && (<div className="p-5 bg-white border-t border-slate-200"><div className="space-y-5"><div className="flex items-start gap-4"><div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg flex-shrink-0">1</div><div><h4 className="font-bold text-slate-800 text-lg">Téléchargez les fichiers Excel modèles</h4><p className="text-slate-600 text-base">Rendez-vous dans Paramètres → Import/Export → Télécharger les modèles.</p></div></div><div className="flex items-start gap-4"><div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg flex-shrink-0">2</div><div><h4 className="font-bold text-slate-800 text-lg">Remplissez les fichiers avec vos données</h4><p className="text-slate-600 text-base">Complétez chaque fichier Excel avec vos données existantes.</p></div></div><div className="flex items-start gap-4"><div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg flex-shrink-0">3</div><div><h4 className="font-bold text-slate-800 text-lg">Importez vos fichiers</h4><p className="text-slate-600 text-base">Paramètres → Import/Export → Importer. Vérification automatique.</p></div></div></div></div>)}</div><div className="border-2 border-slate-200 rounded-xl overflow-hidden"><button onClick={() => setGuideSection(guideSection === 'params' ? null : 'params')} className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-all"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow"><Building2 className="w-6 h-6 text-white" /></div><span className="font-bold text-slate-800 text-xl">Saisir les paramètres de votre société</span></div><ChevronDown className={`w-7 h-7 text-slate-400 transition-transform ${guideSection === 'params' ? 'rotate-180' : ''}`} /></button>{guideSection === 'params' && (<div className="p-5 bg-white border-t border-slate-200"><div className="space-y-5"><div className="flex items-start gap-4"><div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">1</div><div><h4 className="font-bold text-slate-800 text-lg">Accédez aux paramètres</h4><p className="text-slate-600 text-base">Cliquez sur ⚙️ Paramètres → "Ma société".</p></div></div><div className="flex items-start gap-4"><div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">2</div><div><h4 className="font-bold text-slate-800 text-lg">Renseignez vos informations</h4><p className="text-slate-600 text-base">Raison sociale, SIRET, adresse, téléphone, email, logo.</p></div></div><div className="flex items-start gap-4"><div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">3</div><div><h4 className="font-bold text-slate-800 text-lg">Configurez vos préférences</h4><p className="text-slate-600 text-base">TVA, conditions de paiement, mentions légales.</p></div></div></div></div>)}</div><div className="border-2 border-slate-200 rounded-xl overflow-hidden"><button onClick={() => setGuideSection(guideSection === 'client' ? null : 'client')} className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-all"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow"><Users className="w-6 h-6 text-white" /></div><span className="font-bold text-slate-800 text-xl">Comment créer un client et un site</span></div><ChevronDown className={`w-7 h-7 text-slate-400 transition-transform ${guideSection === 'client' ? 'rotate-180' : ''}`} /></button>{guideSection === 'client' && (<div className="p-5 bg-white border-t border-slate-200"><div className="space-y-5"><div className="flex items-start gap-4"><div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg flex-shrink-0">1</div><div><h4 className="font-bold text-slate-800 text-lg">Créer un nouveau client</h4><p className="text-slate-600 text-base">Clients → + Nouveau client → Renseignez les infos.</p></div></div><div className="flex items-start gap-4"><div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg flex-shrink-0">2</div><div><h4 className="font-bold text-slate-800 text-lg">Ajouter un site au client</h4><p className="text-slate-600 text-base">Fiche client → onglet "Sites" → "+ Ajouter un site".</p></div></div><div className="flex items-start gap-4"><div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg flex-shrink-0">3</div><div><h4 className="font-bold text-slate-800 text-lg">Configurer le site</h4><p className="text-slate-600 text-base">Adresse, contact, codes d'accès, horaires.</p></div></div><div className="flex items-start gap-4"><div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg flex-shrink-0">4</div><div><h4 className="font-bold text-slate-800 text-lg">Ajouter des équipements</h4><p className="text-slate-600 text-base">Fiche site → Ajouter les équipements à maintenir.</p></div></div></div></div>)}</div></div><div className="mt-8 p-5 bg-cyan-50 rounded-xl border border-cyan-200"><p className="text-cyan-800 text-base flex items-center gap-3"><HelpCircle className="w-6 h-6 text-cyan-600" />D'autres guides seront ajoutés prochainement. Besoin d'aide ? Contactez le support.</p></div><button onClick={() => { setShowUserGuide(false); setGuideSection(null); }} className="w-full mt-5 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-xl hover:shadow-lg">Fermer le guide</button></div></div>)}
    </div>
  );
};

export default LandingPage;
