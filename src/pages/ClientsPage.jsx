// src/pages/ClientsPage.jsx
import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Building2, Mail, Phone, MapPin, Edit, Trash2, FileText, Receipt, Download, TrendingUp, AlertCircle, LayoutGrid, List, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, Button, Modal, Input, Select, Badge, EmptyState, Skeleton } from '../components/ui';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const [sortConfig, setSortConfig] = useState({ key: 'raisonSociale', direction: 'asc' });
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({ raisonSociale: '', siret: '', email: '', telephone: '', adresse: '', codePostal: '', ville: '', pays: 'France', type: 'professionnel', notes: '' });

  // Générer le prochain code client (format: 001, 002, 003...)
  const getNextClientCode = () => {
    if (clients.length === 0) return '001';
    const maxCode = Math.max(...clients.map(c => parseInt(c.code, 10) || 0));
    return String(maxCode + 1).padStart(3, '0');
  };

  useEffect(() => {
    setTimeout(() => {
      setClients([
        { id: '1', code: '001', raisonSociale: 'Dupont Industries', siret: '123 456 789 00012', email: 'contact@dupont-industries.fr', telephone: '01 23 45 67 89', adresse: '15 rue de la République', codePostal: '75001', ville: 'Paris', pays: 'France', type: 'professionnel', sitesCount: 5, devisEnCours: 3, facturesImpayees: 1, caTotal: 45600, dernierContact: '2025-12-10' },
        { id: '2', code: '002', raisonSociale: 'Martin SAS', siret: '987 654 321 00034', email: 'info@martin-sas.com', telephone: '04 56 78 90 12', adresse: '8 avenue des Champs', codePostal: '69001', ville: 'Lyon', pays: 'France', type: 'professionnel', sitesCount: 12, devisEnCours: 0, facturesImpayees: 0, caTotal: 128500, dernierContact: '2025-12-15' },
        { id: '3', code: '003', raisonSociale: 'Carrefour Lyon', siret: '456 789 123 00056', email: 'technique@carrefour.fr', telephone: '04 78 90 12 34', adresse: '120 boulevard de la Croix-Rousse', codePostal: '69004', ville: 'Lyon', pays: 'France', type: 'professionnel', sitesCount: 3, devisEnCours: 2, facturesImpayees: 2, caTotal: 89200, dernierContact: '2025-12-14' },
        { id: '4', code: '004', raisonSociale: 'Boulangerie Petit Jean', siret: '321 654 987 00078', email: 'petitjean@boulangerie.fr', telephone: '02 34 56 78 90', adresse: '3 place du Marché', codePostal: '44000', ville: 'Nantes', pays: 'France', type: 'professionnel', sitesCount: 1, devisEnCours: 1, facturesImpayees: 0, caTotal: 12400, dernierContact: '2025-12-08' }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredClients = clients.filter(client => 
    client.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.ville.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <ChevronUp className="w-4 h-4 text-gray-300" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 text-blue-500" /> : <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  const openCreateModal = () => { 
    setFormData({ raisonSociale: '', siret: '', email: '', telephone: '', adresse: '', codePostal: '', ville: '', pays: 'France', type: 'professionnel', notes: '' }); 
    setModalMode('create'); 
  };
  
  const openEditModal = (client) => { 
    setSelectedClient(client); 
    setFormData({ raisonSociale: client.raisonSociale, siret: client.siret, email: client.email, telephone: client.telephone, adresse: client.adresse, codePostal: client.codePostal, ville: client.ville, pays: client.pays, type: client.type, notes: client.notes || '' }); 
    setModalMode('edit'); 
  };
  
  const openViewModal = (client) => { setSelectedClient(client); setModalMode('view'); };
  const closeModal = () => { setModalMode(null); setSelectedClient(null); };
  
  const handleSave = () => { 
    if (modalMode === 'create') { 
      const newCode = getNextClientCode();
      setClients([...clients, { 
        id: Date.now().toString(), 
        code: newCode,
        ...formData, 
        sitesCount: 0, 
        devisEnCours: 0, 
        facturesImpayees: 0, 
        caTotal: 0, 
        dernierContact: new Date().toISOString().split('T')[0] 
      }]); 
    } else { 
      setClients(clients.map(c => c.id === selectedClient.id ? { ...c, ...formData } : c)); 
    } 
    closeModal(); 
  };
  
  const handleDelete = (client) => { setClients(clients.filter(c => c.id !== client.id)); setDeleteConfirm(null); };

  const ClientCard = ({ client }) => (
    <Card className="group relative overflow-hidden" padding="none" onClick={() => openViewModal(client)}>
      <div className={`h-1.5 bg-gradient-to-r ${client.facturesImpayees > 0 ? 'from-red-500 to-rose-500' : 'from-blue-500 to-indigo-500'}`} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30">{client.code}</div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{client.raisonSociale}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{client.ville}</p>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button onClick={(e) => { e.stopPropagation(); openEditModal(client); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600"><Edit className="w-3.5 h-3.5" /></button>
            <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(client); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-1.5 bg-gray-50 rounded-lg"><p className="text-sm font-bold text-gray-900">{client.sitesCount}</p><p className="text-[10px] text-gray-500">Sites</p></div>
          <div className="text-center p-1.5 bg-gray-50 rounded-lg"><p className="text-sm font-bold text-gray-900">{client.devisEnCours}</p><p className="text-[10px] text-gray-500">Devis</p></div>
          <div className="text-center p-1.5 bg-gray-50 rounded-lg"><p className={`text-sm font-bold ${client.facturesImpayees > 0 ? 'text-red-600' : 'text-gray-900'}`}>{client.facturesImpayees}</p><p className="text-[10px] text-gray-500">Impayées</p></div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /><span className="font-semibold text-gray-900 text-sm">{client.caTotal.toLocaleString()}€</span></div>
          <span className="text-[10px] text-gray-500">{new Date(client.dernierContact).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"><Users className="w-6 h-6 text-white" /></div>
            Clients Payeurs
          </h1>
          <p className="text-gray-500 mt-1">Gérez vos clients et leurs informations</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openCreateModal}>Nouveau Client</Button>
      </div>

      {/* Barre de recherche et filtres */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Rechercher un client..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button onClick={() => setViewMode('cards')} className={`p-2 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><LayoutGrid className="w-5 h-5" /></button>
              <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><List className="w-5 h-5" /></button>
            </div>
            <Button variant="secondary" icon={Filter}>Filtres</Button>
            <Button variant="secondary" icon={Download}>Exporter</Button>
          </div>
        </div>
      </Card>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="md" className="text-center"><p className="text-3xl font-bold text-gray-900">{clients.length}</p><p className="text-sm text-gray-500">Total clients</p></Card>
        <Card padding="md" className="text-center"><p className="text-3xl font-bold text-blue-600">{clients.reduce((acc, c) => acc + c.sitesCount, 0)}</p><p className="text-sm text-gray-500">Sites actifs</p></Card>
        <Card padding="md" className="text-center"><p className="text-3xl font-bold text-amber-600">{clients.reduce((acc, c) => acc + c.devisEnCours, 0)}</p><p className="text-sm text-gray-500">Devis en cours</p></Card>
        <Card padding="md" className="text-center"><p className="text-3xl font-bold text-emerald-600">{(clients.reduce((acc, c) => acc + c.caTotal, 0) / 1000).toFixed(1)}k€</p><p className="text-sm text-gray-500">CA total</p></Card>
      </div>

      {/* Liste des clients */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (<Card key={i} padding="md"><Skeleton className="h-32" /></Card>))}
        </div>
      ) : filteredClients.length === 0 ? (
        <EmptyState icon={Users} title="Aucun client trouvé" description={searchTerm ? "Aucun client ne correspond à votre recherche" : "Commencez par ajouter votre premier client"} action={<Button variant="primary" icon={Plus} onClick={openCreateModal}>Ajouter un client</Button>} />
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedClients.map(client => (<ClientCard key={client.id} client={client} />))}
        </div>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th onClick={() => handleSort('code')} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"><div className="flex items-center gap-1">N° <SortIcon column="code" /></div></th>
                  <th onClick={() => handleSort('raisonSociale')} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"><div className="flex items-center gap-1">Raison Sociale <SortIcon column="raisonSociale" /></div></th>
                  <th onClick={() => handleSort('ville')} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"><div className="flex items-center gap-1">Ville <SortIcon column="ville" /></div></th>
                  <th onClick={() => handleSort('sitesCount')} className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"><div className="flex items-center justify-center gap-1">Sites <SortIcon column="sitesCount" /></div></th>
                  <th onClick={() => handleSort('devisEnCours')} className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"><div className="flex items-center justify-center gap-1">Devis <SortIcon column="devisEnCours" /></div></th>
                  <th onClick={() => handleSort('facturesImpayees')} className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"><div className="flex items-center justify-center gap-1">Impayées <SortIcon column="facturesImpayees" /></div></th>
                  <th onClick={() => handleSort('caTotal')} className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"><div className="flex items-center justify-end gap-1">CA Total <SortIcon column="caTotal" /></div></th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedClients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openViewModal(client)}>
                    <td className="px-4 py-3"><span className="inline-flex items-center justify-center w-10 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs">{client.code}</span></td>
                    <td className="px-4 py-3 font-medium text-gray-900">{client.raisonSociale}</td>
                    <td className="px-4 py-3 text-gray-600">{client.ville}</td>
                    <td className="px-4 py-3 text-center"><Badge variant="default">{client.sitesCount}</Badge></td>
                    <td className="px-4 py-3 text-center"><Badge variant={client.devisEnCours > 0 ? 'warning' : 'default'}>{client.devisEnCours}</Badge></td>
                    <td className="px-4 py-3 text-center"><Badge variant={client.facturesImpayees > 0 ? 'danger' : 'success'}>{client.facturesImpayees}</Badge></td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{client.caTotal.toLocaleString()}€</td>
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEditModal(client)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteConfirm(client)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal Création/Édition - Sans champ Code (auto-généré) */}
      <Modal isOpen={modalMode === 'create' || modalMode === 'edit'} onClose={closeModal} title={modalMode === 'create' ? 'Nouveau Client' : 'Modifier Client'} subtitle={modalMode === 'create' ? `Code client: ${getNextClientCode()} (auto)` : `Code: ${selectedClient?.code}`} icon={Users} iconColor="blue" size="lg" footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={closeModal}>Annuler</Button><Button variant="primary" onClick={handleSave}>{modalMode === 'create' ? 'Créer' : 'Enregistrer'}</Button></div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Raison sociale" placeholder="Nom de l'entreprise" value={formData.raisonSociale} onChange={(e) => setFormData({...formData, raisonSociale: e.target.value})} required className="md:col-span-2" />
          <Input label="SIRET" placeholder="123 456 789 00012" value={formData.siret} onChange={(e) => setFormData({...formData, siret: e.target.value})} />
          <Select label="Type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} options={[{ value: 'professionnel', label: 'Professionnel' }, { value: 'particulier', label: 'Particulier' }, { value: 'administration', label: 'Administration' }]} />
          <Input label="Email" type="email" placeholder="contact@entreprise.fr" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} icon={Mail} required />
          <Input label="Téléphone" placeholder="01 23 45 67 89" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} icon={Phone} />
          <Input label="Adresse" placeholder="15 rue de la République" value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} className="md:col-span-2" />
          <Input label="Code postal" placeholder="75001" value={formData.codePostal} onChange={(e) => setFormData({...formData, codePostal: e.target.value})} />
          <Input label="Ville" placeholder="Paris" value={formData.ville} onChange={(e) => setFormData({...formData, ville: e.target.value})} />
        </div>
      </Modal>

      {/* Modal Détail Client */}
      <Modal isOpen={modalMode === 'view'} onClose={closeModal} title={selectedClient?.raisonSociale} subtitle={`Client N° ${selectedClient?.code}`} icon={Building2} iconColor="blue" size="xl" footer={<div className="flex justify-between"><Button variant="ghost" onClick={closeModal}>Fermer</Button><div className="flex gap-3"><Button variant="secondary" icon={FileText}>Nouveau Devis</Button><Button variant="primary" icon={Edit} onClick={() => { closeModal(); openEditModal(selectedClient); }}>Modifier</Button></div></div>}>
        {selectedClient && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white"><Building2 className="w-6 h-6 mb-2 opacity-80" /><p className="text-3xl font-bold">{selectedClient.sitesCount}</p><p className="text-sm opacity-80">Sites</p></div>
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-4 text-white"><FileText className="w-6 h-6 mb-2 opacity-80" /><p className="text-3xl font-bold">{selectedClient.devisEnCours}</p><p className="text-sm opacity-80">Devis en cours</p></div>
              <div className={`rounded-2xl p-4 text-white ${selectedClient.facturesImpayees > 0 ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-emerald-500 to-green-600'}`}><Receipt className="w-6 h-6 mb-2 opacity-80" /><p className="text-3xl font-bold">{selectedClient.facturesImpayees}</p><p className="text-sm opacity-80">Factures impayées</p></div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white"><TrendingUp className="w-6 h-6 mb-2 opacity-80" /><p className="text-3xl font-bold">{(selectedClient.caTotal / 1000).toFixed(1)}k€</p><p className="text-sm opacity-80">CA total</p></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div><h4 className="font-semibold text-gray-900 mb-3">Coordonnées</h4><div className="space-y-3"><div className="flex items-center gap-3 text-gray-600"><Mail className="w-4 h-4" /><span>{selectedClient.email}</span></div><div className="flex items-center gap-3 text-gray-600"><Phone className="w-4 h-4" /><span>{selectedClient.telephone}</span></div><div className="flex items-start gap-3 text-gray-600"><MapPin className="w-4 h-4 mt-0.5" /><span>{selectedClient.adresse}<br />{selectedClient.codePostal} {selectedClient.ville}</span></div></div></div>
              <div><h4 className="font-semibold text-gray-900 mb-3">Informations légales</h4><div className="space-y-3"><div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><span className="text-gray-500">SIRET</span><span className="font-mono text-gray-900">{selectedClient.siret}</span></div><div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><span className="text-gray-500">Type</span><Badge variant="primary">{selectedClient.type}</Badge></div></div></div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100"><Button variant="secondary" icon={Building2} fullWidth>Voir les sites</Button><Button variant="secondary" icon={FileText} fullWidth>Historique devis</Button><Button variant="secondary" icon={Receipt} fullWidth>Historique factures</Button></div>
          </div>
        )}
      </Modal>

      {/* Modal Confirmation Suppression */}
      <Modal isOpen={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Supprimer ce client ?" subtitle="Cette action est irréversible" icon={AlertCircle} iconColor="red" size="sm" footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Annuler</Button><Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>Supprimer</Button></div>}>
        <p className="text-gray-600">Vous êtes sur le point de supprimer le client N° <strong>{deleteConfirm?.code}</strong> - <strong>{deleteConfirm?.raisonSociale}</strong>. Tous les sites et données associés seront également supprimés.</p>
      </Modal>
    </div>
  );
};

export default ClientsPage;