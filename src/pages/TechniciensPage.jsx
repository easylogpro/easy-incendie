// src/pages/TechniciensPage.jsx
// Easy Sécurité - Gestion des techniciens

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { Card, Button, Modal, Input, Select, Badge, EmptyState, Skeleton } from '../components/ui';
import { UserCog, Plus, Search, Phone, Mail, Edit, Trash2, Calendar } from 'lucide-react';

const TechniciensPage = () => {
  const { orgId } = useAuth();
  const [techniciens, setTechniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', telephone: '', matricule: '', type_contrat: 'cdi', couleur_planning: '#3B82F6', actif: true
  });

  useEffect(() => { loadData(); }, [orgId]);

  const loadData = async () => {
    if (!orgId) return;
    try {
      const { data } = await supabase.from('techniciens').select('*').eq('organisation_id', orgId).order('nom');
      setTechniciens(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTechniciens = techniciens.filter(t =>
    t.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setFormData({ nom: '', prenom: '', email: '', telephone: '', matricule: '', type_contrat: 'cdi', couleur_planning: '#3B82F6', actif: true });
    setModalMode('create');
  };

  const openEditModal = (tech) => {
    setSelectedTech(tech);
    setFormData({
      nom: tech.nom || '', prenom: tech.prenom || '', email: tech.email || '', telephone: tech.telephone || '',
      matricule: tech.matricule || '', type_contrat: tech.type_contrat || 'cdi', couleur_planning: tech.couleur_planning || '#3B82F6', actif: tech.actif
    });
    setModalMode('edit');
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'create') {
        await supabase.from('techniciens').insert({ ...formData, organisation_id: orgId });
      } else {
        await supabase.from('techniciens').update(formData).eq('id', selectedTech.id);
      }
      setModalMode(null);
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (tech) => {
    if (!confirm(`Supprimer ${tech.prenom} ${tech.nom} ?`)) return;
    try {
      await supabase.from('techniciens').delete().eq('id', tech.id);
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton variant="title" className="w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} variant="card" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Techniciens</h1>
          <p className="text-gray-500">{techniciens.length} technicien(s)</p>
        </div>
        <Button onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>Nouveau technicien</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
        />
      </div>

      {filteredTechniciens.length === 0 ? (
        <EmptyState
          icon={<UserCog className="w-16 h-16" />}
          title="Aucun technicien"
          description="Ajoutez votre premier technicien"
          action={<Button onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>Ajouter</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTechniciens.map(tech => (
            <Card key={tech.id} padding="normal" onClick={() => openEditModal(tech)}>
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: tech.couleur_planning }}
                >
                  {tech.prenom?.[0]}{tech.nom?.[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{tech.prenom} {tech.nom}</h3>
                    <Badge variant={tech.actif ? 'success' : 'default'} size="sm">
                      {tech.actif ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{tech.matricule || 'Sans matricule'}</p>
                  
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    {tech.telephone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{tech.telephone}</span>
                      </div>
                    )}
                    {tech.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{tech.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                <button onClick={(e) => { e.stopPropagation(); openEditModal(tech); }} className="text-blue-600 hover:text-blue-800 text-sm">Modifier</button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(tech); }} className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!modalMode}
        onClose={() => setModalMode(null)}
        title={modalMode === 'create' ? 'Nouveau technicien' : 'Modifier le technicien'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalMode(null)}>Annuler</Button>
            <Button onClick={handleSave}>{modalMode === 'create' ? 'Créer' : 'Enregistrer'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prénom *" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} />
            <Input label="Nom *" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} />
          </div>
          <Input label="Téléphone *" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Matricule" value={formData.matricule} onChange={(e) => setFormData({...formData, matricule: e.target.value})} />
            <Select
              label="Type contrat"
              value={formData.type_contrat}
              onChange={(e) => setFormData({...formData, type_contrat: e.target.value})}
              options={[{ value: 'cdi', label: 'CDI' }, { value: 'cdd', label: 'CDD' }, { value: 'interim', label: 'Intérim' }]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur planning</label>
            <input
              type="color"
              value={formData.couleur_planning}
              onChange={(e) => setFormData({...formData, couleur_planning: e.target.value})}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TechniciensPage;
