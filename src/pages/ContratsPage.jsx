// =============================================================================
// EASY INCENDIE - ContratsPage.jsx
// VERSION 4.1 - Multi-sites + Multi-domaines (visites gérées dans SitesPage)
// ⚠️ ATTENTION: PAS de colonne "notes" dans la table contrats
// ⚠️ BDD V3: contrats.domaines text[] (pas domaine text)
// ⚠️ BDD V3: contrats_sites junction (contrat_id, site_id, domaines[])
// ⚠️ BDD V3: contrats.site_id SUPPRIMÉ
// ⚠️ Numéro contrat: CT-ANNEE-SEQ (ex: CT-2026-001)
// =============================================================================

import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import * as XLSX from 'xlsx';
import {
  FileText, Plus, Search, Download, Upload,
  Edit3, Trash2, Eye, Phone, Mail, MapPin,
  CheckCircle, XCircle, X, Save, Clock,
  AlertCircle, Calendar, ArrowUp, ArrowDown,
  ChevronUp, ChevronDown, Building2, Wrench,
  RefreshCw, Shield, Info, ExternalLink, Hash,
  Check, Layers
} from 'lucide-react';

// =============================================================================
// CONSTANTES MÉTIER
// =============================================================================

const DOMAINES = [
  { code: 'SSI', label: 'Système de Sécurité Incendie', short: 'SSI' },
  { code: 'DSF', label: 'Désenfumage', short: 'DSF' },
  { code: 'CMP', label: 'Compartimentage', short: 'CMP' },
  { code: 'BAES', label: 'Éclairage de Sécurité', short: 'BAES' },
  { code: 'EXT', label: 'Extincteurs', short: 'EXT' },
  { code: 'RIA', label: 'Robinets Incendie', short: 'RIA' },
  { code: 'COLSEC', label: 'Colonnes Sèches', short: 'COLSEC' },
];

const TYPES_CONTRAT = [
  { value: 'base', label: 'Base' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'sur_mesure', label: 'Sur mesure' },
];

const PERIODICITES = [
  { value: 'mensuel', label: 'Mensuel' },
  { value: 'trimestriel', label: 'Trimestriel' },
  { value: 'semestriel', label: 'Semestriel' },
  { value: 'annuel', label: 'Annuel' },
];

const STATUTS = [
  { value: 'actif', label: 'Actif', color: 'green' },
  { value: 'en_attente', label: 'En attente', color: 'yellow' },
  { value: 'suspendu', label: 'Suspendu', color: 'orange' },
  { value: 'resilie', label: 'Résilié', color: 'red' },
  { value: 'termine', label: 'Terminé', color: 'gray' },
];

// Helper: Couleur badge domaine
const getDomaineBadge = (code) => {
  const map = {
    SSI: 'bg-red-100 text-red-700',
    DSF: 'bg-blue-100 text-blue-700',
    CMP: 'bg-purple-100 text-purple-700',
    BAES: 'bg-yellow-100 text-yellow-800',
    EXT: 'bg-rose-100 text-rose-700',
    RIA: 'bg-cyan-100 text-cyan-700',
    COLSEC: 'bg-gray-100 text-gray-700',
  };
  return map[code] || 'bg-gray-100 text-gray-700';
};

