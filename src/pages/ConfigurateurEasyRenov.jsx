// ConfigurateurEasyRenov.jsx
// Landing Page FERRARI - Easy Renov
// Design : Luxury Futuristic avec animations premium

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Check, X, Play, Clock, Gift, Sparkles,
  Users, Building2, User, Briefcase, Wrench, UserCheck, Link2,
  Bot, FileSpreadsheet, Calendar, Smartphone, Monitor, Bell, ArrowRight, Lock,
  BarChart3, Timer, Upload, Download, WifiOff, ClipboardCheck, Flag, LogIn,
  FileCheck, Snowflake, Home, Sun, Wind, Zap, Calculator, Newspaper,
  MessageCircle, Phone, Mail, Shield, Award, TrendingUp, Target,
  Leaf, TreePine, CheckCircle2, Star, Flame, Eye, Volume2
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const CONFIG = {
  colors: {
    primary: '#6366f1',      // Indigo
    accent: '#10b981',       // Emerald (le V)
    dark: '#0f172a',         // Slate 900
    darker: '#020617',       // Slate 950
    gold: '#f59e0b',         // Amber pour premium
  },
  fonts: {
    display: "'Outfit', sans-serif",
    body: "'Inter', sans-serif",
  },
  
  // ═══════════════════════════════════════════════════════════════════
  // 🎁 OFFRE DE LANCEMENT - MODIFIE ICI POUR ACTIVER/DÉSACTIVER
  // ═══════════════════════════════════════════════════════════════════
  offreLancement: {
    active: true,              // ← TRUE = affichée, FALSE = masquée
    reduction: 15,             // ← Pourcentage de réduction (ex: 20 = -20%)
    dureeMinutes: 30,          // ← Durée du timer en minutes (ex: 15 = 15:00)
    titre: "OFFRE LANCEMENT",  // ← Titre affiché
  }
};

// ═══════════════════════════════════════════════════════════════════
// DONNÉES
// ═══════════════════════════════════════════════════════════════════

const PROFILS = [
  { id: 'installateur_rge', label: 'INSTALLATEUR RGE', sublabel: 'Qualifié travaux rénovation', icon: Award, color: 'emerald' },
  { id: 'mainteneur_sav', label: 'MAINTENEUR / SAV', sublabel: 'Entretien et dépannage', icon: Wrench, color: 'blue' },
  { id: 'artisan', label: 'ARTISAN INDÉPENDANT', sublabel: 'Multi-compétences', icon: User, color: 'amber' },
  { id: 'sous_traitant', label: 'SOUS-TRAITANT', sublabel: 'Donneurs d\'ordre', icon: Link2, color: 'violet' },
  { id: 'commercial', label: 'AGENT COMMERCIAL', sublabel: 'Vente et coordination', icon: Target, color: 'rose' },
];

const TAILLES = [
  { id: 'solo', label: 'INDÉPENDANT', sublabel: 'Je travaille seul', icon: User, users: 1 },
  { id: 'petite', label: 'PETITE ÉQUIPE', sublabel: '2 à 5 personnes', icon: Users, users: 5 },
  { id: 'moyenne', label: 'ÉQUIPE MOYENNE', sublabel: '6 à 15 personnes', icon: Briefcase, users: 15 },
  { id: 'grande', label: 'GRANDE STRUCTURE', sublabel: 'Plus de 15 personnes', icon: Building2, users: 999 },
];

const GESTIONS = [
  { id: 'papier', label: 'PAPIER / CARNETS', sublabel: 'Fiches, bons d\'intervention', icon: ClipboardCheck, emoji: '📝' },
  { id: 'excel', label: 'EXCEL / TABLEUR', sublabel: 'Fichiers sur ordinateur', icon: FileSpreadsheet, emoji: '📊' },
  { id: 'logiciel', label: 'LOGICIEL EXISTANT', sublabel: 'Déjà équipé mais pas satisfait', icon: Monitor, emoji: '💻' },
  { id: 'rien', label: 'RIEN DE STRUCTURÉ', sublabel: 'Mémoire, notes, SMS...', icon: MessageCircle, emoji: '🤷' },
];

const BESOINS = [
  { id: 'structurer', label: 'Me structurer / M\'organiser', icon: Target },
  { id: 'conformite', label: 'Être conforme réglementation', icon: Shield },
  { id: 'temps', label: 'Gagner du temps administratif', icon: Clock },
  { id: 'primes', label: 'Simuler les primes clients', icon: Calculator },
  { id: 'terrain', label: 'Suivre mes chantiers terrain', icon: Smartphone },
  { id: 'facturer', label: 'Facturer plus facilement', icon: FileCheck },
];

