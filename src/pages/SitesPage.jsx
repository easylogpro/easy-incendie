// =============================================================================
// EASY INCENDIE - SitesPage.jsx
// VERSION 7.2 - Fullscreen fiche, texte domaines, sans initiales tech
// Types ERP, code site {numero_client}-XX, 8 onglets fiche récapitulatif
// Design aligné ClientsPage/ContratsPage (Option C)
// =============================================================================

import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import * as XLSX from 'xlsx';
import {
  Building2, Plus, Search, Download, Upload,
  Edit3, Trash2, Eye, Phone, Mail, MapPin, FileText,
  CheckCircle, XCircle, ChevronDown, ChevronUp, X, Save,
  User, AlertCircle, Info, ArrowUpDown, Hash, MessageSquare,
  ArrowUp, ArrowDown, AlertTriangle, Key, Cog, FolderOpen, Shield
} from 'lucide-react';

// =============================================================================
// CONSTANTES
// =============================================================================

const DOMAINES = [
  { code: 'SSI', label: 'SSI', icon: '🔥', table: 'equipements_ssi' },
  { code: 'DSF', label: 'Désenfumage', icon: '💨', table: 'equipements_dsf' },
  { code: 'BAES', label: 'BAES', icon: '💡', table: 'equipements_baes' },
  { code: 'EXT', label: 'Extincteurs', icon: '🧯', table: 'equipements_ext' },
  { code: 'RIA', label: 'RIA', icon: '🚿', table: 'equipements_ria' },
  { code: 'CMP', label: 'Compartimentage', icon: '🚪', table: 'equipements_cmp' },
  { code: 'COLSEC', label: 'Colonnes sèches', icon: '🔷', table: 'equipements_colsec' }
];

const DOMAINE_COLORS = {
  SSI: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', header: 'from-red-600 to-red-500', light: 'from-red-50 to-orange-50' },
  DSF: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200', header: 'from-sky-600 to-cyan-500', light: 'from-sky-50 to-cyan-50' },
  BAES: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', header: 'from-yellow-500 to-amber-500', light: 'from-yellow-50 to-amber-50' },
  EXT: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', header: 'from-orange-600 to-red-500', light: 'from-orange-50 to-red-50' },
  RIA: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', header: 'from-blue-600 to-indigo-500', light: 'from-blue-50 to-indigo-50' },
  CMP: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', header: 'from-purple-600 to-violet-500', light: 'from-purple-50 to-violet-50' },
  COLSEC: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', header: 'from-gray-600 to-slate-500', light: 'from-gray-50 to-slate-50' }
};

const EQUIPEMENT_FIELDS = {
  SSI: [
    { name: 'ecs_marque', label: 'Marque ECS', type: 'text' },
    { name: 'ecs_modele', label: 'Modèle ECS', type: 'text' },
    { name: 'cmsi_marque', label: 'Marque CMSI', type: 'text' },
    { name: 'cmsi_modele', label: 'Modèle CMSI', type: 'text' },
    { name: 'nb_di', label: 'Nb détecteurs', type: 'number' },
    { name: 'nb_dm', label: 'Nb déclencheurs', type: 'number' },
    { name: 'nb_ds', label: 'Nb diffuseurs', type: 'number' },
    { name: 'nb_pcf', label: 'Nb PCF', type: 'number' },
    { name: 'nb_ccf', label: 'Nb CCF', type: 'number' },
    { name: 'nb_vcf', label: 'Nb VCF', type: 'number' },
    { name: 'nb_moteur', label: 'Nb moteurs', type: 'number' }
  ],
  DSF: [
    { name: 'type_dsf', label: 'Type', type: 'select', options: ['Naturel', 'Mécanique', 'Mixte'] },
    { name: 'nb_volet', label: 'Nb volets', type: 'number' },
    { name: 'nb_moteur', label: 'Nb moteurs', type: 'number' },
    { name: 'nb_skydome', label: 'Nb skydomes', type: 'number' },
    { name: 'nb_ouvrant', label: 'Nb ouvrants', type: 'number' }
  ],
  BAES: [
    { name: 'marque', label: 'Marque', type: 'text' },
    { name: 'modele', label: 'Modèle', type: 'text' },
    { name: 'nb_baes', label: 'Nb BAES', type: 'number' },
    { name: 'nb_baeh', label: 'Nb BAEH', type: 'number' },
    { name: 'nb_baes_baeh', label: 'Nb combinés', type: 'number' },
    { name: 'nb_telecommande', label: 'Nb télécommandes', type: 'number' },
    { name: 'type_telecommande', label: 'Type télécommande', type: 'text' }
  ],
  EXT: [
    { name: 'type_ext', label: 'Type', type: 'select', options: ['Poudre ABC', 'CO2', 'Eau pulvérisée', 'Eau + additif', 'Mousse'] },
    { name: 'marque', label: 'Marque', type: 'text' },
    { name: 'nb', label: 'Quantité', type: 'number' },
    { name: 'annee_fabrication', label: 'Année fab.', type: 'number' }
  ],
  RIA: [
    { name: 'modele', label: 'Modèle', type: 'select', options: ['DN25', 'DN33', 'DN40'] },
    { name: 'nb', label: 'Quantité', type: 'number' }
  ],
  CMP: [
    { name: 'nb_pcf', label: 'Nb PCF', type: 'number' },
    { name: 'nb_ccf', label: 'Nb CCF', type: 'number' },
    { name: 'nb_rideau_cf', label: 'Nb rideaux CF', type: 'number' }
  ],
  COLSEC: [
    { name: 'type_colonne', label: 'Type', type: 'select', options: ['Sèche', 'Humide'] },
    { name: 'nb', label: 'Quantité', type: 'number' }
  ]
};

const ERP_TYPES = [
  { code: 'J', label: "Structures d'accueil personnes âgées/handicapées", color: 'bg-rose-100 text-rose-700' },
  { code: 'L', label: 'Salles de spectacles, conférences, réunions', color: 'bg-violet-100 text-violet-700' },
  { code: 'M', label: 'Magasins, centres commerciaux', color: 'bg-blue-100 text-blue-700' },
  { code: 'N', label: 'Restaurants, débits de boissons', color: 'bg-amber-100 text-amber-700' },
  { code: 'O', label: 'Hôtels, pensions de famille', color: 'bg-teal-100 text-teal-700' },
  { code: 'P', label: 'Salles de danse, salles de jeux', color: 'bg-pink-100 text-pink-700' },
  { code: 'R', label: "Enseignement, colonies de vacances", color: 'bg-indigo-100 text-indigo-700' },
  { code: 'S', label: 'Bibliothèques, centres de documentation', color: 'bg-cyan-100 text-cyan-700' },
  { code: 'T', label: "Salles d'exposition", color: 'bg-orange-100 text-orange-700' },
  { code: 'U', label: 'Établissements sanitaires (hôpitaux, cliniques)', color: 'bg-emerald-100 text-emerald-700' },
  { code: 'V', label: 'Établissements de culte', color: 'bg-purple-100 text-purple-700' },
  { code: 'W', label: 'Bureaux, administrations', color: 'bg-slate-100 text-slate-700' },
  { code: 'X', label: 'Établissements sportifs couverts', color: 'bg-green-100 text-green-700' },
  { code: 'Y', label: 'Musées', color: 'bg-yellow-100 text-yellow-700' },
  { code: 'IGH', label: 'Immeuble de Grande Hauteur', color: 'bg-red-100 text-red-700' },
  { code: 'CDT', label: 'Code du travail (non ERP)', color: 'bg-gray-100 text-gray-600' }
];

const ERP_CATEGORIES = [
  { value: 1, label: '1ère catégorie (> 1500 pers.)' },
  { value: 2, label: '2ème catégorie (701 à 1500 pers.)' },
  { value: 3, label: '3ème catégorie (301 à 700 pers.)' },
  { value: 4, label: '4ème catégorie (≤ 300 pers.)' },
  { value: 5, label: '5ème catégorie (seuils variables)' }
];

const getErpTypeInfo = (code) => ERP_TYPES.find(t => t.code === code);

