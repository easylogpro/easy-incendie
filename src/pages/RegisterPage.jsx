// src/pages/RegisterPage.jsx
// Easy Sécurité - Page d'inscription
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { supabase } from '../config/supabase';
import { 
  Flame, Mail, Lock, User, Building2, Phone,
  Eye, EyeOff, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    // Étape 1 - Compte
    email: '',
    password: '',
    confirmPassword: '',
    // Étape 2 - Profil
    prenom: '',
    nom: '',
    telephone: '',
    // Étape 3 - Organisation
    entreprise: '',
    siret: '',
    ville: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Validation étape 1
  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Tous les champs sont obligatoires');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email invalide');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  // Validation étape 2
  const validateStep2 = () => {
    if (!formData.prenom || !formData.nom) {
      setError('Le prénom et le nom sont obligatoires');
      return false;
    }
    return true;
  };

  // Passer à l'étape suivante
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  // Inscription complète
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.entreprise) {
      setError('Le nom de l\'entreprise est obligatoire');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Créer l'utilisateur Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;

      // 2. Mettre à jour le profil Firebase
      await updateProfile(user, {
        displayName: `${formData.prenom} ${formData.nom}`
      });

      // 3. Créer l'organisation dans Supabase
      const { data: orgData, error: orgError } = await supabase
        .from('organisations')
        .insert({
          nom: formData.entreprise,
          siret: formData.siret || null,
          ville: formData.ville || null,
          email: formData.email,
          telephone: formData.telephone || null,
          formule: 'starter'
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // 4. Créer l'utilisateur dans Supabase
      const { error: userError } = await supabase
        .from('utilisateurs')
        .insert({
          organisation_id: orgData.id,
          firebase_uid: user.uid,
          email: formData.email,
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone || null,
          role: 'admin'
        });

      if (userError) throw userError;

      // 5. Rediriger vers le dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error('Erreur inscription:', err);
      
      // Messages d'erreur Firebase traduits
      if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé');
      } else if (err.code === 'auth/weak-password') {
        setError('Le mot de passe est trop faible');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide');
      } else {
        setError(err.message || 'Erreur lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  // Logo animé
  const AnimatedLogo = () => (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
          <span className="text-white font-black text-xl">E</span>
          <span className="text-white font-black text-xl animate-pulse">S</span>
        </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black flex">
      {/* Colonne gauche - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-orange-900/30" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 flex flex-col justify-center px-12">
          <AnimatedLogo />
          
          <h1 className="text-4xl font-bold text-white mt-12 mb-4">
            Gérez votre activité de <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">sécurité incendie</span>
          </h1>
          
          <p className="text-gray-400 text-lg mb-8">
            SSI, DSF, BAES, Extincteurs... Tous vos rapports et interventions en un seul endroit.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>14 jours d'essai gratuit</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Sans carte bancaire</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Support français inclus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne droite - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <AnimatedLogo />
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 rounded ${step > s ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gray-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Titre étape */}
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            {step === 1 && 'Créez votre compte'}
            {step === 2 && 'Vos informations'}
            {step === 3 && 'Votre entreprise'}
          </h2>
          <p className="text-gray-400 text-center mb-8">
            {step === 1 && 'Commencez votre essai gratuit de 14 jours'}
            {step === 2 && 'Dites-nous en plus sur vous'}
            {step === 3 && 'Dernière étape !'}
          </p>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={step === 3 ? handleRegister : (e) => { e.preventDefault(); nextStep(); }}>
            {/* Étape 1 - Compte */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="vous@entreprise.fr"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Étape 2 - Profil */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        placeholder="Jean"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Dupont"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone <span className="text-gray-500">(optionnel)</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="06 12 34 56 78"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Étape 3 - Organisation */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nom de l'entreprise</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="entreprise"
                      value={formData.entreprise}
                      onChange={handleChange}
                      placeholder="Ma Société SARL"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">SIRET <span className="text-gray-500">(optionnel)</span></label>
                  <input
                    type="text"
                    name="siret"
                    value={formData.siret}
                    onChange={handleChange}
                    placeholder="123 456 789 00012"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ville <span className="text-gray-500">(optionnel)</span></label>
                  <input
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    placeholder="Paris"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Boutons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Retour
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Création...
                  </>
                ) : step === 3 ? (
                  'Créer mon compte'
                ) : (
                  'Continuer'
                )}
              </button>
            </div>
          </form>

          {/* Lien connexion */}
          <p className="text-center text-gray-400 mt-8">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-red-400 hover:text-red-300 font-medium">
              Se connecter
            </Link>
          </p>

          {/* CGU */}
          <p className="text-center text-gray-500 text-xs mt-6">
            En créant un compte, vous acceptez nos{' '}
            <a href="#" className="text-gray-400 hover:text-white">CGU</a>
            {' '}et notre{' '}
            <a href="#" className="text-gray-400 hover:text-white">Politique de confidentialité</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;