const ACTIVITES = [
  { id: 'pac', label: 'POMPES À CHALEUR', sublabel: 'Air/Air, Air/Eau, Géothermie', icon: Snowflake, color: 'cyan', rapports: ['Installation PAC', 'Mise en service', 'Entretien', 'Dépannage'] },
  { id: 'isolation', label: 'ISOLATION', sublabel: 'Combles, Murs, Planchers, ITE', icon: Home, color: 'emerald', rapports: ['Pose isolation', 'Attestation', 'Dossier CEE'] },
  { id: 'menuiseries', label: 'MENUISERIES EXT.', sublabel: 'Fenêtres, Portes, Volets', icon: Sun, color: 'amber', rapports: ['Pose menuiseries', 'Attestation'] },
  { id: 'cet', label: 'CHAUFFE-EAU THERMO', sublabel: 'Installation, Entretien', icon: Flame, color: 'orange', rapports: ['Installation CET', 'Mise en service', 'SAV'] },
  { id: 'vmc', label: 'VMC / VENTILATION', sublabel: 'Simple flux, Double flux', icon: Wind, color: 'sky', rapports: ['Installation VMC', 'Entretien VMC'] },
  { id: 'pv', label: 'PHOTOVOLTAÏQUE', sublabel: 'Panneaux solaires', icon: Zap, color: 'yellow', rapports: ['Installation PV', 'Consuel'] },
];

const PACKS = [
  { id: 'ia', label: 'ASSISTANT IA', sublabel: 'Correction automatique des rapports', prix: 5, icon: Bot, color: 'violet', popular: true },
  { id: 'simulateur', label: 'SIMULATEUR PRIMES', sublabel: 'CEE + MaPrimeRénov automatique', prix: 10, icon: Calculator, color: 'emerald' },
  { id: 'compta', label: 'EXPORT COMPTABLE', sublabel: 'Envoi auto Sage, EBP, Ciel', prix: 10, icon: FileSpreadsheet, color: 'blue' },
  { id: 'veille', label: 'VEILLE RÉGLEMENTAIRE', sublabel: 'Alertes mises à jour normes', prix: 5, icon: Newspaper, color: 'amber' },
];

// ═══════════════════════════════════════════════════════════════════
// ALGORITHME DE RECOMMANDATION
// ═══════════════════════════════════════════════════════════════════

const calculerRecommandation = (reponses) => {
  let score = 0;
  let packsSuggeres = [];
  let message = '';

  // Profil
  if (reponses.profil === 'installateur_rge') { score += 20; packsSuggeres.push('simulateur'); message = 'Solution complète installateur RGE'; }
  else if (reponses.profil === 'mainteneur_sav') { score += 5; message = 'Optimisez vos tournées SAV'; }
  else if (reponses.profil === 'artisan') { score += 10; packsSuggeres.push('ia'); message = 'Gérez tout depuis votre smartphone'; }
  else if (reponses.profil === 'sous_traitant') { score += 15; packsSuggeres.push('compta'); message = 'Rapports conformes pour vos donneurs d\'ordre'; }
  else if (reponses.profil === 'commercial') { score += 20; packsSuggeres.push('simulateur'); message = 'Convertissez plus de prospects'; }

  // Taille
  if (reponses.taille === 'petite') score += 15;
  else if (reponses.taille === 'moyenne') score += 30;
  else if (reponses.taille === 'grande') score += 50;

  // Besoins
  if (reponses.besoins?.includes('primes') && !packsSuggeres.includes('simulateur')) packsSuggeres.push('simulateur');
  if (reponses.besoins?.includes('temps') && !packsSuggeres.includes('ia')) packsSuggeres.push('ia');
  if (reponses.besoins?.includes('facturer') && !packsSuggeres.includes('compta')) packsSuggeres.push('compta');
  if (reponses.besoins?.includes('conformite')) packsSuggeres.push('veille');

  // Formule
  let formule = 'starter', prixBase = 29;
  if (score >= 40) { formule = 'premium'; prixBase = 79; }
  else if (score >= 20) { formule = 'pro'; prixBase = 49; }

  // Prix packs
  const prixPacks = packsSuggeres.reduce((acc, p) => {
    const pack = PACKS.find(x => x.id === p);
    return acc + (pack?.prix || 0);
  }, 0);

  const prixTotal = prixBase + prixPacks;
  const prixPromo = Math.round(prixTotal * 0.8);

  // Rapports selon activités
  const rapports = reponses.activites?.flatMap(actId => {
    const act = ACTIVITES.find(a => a.id === actId);
    return act?.rapports || [];
  }) || [];

  return { formule, prixBase, prixPacks, prixTotal, prixPromo, packsSuggeres, message, rapports: [...new Set(rapports)] };
};

// ═══════════════════════════════════════════════════════════════════
// COMPOSANTS UI PREMIUM
// ═══════════════════════════════════════════════════════════════════

