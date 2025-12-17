// src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import { Wrench, HardHat, FileText, Receipt, AlertTriangle, Users, Building2, Calendar, TrendingUp, Clock, CheckCircle2, ArrowRight, Shield, Zap, Settings2 } from 'lucide-react';
import { Card, StatCard, Modal, Button, Badge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { userData } = useAuth();
  const [selectedModal, setSelectedModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [filter, setFilter] = useState('tous');

  const stats = {
    sav: { total: 12, enRetard: 3, enCours: 5, termine: 4 },
    travaux: { total: 8, enAttente: 2, planifies: 3, enCours: 2, termine: 1 },
    maintenance: { total: 18, effectuee: 10, semaine: 5, enRetard: 3 },
    devis: { total: 15, enAttente: 7, accepte: 5, refuse: 3, montant: 45600 },
    factures: { total: 23, impayees: 4, payees: 19, montant: 78900 }
  };

  const savList = [
    { id: 1, numero: 'SAV-001-251216-001', client: 'Dupont Industrie', technicien: 'Jean Martin', statut: 'en_retard' },
    { id: 2, numero: 'SAV-002-251216-002', client: 'Martin SAS', technicien: 'Pierre Durand', statut: 'en_cours' },
    { id: 3, numero: 'SAV-003-251215-001', client: 'Carrefour Lyon', technicien: 'Sophie Lemaire', statut: 'termine' },
    { id: 4, numero: 'SAV-004-251214-001', client: 'Boulangerie Petit Jean', technicien: 'Jean Martin', statut: 'en_retard' },
    { id: 5, numero: 'SAV-005-251214-002', client: 'Hotel Mercure', technicien: 'Pierre Durand', statut: 'en_cours' },
    { id: 6, numero: 'SAV-006-251213-001', client: 'Garage Auto Plus', technicien: 'Sophie Lemaire', statut: 'termine' },
    { id: 7, numero: 'SAV-007-251212-001', client: 'Pharmacie Centrale', technicien: 'Jean Martin', statut: 'en_retard' },
    { id: 8, numero: 'SAV-008-251211-001', client: 'Restaurant Le Gourmet', technicien: 'Pierre Durand', statut: 'termine' },
    { id: 9, numero: 'SAV-009-251210-001', client: 'Supermarché Bio', technicien: 'Sophie Lemaire', statut: 'en_cours' },
    { id: 10, numero: 'SAV-010-251209-001', client: 'Clinique Santé', technicien: 'Jean Martin', statut: 'en_cours' },
    { id: 11, numero: 'SAV-011-251208-001', client: 'École Primaire', technicien: 'Pierre Durand', statut: 'termine' },
    { id: 12, numero: 'SAV-012-251207-001', client: 'Mairie Centre', technicien: 'Sophie Lemaire', statut: 'en_cours' }
  ];

  const travauxList = [
    { id: 1, numero: 'TRV-001-251216-001', client: 'Dupont Industries', technicien: 'Jean Martin', statut: 'planifie', montant: 4500 },
    { id: 2, numero: 'TRV-002-251215-001', client: 'Martin SAS', technicien: 'Sophie Lemaire', statut: 'en_cours', montant: 12800 },
    { id: 3, numero: 'TRV-003-251214-001', client: 'Carrefour Lyon', technicien: 'Pierre Durand', statut: 'en_attente', montant: 8900 },
    { id: 4, numero: 'TRV-004-251213-001', client: 'Hotel Mercure', technicien: 'Jean Martin', statut: 'termine', montant: 15600 },
    { id: 5, numero: 'TRV-005-251212-001', client: 'Garage Auto Plus', technicien: 'Sophie Lemaire', statut: 'planifie', montant: 6200 },
    { id: 6, numero: 'TRV-006-251211-001', client: 'Pharmacie Centrale', technicien: 'Pierre Durand', statut: 'en_attente', montant: 3400 },
    { id: 7, numero: 'TRV-007-251210-001', client: 'Boulangerie Petit Jean', technicien: 'Jean Martin', statut: 'en_cours', montant: 7800 },
    { id: 8, numero: 'TRV-008-251209-001', client: 'Restaurant Le Gourmet', technicien: 'Sophie Lemaire', statut: 'planifie', montant: 9100 }
  ];

  const maintenanceList = [
    { id: 1, client: 'Dupont Industries', site: 'Site Principal', type: 'PAC', date: '18/12/2025', statut: 'a_venir' },
    { id: 2, client: 'Martin SAS', site: 'Entrepôt Nord', type: 'Clim', date: '19/12/2025', statut: 'a_venir' },
    { id: 3, client: 'Carrefour Lyon', site: 'Magasin', type: 'SSI', date: '20/12/2025', statut: 'a_venir' },
    { id: 4, client: 'Boulangerie Petit Jean', site: 'Boutique', type: 'Chaudière', date: '10/12/2025', statut: 'en_retard', jours: 6 },
    { id: 5, client: 'Hotel Mercure', site: 'Bâtiment A', type: 'BAES', date: '05/12/2025', statut: 'en_retard', jours: 11 },
    { id: 6, client: 'Garage Auto Plus', site: 'Atelier', type: 'Extincteurs', date: '21/12/2025', statut: 'a_venir' },
    { id: 7, client: 'Restaurant Le Gourmet', site: 'Cuisine', type: 'VMC', date: '08/12/2025', statut: 'en_retard', jours: 8 },
    { id: 8, client: 'Pharmacie Centrale', site: 'Officine', date: '01/12/2025', type: 'Clim', statut: 'effectuee' },
    { id: 9, client: 'Supermarché Bio', site: 'Réserve', type: 'PAC', date: '03/12/2025', statut: 'effectuee' },
    { id: 10, client: 'Clinique Santé', site: 'Bloc A', type: 'SSI', date: '05/12/2025', statut: 'effectuee' },
    { id: 11, client: 'École Primaire', site: 'Gymnase', type: 'Chaudière', date: '22/12/2025', statut: 'a_venir' },
    { id: 12, client: 'Mairie Centre', site: 'Mairie', type: 'BAES', date: '28/11/2025', statut: 'effectuee' }
  ];

  const devisList = [
    { id: 1, numero: 'DEV-001-251216-001', client: 'Dupont Industries', montant: 8500, statut: 'en_attente', date: '16/12/2025' },
    { id: 2, numero: 'DEV-002-251215-001', client: 'Martin SAS', montant: 12400, statut: 'accepte', date: '15/12/2025' },
    { id: 3, numero: 'DEV-003-251214-001', client: 'Carrefour Lyon', montant: 6800, statut: 'en_attente', date: '14/12/2025' },
    { id: 4, numero: 'DEV-004-251213-001', client: 'Boulangerie Petit Jean', montant: 3200, statut: 'refuse', date: '13/12/2025' },
    { id: 5, numero: 'DEV-005-251212-001', client: 'Hotel Mercure', montant: 14700, statut: 'en_attente', date: '12/12/2025' },
    { id: 6, numero: 'DEV-006-251211-001', client: 'Garage Auto Plus', montant: 5600, statut: 'accepte', date: '11/12/2025' },
    { id: 7, numero: 'DEV-007-251210-001', client: 'Pharmacie Centrale', montant: 9200, statut: 'en_attente', date: '10/12/2025' },
    { id: 8, numero: 'DEV-008-251209-001', client: 'Restaurant Le Gourmet', montant: 4300, statut: 'accepte', date: '09/12/2025' },
    { id: 9, numero: 'DEV-009-251208-001', client: 'Supermarché Bio', montant: 7800, statut: 'refuse', date: '08/12/2025' },
    { id: 10, numero: 'DEV-010-251207-001', client: 'Clinique Santé', montant: 11200, statut: 'en_attente', date: '07/12/2025' }
  ];

  const facturesList = [
    { id: 1, numero: 'FAC-001-251216-001', client: 'Dupont Industries', montant: 8500, statut: 'payee', date: '16/12/2025' },
    { id: 2, numero: 'FAC-002-251210-001', client: 'Martin SAS', montant: 12400, statut: 'impayee', echeance: '25/12/2025' },
    { id: 3, numero: 'FAC-003-251205-001', client: 'Carrefour Lyon', montant: 6800, statut: 'impayee', echeance: '20/12/2025' },
    { id: 4, numero: 'FAC-004-251201-001', client: 'Hotel Mercure', montant: 15600, statut: 'payee', date: '10/12/2025' },
    { id: 5, numero: 'FAC-005-251128-001', client: 'Boulangerie Petit Jean', montant: 3200, statut: 'impayee', echeance: '15/12/2025' },
    { id: 6, numero: 'FAC-006-251125-001', client: 'Garage Auto Plus', montant: 5600, statut: 'payee', date: '05/12/2025' },
    { id: 7, numero: 'FAC-007-251120-001', client: 'Pharmacie Centrale', montant: 9200, statut: 'payee', date: '01/12/2025' },
    { id: 8, numero: 'FAC-008-251115-001', client: 'Restaurant Le Gourmet', montant: 4300, statut: 'impayee', echeance: '18/12/2025' }
  ];

  const alertes = [
    { id: 1, type: 'critique', message: 'SSI non conforme - Site Carrefour Lyon', date: '2h', icon: Shield },
    { id: 2, type: 'important', message: 'Maintenance dépassée - PAC Dupont', date: '1j', icon: Zap },
    { id: 3, type: 'info', message: 'Échéance contrat proche - Martin SAS', date: '5j', icon: FileText }
  ];

  const interventionsRecentes = [
    { id: 1, type: 'SAV', client: 'Dupont Industries', technicien: 'Jean M.', statut: 'termine', date: "Aujourd'hui" },
    { id: 2, type: 'MES', client: 'Carrefour Lyon', technicien: 'Pierre L.', statut: 'en_cours', date: "Aujourd'hui" },
    { id: 3, type: 'Travaux', client: 'Martin SAS', technicien: 'Sophie R.', statut: 'planifie', date: 'Demain' }
  ];

  const openModal = (type, data) => { 
    setSelectedModal(type); 
    setModalData(data); 
    setFilter('tous'); 
  };
  
  const closeModal = () => { 
    setSelectedModal(null); 
    setModalData(null); 
    setFilter('tous');
  };

  const AlertItem = ({ alerte }) => {
    const typeStyles = { critique: 'border-l-red-500 bg-red-50', important: 'border-l-amber-500 bg-amber-50', info: 'border-l-blue-500 bg-blue-50' };
    const Icon = alerte.icon;
    return (
      <div className={`flex items-center gap-4 p-4 rounded-xl border-l-4 ${typeStyles[alerte.type]} hover:scale-[1.02] transition-transform duration-200 cursor-pointer`}>
        <div className={`p-2 rounded-lg ${alerte.type === 'critique' ? 'bg-red-500' : ''} ${alerte.type === 'important' ? 'bg-amber-500' : ''} ${alerte.type === 'info' ? 'bg-blue-500' : ''}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 text-sm">{alerte.message}</p>
          <p className="text-xs text-gray-500 mt-0.5">Il y a {alerte.date}</p>
        </div>
        {alerte.type === 'critique' && (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </div>
    );
  };

  const getStatusBadge = (statut) => {
    const variants = {
      en_retard: { variant: 'danger', label: 'En retard' },
      en_cours: { variant: 'warning', label: 'En cours' },
      termine: { variant: 'success', label: 'Terminé' },
      planifie: { variant: 'primary', label: 'Planifié' },
      en_attente: { variant: 'warning', label: 'En attente' },
      a_venir: { variant: 'primary', label: 'À venir' },
      effectuee: { variant: 'success', label: 'Effectuée' },
      accepte: { variant: 'success', label: 'Accepté' },
      refuse: { variant: 'danger', label: 'Refusé' },
      payee: { variant: 'success', label: 'Payée' },
      impayee: { variant: 'danger', label: 'Impayée' }
    };
    const config = variants[statut] || { variant: 'default', label: statut };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Composant boutons filtres
  const FilterButtons = ({ filters, currentFilter, onFilterChange }) => (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl">
      {filters.map(f => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentFilter === f.value 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {f.label} {f.count !== undefined && <span className={`ml-1 ${currentFilter === f.value ? 'text-blue-200' : 'text-gray-400'}`}>({f.count})</span>}
        </button>
      ))}
    </div>
  );

  // Filtrer les listes
  const getFilteredSav = () => {
    if (filter === 'tous') return savList;
    return savList.filter(item => item.statut === filter);
  };

  const getFilteredTravaux = () => {
    if (filter === 'tous') return travauxList;
    return travauxList.filter(item => item.statut === filter);
  };

  const getFilteredMaintenance = () => {
    if (filter === 'tous') return maintenanceList;
    return maintenanceList.filter(item => item.statut === filter);
  };

  const getFilteredDevis = () => {
    if (filter === 'tous') return devisList;
    return devisList.filter(item => item.statut === filter);
  };

  const getFilteredFactures = () => {
    if (filter === 'tous') return facturesList;
    return facturesList.filter(item => item.statut === filter);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1 className="text-3xl font-bold mt-2">Bonjour, {userData?.prenom || 'Admin'} 👋</h1>
          <p className="text-blue-100 mt-2 max-w-lg">Votre tableau de bord est prêt. Vous avez <span className="text-white font-semibold">3 alertes critiques</span> et <span className="text-white font-semibold">5 interventions</span> en cours.</p>
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2"><div className="p-2 rounded-lg bg-white/20"><CheckCircle2 className="w-5 h-5" /></div><div><p className="text-2xl font-bold">24</p><p className="text-xs text-blue-100">Terminées ce mois</p></div></div>
            <div className="flex items-center gap-2"><div className="p-2 rounded-lg bg-white/20"><Clock className="w-5 h-5" /></div><div><p className="text-2xl font-bold">5</p><p className="text-xs text-blue-100">En cours</p></div></div>
            <div className="flex items-center gap-2"><div className="p-2 rounded-lg bg-white/20"><TrendingUp className="w-5 h-5" /></div><div><p className="text-2xl font-bold">+15%</p><p className="text-xs text-blue-100">vs mois dernier</p></div></div>
          </div>
        </div>
      </div>

      {/* Stats Activité Terrain */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Wrench className="w-5 h-5 text-blue-500" />Activité Terrain</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="SAV" value={stats.sav.total} subtitle={`${stats.sav.enRetard} en retard`} icon={Wrench} color="blue" onClick={() => openModal('sav', stats.sav)} pulse={stats.sav.enRetard > 0} />
          <StatCard title="Travaux" value={stats.travaux.total} subtitle={`${stats.travaux.enAttente} en attente`} icon={HardHat} color="amber" onClick={() => openModal('travaux', stats.travaux)} />
          <StatCard title="Maintenance" value={stats.maintenance.total} subtitle={`${stats.maintenance.enRetard} en retard`} icon={Settings2} color="green" onClick={() => openModal('maintenance', stats.maintenance)} pulse={stats.maintenance.enRetard > 0} />
          <StatCard title="Devis" value={stats.devis.total} subtitle={`${stats.devis.enAttente} sans réponse`} icon={FileText} color="purple" onClick={() => openModal('devis', stats.devis)} />
          <StatCard title="Factures" value={stats.factures.total} subtitle={`${stats.factures.impayees} impayées`} icon={Receipt} color={stats.factures.impayees > 0 ? 'red' : 'green'} onClick={() => openModal('factures', stats.factures)} pulse={stats.factures.impayees > 0} />
        </div>
      </div>

      {/* Two Columns: Alertes + Interventions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none" className="overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" />Alertes Récentes</h3>
            <Badge variant="danger" pulse>3 critiques</Badge>
          </div>
          <div className="p-4 space-y-3">{alertes.map(alerte => (<AlertItem key={alerte.id} alerte={alerte} />))}</div>
          <div className="p-4 border-t border-gray-100"><Button variant="ghost" fullWidth icon={ArrowRight} iconPosition="right">Voir toutes les alertes</Button></div>
        </Card>

        <Card padding="none" className="overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-500" />Interventions Récentes</h3>
            <Badge variant="primary">{interventionsRecentes.length} aujourd'hui</Badge>
          </div>
          <div className="divide-y divide-gray-100">
            {interventionsRecentes.map(intervention => (
              <div key={intervention.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${intervention.type === 'SAV' ? 'bg-blue-100' : ''} ${intervention.type === 'MES' ? 'bg-emerald-100' : ''} ${intervention.type === 'Travaux' ? 'bg-amber-100' : ''}`}>
                      <Wrench className={`w-4 h-4 ${intervention.type === 'SAV' ? 'text-blue-600' : ''} ${intervention.type === 'MES' ? 'text-emerald-600' : ''} ${intervention.type === 'Travaux' ? 'text-amber-600' : ''}`} />
                    </div>
                    <div><p className="font-medium text-gray-900">{intervention.client}</p><p className="text-sm text-gray-500">{intervention.type} • {intervention.technicien}</p></div>
                  </div>
                  <div className="text-right">
                    <Badge variant={intervention.statut === 'termine' ? 'success' : intervention.statut === 'en_cours' ? 'primary' : 'default'}>{intervention.statut === 'termine' ? 'Terminé' : intervention.statut === 'en_cours' ? 'En cours' : 'Planifié'}</Badge>
                    <p className="text-xs text-gray-500 mt-1">{intervention.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100"><Button variant="ghost" fullWidth icon={ArrowRight} iconPosition="right">Voir le planning</Button></div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center" padding="md"><Users className="w-8 h-8 text-blue-500 mx-auto mb-2" /><p className="text-2xl font-bold text-gray-900">156</p><p className="text-sm text-gray-500">Clients actifs</p></Card>
        <Card className="text-center" padding="md"><Building2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" /><p className="text-2xl font-bold text-gray-900">243</p><p className="text-sm text-gray-500">Sites</p></Card>
        <Card className="text-center" padding="md"><HardHat className="w-8 h-8 text-amber-500 mx-auto mb-2" /><p className="text-2xl font-bold text-gray-900">8</p><p className="text-sm text-gray-500">Techniciens</p></Card>
        <Card className="text-center" padding="md"><TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" /><p className="text-2xl font-bold text-gray-900">78.9k€</p><p className="text-sm text-gray-500">CA ce mois</p></Card>
      </div>

      {/* Modal SAV */}
      <Modal isOpen={selectedModal === 'sav'} onClose={closeModal} title="Détail SAV" subtitle="Liste des interventions SAV" icon={Wrench} iconColor="blue" size="lg" footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={closeModal}>Fermer</Button><Button variant="primary" icon={ArrowRight} iconPosition="right">Voir tout</Button></div>}>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-blue-600">{modalData?.total}</p><p className="text-sm text-gray-600">Total</p></div>
            <div className="bg-amber-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-amber-600">{modalData?.enCours}</p><p className="text-sm text-gray-600">En cours</p></div>
            <div className="bg-red-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-red-600">{modalData?.enRetard}</p><p className="text-sm text-gray-600">En retard</p></div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-emerald-600">{modalData?.termine}</p><p className="text-sm text-gray-600">Terminés</p></div>
          </div>
          <FilterButtons 
            filters={[
              { value: 'tous', label: 'Tous', count: savList.length },
              { value: 'en_retard', label: 'En retard', count: savList.filter(i => i.statut === 'en_retard').length },
              { value: 'en_cours', label: 'En cours', count: savList.filter(i => i.statut === 'en_cours').length },
              { value: 'termine', label: 'Terminés', count: savList.filter(i => i.statut === 'termine').length }
            ]}
            currentFilter={filter}
            onFilterChange={setFilter}
          />
          <div className="border rounded-xl divide-y max-h-80 overflow-y-auto">
            {getFilteredSav().map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">{item.id}</div>
                  <div><p className="font-medium text-gray-900">{item.numero}</p><p className="text-sm text-gray-500">{item.client} • {item.technicien}</p></div>
                </div>
                {getStatusBadge(item.statut)}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Modal Travaux */}
      <Modal isOpen={selectedModal === 'travaux'} onClose={closeModal} title="Détail Travaux" subtitle="Suivi des chantiers" icon={HardHat} iconColor="amber" size="lg" footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={closeModal}>Fermer</Button><Button variant="primary" icon={ArrowRight} iconPosition="right">Planifier</Button></div>}>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-amber-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-amber-600">{modalData?.total}</p><p className="text-sm text-gray-600">Total</p></div>
            <div className="bg-red-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-red-600">{modalData?.enAttente}</p><p className="text-sm text-gray-600">En attente</p></div>
            <div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-blue-600">{modalData?.planifies}</p><p className="text-sm text-gray-600">Planifiés</p></div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-emerald-600">{modalData?.termine}</p><p className="text-sm text-gray-600">Terminés</p></div>
          </div>
          <FilterButtons 
            filters={[
              { value: 'tous', label: 'Tous', count: travauxList.length },
              { value: 'en_attente', label: 'En attente', count: travauxList.filter(i => i.statut === 'en_attente').length },
              { value: 'planifie', label: 'Planifiés', count: travauxList.filter(i => i.statut === 'planifie').length },
              { value: 'en_cours', label: 'En cours', count: travauxList.filter(i => i.statut === 'en_cours').length },
              { value: 'termine', label: 'Terminés', count: travauxList.filter(i => i.statut === 'termine').length }
            ]}
            currentFilter={filter}
            onFilterChange={setFilter}
          />
          <div className="border rounded-xl divide-y max-h-80 overflow-y-auto">
            {getFilteredTravaux().map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">{item.id}</div>
                  <div><p className="font-medium text-gray-900">{item.numero}</p><p className="text-sm text-gray-500">{item.client} • {item.technicien}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{item.montant.toLocaleString()}€</span>
                  {getStatusBadge(item.statut)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Modal Maintenance */}
      <Modal isOpen={selectedModal === 'maintenance'} onClose={closeModal} title="Détail Maintenance" subtitle="Suivi des maintenances" icon={Settings2} iconColor="green" size="lg" footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={closeModal}>Fermer</Button><Button variant="primary" icon={ArrowRight} iconPosition="right">Voir tout</Button></div>}>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-emerald-600">{modalData?.total}</p><p className="text-sm text-gray-600">Total</p></div>
            <div className="bg-green-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-green-600">{modalData?.effectuee}</p><p className="text-sm text-gray-600">Effectuées</p></div>
            <div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-blue-600">{modalData?.semaine}</p><p className="text-sm text-gray-600">À venir semaine</p></div>
            <div className="bg-red-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-red-600">{modalData?.enRetard}</p><p className="text-sm text-gray-600">En retard</p></div>
          </div>
          <FilterButtons 
            filters={[
              { value: 'tous', label: 'Tous', count: maintenanceList.length },
              { value: 'effectuee', label: 'Effectuées', count: maintenanceList.filter(i => i.statut === 'effectuee').length },
              { value: 'a_venir', label: 'À venir', count: maintenanceList.filter(i => i.statut === 'a_venir').length },
              { value: 'en_retard', label: 'En retard', count: maintenanceList.filter(i => i.statut === 'en_retard').length }
            ]}
            currentFilter={filter}
            onFilterChange={setFilter}
          />
          <div className="border rounded-xl divide-y max-h-80 overflow-y-auto">
            {getFilteredMaintenance().map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${item.statut === 'en_retard' ? 'bg-gradient-to-br from-red-500 to-rose-500' : item.statut === 'effectuee' ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gradient-to-br from-blue-500 to-indigo-500'}`}>{item.id}</div>
                  <div><p className="font-medium text-gray-900">{item.client}</p><p className="text-sm text-gray-500">{item.site} • {item.type}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{item.date}</span>
                  {item.statut === 'en_retard' ? <Badge variant="danger">-{item.jours}j</Badge> : getStatusBadge(item.statut)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Modal Devis */}
      <Modal isOpen={selectedModal === 'devis'} onClose={closeModal} title="Détail Devis" subtitle="Suivi des devis" icon={FileText} iconColor="purple" size="lg" footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={closeModal}>Fermer</Button><Button variant="primary" icon={ArrowRight} iconPosition="right">Créer un devis</Button></div>}>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-purple-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-purple-600">{modalData?.total}</p><p className="text-sm text-gray-600">Total</p></div>
            <div className="bg-amber-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-amber-600">{modalData?.enAttente}</p><p className="text-sm text-gray-600">En attente</p></div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-emerald-600">{modalData?.accepte}</p><p className="text-sm text-gray-600">Acceptés</p></div>
            <div className="bg-red-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-red-600">{modalData?.refuse}</p><p className="text-sm text-gray-600">Refusés</p></div>
          </div>
          <FilterButtons 
            filters={[
              { value: 'tous', label: 'Tous', count: devisList.length },
              { value: 'en_attente', label: 'En attente', count: devisList.filter(i => i.statut === 'en_attente').length },
              { value: 'accepte', label: 'Acceptés', count: devisList.filter(i => i.statut === 'accepte').length },
              { value: 'refuse', label: 'Refusés', count: devisList.filter(i => i.statut === 'refuse').length }
            ]}
            currentFilter={filter}
            onFilterChange={setFilter}
          />
          <div className="border rounded-xl divide-y max-h-80 overflow-y-auto">
            {getFilteredDevis().map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-bold">{item.id}</div>
                  <div><p className="font-medium text-gray-900">{item.numero}</p><p className="text-sm text-gray-500">{item.client} • {item.date}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{item.montant.toLocaleString()}€</span>
                  {getStatusBadge(item.statut)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Modal Factures */}
      <Modal isOpen={selectedModal === 'factures'} onClose={closeModal} title="Détail Factures" subtitle="Suivi des paiements" icon={Receipt} iconColor="green" size="lg" footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={closeModal}>Fermer</Button><Button variant="primary" icon={ArrowRight} iconPosition="right">Voir les factures</Button></div>}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-emerald-600">{modalData?.total}</p><p className="text-sm text-gray-600">Total</p></div>
            <div className="bg-green-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-green-600">{modalData?.payees}</p><p className="text-sm text-gray-600">Payées</p></div>
            <div className="bg-red-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-red-600">{modalData?.impayees}</p><p className="text-sm text-gray-600">Impayées</p></div>
          </div>
          <FilterButtons 
            filters={[
              { value: 'tous', label: 'Toutes', count: facturesList.length },
              { value: 'payee', label: 'Payées', count: facturesList.filter(i => i.statut === 'payee').length },
              { value: 'impayee', label: 'Impayées', count: facturesList.filter(i => i.statut === 'impayee').length }
            ]}
            currentFilter={filter}
            onFilterChange={setFilter}
          />
          <div className="border rounded-xl divide-y max-h-80 overflow-y-auto">
            {getFilteredFactures().map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${item.statut === 'payee' ? 'bg-gradient-to-br from-emerald-500 to-green-500' : 'bg-gradient-to-br from-red-500 to-rose-500'}`}>{item.id}</div>
                  <div><p className="font-medium text-gray-900">{item.numero}</p><p className="text-sm text-gray-500">{item.client} • {item.statut === 'payee' ? `Payée le ${item.date}` : `Échéance: ${item.echeance}`}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{item.montant.toLocaleString()}€</span>
                  {getStatusBadge(item.statut)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
