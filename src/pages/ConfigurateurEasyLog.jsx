// ConfigurateurEasyLog.jsx - V3 - Polices XXL, Rapports détaillés, Accès client visible
import React, { useState, useEffect } from 'react';
import { Flame, Shield, Thermometer, Home, ChevronRight, ChevronLeft, Check, X, Play, Clock, Gift, Sparkles, Users, Building2, User, Briefcase, Bot, FileSpreadsheet, Calendar, Smartphone, Monitor, Bell, ArrowRight, Lock, BarChart3, Timer, Upload, Download, RefreshCw, WifiOff, ClipboardCheck, Flag, LogIn, FileCheck, Snowflake } from 'lucide-react';

const usePricing = (sel) => {
  let form = 'starter', base = 29;
  if (sel.metiers.length >= 3 || sel.tailleEquipe === 'grande') { form = 'business'; base = 49; }
  else if (sel.metiers.length === 2 || ['moyenne', 'petite'].includes(sel.tailleEquipe)) { form = 'pro'; base = 39; }
  let opts = (sel.options.ia ? 5 : 0) + (sel.options.comptabilite ? 10 : 0);
  const total = base + opts, promo = Math.round(total * 0.8);
  return { formuleSuggeree: form, prixBase: base, prixTotal: total, prixPromo: promo, reduction: 20, economieAnnuelle: (total - promo) * 12 };
};

