// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Wrench, HardHat, FileText, Receipt, AlertTriangle, Users, Building2, Calendar, TrendingUp, CheckCircle2, ArrowRight, Shield, Package, RefreshCw } from 'lucide-react';
import { Card, StatCard, Modal, Button, Badge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';

const DashboardPage = () => {
  const { userData } = useAuth();
  const [selectedModal, setSelectedModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [filter, setFilter] = useState('tous');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    clients: { total: 0 },
    sites: { total: 0 },
    equipements: { total: 0, conformes: 0, nonConformes: 0 },
    interventions: { total: 0, enCours: 0, planifiees: 0, terminees: 0 },
    sav: { total: 0, urgentes: 0, enCours: 0 },
    devis: { total: 0, enAttente: 0, signes: 0, refuses: 0, montant: 0 },
    factures: { total: 0, payees: 0, impayees: 0, enRetard: 0, montant: 0, montantImpaye: 0 }
  });

  const [interventionsList, setInterventionsList] = useState([]);
  const [savList, setSavList] = useState([]);
  const [devisList, setDevisList] = useState([]);
  const [facturesList, setFacturesList] = useState([]);
  const [equipementsList, setEquipementsList] = useState([]);
  const [alertes, setAlertes] = useState([]);

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchStats(), fetchInterventions(), fetchSav(), fetchDevis(), fetchFactures(), fetchEquipements()]);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const fetchStats = async () => {
    try {
      const [
        { count: clientsCount },
        { count: sitesCount },
        { count: equipementsCount },
        { count: equipementsNC },
        { count: interventionsTotal },
        { count: interventionsEC },
        { count: interventionsP },
        { count: interventionsT },
        { count: savTotal },
        { count: savUrgentes },
        { count: savEnCours },
        { data: devisData },
        { data: facturesData }
      ] = await Promise.all([
        supabase.from('clients_payeurs').select('*', { count: 'exact', head: true }),
        supabase.from('sites').select('*', { count: 'exact', head: true }),
        supabase.from('equipements').select('*', { count: 'exact', head: true }),
        supabase.from('equipements').select('*', { count: 'exact', head: true }).eq('conforme', false),
        supabase.from('interventions').select('*', { count: 'exact', head: true }),
        supabase.from('interventions').select('*', { count: 'exact', head: true }).eq('statut', 'en_cours'),
        supabase.from('interventions').select('*', { count: 'exact', head: true }).eq('statut', 'planifie'),
        supabase.from('interventions').select('*', { count: 'exact', head: true }).eq('statut', 'termine'),
        supabase.from('demandes_sav').select('*', { count: 'exact', head: true }),
        supabase.from('demandes_sav').select('*', { count: 'exact', head: true }).eq('niveau_urgence', 'urgente'),
        supabase.from('demandes_sav').select('*', { count: 'exact', head: true }).eq('statut', 'en_cours'),
        supabase.from('devis').select('statut, total_ht'),
        supabase.from('factures').select('statut_paiement, total_ttc, reste_a_payer')
      ]);

      setStats({
        clients: { total: clientsCount || 0 },
        sites: { total: sitesCount || 0 },
        equipements: { total: equipementsCount || 0, conformes: (equipementsCount || 0) - (equipementsNC || 0), nonConformes: equipementsNC || 0 },
        interventions: { total: interventionsTotal || 0, enCours: interventionsEC || 0, planifiees: interventionsP || 0, terminees: interventionsT || 0 },
        sav: { total: savTotal || 0, urgentes: savUrgentes || 0, enCours: savEnCours || 0 },
        devis: {
          total: devisData?.length || 0,
          enAttente: devisData?.filter(d => d.statut === 'envoye')?.length || 0,
          signes: devisData?.filter(d => d.statut === 'signe')?.length || 0,
          refuses: devisData?.filter(d => d.statut === 'refuse')?.length || 0,
          montant: devisData?.reduce((acc, d) => acc + (d.total_ht || 0), 0) || 0
        },
        factures: {
          total: facturesData?.length || 0,
          payees: facturesData?.filter(f => f.statut_paiement === 'paye')?.length || 0,
          impayees: facturesData?.filter(f => f.statut_paiement === 'en_attente')?.length || 0,
          enRetard: facturesData?.filter(f => f.statut_paiement === 'en_retard')?.length || 0,
          montant: facturesData?.reduce((acc, f) => acc + (f.total_ttc || 0), 0) || 0,
          montantImpaye: facturesData?.reduce((acc, f) => acc + (f.reste_a_payer || 0), 0) || 0
        }
      });
    } catch (error) { console.error('Erreur fetchStats:', error); }
  };

  const fetchInterventions = async () => {
    try {
      const { data } = await supabase.from('interventions').select('*, sites(nom), clients_payeurs(raison_sociale), techniciens(nom, prenom)').order('date_planifiee', { ascending: false }).limit(20);
      setInterventionsList(data || []);
    } catch (error) { console.error('Erreur:', error); }
  };

  const fetchSav = async () => {
    try {
      const { data } = await supabase.from('demandes_sav').select('*, sites(nom), clients_payeurs(raison_sociale)').order('created_at', { ascending: false }).limit(20);
      setSavList(data || []);
    } catch (error) { console.error('Erreur:', error); }
  };

  const fetchDevis = async () => {
    try {
      const { data } = await supabase.from('devis').select('*, clients_payeurs(raison_sociale)').order('date_creation', { ascending: false }).limit(20);
      setDevisList(data || []);
    } catch (error) { console.error('Erreur:', error); }
  };

  const fetchFactures = async () => {
    try {
      const { data } = await supabase.from('factures').select('*, clients_payeurs(raison_sociale)').order('date_emission', { ascending: false }).limit(20);
      setFacturesList(data || []);
    } catch (error) { console.error('Erreur:', error); }
  };

  const fetchEquipements = async () => {
    try {
      const { data } = await supabase.from('equipements').select('*, sites(nom)').eq('conforme', false).limit(20);
      setEquipementsList(data || []);
    } catch (error) { console.error('Erreur:', error); }
  };

  useEffect(() => {
    if (!loading) {
      const newAlertes = [];
      if (stats.equipements.nonConformes > 0) newAlertes.push({ id: 1, type: 'critique', message: `${stats.equipements.nonConformes} équipement(s) non conforme(s)`, date: 'À traiter', icon: Shield });
      if (stats.sav.urgentes > 0) newAlertes.push({ id: 2, type: 'important', message: `${stats.sav.urgentes} demande(s) SAV urgente(s)`, date: 'En attente', icon: Wrench });
      if (stats.factures.enRetard > 0) newAlertes.push({ id: 3, type: 'important', message: `${stats.factures.enRetard} facture(s) en retard`, date: `${stats.factures.montantImpaye.toLocaleString()}€`, icon: Receipt });
      if (stats.devis.enAttente > 0) newAlertes.push({ id: 4, type: 'info', message: `${stats.devis.enAttente} devis en attente`, date: 'À relancer', icon: FileText });
      setAlertes(newAlertes);
    }
  }, [stats, loading]);

  const openModal = (type, data) => { setSelectedModal(type); setModalData(data); setFilter('tous'); };
  const closeModal = () => { setSelectedModal(null); setModalData(null); setFilter('tous'); };

  const AlertItem = ({ alerte }) => {
    const typeStyles = { critique: 'border-l-red-500 bg-red-50', important: 'border-l-amber-500 bg-amber-50', info: 'border-l-blue-500 bg-blue-50' };
    const Icon = alerte.icon;
    return (
      <div className={`flex items-center gap-4 p-4 rounded-xl border-l-4 ${typeStyles[alerte.type]} hover:scale-[1.02] transition-transform cursor-pointer`}>
        <div className={`p-2 rounded-lg ${alerte.type === 'critique' ? 'bg-red-500' : alerte.type === 'important' ? 'bg-amber-500' : 'bg-blue-500'}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 text-sm">{alerte.message}</p>
          <p className="text-xs text-gray-500 mt-0.5">{alerte.date}</p>
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
      en_retard: { variant: 'danger', label: 'En retard' }, en_cours: { variant: 'warning', label: 'En cours' },
      termine: { variant: 'success', label: 'Terminé' }, planifie: { variant: 'primary', label: 'Planifié' },
      en_attente: { variant: 'warning', label: 'En attente' }, nouvelle: { variant: 'info', label: 'Nouvelle' },
      envoye: { variant: 'warning', label: 'Envoyé' }, signe: { variant: 'success', label: 'Signé' },
      refuse: { variant: 'danger', label: 'Refusé' }, paye: { variant: 'success', label: 'Payée' },
      urgente: { variant: 'danger', label: 'Urgent' }, normale: { variant: 'default', label: 'Normale' }
    };
    const config = variants[statut] || { variant: 'default', label: statut };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const FilterButtons = ({ filters, currentFilter, onFilterChange }) => (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl">
      {filters.map(f => (
        <button key={f.value} onClick={() => onFilterChange(f.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentFilter === f.value ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
          {f.label} {f.count !== undefined && <span className={`ml-1 ${currentFilter === f.value ? 'text-blue-200' : 'text-gray-400'}`}>({f.count})</span>}
        </button>
      ))}
    </div>
  );

  const getFilteredInterventions = () => filter === 'tous' ? interventionsList : interventionsList.filter(i => i.statut === filter);
  const getFilteredDevis = () => filter === 'tous' ? devisList : devisList.filter(i => i.statut === filter);
  const getFilteredFactures = () => filter === 'tous' ? facturesList : facturesList.filter(i => i.statut_paiement === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <button onClick={handleRefresh} disabled={refreshing} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <h1 className="text-3xl font-bold mt-2">Bonjour, {userData?.prenom || 'Admin'} 👋</h1>
          <p className="text-blue-100 mt-2">Vous avez <span className="text-white font-semibold">{stats.equipements.nonConformes} équipement(s) non conforme(s)</span> et <span className="text-white font-semibold">{stats.interventions.enCours} intervention(s)</span> en cours.</p>
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2"><div className="p-2 rounded-lg bg-white/20"><Users className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{stats.clients.total}</p><p className="text-xs text-blue-100">Clients</p></div></div>
            <div className="flex items-center gap-2"><div className="p-2 rounded-lg bg-white/20"><Building2 className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{stats.sites.total}</p><p className="text-xs text-blue-100">Sites</p></div></div>
            <div className="flex items-center gap-2"><div className="p-2 rounded-lg bg-white/20"><Package className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{stats.equipements.total}</p><p className="text-xs text-blue-100">Équipements</p></div></div>
            <div className="flex items-center gap-2"><div className="p-2 rounded-lg bg-white/20"><TrendingUp className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{stats.factures.montant.toLocaleString()}€</p><p className="text-xs text-blue-100">CA Facturé</p></div></div>
          </div>
        </div>
      </div>

      {/* Stats Activité Terrain */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Wrench className="w-5 h-5 text-blue-500" />Activité Terrain</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Interventions" value={stats.interventions.total} subtitle={`${stats.interventions.enCours} en cours`} icon={Wrench} color="blue" onClick={() => openModal('interventions', stats.interventions)} pulse={stats.interventions.enCours > 0} />
          <StatCard title="SAV" value={stats.sav.total} subtitle={`${stats.sav.urgentes} urgente(s)`} icon={HardHat} color="amber" onClick={() => openModal('sav', stats.sav)} pulse={stats.sav.urgentes > 0} />
          <StatCard title="Équipements" value={stats.equipements.total} subtitle={`${stats.equipements.nonConformes} non conforme(s)`} icon={Package} color={stats.equipements.nonConformes > 0 ? 'red' : 'green'} onClick={() => openModal('equipements', stats.equipements)} pulse={stats.equipements.nonConformes > 0} />
          <StatCard title="Devis" value={stats.devis.total} subtitle={`${stats.devis.enAttente} en attente`} icon={FileText} color="purple" onClick={() => openModal('devis', stats.devis)} />
          <StatCard title="Factures" value={stats.factures.total} subtitle={`${stats.factures.impayees + stats.factures.enRetard} impayée(s)`} icon={Receipt} color={stats.factures.enRetard > 0 ? 'red' : 'green'} onClick={() => openModal('factures', stats.factures)} pulse={stats.factures.enRetard > 0} />
        </div>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none" className="overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" />Alertes</h3>
            {alertes.filter(a => a.type === 'critique').length > 0 && <Badge variant="danger" pulse>{alertes.filter(a => a.type === 'critique').length} critique(s)</Badge>}
          </div>
          <div className="p-4 space-y-3">
            {alertes.length > 0 ? alertes.map(alerte => <AlertItem key={alerte.id} alerte={alerte} />) : (
              <div className="text-center py-8 text-gray-500"><CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" /><p>Aucune alerte</p></div>
            )}
          </div>
        </Card>

        <Card padding="none" className="overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-500" />Interventions Récentes</h3>
            <Badge variant="primary">{interventionsList.length}</Badge>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {interventionsList.slice(0, 5).map(intervention => (
              <div key={intervention.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100"><Wrench className="w-4 h-4 text-blue-600" /></div>
                    <div>
                      <p className="font-medium text-gray-900">{intervention.clients_payeurs?.raison_sociale || 'Client'}</p>
                      <p className="text-sm text-gray-500">{intervention.type_intervention} • {intervention.sites?.nom || 'Site'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(intervention.statut)}
                    <p className="text-xs text-gray-500 mt-1">{intervention.date_planifiee ? new Date(intervention.date_planifiee).toLocaleDateString('fr-FR') : '-'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100">
            <Button variant="ghost" fullWidth icon={ArrowRight} iconPosition="right" onClick={() => openModal('interventions', stats.interventions)}>Voir toutes</Button>
          </div>
        </Card>
      </div>

      {/* Modal Interventions */}
      <Modal isOpen={selectedModal === 'interventions'} onClose={closeModal} title="Interventions" subtitle="Suivi terrain" icon={Wrench} iconColor="blue" size="lg"
        footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={closeModal}>Fermer</Button><Button variant="primary">Nouvelle</Button></div>}>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-blue-600">{modalData?.total || 0}</p><p className="text-sm text-gray-600">Total</p></div>
            <div className="bg-amber-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-amber-600">{modalData?.enCours || 0}</p><p className="text-sm text-gray-600">En cours</p></div>
            <div className="bg-indigo-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-indigo-600">{modalData?.planifiees || 0}</p><p className="text-sm text-gray-600">Planifiées</p></div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-emerald-600">{modalData?.terminees || 0}</p><p className="text-sm text-gray-600">Terminées</p></div>
          </div>
          <FilterButtons filters={[
            { value: 'tous', label: 'Toutes', count: interventionsList.length },
            { value: 'en_cours', label: 'En cours', count: interventionsList.filter(i => i.statut === 'en_cours').length },
            { value: 'planifie', label: 'Planifiées', count: interventionsList.filter(i => i.statut === 'planifie').length },
            { value: 'termine', label: 'Terminées', count: interventionsList.filter(i => i.statut === 'termine').length }
          ]} currentFilter={filter} onFilterChange={setFilter} />
          <div className="border rounded-xl divide-y max-h-80 overflow-y-auto">
            {getFilteredInterventions().map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">{item.numero?.slice(-2) || '?'}</div>
                  <div><p className="font-medium text-gray-900">{item.numero}</p><p className="text-sm text-gray-500">{item.clients_payeurs?.raison_sociale} • {item.sites?.nom}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{item.techniciens ? `${item.techniciens.prenom} ${item.techniciens.nom}` : '-'}</span>
                  {getStatusBadge(item.statut)}
                </div>
              </div>
            ))}
            {getFilteredInterventions().length === 0 && <div className="p-8 text-center text-gray-500">Aucune intervention</div>}
          </div>
        </div>
      </Modal>

      {/* Modal SAV */}
      <Modal isOpen={selectedModal === 'sav'} onClose={closeModal} title="Demandes SAV" icon={HardHat} iconColor="amber" size="lg"
        footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={closeModal}>Fermer</Button></div>}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-amber-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-amber-600">{modalData?.total || 0}</p><p className="text-sm text-gray-600">Total</p></div>
            <div className="bg-red-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-red-600">{modalData?.urgentes || 0}</p><p className="text-sm text-gray-600">Urgentes</p></div>
            <div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-blue-600">{modalData?.enCours || 0}</p><p className="text-sm text-gray-600">En cours</p></div>
          </div>
          <div className="border rounded-xl divide-y max-h-80 overflow-y-auto">
            {savList.map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${item.niveau_urgence === 'urgente' ? 'bg-gradient-to-br from-red-500 to-rose-500' : 'bg-gradient-to-br from-amber-500 to-orange-500'}`}>{item.numero?.slice(-2) || '?'}</div>
                  <div><p className="font-medium text-gray-900">{item.numero}</p><p className="text-sm text-gray-500">{item.clients_payeurs?.raison_sociale} • {item.type_probleme}</p></div>
                </div>
                <div className="flex items-center gap-2">{getStatusBadge(item.niveau_urgence)}{getStatusBadge(item.statut)}</div>
              </div>
            ))}
            {savList.length === 0 && <div className="p-8 text-center text-gray-500">Aucune demande SAV</div>}
          </div>
        </div>
      </Modal>

      {/* Modal Équipements */}
      <Modal isOpen={selectedModal === 'equipements'} onClose={closeModal} title="Équipements" icon={Package} iconColor="red" size="lg"
        footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={closeModal}>Fermer</Button></div>}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-blue-600">{modalData?.total || 0}</p><p className="text-sm text-gray-600">Total</p></div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-emerald-600">{modalData?.conformes || 0}</p><p className="text-sm text-gray-600">Conformes</p></div>
            <div className="bg-red-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-red-600">{modalData?.nonConformes || 0}</p><p className="text-sm text-gray-600">Non conformes</p></div>
          </div>
          <div className="border rounded-xl divide-y max-h-80 overflow-y-auto">
            {equipementsList.map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white"><Package className="w-5 h-5" /></div>
                  <div><p className="font-medium text-gray-900">{item.numero_interne}</p><p className="text-sm text-gray-500">{item.designation} • {item.sites?.nom}</p></div>
                </div>
                <div className="flex items-center gap-2"><Badge variant="default">{item.module}</Badge><Badge variant="danger">Non conforme</Badge></div>
              </div>
            ))}
            {equipementsList.length === 0 && <div className="p-8 text-center text-emerald-500"><CheckCircle2 className="w-12 h-12 mx-auto mb-2" /><p>Tous conformes !</p></div>}
          </div>
        </div>
      </Modal>

      {/* Modal Devis */}
      <Modal isOpen={selectedModal === 'devis'} onClose={closeModal} title="Devis" icon={FileText} iconColor="purple" size="lg"
        footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={closeModal}>Fermer</Button><Button variant="primary">Créer</Button></div>}>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-purple-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-purple-600">{modalData?.total || 0}</p><p className="text-sm text-gray-600">Total</p></div>
            <div className="bg-amber-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-amber-600">{modalData?.enAttente || 0}</p><p className="text-sm text-gray-600">En attente</p></div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-emerald-600">{modalData?.signes || 0}</p><p className="text-sm text-gray-600">Signés</p></div>
            <div className="bg-red-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-red-600">{modalData?.refuses || 0}</p><p className="text-sm text-gray-600">Refusés</p></div>
          </div>
          <FilterButtons filters={[
            { value: 'tous', label: 'Tous', count: devisList.length },
            { value: 'envoye', label: 'En attente', count: devisList.filter(i => i.statut === 'envoye').length },
            { value: 'signe', label: 'Signés', count: devisList.filter(i => i.statut === 'signe').length },
            { value: 'refuse', label: 'Refusés', count: devisList.filter(i => i.statut === 'refuse').length }
          ]} currentFilter={filter} onFilterChange={setFilter} />
          <div className="border rounded-xl divide-y max-h-80 overflow-y-auto">
            {getFilteredDevis().map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-bold">{item.numero?.slice(-2) || '?'}</div>
                  <div><p className="font-medium text-gray-900">{item.numero}</p><p className="text-sm text-gray-500">{item.clients_payeurs?.raison_sociale} • {item.objet}</p></div>
                </div>
                <div className="flex items-center gap-3"><span className="font-semibold text-gray-900">{item.total_ttc?.toLocaleString()}€</span>{getStatusBadge(item.statut)}</div>
              </div>
            ))}
            {getFilteredDevis().length === 0 && <div className="p-8 text-center text-gray-500">Aucun devis</div>}
          </div>
        </div>
      </Modal>

      {/* Modal Factures */}
      <Modal isOpen={selectedModal === 'factures'} onClose={closeModal} title="Factures" icon={Receipt} iconColor="green" size="lg"
        footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={closeModal}>Fermer</Button></div>}>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-emerald-600">{modalData?.total || 0}</p><p className="text-sm text-gray-600">Total</p></div>
            <div className="bg-green-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-green-600">{modalData?.payees || 0}</p><p className="text-sm text-gray-600">Payées</p></div>
            <div className="bg-amber-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-amber-600">{modalData?.impayees || 0}</p><p className="text-sm text-gray-600">En attente</p></div>
            <div className="bg-red-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-red-600">{modalData?.enRetard || 0}</p><p className="text-sm text-gray-600">En retard</p></div>
          </div>
          <FilterButtons filters={[
            { value: 'tous', label: 'Toutes', count: facturesList.length },
            { value: 'paye', label: 'Payées', count: facturesList.filter(i => i.statut_paiement === 'paye').length },
            { value: 'en_attente', label: 'En attente', count: facturesList.filter(i => i.statut_paiement === 'en_attente').length },
            { value: 'en_retard', label: 'En retard', count: facturesList.filter(i => i.statut_paiement === 'en_retard').length }
          ]} currentFilter={filter} onFilterChange={setFilter} />
          <div className="border rounded-xl divide-y max-h-80 overflow-y-auto">
            {getFilteredFactures().map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${item.statut_paiement === 'paye' ? 'bg-gradient-to-br from-emerald-500 to-green-500' : item.statut_paiement === 'en_retard' ? 'bg-gradient-to-br from-red-500 to-rose-500' : 'bg-gradient-to-br from-amber-500 to-orange-500'}`}>{item.numero?.slice(-2) || '?'}</div>
                  <div><p className="font-medium text-gray-900">{item.numero}</p><p className="text-sm text-gray-500">{item.clients_payeurs?.raison_sociale}</p></div>
                </div>
                <div className="flex items-center gap-3"><span className="font-semibold text-gray-900">{item.total_ttc?.toLocaleString()}€</span>{getStatusBadge(item.statut_paiement)}</div>
              </div>
            ))}
            {getFilteredFactures().length === 0 && <div className="p-8 text-center text-gray-500">Aucune facture</div>}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
