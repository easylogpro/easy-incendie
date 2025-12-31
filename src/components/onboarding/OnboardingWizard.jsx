// src/components/onboarding/OnboardingWizard.jsx
// Easy Sécurité - Onboarding 7 étapes après paiement

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import { 
  Building2, Settings, Users, Briefcase, Package, 
  MapPin, Cpu, CheckCircle2, ArrowRight, ArrowLeft,
  Upload, Plus, X, Loader2, Camera
} from 'lucide-react';

const OnboardingWizard = ({ onComplete }) => {
  const navigate = useNavigate();
  const { orgId, refreshSettings } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Étape 1 - Profil entreprise
    logo: null,
    adresse: '',
    code_postal: '',
    ville: '',
    assurance_rc: '',
    assurance_decennale: '',
    qualifications: [],
    // Étape 2 - Préférences
    format_numero_devis: 'D-{ANNEE}-{NUM}',
    format_numero_facture: 'F-{ANNEE}-{NUM}',
    format_date: 'DD/MM/YYYY',
    // Étape 3 - Techniciens
    techniciens: [],
    // Étape 5 - Catalogue
    tarif_horaire: 45,
    tarif_deplacement: 0.50
  });

  const steps = [
    { id: 1, title: 'Profil entreprise', icon: Building2 },
    { id: 2, title: 'Préférences', icon: Settings },
    { id: 3, title: 'Techniciens', icon: Users },
    { id: 4, title: 'Sous-traitants', icon: Briefcase },
    { id: 5, title: 'Catalogue', icon: Package },
    { id: 6, title: 'Clients & Sites', icon: MapPin },
    { id: 7, title: 'Équipements', icon: Cpu }
  ];

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const skipStep = () => nextStep();

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      await supabase.from('onboarding_progress').upsert({
        organisation_id: orgId,
        onboarding_complete: true,
        completed_at: new Date().toISOString(),
        etape_actuelle: 7,
        progression_pct: 100
      });

      await refreshSettings();
      onComplete?.();
    } catch (error) {
      console.error('Erreur onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rendu étape 1
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
          <Camera className="w-8 h-8 text-gray-400" />
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
          <Upload className="w-4 h-4 inline mr-2" />
          Importer logo
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input
            type="text"
            value={formData.adresse}
            onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
            placeholder="123 rue de la Paix"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
          <input
            type="text"
            value={formData.code_postal}
            onChange={(e) => setFormData({ ...formData, code_postal: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="75001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
          <input
            type="text"
            value={formData.ville}
            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Paris"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assurance RC Pro</label>
          <input
            type="text"
            value={formData.assurance_rc}
            onChange={(e) => setFormData({ ...formData, assurance_rc: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="N° contrat"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assurance Décennale</label>
          <input
            type="text"
            value={formData.assurance_decennale}
            onChange={(e) => setFormData({ ...formData, assurance_decennale: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="N° contrat"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
        <div className="flex flex-wrap gap-2">
          {['APSAD', 'Qualifelec', 'AFNOR', 'ISO 9001'].map(qual => (
            <button
              key={qual}
              type="button"
              onClick={() => {
                const newQuals = formData.qualifications.includes(qual)
                  ? formData.qualifications.filter(q => q !== qual)
                  : [...formData.qualifications, qual];
                setFormData({ ...formData, qualifications: newQuals });
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                formData.qualifications.includes(qual)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {qual}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Rendu étape 2
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Format numéro devis</label>
        <select
          value={formData.format_numero_devis}
          onChange={(e) => setFormData({ ...formData, format_numero_devis: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="D-{ANNEE}-{NUM}">D-2025-0001</option>
          <option value="DEV{ANNEE}{NUM}">DEV20250001</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Format numéro facture</label>
        <select
          value={formData.format_numero_facture}
          onChange={(e) => setFormData({ ...formData, format_numero_facture: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="F-{ANNEE}-{NUM}">F-2025-0001</option>
          <option value="FAC{ANNEE}{NUM}">FAC20250001</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Format date</label>
        <select
          value={formData.format_date}
          onChange={(e) => setFormData({ ...formData, format_date: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="DD/MM/YYYY">31/12/2025 (français)</option>
          <option value="YYYY-MM-DD">2025-12-31 (ISO)</option>
        </select>
      </div>
    </div>
  );

  // Rendu étapes 3-7 (simplifiées)
  const renderSimpleStep = (title, icon: any, description: string) => (
    <div className="text-center py-12">
      {React.createElement(icon, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" })}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      <p className="text-sm text-gray-400">Vous pourrez configurer cette section plus tard</p>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderSimpleStep('Techniciens', Users, 'Ajoutez votre équipe');
      case 4: return renderSimpleStep('Sous-traitants', Briefcase, 'Ajoutez vos partenaires');
      case 5: return renderSimpleStep('Catalogue', Package, 'Configurez vos tarifs');
      case 6: return renderSimpleStep('Clients & Sites', MapPin, 'Importez vos clients');
      case 7: return renderSimpleStep('Équipements', Cpu, 'Configurez le parc');
      default: return null;
    }
  };

  const progress = ((currentStep - 1) / 7) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Configuration de votre compte</h2>
          <p className="text-gray-500 text-sm mt-1">Étape {currentStep} sur 7</p>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Steps */}
        <div className="px-6 py-3 bg-gray-50 border-b overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {steps.map(step => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  currentStep === step.id ? 'bg-red-500 text-white' :
                  currentStep > step.id ? 'bg-green-100 text-green-700' : 'bg-white text-gray-500 border'
                }`}
              >
                {currentStep > step.id ? <CheckCircle2 className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{steps[currentStep - 1].title}</h3>
          </div>
          {renderCurrentStep()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Précédent
          </button>
          <div className="flex gap-3">
            <button onClick={skipStep} className="px-4 py-2 text-gray-500 hover:text-gray-700">
              Passer
            </button>
            <button
              onClick={nextStep}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : currentStep === 7 ? 'Terminer' : <>Suivant <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