const useTimer = (dur = 900) => {
  const [sec, setSec] = useState(dur);
  useEffect(() => { if (sec <= 0) return; const t = setInterval(() => setSec(s => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, [sec]);
  return { display: `${Math.floor(sec/60)}:${(sec%60).toString().padStart(2,'0')}`, urgent: sec < 300, active: sec > 0 };
};

const METIERS = [
  { id: 'renovation', name: 'RÉNOVATION ÉNERGÉTIQUE', subtitle: 'Isolation • Menuiseries extérieures', icon: Home, gradient: 'from-emerald-500 to-green-600', rapports: ['Audit énergétique', 'Dossier CEE', 'MaPrimeRénov', 'Isolation thermique', 'Menuiseries'] },
  { id: 'pac', name: 'POMPES À CHALEUR', subtitle: 'PAC Air/Air • Air/Eau • Géothermie', icon: Snowflake, gradient: 'from-cyan-500 to-blue-600', rapports: ['Installation PAC', 'Mise en service', 'Entretien annuel', 'Dépannage', 'Fluides frigorigènes'] },
  { id: 'chauffage', name: 'CHAUFFAGE', subtitle: 'Chaudières • Radiateurs • Plancher chauffant', icon: Thermometer, gradient: 'from-orange-500 to-amber-500', rapports: ['Entretien chaudière', 'Ramonage', 'Contrat maintenance', 'Dépannage', 'Installation'] },
  { id: 'protection', name: 'PROTECTION INCENDIE', subtitle: 'Extincteurs • RIA • Désenfumage', icon: Flame, gradient: 'from-red-500 to-rose-600', rapports: ['Vérification DSF', 'Vérification CMP', 'Contrôle BAES', 'Vérification Extincteurs', 'Colonne sèche'] },
  { id: 'ssi', name: 'SSI', subtitle: 'Systèmes Sécurité Incendie', icon: Shield, gradient: 'from-violet-500 to-purple-600', rapports: ['Maintenance SSI', 'Mise en service (MES)', 'Rapport SAV', 'Formation SSI', 'Q18/Q19'] }
];

const TAILLES = [
  { id: 'solo', name: 'INDÉPENDANT', subtitle: 'Je travaille seul', icon: User },
  { id: 'petite', name: 'PETITE ÉQUIPE', subtitle: '2 à 5 personnes', icon: Users },
  { id: 'moyenne', name: 'ÉQUIPE MOYENNE', subtitle: '6 à 15 personnes', icon: Briefcase },
  { id: 'grande', name: 'GRANDE STRUCTURE', subtitle: 'Plus de 15 personnes', icon: Building2 }
];

const StepBar = ({ step }) => (
  <div className="w-full">
    <div className="h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500" style={{ width: `${(step/4)*100}%` }} /></div>
    <div className="flex justify-between mt-3"><span className="text-base font-bold text-slate-500">ÉTAPE {step}/4</span><span className="text-base font-black text-indigo-600">{step < 4 ? '⚡ RAPIDE' : '✓ TERMINÉ'}</span></div>
  </div>
);

const Accueil = ({ onStart, onLogin }) => {
  const [act, setAct] = useState(0);
  useEffect(() => { const i = setInterval(() => setAct(p => (p + 1) % METIERS.length), 2500); return () => clearInterval(i); }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"><div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" /><div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay:'1s'}} /></div>
      <div className="relative z-10 p-5 flex justify-end">
        <button onClick={onLogin} className="flex items-center gap-3 px-6 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-2xl border-2 border-white/30 transition-all active:scale-95">
          <LogIn className="w-6 h-6 text-white" /><span className="text-white font-black text-lg">ESPACE CLIENT</span>
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 -mt-10">
        <div className="relative mb-6"><div className="absolute -inset-6 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-60 animate-pulse" /><div className="relative w-32 h-32 bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/30"><span className="text-7xl font-black text-white">E</span></div></div>
        <h1 className="text-5xl md:text-7xl font-black text-white text-center mb-4 tracking-tight">EASY<span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">LOG</span> PRO</h1>
        <p className="text-2xl text-blue-200 text-center mb-2 font-bold">LE LOGICIEL MÉTIER</p>
        <p className="text-2xl text-cyan-400 text-center mb-8 font-black">QUI S'ADAPTE À VOUS</p>
        <div className="w-full max-w-md mb-8">
          <div className="relative h-28 overflow-hidden rounded-2xl">
            {METIERS.map((m, i) => { const I = m.icon; return (<div key={m.id} className={`absolute inset-0 flex items-center gap-4 p-5 bg-gradient-to-r ${m.gradient} rounded-2xl transition-all duration-500 ${i === act ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}><div className="w-18 h-18 rounded-xl bg-white/20 flex items-center justify-center"><I className="w-10 h-10 text-white" /></div><div><p className="text-white font-black text-2xl">{m.name}</p><p className="text-white/80 text-lg">{m.subtitle}</p></div></div>); })}
          </div>
          <div className="flex justify-center gap-2 mt-4">{METIERS.map((_, i) => (<div key={i} className={`h-2.5 rounded-full transition-all ${i === act ? 'w-10 bg-cyan-400' : 'w-2.5 bg-white/30'}`} />))}</div>
        </div>
        <div className="w-full max-w-md mb-8 space-y-3">
          <div className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"><div className="w-16 h-16 rounded-xl bg-blue-500/30 flex items-center justify-center"><Flag className="w-8 h-8 text-blue-400" /></div><div><p className="text-white font-black text-xl">🇫🇷 HÉBERGÉ EN FRANCE</p><p className="text-blue-300 text-lg">Cloud sécurisé • RGPD</p></div></div>
          <div className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"><div className="w-16 h-16 rounded-xl bg-emerald-500/30 flex items-center justify-center gap-1"><Smartphone className="w-7 h-7 text-emerald-400" /><span className="text-emerald-400 font-black">+</span><Monitor className="w-7 h-7 text-emerald-400" /></div><div><p className="text-white font-black text-xl">2 APPLICATIONS</p><p className="text-blue-300 text-lg">App Terrain + App Bureau</p></div></div>
          <div className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"><div className="w-16 h-16 rounded-xl bg-amber-500/30 flex items-center justify-center"><ClipboardCheck className="w-8 h-8 text-amber-400" /></div><div><p className="text-white font-black text-xl">RAPPORTS SPÉCIALISÉS</p><p className="text-blue-300 text-lg">DSF • CMP • BAES • Q18/Q19...</p></div></div>
        </div>
        <button onClick={onStart} className="w-full max-w-md py-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl text-white font-black text-2xl shadow-2xl shadow-purple-500/30 active:scale-[0.98]">
          <div className="flex items-center justify-center gap-4"><Sparkles className="w-9 h-9" /><span>CONFIGURER MA SOLUTION</span></div>
          <span className="text-xl font-bold text-white/80 block mt-2">⚡ En 90 secondes</span>
        </button>
      </div>
      <div className="px-6 pb-6 relative z-10"><div className="flex items-center justify-center gap-8 text-lg text-blue-300"><div className="flex items-center gap-2"><Lock className="w-6 h-6 text-emerald-400" /><span className="font-bold">SÉCURISÉ</span></div><div className="flex items-center gap-2"><X className="w-6 h-6 text-rose-400" /><span className="font-bold">SANS ENGAGEMENT</span></div></div></div>
    </div>
  );
};

const Step1 = ({ selections: sel, onUpdate, onNext, onBack }) => {
  const [exp, setExp] = useState(null);
  const toggle = (id) => { const u = sel.metiers.includes(id) ? sel.metiers.filter(x => x !== id) : [...sel.metiers, id]; onUpdate({ ...sel, metiers: u }); if (!sel.metiers.includes(id)) { setExp(id); setTimeout(() => setExp(null), 3000); } };
  const rapCnt = METIERS.filter(m => sel.metiers.includes(m.id)).reduce((a, m) => a + m.rapports.length, 0);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 flex flex-col">
      <div className="px-5 pt-5 pb-4 bg-white shadow-sm"><div className="flex items-center justify-between mb-4"><button onClick={onBack} className="w-14 h-14 flex items-center justify-center rounded-xl bg-slate-100 active:scale-95"><ChevronLeft className="w-7 h-7 text-slate-600" /></button><span className="text-xl font-black text-slate-600">1/4</span></div><StepBar step={1} /></div>
      <div className="flex-1 px-5 pb-44 overflow-y-auto pt-5">
        <h1 className="text-4xl font-black text-slate-800 mb-2">VOTRE ACTIVITÉ</h1>
        <p className="text-xl text-slate-500 mb-6">Sélectionnez un ou plusieurs métiers</p>
        <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl mb-6"><ClipboardCheck className="w-10 h-10 text-amber-600 flex-shrink-0" /><div><p className="text-amber-800 font-black text-xl">RAPPORTS SPÉCIALISÉS INCLUS</p><p className="text-amber-700 text-lg">Pour chaque métier sélectionné</p></div></div>
        <div className="space-y-4">
          {METIERS.map((m) => { const s = sel.metiers.includes(m.id), e = exp === m.id, I = m.icon; return (
            <div key={m.id}>
              <button onClick={() => toggle(m.id)} className={`w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-[0.99] ${s ? 'border-indigo-500 bg-indigo-50 shadow-xl' : 'border-slate-200 bg-white shadow-lg'}`}>
                <div className="flex items-center gap-4"><div className={`w-18 h-18 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}><I className="w-10 h-10 text-white" /></div><div className="flex-1"><div className="flex items-center justify-between mb-1"><h3 className="font-black text-slate-800 text-2xl">{m.name}</h3>{s && <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>}</div><p className="text-slate-500 text-lg font-medium">{m.subtitle}</p></div></div>
              </button>
              {(s || e) && <div className="mt-3 ml-4 p-4 bg-white rounded-xl border-2 border-indigo-200"><p className="text-indigo-600 font-black text-lg mb-3 flex items-center gap-2"><FileCheck className="w-6 h-6" />RAPPORTS INCLUS :</p><div className="flex flex-wrap gap-2">{m.rapports.map((r, i) => (<span key={i} className={`px-4 py-2 bg-gradient-to-r ${m.gradient} text-white text-base font-bold rounded-xl shadow`}>{r}</span>))}</div></div>}
            </div>
          ); })}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent">
        {sel.metiers.length > 0 && <div className="text-center mb-4"><span className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-100 text-indigo-700 rounded-full text-lg font-black"><Check className="w-6 h-6" />{sel.metiers.length} MÉTIER{sel.metiers.length > 1 ? 'S' : ''} • {rapCnt} RAPPORTS</span></div>}
        <button onClick={onNext} disabled={!sel.metiers.length} className={`w-full py-6 rounded-2xl font-black text-2xl flex items-center justify-center gap-3 transition-all ${sel.metiers.length ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl active:scale-[0.98]' : 'bg-slate-200 text-slate-400'}`}><span>CONTINUER</span><ChevronRight className="w-7 h-7" /></button>
      </div>
    </div>
  );
};

const Step2 = ({ selections: sel, onUpdate, onNext, onBack }) => {
  const select = (id) => onUpdate({ ...sel, tailleEquipe: id });
  const vals = { solo: { t: "App terrain smartphone + gestion bureau PC", i: Smartphone }, petite: { t: "Synchronisation temps réel équipe", i: RefreshCw }, moyenne: { t: "Planning partagé + alertes auto", i: Bell }, grande: { t: "Multi-agences + tableaux de bord", i: BarChart3 } };
  const v = vals[sel.tailleEquipe];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 flex flex-col">
      <div className="px-5 pt-5 pb-4 bg-white shadow-sm"><div className="flex items-center justify-between mb-4"><button onClick={onBack} className="w-14 h-14 flex items-center justify-center rounded-xl bg-slate-100 active:scale-95"><ChevronLeft className="w-7 h-7 text-slate-600" /></button><span className="text-xl font-black text-slate-600">2/4</span></div><StepBar step={2} /></div>
      <div className="flex-1 px-5 pb-44 overflow-y-auto pt-5">
        <h1 className="text-4xl font-black text-slate-800 mb-2">VOTRE ÉQUIPE</h1>
        <p className="text-xl text-slate-500 mb-6">Combien utiliseront EasyLog Pro ?</p>
        <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-300 rounded-2xl mb-6"><Smartphone className="w-9 h-9 text-emerald-600" /><span className="text-emerald-600 font-black text-2xl mx-2">+</span><Monitor className="w-9 h-9 text-emerald-600" /><div className="ml-2"><p className="text-emerald-800 font-black text-xl">2 APPS PAR UTILISATEUR</p><p className="text-emerald-700 text-lg">Terrain + Bureau inclus</p></div></div>
        <div className="space-y-4">
          {TAILLES.map((t) => { const s = sel.tailleEquipe === t.id, I = t.icon; return (
            <button key={t.id} onClick={() => select(t.id)} className={`w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-[0.99] ${s ? 'border-indigo-500 bg-indigo-50 shadow-xl' : 'border-slate-200 bg-white shadow-lg'}`}>
              <div className="flex items-center gap-4"><div className={`w-18 h-18 rounded-2xl flex items-center justify-center flex-shrink-0 ${s ? 'bg-indigo-500' : 'bg-slate-100'}`}><I className={`w-9 h-9 ${s ? 'text-white' : 'text-slate-500'}`} /></div><div className="flex-1"><div className="flex items-center justify-between"><h3 className="font-black text-slate-800 text-2xl">{t.name}</h3>{s && <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>}</div><p className="text-slate-500 text-lg font-medium">{t.subtitle}</p></div></div>
            </button>
          ); })}
        </div>
        {v && <div className="mt-6 p-5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white"><div className="flex items-center gap-4"><div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center"><v.i className="w-8 h-8" /></div><div><p className="font-black text-xl">INCLUS POUR VOUS :</p><p className="text-xl text-indigo-100">{v.t}</p></div></div></div>}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent"><button onClick={onNext} disabled={!sel.tailleEquipe} className={`w-full py-6 rounded-2xl font-black text-2xl flex items-center justify-center gap-3 transition-all ${sel.tailleEquipe ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl active:scale-[0.98]' : 'bg-slate-200 text-slate-400'}`}><span>CONTINUER</span><ChevronRight className="w-7 h-7" /></button></div>
    </div>
  );
};

const Step3 = ({ selections: sel, onUpdate, onNext, onBack }) => {
  const tog = (o) => onUpdate({ ...sel, options: { ...sel.options, [o]: !sel.options[o] } });
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 flex flex-col">
      <div className="px-5 pt-5 pb-4 bg-white shadow-sm"><div className="flex items-center justify-between mb-4"><button onClick={onBack} className="w-14 h-14 flex items-center justify-center rounded-xl bg-slate-100 active:scale-95"><ChevronLeft className="w-7 h-7 text-slate-600" /></button><span className="text-xl font-black text-slate-600">3/4</span></div><StepBar step={3} /></div>
      <div className="flex-1 px-5 pb-44 overflow-y-auto pt-5">
        <h1 className="text-4xl font-black text-slate-800 mb-2">OPTIONS</h1>
        <p className="text-xl text-slate-500 mb-6">Boostez votre productivité</p>
        <div className="bg-white rounded-2xl border-2 border-emerald-300 p-5 mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center"><Check className="w-7 h-7 text-white" /></div><h3 className="font-black text-slate-800 text-2xl">DÉJÀ INCLUS</h3></div>
          <div className="grid grid-cols-2 gap-3">{[{i:Bell,t:'Alertes auto'},{i:Calendar,t:'Planning'},{i:Upload,t:'Import Excel'},{i:Download,t:'Export données'},{i:ClipboardCheck,t:'Rapports métier'},{i:WifiOff,t:'Mode hors-ligne'}].map((x,j)=>(<div key={j} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl"><x.i className="w-6 h-6 text-emerald-600" /><span className="text-lg font-bold text-slate-700">{x.t}</span></div>))}</div>
        </div>
        <p className="text-slate-600 font-black text-xl mb-4">OPTIONS PREMIUM :</p>
        <button onClick={()=>tog('ia')} className={`w-full p-5 rounded-2xl border-2 text-left mb-4 relative ${sel.options.ia?'border-indigo-500 bg-indigo-50 shadow-xl':'border-slate-200 bg-white shadow-lg'}`}>
          <div className="absolute top-0 right-0 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-base font-black rounded-bl-xl rounded-tr-2xl">⭐ POPULAIRE</div>
          <div className="flex items-start gap-4"><div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${sel.options.ia?'bg-gradient-to-br from-indigo-500 to-purple-600':'bg-slate-100'}`}><Bot className={`w-9 h-9 ${sel.options.ia?'text-white':'text-slate-500'}`} /></div><div className="flex-1 pt-1"><div className="flex items-center justify-between mb-2"><h3 className="font-black text-slate-800 text-2xl">ASSISTANT IA</h3><div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${sel.options.ia?'border-indigo-500 bg-indigo-500':'border-slate-300'}`}>{sel.options.ia&&<Check className="w-6 h-6 text-white"/>}</div></div><p className="text-slate-500 text-lg mb-3">Correction automatique des rapports</p><div className="bg-slate-100 rounded-xl p-3 mb-2"><p className="text-red-500 font-bold text-base">✗ "le clien a signaler un probleme"</p></div><div className="bg-indigo-100 rounded-xl p-3 mb-3"><p className="text-emerald-600 font-bold text-base">✓ "Le client a signalé un problème."</p></div><div className="flex items-center justify-between"><span className="text-indigo-600 font-black text-2xl">+5€/MOIS</span><span className="text-slate-400 text-base">~3000 corrections</span></div></div></div>
        </button>
        <button onClick={()=>tog('comptabilite')} className={`w-full p-5 rounded-2xl border-2 text-left ${sel.options.comptabilite?'border-indigo-500 bg-indigo-50 shadow-xl':'border-slate-200 bg-white shadow-lg'}`}>
          <div className="flex items-start gap-4"><div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${sel.options.comptabilite?'bg-gradient-to-br from-emerald-500 to-teal-600':'bg-slate-100'}`}><FileSpreadsheet className={`w-9 h-9 ${sel.options.comptabilite?'text-white':'text-slate-500'}`} /></div><div className="flex-1"><div className="flex items-center justify-between mb-2"><h3 className="font-black text-slate-800 text-2xl">EXPORT COMPTABLE</h3><div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${sel.options.comptabilite?'border-indigo-500 bg-indigo-500':'border-slate-300'}`}>{sel.options.comptabilite&&<Check className="w-6 h-6 text-white"/>}</div></div><p className="text-slate-500 text-lg mb-3">Envoi auto mensuel au comptable</p><div className="flex flex-wrap gap-2 mb-3">{['Sage','EBP','Ciel','QuickBooks'].map(s=>(<span key={s} className="px-3 py-1 bg-slate-100 rounded-lg text-base font-bold text-slate-600">{s}</span>))}</div><div className="flex items-center justify-between"><span className="text-indigo-600 font-black text-2xl">+10€/MOIS</span><span className="text-emerald-600 text-lg font-bold">⏱️ Gagnez 3h/mois</span></div></div></div>
        </button>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent"><button onClick={onNext} className="w-full py-6 rounded-2xl font-black text-2xl flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl active:scale-[0.98]"><span>VOIR MA SOLUTION</span><ArrowRight className="w-7 h-7" /></button></div>
    </div>
  );
};

const Step4 = ({ selections: sel, onBack, onDemo, onTrial, onSubscribe }) => {
  const p = usePricing(sel), tm = useTimer();
  const mSel = METIERS.filter(m => sel.metiers.includes(m.id)), rapCnt = mSel.reduce((a,m)=>a+m.rapports.length,0);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 flex flex-col">
      <div className="px-5 pt-5 pb-4 bg-white shadow-sm"><div className="flex items-center justify-between mb-4"><button onClick={onBack} className="w-14 h-14 flex items-center justify-center rounded-xl bg-slate-100 active:scale-95"><ChevronLeft className="w-7 h-7 text-slate-600" /></button><span className="text-xl font-black text-slate-600">4/4</span></div><StepBar step={4} /></div>
      <div className="flex-1 px-5 pb-8 overflow-y-auto pt-5">
        <div className="text-center mb-6"><div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-xl"><Sparkles className="w-10 h-10 text-white" /></div><h1 className="text-4xl font-black text-slate-800">VOTRE SOLUTION !</h1></div>
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white"><div className="flex items-center justify-between"><div><p className="text-indigo-200 text-lg">FORMULE</p><h2 className="text-4xl font-black uppercase">{p.formuleSuggeree}</h2></div><div className="text-right"><p className="text-5xl font-black">{p.prixBase}€</p><p className="text-indigo-200 text-lg">/mois HT</p></div></div></div>
          <div className="p-5 border-b-2 border-slate-100"><p className="text-base font-black text-slate-500 mb-3">VOS PACKS MÉTIERS</p><div className="flex flex-wrap gap-2">{mSel.map(m=>{const I=m.icon;return(<div key={m.id} className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${m.gradient} text-white font-bold shadow-lg`}><I className="w-5 h-5"/><span>{m.name}</span></div>);})}</div></div>
          <div className="p-5 border-b-2 border-slate-100 bg-amber-50"><p className="text-base font-black text-amber-700 mb-3 flex items-center gap-2"><ClipboardCheck className="w-6 h-6" />{rapCnt} RAPPORTS SPÉCIALISÉS INCLUS</p><div className="space-y-2">{mSel.map(m=>(<div key={m.id} className="flex flex-wrap gap-1">{m.rapports.map((r,i)=>(<span key={i} className="px-3 py-1 bg-white rounded-lg text-sm font-bold text-slate-600 shadow-sm">{r}</span>))}</div>))}</div></div>
          <div className="p-5 border-b-2 border-slate-100"><p className="text-base font-black text-slate-500 mb-3">INCLUS</p><div className="grid grid-cols-2 gap-2">{[{i:Smartphone,t:'App Terrain',h:1},{i:Monitor,t:'App Bureau',h:1},{i:Bell,t:'Alertes auto'},{i:Upload,t:'Import Excel'},{i:WifiOff,t:'Mode hors-ligne'},{i:Flag,t:'France 🇫🇷',h:1}].map((f,i)=>(<div key={i} className={`flex items-center gap-2 p-3 rounded-xl ${f.h?'bg-indigo-100':'bg-slate-50'}`}><f.i className={`w-6 h-6 ${f.h?'text-indigo-600':'text-slate-500'}`}/><span className={`text-base font-bold ${f.h?'text-indigo-700':'text-slate-600'}`}>{f.t}</span></div>))}</div></div>
          {(sel.options.ia||sel.options.comptabilite)&&<div className="p-5 border-b-2 border-slate-100"><p className="text-base font-black text-slate-500 mb-3">VOS OPTIONS</p><div className="space-y-2">{sel.options.ia&&<div className="flex items-center justify-between p-4 bg-indigo-100 rounded-xl"><div className="flex items-center gap-3"><Bot className="w-7 h-7 text-indigo-600"/><span className="font-bold text-slate-700 text-lg">Assistant IA</span></div><span className="text-indigo-600 font-black text-xl">+5€</span></div>}{sel.options.comptabilite&&<div className="flex items-center justify-between p-4 bg-emerald-100 rounded-xl"><div className="flex items-center gap-3"><FileSpreadsheet className="w-7 h-7 text-emerald-600"/><span className="font-bold text-slate-700 text-lg">Export Comptable</span></div><span className="text-emerald-600 font-black text-xl">+10€</span></div>}</div></div>}
          <div className="p-5 bg-slate-50"><div className="flex items-center justify-between"><span className="text-slate-600 font-bold text-xl">TOTAL MENSUEL</span><span className="text-4xl font-black text-slate-800">{p.prixTotal}€<span className="text-lg font-medium text-slate-500">/mois</span></span></div></div>
        </div>
        {tm.active&&<div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-3xl p-6 text-white mb-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><Gift className="w-8 h-8"/><span className="font-black text-2xl">OFFRE LANCEMENT</span></div><div className={`flex items-center gap-2 px-5 py-2 bg-white/20 rounded-full ${tm.urgent?'animate-pulse':''}`}><Timer className="w-6 h-6"/><span className="font-mono font-black text-xl">{tm.display}</span></div></div>
          <div className="flex items-end justify-between mb-5"><div><p className="text-rose-200 text-xl line-through">{p.prixTotal}€/mois</p><p className="text-6xl font-black">{p.prixPromo}€<span className="text-2xl font-medium">/mois</span></p></div><div className="text-right"><div className="inline-block px-4 py-2 bg-white/20 rounded-full text-xl font-black mb-2">-{p.reduction}%</div><p className="text-rose-100 text-lg">💰 -{p.economieAnnuelle}€/an</p></div></div>
          <button onClick={onSubscribe} className="w-full py-6 bg-white text-rose-600 font-black text-2xl rounded-2xl active:scale-[0.98] shadow-xl">🚀 SOUSCRIRE À {p.prixPromo}€/MOIS</button>
        </div>}
        <button onClick={onDemo} className="w-full py-5 bg-white border-2 border-indigo-300 text-indigo-600 font-black text-xl rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] mb-4 shadow-lg"><Play className="w-7 h-7"/><span>VOIR LA DÉMO</span></button>
        <button onClick={onTrial} className="w-full py-5 bg-slate-100 text-slate-600 font-bold text-xl rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98]"><Clock className="w-7 h-7"/><span>ESSAI GRATUIT 48H SANS CB</span></button>
        <div className="flex items-center justify-center gap-8 mt-6 text-lg text-slate-400"><div className="flex items-center gap-2"><Lock className="w-6 h-6"/><span className="font-bold">SÉCURISÉ</span></div><div className="flex items-center gap-2"><X className="w-6 h-6"/><span className="font-bold">SANS ENGAGEMENT</span></div></div>
      </div>
    </div>
  );
};

const Demo = ({ selections: sel, onClose, onSubscribe }) => {
  const p = usePricing(sel), mSel = METIERS.filter(m => sel.metiers.includes(m.id));
  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
      <div className="flex items-center justify-between p-5 border-b border-slate-800"><button onClick={onClose} className="w-14 h-14 flex items-center justify-center rounded-xl bg-slate-800 active:scale-95"><X className="w-7 h-7 text-white"/></button><div className="text-center"><p className="text-white font-black text-xl">VOTRE DÉMO EASYLOG</p><p className="text-slate-400 text-lg">{mSel.map(m=>m.name).join(' + ')}</p></div><div className="w-14"/></div>
      <div className="flex-1 p-5 flex items-center justify-center"><div className="text-center"><div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6"><Play className="w-14 h-14 text-white"/></div><h2 className="text-white font-black text-3xl mb-4">DÉMO BIENTÔT DISPONIBLE</h2><p className="text-slate-400 text-xl mb-6">Captures d'écran à venir</p><div className="flex flex-wrap justify-center gap-2">{mSel.map(m=>(<span key={m.id} className={`px-5 py-3 bg-gradient-to-r ${m.gradient} text-white text-lg font-bold rounded-xl`}>{m.name}</span>))}</div></div></div>
      <div className="p-5 border-t border-slate-800"><button onClick={onSubscribe} className="w-full py-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-2xl rounded-2xl active:scale-[0.98] shadow-xl">🚀 SOUSCRIRE À {p.prixPromo}€/MOIS</button></div>
    </div>
  );
};

const Login = ({ onClose }) => {
  const [e,setE]=useState(''), [pw,setPw]=useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-5">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6"><h2 className="text-3xl font-black text-slate-800">CONNEXION</h2><button onClick={onClose} className="w-14 h-14 flex items-center justify-center rounded-xl bg-slate-100 active:scale-95"><X className="w-7 h-7 text-slate-500"/></button></div>
        <div className="space-y-5">
          <div><label className="block text-lg font-black text-slate-600 mb-2">EMAIL</label><input type="email" value={e} onChange={x=>setE(x.target.value)} placeholder="votre@email.com" className="w-full px-5 py-4 bg-slate-100 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div>
          <div><label className="block text-lg font-black text-slate-600 mb-2">MOT DE PASSE</label><input type="password" value={pw} onChange={x=>setPw(x.target.value)} placeholder="••••••••" className="w-full px-5 py-4 bg-slate-100 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div>
          <button className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-2xl rounded-xl active:scale-[0.98] shadow-xl mt-2">SE CONNECTER</button>
          <button className="w-full text-center text-indigo-600 font-bold text-lg py-3">Mot de passe oublié ?</button>
        </div>
      </div>
    </div>
  );
};

const ConfigurateurEasyLog = () => {
  const [v, setV] = useState('accueil'), [login, setLogin] = useState(false);
  const [sel, setSel] = useState({ metiers: [], tailleEquipe: null, options: { ia: false, comptabilite: false } });
  const go = x => setV(x);
  const sub = () => alert('Redirection vers paiement sécurisé Stripe...');
  const trial = () => alert('Demande envoyée ! Accès sous 24h.');
  const render = () => {
    switch (v) {
      case 'accueil': return <Accueil onStart={()=>go('step1')} onLogin={()=>setLogin(true)} />;
      case 'step1': return <Step1 selections={sel} onUpdate={setSel} onNext={()=>go('step2')} onBack={()=>go('accueil')} />;
      case 'step2': return <Step2 selections={sel} onUpdate={setSel} onNext={()=>go('step3')} onBack={()=>go('step1')} />;
      case 'step3': return <Step3 selections={sel} onUpdate={setSel} onNext={()=>go('step4')} onBack={()=>go('step2')} />;
      case 'step4': return <Step4 selections={sel} onBack={()=>go('step3')} onDemo={()=>go('demo')} onTrial={trial} onSubscribe={sub} />;
      case 'demo': return <Demo selections={sel} onClose={()=>go('step4')} onSubscribe={sub} />;
      default: return null;
    }
  };
  return <>{render()}{login && <Login onClose={()=>setLogin(false)} />}</>;
};

export default ConfigurateurEasyLog;
