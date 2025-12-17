// src/pages/LoginPage.jsx
// Page de connexion Premium - Design Éblouissant

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        
        {/* Logo */}
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">EasyLog Pro</span>
          </div>
        </div>

        {/* Message principal */}
        <div className="relative space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Gérez votre activité<br />
            <span className="text-blue-200">en toute simplicité</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-md">
            Solution complète de gestion pour les entreprises d'énergie, chauffage, incendie et isolation.
          </p>

          {/* Features */}
          <div className="flex gap-4 pt-4">
            {['Multi-tenant', 'Temps réel', 'Mode hors-ligne'].map((feature, i) => (
              <div 
                key={i}
                className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm font-medium"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative text-blue-200 text-sm">
          © 2025 EasyLog Pro. Tous droits réservés.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">EasyLog Pro</span>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
            <p className="text-gray-500 mt-2">Accédez à votre espace de gestion</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-shake">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="
                    w-full pl-12 pr-4 py-4
                    bg-white border-2 border-gray-200
                    rounded-xl text-gray-900
                    placeholder-gray-400
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                    transition-all duration-200
                    focus:outline-none
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="
                    w-full pl-12 pr-12 py-4
                    bg-white border-2 border-gray-200
                    rounded-xl text-gray-900
                    placeholder-gray-400
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                    transition-all duration-200
                    focus:outline-none
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-sm text-blue-600 font-medium hover:text-blue-700">
                Mot de passe oublié ?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-4 px-6 
                bg-gradient-to-r from-blue-500 to-indigo-600
                hover:from-blue-600 hover:to-indigo-700
                text-white font-semibold text-lg
                rounded-xl
                shadow-lg shadow-blue-500/30
                hover:shadow-xl hover:shadow-blue-500/40
                transform hover:-translate-y-0.5
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-800 font-medium mb-1">🔐 Compte de démonstration</p>
            <p className="text-xs text-blue-600">
              Email: demo@easylog-pro.fr<br />
              Mot de passe: demo123
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-8">
            Besoin d'aide ?{' '}
            <a href="#" className="text-blue-600 font-medium hover:text-blue-700">
              Contactez le support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
