// src/components/demo/DemoBanner.jsx
// Easy Sécurité - Bandeau de démo avec décompte visible

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../contexts/DemoContext';
import { Clock, Zap, AlertTriangle } from 'lucide-react';

const DemoBanner = () => {
  const navigate = useNavigate();
  const { isDemoMode, timeRemaining, formatTimeRemaining, DEMO_DURATION } = useDemo();

  // Ne pas afficher si pas en mode démo
  if (!isDemoMode) return null;

  // Couleur selon temps restant
  const getColorClass = () => {
    if (timeRemaining <= 30) return 'from-red-600 to-red-700';
    if (timeRemaining <= 60) return 'from-orange-500 to-orange-600';
    return 'from-blue-500 to-blue-600';
  };

  // Pourcentage restant pour la barre
  const percentage = (timeRemaining / DEMO_DURATION) * 100;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r ${getColorClass()} text-white shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Gauche - Message */}
          <div className="flex items-center gap-3">
            {timeRemaining <= 30 ? (
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            ) : (
              <Clock className="w-5 h-5" />
            )}
            <span className="font-medium text-sm sm:text-base">
              🔥 DÉMO GRATUITE - Essai de 3 minutes
            </span>
          </div>

          {/* Centre - Timer GROS ET VISIBLE */}
          <div className="flex items-center gap-4">
            <div className={`bg-white/20 backdrop-blur rounded-lg px-4 py-1 ${timeRemaining <= 30 ? 'animate-pulse' : ''}`}>
              <span className="text-2xl sm:text-3xl font-mono font-black">
                {formatTimeRemaining()}
              </span>
            </div>
          </div>

          {/* Droite - Bouton */}
          <button
            onClick={() => navigate('/subscribe')}
            className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-all shadow-lg"
          >
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Souscrire -10%</span>
            <span className="sm:hidden">-10%</span>
          </button>
        </div>

        {/* Barre de progression */}
        <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;