// Particules flottantes
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${5 + Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

// Logo animé Easy Renov - E blanc + V illuminé spectaculaire + zoom/dézoom
const Logo = ({ size = 'normal' }) => {
  const sizes = {
    small: { container: 'w-12 h-12', text: 'text-2xl' },
    normal: { container: 'w-20 h-20', text: 'text-4xl' },
    large: { container: 'w-32 h-32', text: 'text-6xl' },
    hero: { container: 'w-40 h-40', text: 'text-7xl' },
  };
  const s = sizes[size];

  return (
    <div className={`relative ${s.container} group`}>
      {/* Glow effect pulsant */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-3xl blur-xl opacity-60"
        style={{ animation: 'glowPulse 2s ease-in-out infinite' }}
      />
      
      {/* Main container avec zoom/dézoom */}
      <div 
        className={`relative ${s.container} bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 overflow-hidden`}
        style={{ animation: 'zoomBreath 3s ease-in-out infinite' }}
      >
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
        
        {/* E + V illuminé */}
        <div className={`relative z-10 ${s.text} font-black tracking-tight flex items-center justify-center`}>
          <span className="text-white">E</span>
          {/* V ILLUMINÉ SPECTACULAIRE */}
          <span 
            className="text-emerald-400 relative"
            style={{ 
              animation: 'vGlowSpectacular 1.5s ease-in-out infinite',
              textShadow: '0 0 10px #34d399, 0 0 20px #34d399, 0 0 40px #10b981, 0 0 60px #10b981, 0 0 80px #059669'
            }}
          >
            V
            {/* Effet de lumière rayonnante derrière le V */}
            <span 
              className="absolute inset-0 text-emerald-300 blur-sm"
              style={{ animation: 'vRayPulse 1.5s ease-in-out infinite' }}
            >
              V
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

// Titre animé - V en MAJUSCULE, vert, 1 taille au-dessus, dynamique
const AnimatedTitle = () => (
  <h1 className="relative">
    <span className="flex items-baseline justify-center text-6xl md:text-8xl font-black tracking-tight">
      <span className="text-white">Easy</span>
      <span className="text-white ml-3">Reno</span>
      {/* V MAJUSCULE - vert - plus grand - dynamique */}
      <span 
        className="text-7xl md:text-9xl text-emerald-400 font-black ml-0"
        style={{ 
          textShadow: '0 0 30px rgba(52, 211, 153, 0.7), 0 0 60px rgba(52, 211, 153, 0.4)',
          animation: 'pulseV 2s ease-in-out infinite'
        }}
      >
        V
      </span>
    </span>
    {/* Ligne de soulignement animée */}
    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-shimmer" />
  </h1>
);

// Bouton premium
const PremiumButton = ({ children, onClick, variant = 'primary', size = 'large', disabled, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 text-slate-900 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50',
    secondary: 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20',
    ghost: 'text-white/70 hover:text-white hover:bg-white/10',
  };
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-2xl font-bold transition-all duration-300
        ${variants[variant]} ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
        ${className}
      `}
    >
      {/* Shine effect */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      )}
      <span className="relative z-10 flex items-center justify-center gap-3">{children}</span>
    </button>
  );
};

// Card de sélection
const SelectCard = ({ selected, onClick, icon: Icon, label, sublabel, color = 'indigo', badge, disabled }) => {
  const colors = {
    indigo: 'from-indigo-500 to-purple-600',
    emerald: 'from-emerald-500 to-teal-600',
    blue: 'from-blue-500 to-cyan-600',
    amber: 'from-amber-500 to-orange-600',
    violet: 'from-violet-500 to-purple-600',
    rose: 'from-rose-500 to-pink-600',
    cyan: 'from-cyan-500 to-blue-600',
    orange: 'from-orange-500 to-red-600',
    sky: 'from-sky-500 to-blue-600',
    yellow: 'from-yellow-500 to-amber-600',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full p-5 rounded-2xl text-left transition-all duration-300 group
        ${selected 
          ? 'bg-gradient-to-br ' + colors[color] + ' shadow-2xl scale-[1.02]' 
          : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {/* Badge populaire */}
      {badge && (
        <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-xs font-black rounded-full shadow-lg">
          {badge}
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Icône */}
        <div className={`
          w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300
          ${selected 
            ? 'bg-white/20' 
            : 'bg-gradient-to-br ' + colors[color] + '/20'
          }
        `}>
          <Icon className={`w-7 h-7 ${selected ? 'text-white' : 'text-' + color + '-400'}`} />
        </div>

        {/* Texte */}
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-lg ${selected ? 'text-white' : 'text-white'}`}>
            {label}
          </p>
          {sublabel && (
            <p className={`text-sm ${selected ? 'text-white/80' : 'text-white/50'}`}>
              {sublabel}
            </p>
          )}
        </div>

        {/* Check */}
        {selected && (
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <Check className="w-5 h-5 text-emerald-600" />
          </div>
        )}
      </div>
    </button>
  );
};

// Checkbox card pour multi-sélection
const CheckboxCard = ({ checked, onClick, icon: Icon, label, color = 'emerald' }) => (
  <button
    onClick={onClick}
    className={`
      relative p-4 rounded-xl text-left transition-all duration-300 flex items-center gap-3
      ${checked 
        ? 'bg-emerald-500/20 border-2 border-emerald-400' 
        : 'bg-white/5 border-2 border-transparent hover:border-white/20'
      }
    `}
  >
    {/* Checkbox */}
    <div className={`
      w-6 h-6 rounded-lg flex items-center justify-center transition-all
      ${checked ? 'bg-emerald-500' : 'bg-white/10 border border-white/30'}
    `}>
      {checked && <Check className="w-4 h-4 text-white" />}
    </div>

    {/* Icône + Label */}
    <Icon className={`w-5 h-5 ${checked ? 'text-emerald-400' : 'text-white/50'}`} />
    <span className={`font-medium ${checked ? 'text-white' : 'text-white/70'}`}>{label}</span>
  </button>
);

// Progress bar
const ProgressBar = ({ step, total = 5 }) => (
  <div className="w-full">
    <div className="flex items-center justify-between mb-2">
      <span className="text-white/50 text-sm font-medium">ÉTAPE {step}/{total}</span>
      <span className="text-emerald-400 text-sm font-bold">{Math.round((step/total)*100)}%</span>
    </div>
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
        style={{ width: `${(step/total)*100}%` }}
      />
    </div>
  </div>
);

// Timer offre flash
const useTimer = (seconds = 900) => {
  const [time, setTime] = useState(seconds);
  useEffect(() => {
    if (time <= 0) return;
    const t = setInterval(() => setTime(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [time]);
  return { 
    minutes: Math.floor(time / 60), 
    seconds: time % 60, 
    display: `${Math.floor(time/60)}:${(time%60).toString().padStart(2,'0')}`,
    urgent: time < 300,
    active: time > 0
  };
};

// ═══════════════════════════════════════════════════════════════════
// ÉCRANS
// ═══════════════════════════════════════════════════════════════════

// ÉCRAN ACCUEIL HERO
const HeroScreen = ({ onStart, onLogin }) => {
  const features = [
    { icon: Smartphone, label: '2 Applications', sublabel: 'Terrain + Bureau' },
    { icon: ClipboardCheck, label: 'Rapports RGE', sublabel: 'Conformes & spécialisés' },
    { icon: Calculator, label: 'Simulateur Primes', sublabel: 'CEE + MaPrimeRénov' },
    { icon: FileCheck, label: 'Devis / Factures', sublabel: 'Génération automatique' },
    { icon: Calendar, label: 'Planning intelligent', sublabel: 'Gestion tech / STT' },
    { icon: Bell, label: 'Alertes automatiques', sublabel: 'Relances, échéances' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <Particles />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="small" />
          <span className="text-white font-bold text-xl hidden sm:block">Easy Renov</span>
        </div>
        <button
          onClick={onLogin}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/10 transition-all text-white font-semibold"
        >
          <LogIn className="w-5 h-5" />
          <span className="hidden sm:inline">ESPACE CLIENT</span>
        </button>
      </header>

      {/* Hero content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <Logo size="hero" />
          <div className="mt-8">
            <AnimatedTitle />
          </div>
          <p className="mt-6 text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            La plateforme <span className="text-white font-semibold">tout-en-un</span> pour les professionnels 
            de la <span className="text-emerald-400 font-semibold">rénovation énergétique</span>
          </p>
        </div>

        {/* Features grid - 6 icônes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl w-full mb-10">
          {features.map((f, i) => (
            <div 
              key={i}
              className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-center group hover:bg-white/10 transition-all"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-white font-bold text-sm">{f.label}</p>
              <p className="text-white/50 text-xs mt-1">{f.sublabel}</p>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            BLOC INCITATIF - Texte au-dessus du CTA
            ═══════════════════════════════════════════════════════════════ */}
        <div className="max-w-2xl w-full mb-8 text-center animate-pulseGlow rounded-2xl p-6 bg-gradient-to-r from-white/5 via-emerald-500/10 to-white/5 border border-emerald-500/20">
          {/* Profils */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {['INSTALLATEUR', 'MAINTENEUR', 'ARTISAN', 'SOUS-TRAITANT', 'AGENT CO'].map((profil, i) => (
              <span 
                key={i}
                className="px-3 py-1 bg-white/10 rounded-full text-white font-bold text-sm border border-white/20"
              >
                {profil}
              </span>
            ))}
          </div>
          
          {/* Texte explicatif */}
          <p className="text-white/90 text-lg md:text-xl leading-relaxed">
            <span className="text-emerald-400 font-semibold">Accédez à nos offres</span> en suivant le configurateur interactif,
            <br className="hidden md:block" />
            <span className="text-white font-medium"> nous identifions vos besoins</span> et vous proposons 
            <span className="text-emerald-400 font-semibold"> la solution adaptée</span>.
          </p>
          
          {/* Flèche animée vers le bouton */}
          <div className="mt-4 flex justify-center">
            <ChevronRight className="w-6 h-6 text-emerald-400 animate-bounce rotate-90" />
          </div>
        </div>

        {/* CTA */}
        <PremiumButton onClick={onStart} size="xl" className="min-w-[320px]">
          <Sparkles className="w-6 h-6" />
          CONFIGURER MA SOLUTION
          <ChevronRight className="w-6 h-6" />
        </PremiumButton>

        <p className="mt-4 text-white/40 text-sm">
          ⚡ 5 questions • 90 secondes • Sans engagement
        </p>
      </main>

      {/* Footer badges + mentions légales */}
      <footer className="relative z-10 p-6">
        <div className="flex flex-col items-center gap-4">
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-blue-400" />
              <span>🇫🇷 Hébergé en France</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Données sécurisées</span>
              </div>
              <span className="text-white/30 text-xs">RGPD • Import/Export client</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-rose-400" />
              <span>Sans engagement</span>
            </div>
          </div>
          
          {/* Mentions légales et CGV */}
          <div className="flex items-center gap-4 text-white/30 text-xs">
            <a href="/mentions-legales" className="hover:text-white/60 transition-colors underline">
              Mentions légales
            </a>
            <span>•</span>
            <a href="/cgv" className="hover:text-white/60 transition-colors underline">
              Conditions Générales de Vente
            </a>
          </div>
        </div>
      </footer>

      {/* Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes grow {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.2); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes zoomBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes vGlowSpectacular {
          0%, 100% { 
            text-shadow: 0 0 10px #34d399, 0 0 20px #34d399, 0 0 40px #10b981, 0 0 60px #10b981, 0 0 80px #059669;
            transform: scale(1);
          }
          50% { 
            text-shadow: 0 0 20px #34d399, 0 0 40px #34d399, 0 0 60px #10b981, 0 0 80px #10b981, 0 0 100px #059669, 0 0 120px #047857;
            transform: scale(1.1);
          }
        }
        @keyframes vRayPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseV {
          0%, 100% { 
            transform: scale(1) translateY(0);
            text-shadow: 0 0 30px rgba(52, 211, 153, 0.7), 0 0 60px rgba(52, 211, 153, 0.4);
          }
          50% { 
            transform: scale(1.05) translateY(-5px);
            text-shadow: 0 0 40px rgba(52, 211, 153, 0.9), 0 0 80px rgba(52, 211, 153, 0.6);
          }
        }
        @keyframes flyV {
          0%, 100% { 
            transform: translateY(-5px) rotate(-2deg); 
            filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.5));
          }
          50% { 
            transform: translateY(-15px) rotate(2deg); 
            filter: drop-shadow(0 0 40px rgba(16, 185, 129, 0.8));
          }
        }
        @keyframes logoV {
          0%, 100% { 
            transform: scale(1) rotate(0deg); 
            filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.5));
          }
          50% { 
            transform: scale(1.05) rotate(2deg); 
            filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.8));
          }
        }
        @keyframes leafPulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.9;
            transform: scale(1.05);
          }
        }
        @keyframes treeGrow {
          0%, 100% { 
            transform: translateX(-50%) scale(1); 
            opacity: 1;
          }
          50% { 
            transform: translateX(-50%) scale(1.15); 
            opacity: 1;
          }
        }
        @keyframes leafAppear1 {
          0%, 100% { 
            transform: rotate(-15deg) scale(1); 
            opacity: 0.8;
          }
          50% { 
            transform: rotate(-25deg) scale(1.2); 
            opacity: 1;
          }
        }
        @keyframes leafAppear2 {
          0%, 100% { 
            transform: rotate(15deg) scale(1); 
            opacity: 0.8;
          }
          50% { 
            transform: rotate(25deg) scale(1.2); 
            opacity: 1;
          }
        }
        @keyframes pulseGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
          }
          50% { 
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.3);
          }
        }
        @keyframes floatV {
          0%, 100% { 
            transform: translateY(0) rotate(0deg);
          }
          25% { 
            transform: translateY(-8px) rotate(2deg);
          }
          75% { 
            transform: translateY(-4px) rotate(-1deg);
          }
        }
        .animate-float { animation: float 10s infinite ease-in-out; }
        .animate-shimmer { animation: shimmer 3s infinite; }
        .animate-sway { animation: sway 2s infinite ease-in-out; }
        .animate-grow { animation: grow 2s infinite ease-in-out; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 4s infinite; }
        .animate-flyV { animation: flyV 3s infinite ease-in-out; }
        .animate-logoV { animation: logoV 2s infinite ease-in-out; }
        .animate-leafPulse { animation: leafPulse 2s infinite ease-in-out; }
        .animate-treeGrow { animation: treeGrow 2.5s infinite ease-in-out; }
        .animate-leafAppear1 { animation: leafAppear1 2s infinite ease-in-out 0.3s; }
        .animate-leafAppear2 { animation: leafAppear2 2s infinite ease-in-out 0.6s; }
        .animate-pulseGlow { animation: pulseGlow 3s infinite ease-in-out; }
        .animate-floatV { animation: floatV 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

// QUESTION 1 : Profil
const Step1Profil = ({ value, onChange, onNext, onBack }) => (
  <StepLayout step={1} title="VOUS ÊTES..." subtitle="Sélectionnez votre profil" onBack={onBack}>
    <div className="space-y-3">
      {PROFILS.map(p => (
        <SelectCard
          key={p.id}
          selected={value === p.id}
          onClick={() => onChange(p.id)}
          icon={p.icon}
          label={p.label}
          sublabel={p.sublabel}
          color={p.color}
        />
      ))}
    </div>
    <StepFooter onNext={onNext} disabled={!value} />
  </StepLayout>
);

// QUESTION 2 : Taille
const Step2Taille = ({ value, onChange, onNext, onBack }) => (
  <StepLayout step={2} title="VOTRE STRUCTURE" subtitle="Combien de personnes ?" onBack={onBack}>
    <div className="space-y-3">
      {TAILLES.map(t => (
        <SelectCard
          key={t.id}
          selected={value === t.id}
          onClick={() => onChange(t.id)}
          icon={t.icon}
          label={t.label}
          sublabel={t.sublabel}
          color="indigo"
        />
      ))}
    </div>
    
    {/* Info box */}
    <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-bold">+</span>
          <Monitor className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-emerald-400 font-bold text-sm">2 APPS PAR UTILISATEUR</p>
          <p className="text-emerald-400/70 text-xs">App Terrain + App Bureau incluses</p>
        </div>
      </div>
    </div>
    
    <StepFooter onNext={onNext} disabled={!value} />
  </StepLayout>
);

// QUESTION 3 : Gestion actuelle
const Step3Gestion = ({ value, onChange, onNext, onBack }) => (
  <StepLayout step={3} title="ACTUELLEMENT..." subtitle="Comment gérez-vous votre activité ?" onBack={onBack}>
    <div className="space-y-3">
      {GESTIONS.map(g => (
        <SelectCard
          key={g.id}
          selected={value === g.id}
          onClick={() => onChange(g.id)}
          icon={g.icon}
          label={g.label}
          sublabel={g.sublabel}
          color="indigo"
        />
      ))}
    </div>
    
    {/* Info import Excel */}
    {value === 'excel' && (
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl animate-fadeIn">
        <div className="flex items-center gap-3">
          <Upload className="w-6 h-6 text-blue-400" />
          <div>
            <p className="text-blue-400 font-bold">BONNE NOUVELLE !</p>
            <p className="text-blue-400/70 text-sm">On importe vos données Excel en 1 clic</p>
          </div>
        </div>
      </div>
    )}
    
    <StepFooter onNext={onNext} disabled={!value} />
  </StepLayout>
);

// QUESTION 4 : Besoins (multi-select)
const Step4Besoins = ({ values = [], onChange, onNext, onBack }) => {
  const toggle = (id) => {
    if (values.includes(id)) {
      onChange(values.filter(x => x !== id));
    } else {
      onChange([...values, id]);
    }
  };

  return (
    <StepLayout step={4} title="VOS BESOINS" subtitle="Plusieurs choix possibles" onBack={onBack}>
      <div className="grid grid-cols-1 gap-3">
        {BESOINS.map(b => (
          <CheckboxCard
            key={b.id}
            checked={values.includes(b.id)}
            onClick={() => toggle(b.id)}
            icon={b.icon}
            label={b.label}
          />
        ))}
      </div>
      <StepFooter onNext={onNext} disabled={values.length === 0} label="CONTINUER" />
    </StepLayout>
  );
};

// QUESTION 5 : Activités (multi-select)
const Step5Activites = ({ values = [], onChange, onNext, onBack }) => {
  const toggle = (id) => {
    if (values.includes(id)) {
      onChange(values.filter(x => x !== id));
    } else {
      onChange([...values, id]);
    }
  };

  return (
    <StepLayout step={5} title="VOS ACTIVITÉS" subtitle="Sélectionnez vos domaines" onBack={onBack}>
      <div className="grid grid-cols-1 gap-3">
        {ACTIVITES.map(a => (
          <div key={a.id}>
            <SelectCard
              selected={values.includes(a.id)}
              onClick={() => toggle(a.id)}
              icon={a.icon}
              label={a.label}
              sublabel={a.sublabel}
              color={a.color}
            />
            {/* Rapports inclus */}
            {values.includes(a.id) && (
              <div className="mt-2 ml-4 flex flex-wrap gap-2 animate-fadeIn">
                {a.rapports.map((r, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-xs text-white/70">
                    {r}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <StepFooter onNext={onNext} disabled={values.length === 0} label="VOIR MA SOLUTION" final />
    </StepLayout>
  );
};

// LAYOUT pour les étapes
const StepLayout = ({ step, title, subtitle, onBack, children }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col relative overflow-hidden">
    <Particles />
    
    {/* Header */}
    <header className="relative z-10 p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <Logo size="small" />
      </div>
      <ProgressBar step={step} />
    </header>

    {/* Content */}
    <main className="flex-1 px-6 pb-32 overflow-y-auto relative z-10">
      <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{title}</h1>
      <p className="text-white/50 mb-8">{subtitle}</p>
      {children}
    </main>

    <style jsx>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
    `}</style>
  </div>
);

// Footer avec bouton continuer
const StepFooter = ({ onNext, disabled, label = 'CONTINUER', final = false }) => (
  <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20">
    <PremiumButton onClick={onNext} disabled={disabled} className="w-full" variant={final ? 'primary' : 'primary'}>
      {label}
      {final ? <Sparkles className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
    </PremiumButton>
  </div>
);

// ÉCRAN RÉCAPITULATIF
const RecapScreen = ({ reponses, onBack, onSubscribe, onDemo, onTrial }) => {
  const reco = calculerRecommandation(reponses);
  
  // Timer basé sur la config
  const timer = useTimer(CONFIG.offreLancement.dureeMinutes * 60);
  
  // Offre active seulement si config.active ET timer pas expiré
  const offreActive = CONFIG.offreLancement.active && timer.active;
  
  const activitesSelectionnees = ACTIVITES.filter(a => reponses.activites?.includes(a.id));
  
  // État local pour les packs sélectionnés (initialisé avec les packs suggérés)
  const [packsSelectionnes, setPacksSelectionnes] = useState(reco.packsSuggeres);
  
  // Toggle un pack
  const togglePack = (packId) => {
    setPacksSelectionnes(prev => 
      prev.includes(packId) 
        ? prev.filter(id => id !== packId) 
        : [...prev, packId]
    );
  };
  
  // Calcul du prix avec les packs sélectionnés
  const prixPacks = packsSelectionnes.reduce((acc, packId) => {
    const pack = PACKS.find(p => p.id === packId);
    return acc + (pack?.prix || 0);
  }, 0);
  const prixTotal = reco.prixBase + prixPacks;
  
  // Prix promo basé sur la config (ex: 20% = 0.8)
  const tauxReduction = (100 - CONFIG.offreLancement.reduction) / 100;
  const prixPromo = Math.round(prixTotal * tauxReduction);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col relative overflow-hidden">
      <Particles />
      
      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <Logo size="small" />
      </header>

      {/* Content */}
      <main className="flex-1 px-6 pb-8 overflow-y-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-2xl shadow-emerald-500/30">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white">VOTRE SOLUTION</h1>
          <p className="text-white/50 mt-2">{reco.message}</p>
        </div>

        {/* Carte principale */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden mb-6">
          {/* Header formule */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium">FORMULE RECOMMANDÉE</p>
                <h2 className="text-4xl font-black text-white uppercase">{reco.formule}</h2>
              </div>
              <div className="text-right">
                <p className="text-5xl font-black text-white">{reco.prixBase}€</p>
                <p className="text-indigo-200">/mois HT</p>
              </div>
            </div>
          </div>

          {/* Activités sélectionnées */}
          <div className="p-6 border-b border-white/10">
            <p className="text-white/50 text-sm font-bold mb-4">VOS ACTIVITÉS</p>
            <div className="flex flex-wrap gap-2">
              {activitesSelectionnees.map(a => {
                const Icon = a.icon;
                return (
                  <div key={a.id} className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-${a.color}-500/20 border border-${a.color}-500/30`}>
                    <Icon className={`w-5 h-5 text-${a.color}-400`} />
                    <span className="text-white font-medium text-sm">{a.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rapports inclus */}
          <div className="p-6 border-b border-white/10 bg-emerald-500/5">
            <p className="text-emerald-400 text-sm font-bold mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5" />
              {reco.rapports.length} RAPPORTS SPÉCIALISÉS INCLUS
            </p>
            <div className="flex flex-wrap gap-2">
              {reco.rapports.map((r, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/10 rounded-lg text-sm text-white/80">{r}</span>
              ))}
            </div>
          </div>

          {/* Packs - TOUS affichés avec checkbox */}
          <div className="p-6 border-b border-white/10">
            <p className="text-white/50 text-sm font-bold mb-4">PACKS ADDITIONNELS <span className="text-white/30 font-normal">(cliquez pour ajouter/retirer)</span></p>
            <div className="space-y-3">
              {PACKS.map(p => {
                const Icon = p.icon;
                const isSelected = packsSelectionnes.includes(p.id);
                const isRecommended = reco.packsSuggeres.includes(p.id);
                return (
                  <button 
                    key={p.id} 
                    onClick={() => togglePack(p.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                      isSelected 
                        ? 'bg-emerald-500/20 border-2 border-emerald-400' 
                        : 'bg-white/5 border-2 border-transparent hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        isSelected ? 'bg-emerald-500' : 'bg-white/10 border border-white/30'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-emerald-400' : 'text-white/50'}`} />
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold ${isSelected ? 'text-white' : 'text-white/70'}`}>{p.label}</p>
                          {isRecommended && (
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
                              Recommandé
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${isSelected ? 'text-white/70' : 'text-white/40'}`}>{p.sublabel}</p>
                      </div>
                    </div>
                    <span className={`font-black ${isSelected ? 'text-emerald-400' : 'text-white/50'}`}>+{p.prix}€</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total dynamique */}
          <div className="p-6 bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white/70 font-bold">TOTAL MENSUEL</span>
                {packsSelectionnes.length > 0 && (
                  <p className="text-white/40 text-xs">
                    {reco.prixBase}€ + {prixPacks}€ de packs
                  </p>
                )}
              </div>
              <span className="text-3xl font-black text-white">{prixTotal}€<span className="text-lg text-white/50">/mois</span></span>
            </div>
          </div>
        </div>

        {/* Offre flash - recalcul en temps réel - Contrôlée par CONFIG.offreLancement */}
        {offreActive && (
          <div key={`promo-${prixTotal}`} className="bg-gradient-to-r from-rose-600 to-orange-500 rounded-3xl p-6 mb-6 relative overflow-hidden">
            {/* Animated bg */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Gift className="w-7 h-7 text-white" />
                  <span className="text-white font-black text-xl">{CONFIG.offreLancement.titre}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full ${timer.urgent ? 'animate-pulse' : ''}`}>
                  <Timer className="w-5 h-5 text-white" />
                  <span className="font-mono font-black text-white text-lg">{timer.display}</span>
                </div>
              </div>

              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-white/60 text-lg line-through">{prixTotal}€/mois</p>
                  <p className="text-5xl font-black text-white">{prixPromo}€<span className="text-xl">/mois</span></p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-white font-black text-lg mb-1">-{CONFIG.offreLancement.reduction}%</div>
                  <p className="text-white/80">💰 Économie: {(prixTotal - prixPromo) * 12}€/an</p>
                </div>
              </div>

              <button
                onClick={onSubscribe}
                className="w-full py-5 bg-white text-rose-600 font-black text-xl rounded-2xl hover:bg-white/90 transition-all active:scale-[0.98] shadow-2xl"
              >
                🚀 SOUSCRIRE À {prixPromo}€/MOIS
              </button>
            </div>
          </div>
        )}

        {/* Nos engagements */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
          <p className="text-white font-bold mb-4">✨ NOS ENGAGEMENTS</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Flag, label: '🇫🇷 Hébergé en France', color: 'blue' },
              { icon: Lock, label: 'Données sécurisées', color: 'emerald' },
              { icon: X, label: 'Sans engagement', color: 'rose' },
              { icon: ClipboardCheck, label: 'Rapports conformes', color: 'amber' },
              { icon: Smartphone, label: '2 Applications', color: 'violet' },
              { icon: MessageCircle, label: 'Support < 24h', color: 'cyan' },
            ].map((e, i) => (
              <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                <e.icon className={`w-4 h-4 text-${e.color}-400`} />
                <span>{e.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Boutons secondaires */}
        <div className="space-y-3">
          <PremiumButton onClick={onDemo} variant="secondary" className="w-full">
            <Play className="w-5 h-5" />
            VOIR LA DÉMO VIDÉO
          </PremiumButton>
          
          <PremiumButton onClick={onTrial} variant="ghost" className="w-full">
            <Clock className="w-5 h-5" />
            ESSAI GRATUIT 48H SANS CB
          </PremiumButton>
        </div>

        {/* Chat */}
        <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-white font-bold mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            Une question ?
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tapez votre message..."
              className="flex-1 px-4 py-3 bg-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="px-4 py-3 bg-emerald-500 rounded-xl text-white font-bold hover:bg-emerald-400 transition-all">
              Envoyer
            </button>
          </div>
          <p className="text-white/40 text-sm mt-3 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Ou appelez-nous : 01 XX XX XX XX
          </p>
        </div>
      </main>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
      `}</style>
    </div>
  );
};

// MODAL LOGIN avec Firebase Auth
const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Import dynamique de Firebase auth
      const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
      const auth = getAuth();
      
      await signInWithEmailAndPassword(auth, email, password);
      
      // Succès → redirection vers dashboard
      onLoginSuccess();
    } catch (err) {
      console.error('Erreur login:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email ou mot de passe incorrect');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Trop de tentatives, réessayez plus tard');
      } else {
        setError('Erreur de connexion, veuillez réessayer');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      <div className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white">CONNEXION</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Message d'erreur */}
          {error && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-300 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-white/70 text-sm font-bold mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-4 py-4 bg-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm font-bold mb-2">MOT DE PASSE</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-4 bg-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              required
              disabled={loading}
            />
          </div>

          <PremiumButton type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                CONNEXION...
              </>
            ) : (
              'SE CONNECTER'
            )}
          </PremiumButton>

          <button 
            type="button"
            className="w-full text-center text-emerald-400 font-medium py-2 hover:text-emerald-300"
          >
            Mot de passe oublié ?
          </button>
        </form>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

const ConfigurateurEasyRenov = () => {
  const [screen, setScreen] = useState('hero');
  const [showLogin, setShowLogin] = useState(false);
  const [reponses, setReponses] = useState({
    profil: null,
    taille: null,
    gestion: null,
    besoins: [],
    activites: [],
  });

  const updateReponse = (key, value) => setReponses(prev => ({ ...prev, [key]: value }));

  const handleSubscribe = () => alert('Redirection vers Stripe...');
  const handleDemo = () => alert('Ouverture vidéo démo...');
  const handleTrial = () => alert('Demande essai envoyée !');
  
  // Redirection après login réussi
  const handleLoginSuccess = () => {
    setShowLogin(false);
    // Redirection vers le dashboard
    window.location.href = '/dashboard';
  };

  const renderScreen = () => {
    switch (screen) {
      case 'hero':
        return <HeroScreen onStart={() => setScreen('step1')} onLogin={() => setShowLogin(true)} />;
      case 'step1':
        return <Step1Profil value={reponses.profil} onChange={v => updateReponse('profil', v)} onNext={() => setScreen('step2')} onBack={() => setScreen('hero')} />;
      case 'step2':
        return <Step2Taille value={reponses.taille} onChange={v => updateReponse('taille', v)} onNext={() => setScreen('step3')} onBack={() => setScreen('step1')} />;
      case 'step3':
        return <Step3Gestion value={reponses.gestion} onChange={v => updateReponse('gestion', v)} onNext={() => setScreen('step4')} onBack={() => setScreen('step2')} />;
      case 'step4':
        return <Step4Besoins values={reponses.besoins} onChange={v => updateReponse('besoins', v)} onNext={() => setScreen('step5')} onBack={() => setScreen('step3')} />;
      case 'step5':
        return <Step5Activites values={reponses.activites} onChange={v => updateReponse('activites', v)} onNext={() => setScreen('recap')} onBack={() => setScreen('step4')} />;
      case 'recap':
        return <RecapScreen reponses={reponses} onBack={() => setScreen('step5')} onSubscribe={handleSubscribe} onDemo={handleDemo} onTrial={handleTrial} />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderScreen()}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />}
    </>
  );
};

export default ConfigurateurEasyRenov;