// Helper: Couleur badge statut
const getStatutBadge = (value) => {
  const map = {
    actif: 'bg-green-100 text-green-700',
    en_attente: 'bg-yellow-100 text-yellow-800',
    suspendu: 'bg-orange-100 text-orange-700',
    resilie: 'bg-red-100 text-red-700',
    termine: 'bg-gray-100 text-gray-600',
  };
  return map[value] || 'bg-gray-100 text-gray-600';
};

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================
export default function ContratsPage() {
  const { orgId } = useAuth();

  // États principaux
  const [contrats, setContrats] = useState([]);
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDomaine, setFilterDomaine] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterKpi, setFilterKpi] = useState('');  // '', 'expire_soon'
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  // Sélection multiple
  const [selectedContrats, setSelectedContrats] = useState([]);

  // Modal création/édition
  const [showModal, setShowModal] = useState(false);
  const [editingContrat, setEditingContrat] = useState(null);
  const [saving, setSaving] = useState(false);

  // Modal fiche contrat (détails)
  const [showDetails, setShowDetails] = useState(false);
  const [detailsContrat, setDetailsContrat] = useState(null);
  const [detailsTab, setDetailsTab] = useState('fiche');

  // Import/Export modals
  const [showImportHelp, setShowImportHelp] = useState(false);
  const [showExportHelp, setShowExportHelp] = useState(false);
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);

  // Refs pour scroll
  const tableContainerRef = useRef(null);

  // =========================================================================
  // FORMULAIRE MULTI-SITES / MULTI-DOMAINES
  // =========================================================================
  const [form, setForm] = useState({
    client_id: '',
    numero_contrat: '',
    domaines: [],               // Domaines du contrat (master list)
    type_contrat: 'base',
    periodicite: 'annuel',
    nb_visites_an: 1,
    prestations_incluses: {},
    prix_annuel_ht: null,
    date_debut: '',
    date_fin: '',
    reconduction_auto: true,
    preavis_jours: 90,
    statut: 'actif'
  });

  // Sites sélectionnés : { site_id: { domaines: [] } }
  const [formSites, setFormSites] = useState({});

  // Sites filtrés par client sélectionné
  const [filteredSites, setFilteredSites] = useState([]);

  // Scroll helpers
  const scrollToTop = (ref) => { if (ref?.current) ref.current.scrollTo({ top: 0, behavior: 'smooth' }); };
  const scrollToBottom = (ref) => { if (ref?.current) ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' }); };

  // =============================================================================
  // CHARGEMENT DONNÉES
  // =============================================================================
  useEffect(() => {
    if (orgId) {
      loadContrats();
      loadClients();
      loadSites();
    }
  }, [orgId]);

  // Filtrer sites quand client change dans le formulaire
  useEffect(() => {
    if (form.client_id) {
      setFilteredSites(sites.filter(s => s.client_id === form.client_id));
    } else {
      setFilteredSites([]);
    }
  }, [form.client_id, sites]);

  const loadContrats = async () => {
    setLoading(true);
    try {
      // Charger contrats avec client
      const { data: contratsData, error: contratsError } = await supabase
        .from('contrats')
        .select(`
          *,
          client:clients(raison_sociale)
        `)
        .eq('organisation_id', orgId)
        .order('created_at', { ascending: false });

      if (contratsError) throw contratsError;

      // Charger tous les contrats_sites avec infos site + dates visite
      const { data: csData, error: csError } = await supabase
        .from('contrats_sites')
        .select(`
          id, contrat_id, site_id, domaines,
          site:sites(nom, adresse, ville)
        `)
        .eq('organisation_id', orgId);

      if (csError) throw csError;

      // Fusionner : chaque contrat reçoit son tableau de sites
      const contratsList = (contratsData || []).map(c => ({
        ...c,
        contrats_sites: (csData || []).filter(cs => cs.contrat_id === c.id)
      }));

      setContrats(contratsList);
    } catch (err) {
      console.error('Erreur chargement contrats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('id, raison_sociale')
      .eq('organisation_id', orgId)
      .eq('actif', true)
      .order('raison_sociale');
    setClients(data || []);
  };

  const loadSites = async () => {
    const { data } = await supabase
      .from('sites')
      .select('id, nom, client_id, adresse, ville, domaines_actifs')
      .eq('organisation_id', orgId)
      .eq('actif', true)
      .order('nom');
    setSites(data || []);
  };

  // =============================================================================
  // STATISTIQUES
  // =============================================================================
  const stats = useMemo(() => {
    const today = new Date();
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const actifs = contrats.filter(c => c.statut === 'actif');
    const caTotal = actifs.reduce((sum, c) => sum + (c.prix_annuel_ht || 0), 0);

    // Contrats expirant dans 30 jours
    const expireSoonIds = contrats.filter(c => {
      if (!c.date_fin || c.statut !== 'actif') return false;
      const dateFin = new Date(c.date_fin);
      return dateFin <= in30Days && dateFin >= today;
    }).map(c => c.id);

    return {
      total: contrats.length,
      actifs: actifs.length,
      caTotal,
      expireSoon: expireSoonIds.length,
      expireSoonIds
    };
  }, [contrats]);

  // =============================================================================
  // TRI
  // =============================================================================
  const toggleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIndicator = ({ column }) => {
    if (sortConfig.key !== column) return <ChevronDown className="w-3 h-3 ml-1 opacity-30" />;
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-3 h-3 ml-1 text-white" />
      : <ChevronDown className="w-3 h-3 ml-1 text-white" />;
  };

  // =============================================================================
  // FILTRAGE + TRI
  // =============================================================================
  const filteredContrats = useMemo(() => {
    let filtered = contrats.filter(c => {
      const matchSearch = !search ||
        c.numero_contrat?.toLowerCase().includes(search.toLowerCase()) ||
        c.client?.raison_sociale?.toLowerCase().includes(search.toLowerCase()) ||
        (c.contrats_sites || []).some(cs => cs.site?.nom?.toLowerCase().includes(search.toLowerCase()));
      const matchDomaine = !filterDomaine || (c.domaines || []).includes(filterDomaine);
      const matchStatut = !filterStatut || c.statut === filterStatut;

      // KPI filter
      const matchKpi = !filterKpi ||
        (filterKpi === 'expire_soon' && stats.expireSoonIds.includes(c.id));

      return matchSearch && matchDomaine && matchStatut && matchKpi;
    });

    // Tri
    filtered.sort((a, b) => {
      const dir = sortConfig.direction === 'asc' ? 1 : -1;
      const key = sortConfig.key;

      if (key === 'client') {
        const va = a.client?.raison_sociale || '';
        const vb = b.client?.raison_sociale || '';
        return dir * va.localeCompare(vb);
      }
      if (key === 'sites_count') {
        return dir * ((a.contrats_sites?.length || 0) - (b.contrats_sites?.length || 0));
      }
      if (key === 'prix_annuel_ht') {
        return dir * ((a.prix_annuel_ht || 0) - (b.prix_annuel_ht || 0));
      }
      if (key === 'date_debut' || key === 'date_fin' || key === 'created_at') {
        const da = a[key] ? new Date(a[key]).getTime() : 0;
        const db = b[key] ? new Date(b[key]).getTime() : 0;
        return dir * (da - db);
      }
      const va = a[key] || '';
      const vb = b[key] || '';
      return dir * String(va).localeCompare(String(vb));
    });

    return filtered;
  }, [contrats, search, filterDomaine, filterStatut, filterKpi, stats, sortConfig]);

  // =============================================================================
  // SÉLECTION MULTIPLE
  // =============================================================================
  const toggleSelectAll = () => {
    if (selectedContrats.length === filteredContrats.length) {
      setSelectedContrats([]);
    } else {
      setSelectedContrats(filteredContrats.map(c => c.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedContrats(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // =============================================================================
  // NUMÉRO CONTRAT AUTO
  // =============================================================================
  const generateNumeroContrat = async () => {
    const year = new Date().getFullYear();
    const prefix = `CT-${year}-`;

    // Chercher le dernier numéro CT-ANNEE-XXX pour cette org et cette année
    const { data } = await supabase
      .from('contrats')
      .select('numero_contrat')
      .eq('organisation_id', orgId)
      .like('numero_contrat', `${prefix}%`)
      .order('numero_contrat', { ascending: false })
      .limit(1);

    let nextSeq = 1;
    if (data && data.length > 0) {
      const lastNum = data[0].numero_contrat;
      const lastSeq = parseInt(lastNum.replace(prefix, ''), 10);
      if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
    }

    return `${prefix}${String(nextSeq).padStart(3, '0')}`;
  };

  // =============================================================================
  // FORM HELPERS - Multi-sites / Multi-domaines
  // =============================================================================

  // Toggle un domaine dans le contrat
  const toggleFormDomaine = (code) => {
    setForm(prev => {
      const newDomaines = prev.domaines.includes(code)
        ? prev.domaines.filter(d => d !== code)
        : [...prev.domaines, code];

      // Nettoyer les domaines des sites sélectionnés quand on enlève un domaine du contrat
      if (!newDomaines.includes(code)) {
        setFormSites(prevSites => {
          const updated = { ...prevSites };
          Object.keys(updated).forEach(siteId => {
            const entry = updated[siteId];
            const newDoms = (entry.domaines || []).filter(d => d !== code);
            if (newDoms.length === 0) {
              delete updated[siteId];
            } else {
              updated[siteId] = { ...entry, domaines: newDoms };
            }
          });
          return updated;
        });
      }

      return { ...prev, domaines: newDomaines };
    });
  };

  // Toggle un site dans le contrat
  const toggleFormSite = (siteId) => {
    setFormSites(prev => {
      const updated = { ...prev };
      if (updated[siteId]) {
        delete updated[siteId];
      } else {
        // Par défaut: tous les domaines du contrat + dates vides
        updated[siteId] = { domaines: [...form.domaines] };
      }
      return updated;
    });
  };

  // Toggle un domaine pour un site spécifique
  const toggleSiteDomaine = (siteId, domaineCode) => {
    setFormSites(prev => {
      const updated = { ...prev };
      const entry = updated[siteId] || { domaines: [] };
      const current = entry.domaines || [];
      if (current.includes(domaineCode)) {
        const newDoms = current.filter(d => d !== domaineCode);
        if (newDoms.length === 0) {
          delete updated[siteId];
        } else {
          updated[siteId] = { ...entry, domaines: newDoms };
        }
      } else {
        updated[siteId] = { ...entry, domaines: [...current, domaineCode] };
      }
      return updated;
    });
  };

  // =============================================================================
  // CRUD HANDLERS
  // =============================================================================
  const handleNew = async () => {
    const numero = await generateNumeroContrat();
    setForm({
      client_id: '',
      numero_contrat: numero,
      domaines: [],
      type_contrat: 'base',
      periodicite: 'annuel',
      nb_visites_an: 1,
      prestations_incluses: {},
      prix_annuel_ht: null,
      date_debut: new Date().toISOString().split('T')[0],
      date_fin: '',
      reconduction_auto: true,
      preavis_jours: 90,
      statut: 'actif'
    });
    setFormSites({});
    setEditingContrat(null);
    setShowModal(true);
  };

  const handleEdit = (contrat) => {
    setForm({
      client_id: contrat.client_id || '',
      numero_contrat: contrat.numero_contrat || '',
      domaines: contrat.domaines || [],
      type_contrat: contrat.type_contrat || 'base',
      periodicite: contrat.periodicite || 'annuel',
      nb_visites_an: contrat.nb_visites_an || 1,
      prestations_incluses: contrat.prestations_incluses || {},
      prix_annuel_ht: contrat.prix_annuel_ht || null,
      date_debut: contrat.date_debut || '',
      date_fin: contrat.date_fin || '',
      reconduction_auto: contrat.reconduction_auto !== false,
      preavis_jours: contrat.preavis_jours || 90,
      statut: contrat.statut || 'actif'
    });

    // Charger les sites du contrat dans formSites (nouvelle structure)
    const sitesMap = {};
    (contrat.contrats_sites || []).forEach(cs => {
      sitesMap[cs.site_id] = {
        domaines: cs.domaines || []
      };
    });
    setFormSites(sitesMap);

    setEditingContrat(contrat);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.client_id) { alert('Le client est obligatoire'); return; }
    if (form.domaines.length === 0) { alert('Sélectionnez au moins un domaine'); return; }
    if (Object.keys(formSites).length === 0) { alert('Sélectionnez au moins un site'); return; }

    // Vérifier que chaque site a au moins un domaine
    for (const [siteId, siteData] of Object.entries(formSites)) {
      if (!siteData.domaines || siteData.domaines.length === 0) {
        const site = sites.find(s => s.id === siteId);
        alert(`Le site "${site?.nom || siteId}" n'a aucun domaine sélectionné`);
        return;
      }
    }

    setSaving(true);
    try {
      // Données du contrat (sans site_id ni domaine)
      const contratData = {
        organisation_id: orgId,
        client_id: form.client_id,
        numero_contrat: form.numero_contrat,
        domaines: form.domaines,
        type_contrat: form.type_contrat,
        periodicite: form.periodicite,
        nb_visites_an: form.nb_visites_an,
        prestations_incluses: form.prestations_incluses,
        prix_annuel_ht: form.prix_annuel_ht || null,
        date_debut: form.date_debut || null,
        date_fin: form.date_fin || null,
        reconduction_auto: form.reconduction_auto,
        preavis_jours: form.preavis_jours,
        statut: form.statut,
        updated_at: new Date().toISOString()
      };

      let contratId;

      if (editingContrat) {
        // UPDATE contrat
        const { error } = await supabase.from('contrats').update(contratData).eq('id', editingContrat.id);
        if (error) throw error;
        contratId = editingContrat.id;

        // Supprimer les anciens contrats_sites
        const { error: delError } = await supabase
          .from('contrats_sites')
          .delete()
          .eq('contrat_id', contratId);
        if (delError) throw delError;
      } else {
        // INSERT contrat
        const { data: inserted, error } = await supabase
          .from('contrats')
          .insert([contratData])
          .select('id')
          .single();
        if (error) throw error;
        contratId = inserted.id;
      }

      // INSERT contrats_sites
      const csRows = Object.entries(formSites).map(([siteId, siteData]) => ({
        organisation_id: orgId,
        contrat_id: contratId,
        site_id: siteId,
        domaines: siteData.domaines
      }));

      if (csRows.length > 0) {
        const { error: csError } = await supabase
          .from('contrats_sites')
          .insert(csRows);
        if (csError) throw csError;
      }

      setShowModal(false);
      loadContrats();
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      alert('Erreur lors de la sauvegarde: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (contrat) => {
    if (!confirm(`Supprimer le contrat "${contrat.numero_contrat}" ?`)) return;
    try {
      // contrats_sites supprimés automatiquement (ON DELETE CASCADE)
      const { error } = await supabase.from('contrats').delete().eq('id', contrat.id);
      if (error) throw error;
      loadContrats();
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Supprimer ${selectedContrats.length} contrat(s) sélectionné(s) ?`)) return;
    try {
      const { error } = await supabase.from('contrats').delete().in('id', selectedContrats);
      if (error) throw error;
      setSelectedContrats([]);
      loadContrats();
    } catch (err) {
      console.error('Erreur suppression groupée:', err);
      alert('Erreur lors de la suppression');
    }
  };

  // =============================================================================
  // DETAIL VIEW
  // =============================================================================
  const handleView = (contrat) => {
    setDetailsContrat(contrat);
    setDetailsTab('fiche');
    setShowDetails(true);
  };

  // =============================================================================
  // IMPORT / EXPORT EXCEL
  // =============================================================================
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setShowImportHelp(false);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      let imported = 0;
      for (const row of rows) {
        // Chercher le client par nom
        let clientId = null;
        if (row['Client']) {
          const client = clients.find(c => c.raison_sociale?.toLowerCase() === row['Client']?.toLowerCase());
          if (client) clientId = client.id;
        }
        if (!clientId) continue;

        // Domaines depuis la colonne (séparés par virgule)
        const domaines = row['Domaines']
          ? String(row['Domaines']).split(',').map(d => d.trim().toUpperCase()).filter(d => DOMAINES.some(dom => dom.code === d))
          : ['SSI'];

        const contratData = {
          organisation_id: orgId,
          client_id: clientId,
          numero_contrat: row['N° Contrat'] || `CTR-IMP-${Date.now()}-${imported}`,
          domaines: domaines,
          type_contrat: row['Type'] || 'base',
          periodicite: row['Périodicité'] || 'annuel',
          nb_visites_an: parseInt(row['Visites/an']) || 1,
          prix_annuel_ht: parseFloat(row['Prix HT']) || null,
          date_debut: row['Date début'] || null,
          date_fin: row['Date fin'] || null,
          reconduction_auto: row['Reconduction'] !== 'Non',
          statut: row['Statut'] || 'actif'
        };

        const { data: inserted, error } = await supabase
          .from('contrats')
          .insert([contratData])
          .select('id')
          .single();

        if (!error && inserted) {
          // Si un site est indiqué, créer le lien
          if (row['Site']) {
            const site = sites.find(s => s.nom?.toLowerCase() === row['Site']?.toLowerCase());
            if (site) {
              await supabase.from('contrats_sites').insert([{
                organisation_id: orgId,
                contrat_id: inserted.id,
                site_id: site.id,
                domaines: domaines
              }]);
            }
          }
          imported++;
        }
      }

      alert(`${imported} contrat(s) importé(s) sur ${rows.length} lignes.`);
      loadContrats();
    } catch (err) {
      console.error('Erreur import:', err);
      alert('Erreur lors de l\'import: ' + err.message);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExport = (format = 'xlsx') => {
    setShowExportHelp(false);
    const exportData = filteredContrats.map(c => ({
      'N° Contrat': c.numero_contrat || '',
      'Client': c.client?.raison_sociale || '',
      'Sites': (c.contrats_sites || []).map(cs => cs.site?.nom).filter(Boolean).join(', '),
      'Nb Sites': (c.contrats_sites || []).length,
      'Domaines': (c.domaines || []).join(', '),
      'Type': c.type_contrat || '',
      'Périodicité': c.periodicite || '',
      'Visites/an': c.nb_visites_an || '',
      'Prix HT': c.prix_annuel_ht || '',
      'Date début': c.date_debut || '',
      'Date fin': c.date_fin || '',
      'Reconduction': c.reconduction_auto ? 'Oui' : 'Non',
      'Statut': c.statut || '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contrats');

    ws['!cols'] = [
      { wch: 18 }, { wch: 30 }, { wch: 40 }, { wch: 8 },
      { wch: 25 }, { wch: 12 }, { wch: 14 }, { wch: 10 },
      { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
      { wch: 14 }, { wch: 14 }, { wch: 12 }
    ];

    XLSX.writeFile(wb, `contrats_export_${new Date().toISOString().split('T')[0]}.${format}`);
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className="min-h-screen bg-slate-200 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">

      {/* ===== HEADER ===== */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Contrats
                <span className="ml-3 px-3 py-1 bg-gray-100 rounded-full text-base font-semibold text-gray-600">
                  {contrats.length}
                </span>
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">Gestion des contrats de maintenance multi-sites</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".xlsx,.xls" className="hidden" />
            <button
              onClick={() => setShowImportHelp(true)}
              disabled={importing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">{importing ? 'Import...' : 'Importer'}</span>
            </button>
            <button
              onClick={() => setShowExportHelp(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter</span>
            </button>
            <button
              onClick={handleNew}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Nouveau
            </button>
          </div>
        </div>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: stats.total, icon: FileText, color: 'text-slate-600', border: 'border-slate-200', bg: 'bg-slate-50', kpiKey: '' },
          { label: 'Actifs', value: stats.actifs, icon: CheckCircle, color: 'text-green-600', border: 'border-green-200', bg: 'bg-green-50', kpiKey: '' },
          { label: 'CA annuel', value: `${(stats.caTotal || 0).toLocaleString('fr-FR')}€`, icon: Shield, color: 'text-blue-600', border: 'border-blue-200', bg: 'bg-blue-50', kpiKey: '' },
          { label: 'Expire <30j', value: stats.expireSoon, icon: Clock, color: 'text-orange-600', border: 'border-orange-200', bg: 'bg-orange-50', kpiKey: 'expire_soon', clickable: stats.expireSoon > 0 },
        ].map(({ label, value, icon: Icon, color, border, bg, kpiKey, clickable }) => (
          <div
            key={label}
            onClick={() => {
              if (kpiKey) {
                setFilterKpi(prev => prev === kpiKey ? '' : kpiKey);
                setFilterDomaine('');
                setFilterStatut('');
              }
            }}
            className={`${bg} ${border} border rounded-2xl p-4 transition-all ${
              kpiKey && clickable ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''
            } ${filterKpi === kpiKey && kpiKey ? 'ring-2 ring-offset-1 ring-red-400 shadow-md' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${bg}`}><Icon className={`w-5 h-5 ${color}`} /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-xl font-bold text-gray-800">{value}</p>
              </div>
            </div>
            {filterKpi === kpiKey && kpiKey && (
              <p className="text-[10px] text-red-500 font-semibold mt-1.5 text-center">✕ Cliquer pour retirer le filtre</p>
            )}
          </div>
        ))}
      </div>

      {/* ===== FILTRE KPI ACTIF ===== */}
      {filterKpi && (
        <div className="mb-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-800">
            Filtre actif : Expire dans 30 jours ({stats.expireSoon})
          </span>
          <button onClick={() => setFilterKpi('')} className="ml-auto text-amber-600 hover:text-amber-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ===== FILTRES ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher contrat, client, site..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm"
          />
        </div>
        <select
          value={filterDomaine}
          onChange={(e) => setFilterDomaine(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm min-w-[140px]"
        >
          <option value="">Tous domaines</option>
          {DOMAINES.map(d => (
            <option key={d.code} value={d.code}>{d.code} - {d.label}</option>
          ))}
        </select>
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm min-w-[130px]"
        >
          <option value="">Tous statuts</option>
          {STATUTS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* ===== SÉLECTION BANNER ===== */}
      {selectedContrats.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-red-700">
            {selectedContrats.length} contrat(s) sélectionné(s)
          </span>
          <div className="flex gap-2">
            <button onClick={() => setSelectedContrats([])} className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Désélectionner
            </button>
            <button onClick={handleDeleteSelected} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700">
              <Trash2 className="w-3.5 h-3.5 inline mr-1" />Supprimer
            </button>
          </div>
        </div>
      )}

      {/* ===== TABLEAU ===== */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Chargement des contrats...</p>
          </div>
        ) : filteredContrats.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun contrat trouvé</p>
            <button onClick={handleNew} className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl text-sm font-semibold">
              <Plus className="w-4 h-4 inline mr-1" />Créer un contrat
            </button>
          </div>
        ) : (
          <>
          {/* Desktop */}
          <div ref={tableContainerRef} className="hidden md:block overflow-x-auto max-h-[65vh] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-slate-800 text-white text-xs uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedContrats.length === filteredContrats.length && filteredContrats.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-3 py-3 text-left cursor-pointer hover:text-white" onClick={() => toggleSort('numero_contrat')}>
                    N° Contrat <SortIndicator column="numero_contrat" />
                  </th>
                  <th className="px-3 py-3 text-left cursor-pointer hover:text-white" onClick={() => toggleSort('client')}>
                    Client <SortIndicator column="client" />
                  </th>
                  <th className="px-3 py-3 text-left cursor-pointer hover:text-white" onClick={() => toggleSort('sites_count')}>
                    Sites <SortIndicator column="sites_count" />
                  </th>
                  <th className="px-3 py-3 text-left">Domaines</th>
                  <th className="px-3 py-3 text-left cursor-pointer hover:text-white" onClick={() => toggleSort('type_contrat')}>
                    Type <SortIndicator column="type_contrat" />
                  </th>
                  <th className="px-3 py-3 text-right cursor-pointer hover:text-white" onClick={() => toggleSort('prix_annuel_ht')}>
                    Prix HT <SortIndicator column="prix_annuel_ht" />
                  </th>
                  <th className="px-3 py-3 text-left cursor-pointer hover:text-white" onClick={() => toggleSort('statut')}>
                    Statut <SortIndicator column="statut" />
                  </th>
                  <th className="px-3 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredContrats.map((contrat) => {
                  const nbSites = contrat.contrats_sites?.length || 0;
                  const siteNames = (contrat.contrats_sites || []).map(cs => cs.site?.nom).filter(Boolean);

                  return (
                    <tr key={contrat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedContrats.includes(contrat.id)}
                          onChange={() => toggleSelect(contrat.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-semibold text-gray-900 text-sm">{contrat.numero_contrat || '-'}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-sm text-gray-700">{contrat.client?.raison_sociale || '-'}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold text-slate-700">{nbSites}</span>
                          <span className="text-xs text-gray-500 truncate max-w-[150px]" title={siteNames.join(', ')}>
                            {siteNames.length > 0 ? siteNames.join(', ') : '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(contrat.domaines || []).map(d => (
                            <span key={d} className={`px-1.5 py-0.5 rounded text-xs font-semibold ${getDomaineBadge(d)}`}>
                              {d}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600 capitalize">
                        {contrat.type_contrat || '-'}
                      </td>
                      <td className="px-3 py-3 text-right text-sm font-semibold text-gray-800">
                        {contrat.prix_annuel_ht ? `${Number(contrat.prix_annuel_ht).toLocaleString('fr-FR')} €` : '-'}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatutBadge(contrat.statut)}`}>
                          {STATUTS.find(s => s.value === contrat.statut)?.label || contrat.statut}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleView(contrat)} className="p-1.5 hover:bg-blue-50 rounded-lg" title="Voir">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button onClick={() => handleEdit(contrat)} className="p-1.5 hover:bg-amber-50 rounded-lg" title="Modifier">
                            <Edit3 className="w-4 h-4 text-amber-600" />
                          </button>
                          <button onClick={() => handleDelete(contrat)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Supprimer">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredContrats.map(contrat => {
              const nbSites = contrat.contrats_sites?.length || 0;
              return (
                <div key={contrat.id} className="p-4 hover:bg-slate-50" onClick={() => handleView(contrat)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-gray-900">{contrat.numero_contrat}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatutBadge(contrat.statut)}`}>
                      {STATUTS.find(s => s.value === contrat.statut)?.label || contrat.statut}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{contrat.client?.raison_sociale || '-'}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">{nbSites} site(s)</span>
                    <span className="text-xs text-gray-300">•</span>
                    <div className="flex gap-1">
                      {(contrat.domaines || []).map(d => (
                        <span key={d} className={`px-1.5 py-0.5 rounded text-xs font-semibold ${getDomaineBadge(d)}`}>{d}</span>
                      ))}
                    </div>
                  </div>
                  {contrat.prix_annuel_ht && (
                    <p className="text-sm font-bold text-gray-800">{Number(contrat.prix_annuel_ht).toLocaleString('fr-FR')} € HT/an</p>
                  )}
                </div>
              );
            })}
          </div>
          </>
        )}

        {/* Footer compteur */}
        {filteredContrats.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <span>{filteredContrats.length} / {contrats.length} contrats affichés</span>
            <div className="flex gap-1">
              <button onClick={() => scrollToTop(tableContainerRef)} className="p-1 hover:bg-gray-200 rounded"><ArrowUp className="w-3.5 h-3.5" /></button>
              <button onClick={() => scrollToBottom(tableContainerRef)} className="p-1 hover:bg-gray-200 rounded"><ArrowDown className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* MODAL CRÉATION / ÉDITION                                             */}
      {/* ===================================================================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            {/* Header navy */}
            <div className="bg-slate-800 text-white px-6 py-4 rounded-t-2xl border-b-[3px] border-red-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold">{editingContrat ? 'Modifier le contrat' : 'Nouveau contrat'}</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* N° Contrat + Statut */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    <Hash className="w-3.5 h-3.5 inline mr-1" />N° Contrat
                  </label>
                  <input type="text" value={form.numero_contrat}
                    onChange={(e) => setForm({ ...form, numero_contrat: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Statut</label>
                  <select value={form.statut}
                    onChange={(e) => setForm({ ...form, statut: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm">
                    {STATUTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Client */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  <Building2 className="w-3.5 h-3.5 inline mr-1" />Client *
                </label>
                <select value={form.client_id}
                  onChange={(e) => { setForm({ ...form, client_id: e.target.value }); setFormSites({}); }}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm">
                  <option value="">-- Sélectionner un client --</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.raison_sociale}</option>)}
                </select>
              </div>

              {/* DOMAINES DU CONTRAT */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-600" />Domaines du contrat *
                </h3>
                <div className="flex flex-wrap gap-2">
                  {DOMAINES.map(d => {
                    const selected = form.domaines.includes(d.code);
                    return (
                      <button
                        key={d.code}
                        type="button"
                        onClick={() => toggleFormDomaine(d.code)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                          selected
                            ? `${getDomaineBadge(d.code)} border-current shadow-sm`
                            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {selected && <Check className="w-3.5 h-3.5 inline mr-1" />}
                        {d.code}
                      </button>
                    );
                  })}
                </div>
                {form.domaines.length === 0 && (
                  <p className="text-xs text-orange-500 mt-2">⚠ Sélectionnez au moins un domaine</p>
                )}
              </div>

              {/* SITES DU CONTRAT */}
              {form.client_id && form.domaines.length > 0 && (
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />Sites du contrat *
                  </h3>

                  {filteredSites.length === 0 ? (
                    <p className="text-sm text-gray-500">Aucun site pour ce client. Créez d'abord un site.</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredSites.map(site => {
                        const isSelected = !!formSites[site.id];
                        const siteData = formSites[site.id] || { domaines: [] };
                        const siteDomaines = siteData.domaines || [];
                        return (
                          <div key={site.id} className={`rounded-lg border-2 transition-all ${
                            isSelected ? 'border-blue-400 bg-white shadow-sm' : 'border-transparent bg-white/60'
                          }`}>
                            {/* Site header - toggle sélection */}
                            <div
                              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                              onClick={() => toggleFormSite(site.id)}
                            >
                              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                                isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-semibold text-gray-800">{site.nom}</span>
                                {site.ville && <span className="text-xs text-gray-500 ml-2">({site.ville})</span>}
                              </div>
                            </div>

                            {/* Domaines + Dates visite par site */}
                            {isSelected && (
                              <div className="px-3 pb-3 pt-0 space-y-3">
                                <div>
                                  <p className="text-xs text-gray-500 mb-2">Domaines applicables à ce site :</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {form.domaines.map(dCode => {
                                      const active = siteDomaines.includes(dCode);
                                      const siteHasDomain = (site.domaines_actifs || []).includes(dCode);
                                      return (
                                        <button
                                          key={dCode}
                                          type="button"
                                          onClick={() => siteHasDomain && toggleSiteDomaine(site.id, dCode)}
                                          disabled={!siteHasDomain}
                                          className={`px-2 py-1 rounded text-xs font-semibold border transition-all ${
                                            !siteHasDomain
                                              ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed line-through'
                                              : active
                                                ? `${getDomaineBadge(dCode)} border-current`
                                                : 'bg-gray-100 text-gray-400 border-gray-200'
                                          }`}
                                          title={!siteHasDomain ? `${dCode} non actif sur ce site` : ''}
                                        >
                                          {active && siteHasDomain && <Check className="w-3 h-3 inline mr-0.5" />}
                                          {dCode}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Résumé sélection */}
                  {Object.keys(formSites).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs font-semibold text-blue-700">
                        {Object.keys(formSites).length} site(s) sélectionné(s)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Type + Périodicité + Visites */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-600" />Planification
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type</label>
                    <select value={form.type_contrat}
                      onChange={(e) => setForm({ ...form, type_contrat: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
                      {TYPES_CONTRAT.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Périodicité</label>
                    <select value={form.periodicite}
                      onChange={(e) => setForm({ ...form, periodicite: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
                      {PERIODICITES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Visites/an</label>
                    <input type="number" min="1" value={form.nb_visites_an}
                      onChange={(e) => setForm({ ...form, nb_visites_an: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white" />
                  </div>
                </div>
              </div>

              {/* Durée + Reconduction */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />Durée
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date début</label>
                    <input type="date" value={form.date_debut}
                      onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date fin</label>
                    <input type="date" value={form.date_fin}
                      onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.reconduction_auto}
                      onChange={(e) => setForm({ ...form, reconduction_auto: e.target.checked })}
                      className="rounded" />
                    <span className="text-sm text-gray-700">Reconduction automatique</span>
                  </label>
                  {form.reconduction_auto && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Préavis</span>
                      <input type="number" min="0" value={form.preavis_jours}
                        onChange={(e) => setForm({ ...form, preavis_jours: parseInt(e.target.value) || 0 })}
                        className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center" />
                      <span className="text-xs text-gray-500">jours</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tarification */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-600" />Tarification
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Prix annuel HT (€)</label>
                  <input type="number" min="0" step="0.01" value={form.prix_annuel_ht || ''}
                    onChange={(e) => setForm({ ...form, prix_annuel_ht: e.target.value ? parseFloat(e.target.value) : null })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                    placeholder="0.00" />
                </div>
              </div>

              {/* Info visites */}
              {Object.keys(formSites).length > 0 && (
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-3">
                  <p className="text-xs text-blue-700 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Les dates de visite sont gérées dans la fiche de chaque site (page Sites)
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-xl hover:shadow-lg disabled:opacity-50">
                <Save className="w-4 h-4 inline mr-2" />
                {saving ? 'Enregistrement...' : (editingContrat ? 'Mettre à jour' : 'Créer le contrat')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL DÉTAILS                                                        */}
      {/* ===================================================================== */}
      {showDetails && detailsContrat && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            {/* Header navy */}
            <div className="bg-slate-800 text-white px-6 py-4 rounded-t-2xl border-b-[3px] border-red-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{detailsContrat.numero_contrat}</h2>
                    <p className="text-slate-300 text-sm">{detailsContrat.client?.raison_sociale || '-'}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetails(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {(detailsContrat.domaines || []).map(d => (
                  <span key={d} className={`px-2 py-0.5 rounded text-xs font-bold ${getDomaineBadge(d)}`}>{d}</span>
                ))}
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatutBadge(detailsContrat.statut)}`}>
                  {STATUTS.find(s => s.value === detailsContrat.statut)?.label || detailsContrat.statut}
                </span>
                {detailsContrat.reconduction_auto && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                    <RefreshCw className="w-3 h-3 inline mr-1" />Reconduction auto
                  </span>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {[
                { key: 'fiche', label: 'Fiche', icon: Info },
                { key: 'sites', label: `Sites (${(detailsContrat.contrats_sites || []).length})`, icon: MapPin },
                { key: 'documents', label: 'Documents', icon: FileText },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setDetailsTab(tab.key)}
                  className={`flex-1 px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    detailsTab === tab.key
                      ? 'border-red-500 text-red-600 bg-red-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />{tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* TAB FICHE */}
              {detailsTab === 'fiche' && (
                <div className="space-y-4">
                  {/* Stat cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-blue-600 font-medium">Type</p>
                      <p className="text-sm font-bold text-blue-800 capitalize">{detailsContrat.type_contrat || '-'}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-green-600 font-medium">Périodicité</p>
                      <p className="text-sm font-bold text-green-800 capitalize">{detailsContrat.periodicite || '-'}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-purple-600 font-medium">Visites/an</p>
                      <p className="text-sm font-bold text-purple-800">{detailsContrat.nb_visites_an || '-'}</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-amber-600 font-medium">Prix HT/an</p>
                      <p className="text-sm font-bold text-amber-800">
                        {detailsContrat.prix_annuel_ht
                          ? `${Number(detailsContrat.prix_annuel_ht).toLocaleString('fr-FR')} €`
                          : '-'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Durée & Reconduction */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
                      <div className="w-1.5 h-5 bg-green-500 rounded-full"></div>
                      <Clock className="w-4 h-4 text-green-600" />
                      <h3 className="text-sm font-bold text-gray-800">Durée & Reconduction</h3>
                    </div>
                    <div className="border-l-[3px] border-green-500 ml-0 p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-gray-500">Début</span>
                          <p className="text-sm font-semibold">{detailsContrat.date_debut ? new Date(detailsContrat.date_debut).toLocaleDateString('fr-FR') : '-'}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Fin</span>
                          <p className="text-sm font-semibold">{detailsContrat.date_fin ? new Date(detailsContrat.date_fin).toLocaleDateString('fr-FR') : '-'}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Reconduction</span>
                          <p className="text-sm font-semibold">{detailsContrat.reconduction_auto ? `Oui (préavis ${detailsContrat.preavis_jours}j)` : 'Non'}</p>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              )}

              {/* TAB SITES */}
              {detailsTab === 'sites' && (
                <div className="space-y-3">
                  {(detailsContrat.contrats_sites || []).length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Aucun site associé à ce contrat</p>
                  ) : (
                    (detailsContrat.contrats_sites || []).map(cs => {
                      return (
                        <div key={cs.id} className="bg-white rounded-xl border border-gray-200 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <MapPin className={`w-4 h-4 ${isRetard ? 'text-red-500' : 'text-blue-500'}`} />
                              <span className="font-semibold text-gray-800">{cs.site?.nom || '-'}</span>
                              {isRetard && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">EN RETARD</span>}
                            </div>
                          </div>
                          {cs.site?.adresse && (
                            <p className="text-xs text-gray-500 mb-2 ml-6">
                              {cs.site.adresse}{cs.site.ville ? `, ${cs.site.ville}` : ''}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1.5 ml-6 mb-3">
                            {(cs.domaines || []).map(d => (
                              <span key={d} className={`px-2 py-0.5 rounded text-xs font-semibold ${getDomaineBadge(d)}`}>
                                {d}
                              </span>
                            ))}
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB DOCUMENTS */}
              {detailsTab === 'documents' && (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Documents associés</p>
                  <p className="text-xs mt-1">Fonctionnalité à venir</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50 rounded-b-2xl">
              <button onClick={() => { handleEdit(detailsContrat); setShowDetails(false); }}
                className="px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100">
                <Edit3 className="w-4 h-4 inline mr-1" />Modifier
              </button>
              <button onClick={() => setShowDetails(false)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL IMPORT HELP                                                    */}
      {/* ===================================================================== */}
      {showImportHelp && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-slate-800 text-white px-6 py-4 rounded-t-2xl border-b-[3px] border-red-500 flex justify-between items-center">
              <h3 className="font-bold">Importer des contrats</h3>
              <button onClick={() => setShowImportHelp(false)} className="p-1 hover:bg-white/10 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">Format attendu (colonnes) :</p>
                <p className="text-xs">Client, Site, Domaines, N° Contrat, Type, Périodicité, Visites/an, Prix HT, Date début, Date fin, Reconduction, Statut</p>
                <p className="text-xs mt-2 text-blue-600">Les domaines doivent être séparés par des virgules (ex: SSI, DSF, BAES)</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg"
              >
                <Upload className="w-4 h-4 inline mr-2" />Choisir un fichier Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL EXPORT HELP                                                    */}
      {/* ===================================================================== */}
      {showExportHelp && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-slate-800 text-white px-6 py-4 rounded-t-2xl border-b-[3px] border-red-500 flex justify-between items-center">
              <h3 className="font-bold">Exporter les contrats</h3>
              <button onClick={() => setShowExportHelp(false)} className="p-1 hover:bg-white/10 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Export de <span className="font-bold text-gray-900">{filteredContrats.length}</span> contrat(s) (filtrés).
              </p>
              <button
                onClick={() => handleExport('xlsx')}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg"
              >
                <Download className="w-4 h-4 inline mr-2" />Télécharger Excel
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