const getDepartement = (cp) => {
  if (!cp || cp.length < 2) return '-';
  if (cp.startsWith('20')) return parseInt(cp.substring(0, 3)) <= 201 ? '2A' : '2B';
  if (cp.startsWith('97') || cp.startsWith('98')) return cp.substring(0, 3);
  return cp.substring(0, 2);
};

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================
export default function SitesPage() {
  const { orgId } = useAuth();

  // --- États principaux ---
  const [sites, setSites] = useState([]);
  const [clients, setClients] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterClient, setFilterClient] = useState('');
  const [filterTechnicien, setFilterTechnicien] = useState('');
  const [filterDomaine, setFilterDomaine] = useState('');
  const [filterActif, setFilterActif] = useState('');
  const [filterTypeErp, setFilterTypeErp] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nom', direction: 'asc' });
  const [selectedSites, setSelectedSites] = useState([]);

  // --- Modal création/édition ---
  const [showModal, setShowModal] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [saving, setSaving] = useState(false);

  // --- Modal fiche détail ---
  const [showDetails, setShowDetails] = useState(false);
  const [detailsSite, setDetailsSite] = useState(null);
  const [detailsTab, setDetailsTab] = useState('fiche');
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsContrats, setDetailsContrats] = useState([]);
  const [detailsSav, setDetailsSav] = useState([]);
  const [detailsTravaux, setDetailsTravaux] = useState([]);
  const [detailsDevis, setDetailsDevis] = useState([]);
  const [detailsFactures, setDetailsFactures] = useState([]);
  const [detailsDocuments, setDetailsDocuments] = useState([]);

  // Document form
  const [showDocForm, setShowDocForm] = useState(false);
  const [docForm, setDocForm] = useState({ categorie: 'rapport_maintenance', titre: '', url: '', description: '', domaine: '', date_document: '' });
  const [savingDoc, setSavingDoc] = useState(false);

  const DOC_CATEGORIES = [
    { value: 'rapport_maintenance', label: 'Rapport Maintenance' },
    { value: 'rapport_sav', label: 'Rapport SAV' },
    { value: 'rapport_travaux', label: 'Rapport Travaux' },
    { value: 'formation', label: 'Formation' },
    { value: 'bureau_controle', label: 'Bureau de contrôle' },
    { value: 'autre', label: 'Autre' }
  ];

  // --- Équipements ---
  const [equipements, setEquipements] = useState({
    SSI: null, DSF: null, BAES: null, EXT: null, RIA: null, CMP: null, COLSEC: null
  });
  const [editingEquipement, setEditingEquipement] = useState(null);
  const [equipForm, setEquipForm] = useState({});
  const [savingEquipement, setSavingEquipement] = useState(false);

  // --- Import/Export ---
  const [showImportHelp, setShowImportHelp] = useState(false);
  const [showExportHelp, setShowExportHelp] = useState(false);
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);

  // --- Refs ---
  const tableContainerRef = useRef(null);
  const ficheRef = useRef(null);

  // --- Formulaire ---
  const emptyForm = {
    code_site: '', nom: '', client_id: '', technicien_id: '',
    adresse: '', code_postal: '', ville: '', acces_instructions: '',
    contact_nom: '', contact_telephone: '', contact_email: '',
    type_erp: '', categorie_erp: '',
    domaines_actifs: [], notes: '', actif: true
  };
  const [form, setForm] = useState(emptyForm);

  // =========================================================================
  // CHARGEMENT DES DONNÉES
  // =========================================================================
  const loadData = async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const [sitesRes, clientsRes, techRes] = await Promise.all([
        supabase
          .from('sites')
          .select('*, clients(id, raison_sociale, numero_client), techniciens(id, nom, prenom)')
          .eq('organisation_id', orgId)
          .order('created_at', { ascending: false }),
        supabase
          .from('clients')
          .select('id, raison_sociale, numero_client')
          .eq('organisation_id', orgId)
          .eq('actif', true)
          .order('raison_sociale'),
        supabase
          .from('techniciens')
          .select('id, nom, prenom')
          .eq('organisation_id', orgId)
          .eq('actif', true)
          .order('nom')
      ]);
      if (sitesRes.error) throw sitesRes.error;
      setSites(sitesRes.data || []);
      setClients(clientsRes.data || []);
      setTechniciens(techRes.data || []);
    } catch (err) {
      console.error('Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [orgId]);

  // =========================================================================
  // GÉNÉRATION CODE SITE : {numero_client}-{XX}
  // =========================================================================
  const generateCodeSite = async (clientId) => {
    if (!orgId || !clientId) return '';
    try {
      const client = clients.find(c => c.id === clientId);
      const numClient = client?.numero_client || '';
      if (!numClient) return '';

      const { data } = await supabase
        .from('sites')
        .select('code_site')
        .eq('organisation_id', orgId)
        .eq('client_id', clientId);

      let maxNum = 0;
      const prefix = numClient + '-';
      data?.forEach(s => {
        if (s.code_site?.startsWith(prefix)) {
          const num = parseInt(s.code_site.substring(prefix.length));
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      });
      return prefix + String(maxNum + 1).padStart(2, '0');
    } catch {
      return '';
    }
  };

  // =========================================================================
  // CRUD SITES
  // =========================================================================
  const handleNew = () => {
    setForm({ ...emptyForm });
    setEditingSite(null);
    setShowModal(true);
  };

  const handleClientChange = async (clientId) => {
    const newCode = await generateCodeSite(clientId);
    setForm(prev => ({ ...prev, client_id: clientId, code_site: newCode }));
  };

  const handleEdit = (site) => {
    setForm({
      code_site: site.code_site || '',
      nom: site.nom || '',
      client_id: site.client_id || '',
      technicien_id: site.technicien_id || '',
      adresse: site.adresse || '',
      code_postal: site.code_postal || '',
      ville: site.ville || '',
      acces_instructions: site.acces_instructions || '',
      contact_nom: site.contact_nom || '',
      contact_telephone: site.contact_telephone || '',
      contact_email: site.contact_email || '',
      type_erp: site.type_erp || '',
      categorie_erp: site.categorie_erp ?? '',
      domaines_actifs: site.domaines_actifs || [],
      notes: site.notes || '',
      actif: site.actif !== false
    });
    setEditingSite(site);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nom.trim()) { alert('Le nom du site est obligatoire'); return; }
    if (!form.client_id) { alert('Le client est obligatoire'); return; }
    if (!form.adresse.trim()) { alert('L\'adresse est obligatoire'); return; }
    setSaving(true);
    try {
      const siteData = {
        organisation_id: orgId,
        code_site: form.code_site || null,
        nom: form.nom.trim(),
        client_id: form.client_id,
        technicien_id: form.technicien_id || null,
        adresse: form.adresse.trim(),
        code_postal: form.code_postal.trim() || null,
        ville: form.ville.trim() || null,
        acces_instructions: form.acces_instructions.trim() || null,
        contact_nom: form.contact_nom.trim() || null,
        contact_telephone: form.contact_telephone.trim() || null,
        contact_email: form.contact_email.trim() || null,
        type_erp: form.type_erp || null,
        categorie_erp: form.categorie_erp ? parseInt(form.categorie_erp) : null,
        domaines_actifs: form.domaines_actifs,
        notes: form.notes.trim() || null,
        actif: form.actif
      };

      if (editingSite) {
        const { error } = await supabase.from('sites').update(siteData).eq('id', editingSite.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('sites').insert([siteData]);
        if (error) throw error;
      }
      await loadData();
      setShowModal(false);
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (site) => {
    if (!confirm(`Supprimer "${site.nom}" ?`)) return;
    try {
      await supabase.from('sites').delete().eq('id', site.id);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Supprimer ${selectedSites.length} site(s) ?`)) return;
    try {
      await supabase.from('sites').delete().in('id', selectedSites);
      setSelectedSites([]);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelectSite = (id) => {
    setSelectedSites(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedSites(
      selectedSites.length === filteredSites.length && filteredSites.length > 0
        ? []
        : filteredSites.map(s => s.id)
    );
  };

  const toggleDomaine = (d) => {
    setForm(prev => ({
      ...prev,
      domaines_actifs: prev.domaines_actifs.includes(d)
        ? prev.domaines_actifs.filter(x => x !== d)
        : [...prev.domaines_actifs, d]
    }));
  };

  // =========================================================================
  // FICHE SITE (modal détails)
  // =========================================================================
  const handleView = async (site, tab = 'fiche') => {
    setDetailsSite(site);
    setDetailsTab(tab);
    setShowDetails(true);
    setDetailsLoading(true);
    setEditingEquipement(null);
    setEquipForm({});
    try {
      // Charger contrats (via contrats_sites)
      const { data: csData } = await supabase
        .from('contrats_sites')
        .select('*, contrats(*)')
        .eq('site_id', site.id);
      const contratsFromCs = (csData || []).map(cs => cs.contrats).filter(Boolean);
      // Fallback: contrats directs
      const { data: directContrats } = await supabase
        .from('contrats')
        .select('*')
        .eq('site_id', site.id);
      // Merge unique
      const allContrats = [...contratsFromCs];
      (directContrats || []).forEach(dc => {
        if (!allContrats.find(c => c.id === dc.id)) allContrats.push(dc);
      });
      setDetailsContrats(allContrats);

      // Charger SAV
      const { data: savData } = await supabase
        .from('sav')
        .select('*, techniciens(nom, prenom)')
        .eq('site_id', site.id)
        .order('date_demande', { ascending: false })
        .limit(20);
      setDetailsSav(savData || []);

      // Charger Travaux
      const { data: travauxData } = await supabase
        .from('travaux')
        .select('*, techniciens(nom, prenom)')
        .eq('site_id', site.id)
        .order('created_at', { ascending: false })
        .limit(20);
      setDetailsTravaux(travauxData || []);

      // Charger Devis
      const { data: devisData } = await supabase
        .from('devis')
        .select('*')
        .eq('site_id', site.id)
        .order('date_emission', { ascending: false })
        .limit(20);
      setDetailsDevis(devisData || []);

      // Charger Factures (via client_id du site)
      if (site.client_id) {
        const { data: facturesData } = await supabase
          .from('factures')
          .select('*')
          .eq('client_id', site.client_id)
          .order('date_emission', { ascending: false })
          .limit(20);
        setDetailsFactures(facturesData || []);
      } else {
        setDetailsFactures([]);
      }

      // Charger Documents (liens)
      const { data: docsData } = await supabase
        .from('sites_documents')
        .select('*')
        .eq('site_id', site.id)
        .order('created_at', { ascending: false });
      setDetailsDocuments(docsData || []);

      const newEquip = { SSI: null, DSF: null, BAES: null, EXT: null, RIA: null, CMP: null, COLSEC: null };
      for (const d of DOMAINES) {
        const { data } = await supabase
          .from(d.table)
          .select('*')
          .eq('site_id', site.id)
          .maybeSingle();
        newEquip[d.code] = data || null;
      }
      setEquipements(newEquip);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  // =========================================================================
  // GESTION ÉQUIPEMENTS
  // =========================================================================
  const handleEditEquipement = (domaine) => {
    const existing = equipements[domaine] || {};
    const formData = {};
    EQUIPEMENT_FIELDS[domaine]?.forEach(f => {
      formData[f.name] = existing[f.name] ?? (f.type === 'number' ? '' : '');
    });
    setEquipForm(formData);
    setEditingEquipement(domaine);
  };

  const handleSaveEquipement = async () => {
    if (!editingEquipement || !detailsSite) return;
    setSavingEquipement(true);
    const dom = DOMAINES.find(d => d.code === editingEquipement);
    try {
      const data = { organisation_id: orgId, site_id: detailsSite.id, ...equipForm };
      EQUIPEMENT_FIELDS[editingEquipement]?.forEach(f => {
        if (f.type === 'number' && data[f.name] !== '') {
          data[f.name] = parseInt(data[f.name]) || 0;
        }
      });

      const existing = equipements[editingEquipement];
      if (existing?.id) {
        const { error } = await supabase.from(dom.table).update(data).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(dom.table).insert([data]);
        if (error) throw error;
      }

      const { data: newData } = await supabase
        .from(dom.table)
        .select('*')
        .eq('site_id', detailsSite.id)
        .maybeSingle();
      setEquipements(prev => ({ ...prev, [editingEquipement]: newData }));
      setEditingEquipement(null);
      setEquipForm({});
    } catch (err) {
      console.error(err);
      alert('Erreur');
    } finally {
      setSavingEquipement(false);
    }
  };

  const handleDeleteEquipement = async (domaine) => {
    if (!confirm(`Supprimer équipements ${domaine} ?`)) return;
    const dom = DOMAINES.find(d => d.code === domaine);
    if (!dom || !equipements[domaine]?.id) return;
    try {
      await supabase.from(dom.table).delete().eq('id', equipements[domaine].id);
      setEquipements(prev => ({ ...prev, [domaine]: null }));
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================================
  // IMPORT / EXPORT
  // =========================================================================
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setShowImportHelp(false);
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      let imported = 0;
      for (const row of json) {
        const nom = row['nom'] || row['Nom'] || row['site'];
        if (!nom) continue;
        const { error } = await supabase.from('sites').insert([{
          organisation_id: orgId,
          nom: String(nom).trim(),
          adresse: row['adresse'] || row['Adresse'] || '',
          code_postal: row['code_postal'] || row['cp'] || null,
          ville: row['ville'] || null,
          type_erp: row['type_erp'] || row['Type ERP'] || null,
          actif: true
        }]);
        if (!error) imported++;
      }
      await loadData();
      alert(`✅ ${imported} site(s) importé(s)`);
    } catch (err) {
      console.error(err);
      alert("Erreur import");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    const data = sites.map((s, i) => ({
      '#': i + 1,
      Code: s.code_site,
      Nom: s.nom,
      Client: s.clients?.raison_sociale || '',
      Technicien: s.techniciens ? `${s.techniciens.prenom} ${s.techniciens.nom}` : '',
      'Type ERP': s.type_erp || '',
      Catégorie: s.categorie_erp || '',
      Adresse: s.adresse || '',
      CP: s.code_postal || '',
      Ville: s.ville || '',
      Domaines: (s.domaines_actifs || []).join(', '),
      Statut: s.actif ? 'Actif' : 'Inactif'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sites');
    XLSX.writeFile(wb, `sites_${new Date().toISOString().split('T')[0]}.xlsx`);
    setShowExportHelp(false);
  };

  // =========================================================================
  // TRI / FILTRAGE
  // =========================================================================
  const toggleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIndicator = ({ column }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-30" />;
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-4 h-4 ml-1" />
      : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const filteredSites = useMemo(() => {
    let result = [...sites];

    if (search) {
      const t = search.toLowerCase();
      result = result.filter(s =>
        s.nom?.toLowerCase().includes(t) ||
        s.code_site?.toLowerCase().includes(t) ||
        s.ville?.toLowerCase().includes(t) ||
        s.clients?.raison_sociale?.toLowerCase().includes(t) ||
        s.type_erp?.toLowerCase().includes(t)
      );
    }
    if (filterClient) result = result.filter(s => s.client_id === filterClient);
    if (filterTechnicien === 'none') result = result.filter(s => !s.technicien_id);
    else if (filterTechnicien) result = result.filter(s => s.technicien_id === filterTechnicien);
    if (filterDomaine) result = result.filter(s => s.domaines_actifs?.includes(filterDomaine));
    if (filterActif) result = result.filter(s => String(s.actif) === filterActif);
    if (filterTypeErp) result = result.filter(s => s.type_erp === filterTypeErp);

    result.sort((a, b) => {
      let aV, bV;
      switch (sortConfig.key) {
        case 'client': aV = a.clients?.raison_sociale || ''; bV = b.clients?.raison_sociale || ''; break;
        case 'technicien': aV = a.techniciens?.nom || ''; bV = b.techniciens?.nom || ''; break;
        case 'departement': aV = getDepartement(a.code_postal); bV = getDepartement(b.code_postal); break;
        case 'type_erp': aV = a.type_erp || ''; bV = b.type_erp || ''; break;
        case 'actif': aV = a.actif ? 1 : 0; bV = b.actif ? 1 : 0; break;
        default: aV = a[sortConfig.key] || ''; bV = b[sortConfig.key] || '';
      }
      return typeof aV === 'string'
        ? (sortConfig.direction === 'asc' ? aV.localeCompare(bV) : bV.localeCompare(aV))
        : (sortConfig.direction === 'asc' ? aV - bV : bV - aV);
    });

    return result;
  }, [sites, search, filterClient, filterTechnicien, filterDomaine, filterActif, filterTypeErp, sortConfig]);

  // =========================================================================
  // VALEURS CALCULÉES
  // =========================================================================
  const stats = useMemo(() => ({
    total: sites.length,
    actifs: sites.filter(s => s.actif).length,
    avecTech: sites.filter(s => s.technicien_id).length,
    sansTech: sites.filter(s => !s.technicien_id && s.actif).length,
    inactifs: sites.filter(s => !s.actif).length
  }), [sites]);

  const getEquipCount = (dom) => {
    const eq = equipements[dom];
    if (!eq) return 0;
    return EQUIPEMENT_FIELDS[dom]?.filter(f => f.type === 'number')
      .reduce((s, f) => s + (parseInt(eq[f.name]) || 0), 0) || 0;
  };

  const scrollToTop = (r) => r?.current?.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = (r) => r?.current?.scrollTo({ top: r.current.scrollHeight, behavior: 'smooth' });
  const hasActiveFilters = filterClient || filterTechnicien || filterDomaine || filterActif || filterTypeErp;

  // =========================================================================
  // RENDU
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-200 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">

        {/* ============================================================= */}
        {/* HEADER                                                         */}
        {/* ============================================================= */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Sites
                  <span className="ml-3 px-3 py-1 bg-gray-100 rounded-full text-base font-semibold text-gray-600">
                    {sites.length}
                  </span>
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">
                  Gérez les sites d'intervention
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".xlsx,.xls"
                className="hidden"
              />
              <button
                onClick={() => setShowImportHelp(true)}
                disabled={importing}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">{importing ? 'Import...' : 'Importer'}</span>
              </button>
              <button
                onClick={() => setShowExportHelp(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exporter</span>
              </button>
              <button
                onClick={handleNew}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau site</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* KPI CARDS                                                      */}
        {/* ============================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-100 rounded-xl">
                <Building2 className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total sites</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-100 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.actifs}</p>
                <p className="text-xs text-gray-500">Sites actifs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.avecTech}</p>
                <p className="text-xs text-gray-500">Avec technicien</p>
              </div>
            </div>
          </div>
          <div
            onClick={() => { setFilterTechnicien('none'); setFilterActif('true'); }}
            className="bg-white rounded-2xl p-4 border border-orange-200 shadow-sm cursor-pointer hover:shadow-md hover:border-orange-300 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.sansTech}</p>
                <p className="text-xs text-orange-600 font-medium">👆 Sans technicien</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gray-100 rounded-xl">
                <XCircle className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-500">{stats.inactifs}</p>
                <p className="text-xs text-gray-500">Inactifs</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* BARRE DE FILTRES                                               */}
        {/* ============================================================= */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher nom, code, ville, client, type ERP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-500/20 focus:border-slate-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap lg:flex-nowrap">
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="flex-1 lg:flex-none px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white min-w-[140px]"
              >
                <option value="">Tous clients</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>🏢 {c.raison_sociale}</option>
                ))}
              </select>
              <select
                value={filterTypeErp}
                onChange={(e) => setFilterTypeErp(e.target.value)}
                className="flex-1 lg:flex-none px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white min-w-[120px]"
              >
                <option value="">Type ERP</option>
                {ERP_TYPES.map(t => (
                  <option key={t.code} value={t.code}>
                    {t.code} - {t.label.substring(0, 25)}
                  </option>
                ))}
              </select>
              <select
                value={filterTechnicien}
                onChange={(e) => setFilterTechnicien(e.target.value)}
                className="flex-1 lg:flex-none px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white min-w-[150px]"
              >
                <option value="">Tous tech.</option>
                <option value="none">⚠️ Sans tech.</option>
                {techniciens.map(t => (
                  <option key={t.id} value={t.id}>👤 {t.prenom} {t.nom}</option>
                ))}
              </select>
              <select
                value={filterDomaine}
                onChange={(e) => setFilterDomaine(e.target.value)}
                className="flex-1 lg:flex-none px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white min-w-[120px]"
              >
                <option value="">Tous domaines</option>
                {DOMAINES.map(d => (
                  <option key={d.code} value={d.code}>{d.icon} {d.code}</option>
                ))}
              </select>
              <select
                value={filterActif}
                onChange={(e) => setFilterActif(e.target.value)}
                className="flex-1 lg:flex-none px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white min-w-[100px]"
              >
                <option value="">Tous</option>
                <option value="true">✅ Actifs</option>
                <option value="false">❌ Inactifs</option>
              </select>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setFilterClient('');
                    setFilterTechnicien('');
                    setFilterDomaine('');
                    setFilterActif('');
                    setFilterTypeErp('');
                  }}
                  className="px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-medium"
                >
                  ✕ Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* BANDEAU SÉLECTION                                              */}
        {/* ============================================================= */}
        {selectedSites.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <CheckCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-red-800 font-semibold">
                {selectedSites.length} sélectionné(s)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedSites([])}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-white"
              >
                Désélectionner
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TABLEAU PRINCIPAL                                              */}
        {/* ============================================================= */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-slate-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Chargement...</p>
            </div>
          ) : filteredSites.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium text-lg">
                {sites.length === 0 ? 'Aucun site' : 'Aucun résultat'}
              </p>
              {sites.length === 0 && (
                <button
                  onClick={handleNew}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />Créer
                </button>
              )}
            </div>
          ) : (
            <>
              {/* ----- DESKTOP TABLE ----- */}
              <div className="hidden md:block relative">
                <div className="absolute right-4 bottom-4 z-20 flex flex-col gap-2">
                  <button onClick={() => scrollToTop(tableContainerRef)} className="p-2.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl shadow-lg">
                    <ArrowUp className="w-5 h-5" />
                  </button>
                  <button onClick={() => scrollToBottom(tableContainerRef)} className="p-2.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl shadow-lg">
                    <ArrowDown className="w-5 h-5" />
                  </button>
                </div>

                <div ref={tableContainerRef} className="overflow-x-auto overflow-y-auto max-h-[65vh]">
                  <table className="w-full">
                    <thead className="sticky top-0 z-[5]">
                      <tr className="bg-[#1e293b]">
                        <th className="text-center px-3 py-2.5 w-12">
                          <input
                            type="checkbox"
                            checked={selectedSites.length === filteredSites.length && filteredSites.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-2 border-white/50 text-slate-600 focus:ring-white cursor-pointer"
                          />
                        </th>
                        <th className="text-center px-3 py-2.5 text-xs font-bold text-white uppercase w-12">#</th>
                        <th onClick={() => toggleSort('code_site')} className="text-left px-4 py-2.5 text-xs font-bold text-white uppercase cursor-pointer hover:bg-white/10 transition-colors">
                          <span className="flex items-center">Code<SortIndicator column="code_site" /></span>
                        </th>
                        <th onClick={() => toggleSort('nom')} className="text-left px-4 py-2.5 text-xs font-bold text-white uppercase cursor-pointer hover:bg-white/10 transition-colors">
                          <span className="flex items-center">Site<SortIndicator column="nom" /></span>
                        </th>
                        <th onClick={() => toggleSort('client')} className="text-left px-4 py-2.5 text-xs font-bold text-white uppercase cursor-pointer hover:bg-white/10 transition-colors">
                          <span className="flex items-center">Client<SortIndicator column="client" /></span>
                        </th>
                        <th onClick={() => toggleSort('type_erp')} className="text-center px-3 py-2.5 text-xs font-bold text-white uppercase cursor-pointer hover:bg-white/10 transition-colors">
                          <span className="flex items-center justify-center">Type<SortIndicator column="type_erp" /></span>
                        </th>
                        <th onClick={() => toggleSort('departement')} className="text-center px-3 py-2.5 text-xs font-bold text-white uppercase cursor-pointer hover:bg-white/10 transition-colors">
                          <span className="flex items-center justify-center">Dép.<SortIndicator column="departement" /></span>
                        </th>
                        <th onClick={() => toggleSort('ville')} className="text-left px-4 py-2.5 text-xs font-bold text-white uppercase cursor-pointer hover:bg-white/10 transition-colors">
                          <span className="flex items-center">Ville<SortIndicator column="ville" /></span>
                        </th>
                        <th onClick={() => toggleSort('technicien')} className="text-left px-4 py-2.5 text-xs font-bold text-white uppercase cursor-pointer hover:bg-white/10 transition-colors">
                          <span className="flex items-center">Technicien<SortIndicator column="technicien" /></span>
                        </th>
                        <th className="text-center px-3 py-2.5 text-xs font-bold text-white uppercase">Domaines</th>
                        <th onClick={() => toggleSort('actif')} className="text-center px-3 py-2.5 text-xs font-bold text-white uppercase cursor-pointer hover:bg-white/10 transition-colors">
                          <span className="flex items-center justify-center">Statut<SortIndicator column="actif" /></span>
                        </th>
                        <th className="text-right px-4 py-2.5 text-xs font-bold text-white uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredSites.map((site, i) => {
                        const erpInfo = getErpTypeInfo(site.type_erp);
                        return (
                          <tr
                            key={site.id}
                            className={`hover:bg-blue-50/50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} ${selectedSites.includes(site.id) ? 'bg-red-50' : ''}`}
                          >
                            <td className="px-3 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={selectedSites.includes(site.id)}
                                onChange={() => toggleSelectSite(site.id)}
                                className="w-5 h-5 rounded-lg border-2 border-gray-300"
                              />
                            </td>
                            <td className="px-3 py-4 text-center text-sm text-gray-400">{i + 1}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2.5 py-1 rounded-lg text-sm font-bold ${site.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'}`}>
                                {site.code_site || '-'}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-semibold text-gray-900">{site.nom}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">{site.clients?.raison_sociale || '-'}</td>
                            <td className="px-3 py-4 text-center">
                              {erpInfo ? (
                                <span
                                  className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-xs font-bold ${erpInfo.color}`}
                                  title={erpInfo.label}
                                >
                                  {erpInfo.code}
                                </span>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                            </td>
                            <td className="px-3 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-10 h-8 bg-slate-100 rounded-lg font-bold text-sm text-slate-700">
                                {getDepartement(site.code_postal)}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">{site.ville || '-'}</td>
                            <td className="px-4 py-4">
                              {site.techniciens ? (
                                <span className="text-sm text-gray-700">
                                  {site.techniciens.prenom} {site.techniciens.nom}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold">
                                  <AlertTriangle className="w-3 h-3" />Non attribué
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-4">
                              <div className="flex flex-wrap gap-1 justify-center">
                                {(site.domaines_actifs || []).map(d => (
                                  <span
                                    key={d}
                                    className={`px-1.5 py-0.5 rounded text-xs font-bold ${DOMAINE_COLORS[d]?.bg} ${DOMAINE_COLORS[d]?.text}`}
                                  >
                                    {d}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${site.actif ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                {site.actif ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleView(site)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Voir">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleEdit(site)} className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg" title="Modifier">
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(site)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ----- MOBILE CARDS ----- */}
              <div className="md:hidden p-4 space-y-4">
                {filteredSites.map(site => {
                  const erpInfo = getErpTypeInfo(site.type_erp);
                  return (
                    <div key={site.id} className="bg-white rounded-2xl p-5 shadow-md border-2 border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-2.5 py-1 rounded-lg text-sm font-bold ${site.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'}`}>
                          {site.code_site || '-'}
                        </span>
                        {erpInfo && (
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${erpInfo.color}`}>
                            {erpInfo.code}
                          </span>
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{site.nom}</p>
                          <p className="text-sm text-gray-500">{site.clients?.raison_sociale}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm mb-4">
                        <p className="text-gray-600">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          {site.ville || '-'} ({getDepartement(site.code_postal)})
                        </p>
                        {site.techniciens ? (
                          <p className="text-gray-600">
                            <User className="w-4 h-4 inline mr-1" />
                            {site.techniciens.prenom} {site.techniciens.nom}
                          </p>
                        ) : (
                          <p className="text-orange-600 font-medium">
                            <AlertTriangle className="w-4 h-4 inline mr-1" />Sans technicien
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(site.domaines_actifs || []).map(d => (
                          <span
                            key={d}
                            className={`px-2 py-1 rounded-lg text-xs font-bold ${DOMAINE_COLORS[d]?.bg} ${DOMAINE_COLORS[d]?.text}`}
                          >
                            {DOMAINES.find(x => x.code === d)?.icon} {d}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button onClick={() => handleView(site)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold">
                          <Eye className="w-4 h-4" />Voir
                        </button>
                        <button onClick={() => handleEdit(site)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold">
                          <Edit3 className="w-4 h-4" />Modifier
                        </button>
                        <button onClick={() => handleDelete(site)} className="p-2 text-red-500 bg-red-50 rounded-xl">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer count */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Affichage de <span className="font-semibold">{filteredSites.length}</span> site{filteredSites.length > 1 ? 's' : ''}
                  {filteredSites.length !== sites.length && (
                    <span className="text-gray-400"> sur {sites.length}</span>
                  )}
                </p>
              </div>
            </>
          )}
        </div>

        {/* ============================================================= */}
        {/* MODAL IMPORT                                                   */}
        {/* ============================================================= */}
        {showImportHelp && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="px-6 py-5 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-xl">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Importer des sites</h3>
                    <p className="text-white/80 text-sm">Format Excel</p>
                  </div>
                </div>
                <button onClick={() => setShowImportHelp(false)} className="p-2 hover:bg-white/20 rounded-xl">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                  <h4 className="font-bold text-blue-800 mb-2">
                    <Info className="w-5 h-5 inline mr-1" />Colonnes
                  </h4>
                  <p className="text-sm text-blue-700"><b>Obligatoire:</b> nom</p>
                  <p className="text-sm text-blue-600"><b>Optionnel:</b> adresse, code_postal, ville, type_erp</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowImportHelp(false)} className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700">
                    Annuler
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />Choisir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* MODAL EXPORT                                                   */}
        {/* ============================================================= */}
        {showExportHelp && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="px-6 py-5 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-xl">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Exporter</h3>
                    <p className="text-white/80 text-sm">Format Excel</p>
                  </div>
                </div>
                <button onClick={() => setShowExportHelp(false)} className="p-2 hover:bg-white/20 rounded-xl">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
                  <h4 className="font-bold text-green-800 mb-2">Export</h4>
                  <p className="text-sm text-green-700">
                    ✓ {sites.length} sites (avec Type ERP, Catégorie, Effectif)
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowExportHelp(false)} className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700">
                    Annuler
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />Télécharger
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* MODAL NOUVEAU / MODIFIER SITE                                  */}
        {/* ============================================================= */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {editingSite ? 'Modifier le site' : 'Nouveau site'}
                  </h2>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-xl">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Code + Nom */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      <Hash className="w-4 h-4 inline mr-1" />Code
                    </label>
                    <input
                      type="text"
                      value={form.code_site}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 font-mono text-emerald-600"
                      placeholder="Auto"
                      title="Généré : {numero_client}-XX"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      <Building2 className="w-4 h-4 inline mr-1" />Nom *
                    </label>
                    <input
                      type="text"
                      value={form.nom}
                      onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-500/20"
                      placeholder="Nom du site"
                    />
                  </div>
                </div>

                {/* Client + Technicien */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Client *</label>
                    <select
                      value={form.client_id}
                      onChange={(e) => handleClientChange(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                    >
                      <option value="">-- Sélectionner --</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.raison_sociale}{c.numero_client ? ` (${c.numero_client})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Technicien</label>
                    <select
                      value={form.technicien_id}
                      onChange={(e) => setForm({ ...form, technicien_id: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                    >
                      <option value="">-- Aucun --</option>
                      {techniciens.map(t => (
                        <option key={t.id} value={t.id}>{t.prenom} {t.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Classification ERP */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-600" />Classification
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type ERP</label>
                      <select
                        value={form.type_erp}
                        onChange={(e) => setForm({ ...form, type_erp: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                      >
                        <option value="">-- Aucun --</option>
                        {ERP_TYPES.map(t => (
                          <option key={t.code} value={t.code}>{t.code} - {t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Catégorie</label>
                      <select
                        value={form.categorie_erp}
                        onChange={(e) => setForm({ ...form, categorie_erp: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                      >
                        <option value="">-- Aucune --</option>
                        {ERP_CATEGORIES.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Adresse */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    <MapPin className="w-4 h-4 inline mr-1" />Adresse
                  </label>
                  <input
                    type="text"
                    value={form.adresse}
                    onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                    placeholder="Rue"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={form.code_postal}
                      onChange={(e) => setForm({ ...form, code_postal: e.target.value })}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                      placeholder="CP"
                      maxLength={5}
                    />
                    <input
                      type="text"
                      value={form.ville}
                      onChange={(e) => setForm({ ...form, ville: e.target.value })}
                      className="col-span-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                      placeholder="Ville"
                    />
                  </div>
                </div>

                {/* Instructions accès */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <Key className="w-4 h-4 inline mr-1" />Instructions accès
                  </label>
                  <textarea
                    value={form.acces_instructions}
                    onChange={(e) => setForm({ ...form, acces_instructions: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none"
                    rows={2}
                    placeholder="Codes, badges..."
                  />
                </div>

                {/* Contact */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    <User className="w-4 h-4 inline mr-1" />Contact
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={form.contact_nom}
                      onChange={(e) => setForm({ ...form, contact_nom: e.target.value })}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                      placeholder="Nom"
                    />
                    <input
                      type="tel"
                      value={form.contact_telephone}
                      onChange={(e) => setForm({ ...form, contact_telephone: e.target.value })}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                      placeholder="Tél"
                    />
                    <input
                      type="email"
                      value={form.contact_email}
                      onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                      placeholder="Email"
                    />
                  </div>
                </div>

                {/* Domaines actifs */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Cog className="w-4 h-4 inline mr-1" />Domaines actifs
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DOMAINES.map(d => (
                      <button
                        key={d.code}
                        type="button"
                        onClick={() => toggleDomaine(d.code)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                          form.domaines_actifs.includes(d.code)
                            ? `${DOMAINE_COLORS[d.code].bg} ${DOMAINE_COLORS[d.code].text} ${DOMAINE_COLORS[d.code].border}`
                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {d.icon} {d.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <MessageSquare className="w-4 h-4 inline mr-1" />Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none"
                    rows={2}
                  />
                </div>

                {/* Actif toggle */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="actif"
                    checked={form.actif}
                    onChange={(e) => setForm({ ...form, actif: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-slate-600"
                  />
                  <label htmlFor="actif" className="text-sm">
                    <span className="font-medium text-gray-900">Site actif</span>
                  </label>
                </div>
              </div>

              {/* Footer modal */}
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-white"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingSite ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* MODAL FICHE SITE - 4 ONGLETS                                   */}
        {/* ============================================================= */}
        {showDetails && detailsSite && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white w-full h-full overflow-hidden flex flex-col">
              {/* Header navy */}
              <div className="px-6 py-5 bg-slate-800 border-b-[3px] border-red-500 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white/15 rounded-xl">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{detailsSite.nom}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="px-2 py-0.5 bg-white/15 rounded text-white/90 text-xs font-mono">
                        {detailsSite.code_site || '-'}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-400/25 text-emerald-200 rounded text-xs">
                        🏢 {detailsSite.clients?.raison_sociale || 'N/A'}
                      </span>
                      {detailsSite.type_erp && (() => {
                        const info = getErpTypeInfo(detailsSite.type_erp);
                        return info ? (
                          <span className="px-2 py-0.5 bg-amber-400/25 text-amber-200 rounded text-xs font-bold">
                            🏛️ {info.code}{detailsSite.categorie_erp ? ` - Cat.${detailsSite.categorie_erp}` : ''}
                          </span>
                        ) : null;
                      })()}
                      <span className={`px-2 py-0.5 rounded text-xs ${detailsSite.actif ? 'bg-green-400/25 text-green-200' : 'bg-gray-400/25 text-gray-300'}`}>
                        {detailsSite.actif ? '✅ Actif' : '⭕ Inactif'}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowDetails(false)} className="p-2 hover:bg-white/15 rounded-xl text-white/80 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 px-6 bg-gray-50">
                <div className="flex gap-1">
                  {[
                    { id: 'fiche', label: 'Fiche', icon: '📋' },
                    { id: 'equipements', label: 'Équipements', icon: '🔧' },
                    { id: 'contrats', label: 'Contrats', icon: '📄' },
                    { id: 'sav', label: 'SAV', icon: '🔧' },
                    { id: 'travaux', label: 'Travaux', icon: '🏗️' },
                    { id: 'devis', label: 'Devis', icon: '📝' },
                    { id: 'factures', label: 'Factures', icon: '💰' },
                    { id: 'documents', label: 'Documents', icon: '📁' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setDetailsTab(tab.id)}
                      className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                        detailsTab === tab.id
                          ? 'border-slate-700 text-slate-800 bg-white'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.icon} {tab.label}
                      {tab.id === 'contrats' && detailsContrats.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">{detailsContrats.length}</span>
                      )}
                      {tab.id === 'sav' && detailsSav.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">{detailsSav.length}</span>
                      )}
                      {tab.id === 'travaux' && detailsTravaux.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">{detailsTravaux.length}</span>
                      )}
                      {tab.id === 'devis' && detailsDevis.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs">{detailsDevis.length}</span>
                      )}
                      {tab.id === 'factures' && detailsFactures.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">{detailsFactures.length}</span>
                      )}
                      {tab.id === 'documents' && detailsDocuments.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded text-xs">{detailsDocuments.length}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div ref={ficheRef} className="flex-1 overflow-y-auto p-6">
                {detailsLoading ? (
                  <div className="p-12 text-center">
                    <div className="w-10 h-10 border-4 border-slate-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  </div>
                ) : (
                  <>
                    {/* ===== ONGLET FICHE ===== */}
                    {detailsTab === 'fiche' && (
                      <div className="space-y-4">
                        {/* Cards: Infos, Contact, Technicien */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Informations */}
                          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
                              <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                              <Building2 className="w-4 h-4 text-blue-600" />
                              <h3 className="text-sm font-bold text-gray-800">Informations</h3>
                            </div>
                            <div className="border-l-[3px] border-blue-500 ml-0">
                              <div className="p-4 space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500">Code</span>
                                  <span className="text-sm font-mono font-semibold text-gray-900">{detailsSite.code_site || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500">Client</span>
                                  <span className="text-sm font-semibold text-gray-900">{detailsSite.clients?.raison_sociale || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500">Créé</span>
                                  <span className="text-sm font-semibold text-gray-900">{new Date(detailsSite.created_at).toLocaleDateString('fr-FR')}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Contact */}
                          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
                              <div className="w-1.5 h-5 bg-violet-500 rounded-full"></div>
                              <User className="w-4 h-4 text-violet-600" />
                              <h3 className="text-sm font-bold text-gray-800">Contact</h3>
                            </div>
                            <div className="border-l-[3px] border-violet-500 ml-0">
                              <div className="p-4">
                                {detailsSite.contact_nom ? (
                                  <div className="space-y-2">
                                    <p className="font-semibold text-gray-900">{detailsSite.contact_nom}</p>
                                    {detailsSite.contact_telephone && (
                                      <a href={`tel:${detailsSite.contact_telephone}`} className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800 font-medium">
                                        <Phone className="w-3.5 h-3.5" />{detailsSite.contact_telephone}
                                      </a>
                                    )}
                                    {detailsSite.contact_email && (
                                      <a href={`mailto:${detailsSite.contact_email}`} className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800 font-medium break-all">
                                        <Mail className="w-3.5 h-3.5 shrink-0" />{detailsSite.contact_email}
                                      </a>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-400 italic">Non renseigné</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Technicien */}
                          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
                              <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
                              <User className="w-4 h-4 text-emerald-600" />
                              <h3 className="text-sm font-bold text-gray-800">Technicien</h3>
                            </div>
                            <div className="border-l-[3px] border-emerald-500 ml-0">
                              <div className="p-4">
                                {detailsSite.techniciens ? (
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <p className="font-semibold text-gray-900">{detailsSite.techniciens.prenom} {detailsSite.techniciens.nom}</p>
                                      <p className="text-xs text-emerald-600">Technicien assigné</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-orange-600">
                                    <AlertTriangle className="w-5 h-5" />
                                    <span className="text-sm font-medium">Non attribué</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Classification ERP */}
                        {(detailsSite.type_erp || detailsSite.categorie_erp) && (
                          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
                              <div className="w-1.5 h-5 bg-amber-500 rounded-full"></div>
                              <Shield className="w-4 h-4 text-amber-600" />
                              <h3 className="text-sm font-bold text-gray-800">Classification</h3>
                            </div>
                            <div className="border-l-[3px] border-amber-500 ml-0">
                              <div className="p-4">
                                <div className="flex flex-wrap gap-4">
                                  {detailsSite.type_erp && (() => {
                                    const info = getErpTypeInfo(detailsSite.type_erp);
                                    return info ? (
                                      <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${info.color}`}>{info.code}</span>
                                        <span className="text-sm text-gray-600">{info.label}</span>
                                      </div>
                                    ) : null;
                                  })()}
                                  {detailsSite.categorie_erp && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-500">Catégorie :</span>
                                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-sm font-bold text-slate-700">
                                        {detailsSite.categorie_erp}ème
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Adresse + Accès */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
                              <div className="w-1.5 h-5 bg-red-500 rounded-full"></div>
                              <MapPin className="w-4 h-4 text-red-500" />
                              <h3 className="text-sm font-bold text-gray-800">Adresse</h3>
                            </div>
                            <div className="border-l-[3px] border-red-500 ml-0">
                              <div className="p-4">
                                {detailsSite.adresse || detailsSite.ville ? (
                                  <div className="space-y-1">
                                    {detailsSite.adresse && <p className="text-sm text-gray-700">{detailsSite.adresse}</p>}
                                    <p className="text-sm font-semibold text-gray-900">{detailsSite.code_postal} {detailsSite.ville}</p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-400 italic">Non renseignée</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
                              <div className="w-1.5 h-5 bg-amber-500 rounded-full"></div>
                              <Key className="w-4 h-4 text-amber-600" />
                              <h3 className="text-sm font-bold text-gray-800">Accès</h3>
                            </div>
                            <div className="border-l-[3px] border-amber-500 ml-0">
                              <div className="p-4">
                                {detailsSite.acces_instructions ? (
                                  <p className="text-sm text-gray-700">{detailsSite.acces_instructions}</p>
                                ) : (
                                  <p className="text-sm text-gray-400 italic">Aucune instruction</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Domaines + Notes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
                              <div className="w-1.5 h-5 bg-cyan-500 rounded-full"></div>
                              <Cog className="w-4 h-4 text-cyan-600" />
                              <h3 className="text-sm font-bold text-gray-800">Domaines</h3>
                              <span className="ml-auto px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold">
                                {detailsSite.domaines_actifs?.length || 0}
                              </span>
                            </div>
                            <div className="border-l-[3px] border-cyan-500 ml-0">
                              <div className="p-4">
                                {(detailsSite.domaines_actifs?.length || 0) > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {detailsSite.domaines_actifs.map(d => (
                                      <span key={d} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${DOMAINE_COLORS[d]?.bg} ${DOMAINE_COLORS[d]?.text}`}>
                                        {DOMAINES.find(x => x.code === d)?.icon} {d}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-400 italic">Aucun</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
                              <div className="w-1.5 h-5 bg-indigo-500 rounded-full"></div>
                              <MessageSquare className="w-4 h-4 text-indigo-600" />
                              <h3 className="text-sm font-bold text-gray-800">Notes</h3>
                            </div>
                            <div className="border-l-[3px] border-indigo-500 ml-0">
                              <div className="p-4">
                                {detailsSite.notes ? (
                                  <p className="text-sm text-gray-700">{detailsSite.notes}</p>
                                ) : (
                                  <p className="text-sm text-gray-400 italic">Aucune</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ===== ONGLET ÉQUIPEMENTS ===== */}
                    {detailsTab === 'equipements' && (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-500 mb-4">
                          Gérez les équipements par domaine. Seuls les domaines cochés seront utilisés pour les maintenances.
                        </p>
                        {DOMAINES.map(dom => {
                          const colors = DOMAINE_COLORS[dom.code];
                          const eq = equipements[dom.code];
                          const isActive = detailsSite.domaines_actifs?.includes(dom.code);
                          const isEditing = editingEquipement === dom.code;

                          return (
                            <div key={dom.code} className={`rounded-xl overflow-hidden border shadow-sm ${isActive ? colors.border : 'border-gray-200 opacity-60'}`}>
                              {/* Domaine header */}
                              <div className={`bg-gradient-to-r ${isActive ? colors.header : 'from-gray-400 to-gray-300'} px-4 py-2.5 flex items-center justify-between`}>
                                <h4 className="text-sm font-bold text-white">{dom.icon} {dom.label}</h4>
                                <div className="flex items-center gap-2">
                                  {!isActive && <span className="px-2 py-0.5 bg-white/30 rounded text-xs text-white">Non activé</span>}
                                  {eq && <span className="px-2 py-0.5 bg-white/30 rounded-full text-xs text-white font-bold">{getEquipCount(dom.code)} éq.</span>}
                                </div>
                              </div>

                              {/* Domaine body */}
                              <div className={`bg-gradient-to-br ${isActive ? colors.light : 'from-gray-50 to-gray-100'} p-4`}>
                                {isEditing ? (
                                  /* --- Mode édition --- */
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                      {EQUIPEMENT_FIELDS[dom.code]?.map(field => (
                                        <div key={field.name}>
                                          <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
                                          {field.type === 'select' ? (
                                            <select
                                              value={equipForm[field.name] || ''}
                                              onChange={(e) => setEquipForm(prev => ({ ...prev, [field.name]: e.target.value }))}
                                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                                            >
                                              <option value="">--</option>
                                              {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                          ) : (
                                            <input
                                              type={field.type}
                                              value={equipForm[field.name] || ''}
                                              onChange={(e) => setEquipForm(prev => ({ ...prev, [field.name]: e.target.value }))}
                                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                            />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                                      <button
                                        onClick={() => { setEditingEquipement(null); setEquipForm({}); }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600"
                                      >
                                        Annuler
                                      </button>
                                      <button
                                        onClick={handleSaveEquipement}
                                        disabled={savingEquipement}
                                        className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
                                      >
                                        {savingEquipement ? (
                                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                          <Save className="w-4 h-4" />
                                        )}
                                        Enregistrer
                                      </button>
                                    </div>
                                  </div>
                                ) : eq ? (
                                  /* --- Mode affichage --- */
                                  <div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                                      {EQUIPEMENT_FIELDS[dom.code]?.filter(f => eq[f.name]).map(f => (
                                        <div key={f.name} className="bg-white/70 rounded-lg p-2 text-center">
                                          <p className="text-xs text-gray-500">{f.label}</p>
                                          <p className="font-bold text-sm text-gray-800">{eq[f.name]}</p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => handleEditEquipement(dom.code)}
                                        className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                                      >
                                        <Edit3 className="w-3 h-3" />Modifier
                                      </button>
                                      <button
                                        onClick={() => handleDeleteEquipement(dom.code)}
                                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                                      >
                                        <Trash2 className="w-3 h-3" />Supprimer
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  /* --- Mode vide --- */
                                  <div className="text-center py-4">
                                    <p className="text-sm text-gray-400 mb-3">Aucun équipement</p>
                                    <button
                                      onClick={() => handleEditEquipement(dom.code)}
                                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${isActive ? `${colors.bg} ${colors.text}` : 'bg-gray-200 text-gray-500'} flex items-center gap-2 mx-auto`}
                                    >
                                      <Plus className="w-4 h-4" />Ajouter
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* ===== ONGLET CONTRATS ===== */}
                    {detailsTab === 'contrats' && (
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
                            <div className="w-1.5 h-5 bg-indigo-500 rounded-full"></div>
                            <FileText className="w-4 h-4 text-indigo-600" />
                            <h3 className="text-sm font-bold text-gray-800">Contrats</h3>
                            <span className="ml-auto px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                              {detailsContrats.length}
                            </span>
                          </div>
                          <div className="border-l-[3px] border-indigo-500 ml-0">
                            <div className="p-4">
                              {detailsContrats.length > 0 ? (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                  {detailsContrats.map(c => (
                                    <div key={c.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between hover:bg-gray-100 transition-colors">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${DOMAINE_COLORS[c.domaine]?.bg || 'bg-gray-100'} ${DOMAINE_COLORS[c.domaine]?.text || 'text-gray-700'}`}>
                                            {DOMAINES.find(d => d.code === c.domaine)?.icon} {c.domaine}
                                          </span>
                                          <p className="font-semibold text-gray-900 text-sm">{c.numero_contrat || 'Sans n°'}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {c.type_contrat || 'Standard'} • {c.periodicite || 'Annuel'} • {c.nb_visites_an || 1} visite(s)/an
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {c.prix_annuel_ht && (
                                          <span className="text-sm font-bold text-green-600">{c.prix_annuel_ht}€</span>
                                        )}
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${c.statut === 'actif' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                          {c.statut === 'actif' ? '✅' : '⭕'} {c.statut || 'Inactif'}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                  <p className="text-gray-400 text-sm">Aucun contrat</p>
                                  <p className="text-gray-300 text-xs mt-1">Créez depuis la page Contrats</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ===== ONGLET DOCUMENTS ===== */}
                    {/* TAB SAV */}
                    {detailsTab === 'sav' && (
                      <div className="space-y-3">
                        {detailsSav.length === 0 ? (
                          <div className="text-center py-12 text-gray-400">
                            <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">Aucune intervention SAV</p>
                          </div>
                        ) : detailsSav.map(sav => (
                          <div key={sav.id} className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                  sav.priorite === 'p1' ? 'bg-red-100 text-red-700' :
                                  sav.priorite === 'p2' ? 'bg-orange-100 text-orange-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>{(sav.priorite || 'p3').toUpperCase()}</span>
                                <span className="text-sm font-semibold text-gray-800">{sav.numero || '-'}</span>
                                {sav.domaine && <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-semibold">{sav.domaine}</span>}
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                sav.statut === 'termine' ? 'bg-green-100 text-green-700' :
                                sav.statut === 'en_cours' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>{sav.statut || 'nouveau'}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{sav.symptome_declare || '-'}</p>
                            <div className="flex items-center gap-4 text-[10px] text-gray-400">
                              <span>Demande: {sav.date_demande ? new Date(sav.date_demande).toLocaleDateString('fr-FR') : '-'}</span>
                              {sav.techniciens && <span>Tech: {sav.techniciens.prenom} {sav.techniciens.nom}</span>}
                              {sav.cout && <span>Coût: {Number(sav.cout).toLocaleString('fr-FR')} €</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TAB TRAVAUX */}
                    {detailsTab === 'travaux' && (
                      <div className="space-y-3">
                        {detailsTravaux.length === 0 ? (
                          <div className="text-center py-12 text-gray-400">
                            <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">Aucun travaux enregistré</p>
                          </div>
                        ) : detailsTravaux.map(t => (
                          <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-800">{t.numero || '-'}</span>
                                {t.domaine && <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-semibold">{t.domaine}</span>}
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                t.statut === 'termine' ? 'bg-green-100 text-green-700' :
                                t.statut === 'en_cours' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>{t.statut || 'planifie'}</span>
                            </div>
                            <p className="text-xs text-gray-600 font-medium mb-1">{t.objet || '-'}</p>
                            <div className="flex items-center gap-4 text-[10px] text-gray-400">
                              {t.date_realisation && <span>Réalisé: {new Date(t.date_realisation).toLocaleDateString('fr-FR')}</span>}
                              {t.techniciens && <span>Tech: {t.techniciens.prenom} {t.techniciens.nom}</span>}
                              {t.cout && <span>Coût: {Number(t.cout).toLocaleString('fr-FR')} €</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TAB DEVIS */}
                    {detailsTab === 'devis' && (
                      <div className="space-y-3">
                        {detailsDevis.length === 0 ? (
                          <div className="text-center py-12 text-gray-400">
                            <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">Aucun devis</p>
                          </div>
                        ) : detailsDevis.map(d => (
                          <div key={d.id} className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-800">{d.numero || '-'}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                d.statut === 'accepte' ? 'bg-green-100 text-green-700' :
                                d.statut === 'refuse' ? 'bg-red-100 text-red-700' :
                                d.statut === 'envoye' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>{d.statut || 'brouillon'}</span>
                            </div>
                            <p className="text-xs text-gray-600 font-medium mb-1">{d.objet || '-'}</p>
                            <div className="flex items-center gap-4 text-[10px] text-gray-400">
                              {d.date_emission && <span>Émis: {new Date(d.date_emission).toLocaleDateString('fr-FR')}</span>}
                              {d.montant_ttc && <span className="font-semibold text-gray-600">{Number(d.montant_ttc).toLocaleString('fr-FR')} € TTC</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TAB FACTURES */}
                    {detailsTab === 'factures' && (
                      <div className="space-y-3">
                        {detailsFactures.length === 0 ? (
                          <div className="text-center py-12 text-gray-400">
                            <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">Aucune facture</p>
                          </div>
                        ) : detailsFactures.map(f => (
                          <div key={f.id} className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-800">{f.numero || '-'}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                f.statut === 'paid' || f.statut === 'payee' ? 'bg-green-100 text-green-700' :
                                f.statut === 'overdue' || f.statut === 'en_retard' ? 'bg-red-100 text-red-700' :
                                f.statut === 'sent' || f.statut === 'envoyee' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>{f.statut || 'brouillon'}</span>
                            </div>
                            <p className="text-xs text-gray-600 font-medium mb-1">{f.objet || '-'}</p>
                            <div className="flex items-center gap-4 text-[10px] text-gray-400">
                              {f.date_emission && <span>Émise: {new Date(f.date_emission).toLocaleDateString('fr-FR')}</span>}
                              {f.date_echeance && <span>Échéance: {new Date(f.date_echeance).toLocaleDateString('fr-FR')}</span>}
                              {f.montant_ttc && <span className="font-semibold text-gray-600">{Number(f.montant_ttc).toLocaleString('fr-FR')} € TTC</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TAB DOCUMENTS (liens Drive/Dropbox) */}
                    {detailsTab === 'documents' && (
                      <div className="space-y-4">
                        {/* Info box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-blue-700">
                              <p className="font-semibold mb-1">Comment ajouter des documents ?</p>
                              <p>1. Déposez vos fichiers sur Google Drive, Dropbox ou OneDrive</p>
                              <p>2. Générez un lien de partage</p>
                              <p>3. Collez le lien ci-dessous avec un titre</p>
                              <p className="mt-1 text-blue-500 italic">Les rapports générés par l'appli seront ajoutés automatiquement (à venir)</p>
                            </div>
                          </div>
                        </div>

                        {/* Bouton ajouter */}
                        <button
                          onClick={() => { setShowDocForm(true); setDocForm({ categorie: 'rapport_maintenance', titre: '', url: '', description: '', domaine: '', date_document: '' }); }}
                          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700"
                        >
                          <Plus className="w-4 h-4" /> Ajouter un lien
                        </button>

                        {/* Formulaire ajout doc */}
                        {showDocForm && (
                          <div className="bg-white rounded-xl border-2 border-teal-200 p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Catégorie *</label>
                                <select value={docForm.categorie} onChange={e => setDocForm(p => ({...p, categorie: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                                  {DOC_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Domaine</label>
                                <select value={docForm.domaine} onChange={e => setDocForm(p => ({...p, domaine: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                                  <option value="">— Aucun —</option>
                                  {DOMAINES.map(d => <option key={d.code} value={d.code}>{d.code} - {d.label}</option>)}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">Titre *</label>
                              <input type="text" value={docForm.titre} onChange={e => setDocForm(p => ({...p, titre: e.target.value}))} placeholder="Ex: Rapport maintenance SSI - Janvier 2026" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">URL du lien *</label>
                              <input type="url" value={docForm.url} onChange={e => setDocForm(p => ({...p, url: e.target.value}))} placeholder="https://drive.google.com/..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Date du document</label>
                                <input type="date" value={docForm.date_document} onChange={e => setDocForm(p => ({...p, date_document: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                                <input type="text" value={docForm.description} onChange={e => setDocForm(p => ({...p, description: e.target.value}))} placeholder="Optionnel" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button
                                disabled={savingDoc || !docForm.titre || !docForm.url}
                                onClick={async () => {
                                  if (!docForm.titre || !docForm.url) return;
                                  setSavingDoc(true);
                                  try {
                                    const { error } = await supabase.from('sites_documents').insert([{
                                      organisation_id: orgId,
                                      site_id: detailsSite.id,
                                      categorie: docForm.categorie,
                                      titre: docForm.titre,
                                      url: docForm.url,
                                      description: docForm.description || null,
                                      domaine: docForm.domaine || null,
                                      date_document: docForm.date_document || null
                                    }]);
                                    if (error) throw error;
                                    // Recharger
                                    const { data: docsData } = await supabase.from('sites_documents').select('*').eq('site_id', detailsSite.id).order('created_at', { ascending: false });
                                    setDetailsDocuments(docsData || []);
                                    setShowDocForm(false);
                                  } catch (err) {
                                    console.error(err);
                                    alert('Erreur: ' + err.message);
                                  } finally {
                                    setSavingDoc(false);
                                  }
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50"
                              >
                                <Save className="w-4 h-4" /> {savingDoc ? 'Enregistrement...' : 'Enregistrer'}
                              </button>
                              <button onClick={() => setShowDocForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Annuler</button>
                            </div>
                          </div>
                        )}

                        {/* Liste des documents */}
                        {detailsDocuments.length === 0 && !showDocForm ? (
                          <div className="text-center py-8">
                            <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">Aucun document lié</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {detailsDocuments.map(doc => (
                              <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between group hover:border-teal-300 transition-colors">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FolderOpen className="w-4 h-4 text-teal-600" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{doc.titre}</p>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                      <span className="px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded font-semibold">
                                        {DOC_CATEGORIES.find(c => c.value === doc.categorie)?.label || doc.categorie}
                                      </span>
                                      {doc.domaine && <span className="px-1.5 py-0.5 bg-gray-100 rounded font-semibold">{doc.domaine}</span>}
                                      {doc.date_document && <span>{new Date(doc.date_document).toLocaleDateString('fr-FR')}</span>}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-teal-50 rounded-lg text-teal-600" title="Ouvrir le lien">
                                    <Eye className="w-4 h-4" />
                                  </a>
                                  <button
                                    onClick={async () => {
                                      if (!confirm('Supprimer ce document ?')) return;
                                      await supabase.from('sites_documents').delete().eq('id', doc.id);
                                      setDetailsDocuments(prev => prev.filter(d => d.id !== doc.id));
                                    }}
                                    className="p-2 hover:bg-red-50 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer fiche */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <div className="flex gap-2">
                  <button onClick={() => scrollToTop(ficheRef)} className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-slate-50">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => scrollToBottom(ficheRef)} className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-slate-50">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowDetails(false)} className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50">
                    Fermer
                  </button>
                  <button
                    onClick={() => { setShowDetails(false); handleEdit(detailsSite); }}
                    className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-xl font-semibold shadow-lg flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />Modifier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
