# ARCHITECTURE FIREBASE — LOGICIEL ÉNERGIE & INCENDIE

## Vue d'ensemble

Architecture **multi-tenant isolé** : un projet Firebase unique avec isolation stricte des données par organisation.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROJET FIREBASE UNIQUE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   organizations/{orgId}/                                        │
│   ├── settings                  (configuration organisation)   │
│   ├── users/{userId}            (utilisateurs)                 │
│   ├── clients_payeurs/{id}      (clients payeurs)              │
│   ├── sites/{id}                (sites / clients finaux)       │
│   ├── techniciens/{id}          (techniciens internes)         │
│   ├── stt/{id}                  (sous-traitants)               │
│   ├── interventions/{id}        (interventions)                │
│   ├── rapports/{id}             (rapports)                     │
│   ├── devis/{id}                (devis)                        │
│   ├── factures/{id}             (factures)                     │
│   ├── contrats/{id}             (contrats maintenance)         │
│   ├── materiel/{id}             (référentiel matériel)         │
│   ├── alertes/{id}              (alertes actives)              │
│   ├── counters/{type}           (compteurs numérotation)       │
│   └── audit_log/{id}            (historique modifications)     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Collections et Schémas

### 1. organizations/{orgId}/settings

Configuration globale de l'organisation.

```javascript
{
  // Identité
  nom: "AVISS SERVICES",
  forme_juridique: "SAS",
  capital: "157 500 €",
  
  // Coordonnées
  adresse: "54 RUE PIERRE CURIE",
  code_postal: "78370",
  ville: "PLAISIR",
  telephone: "+33 1 30 16 58 73",
  email: "contact@aviss.fr",
  site_web: "http://aviss.fr",
  
  // Légal
  siret: "51155611000027",
  siren: "511556110",
  code_ape: "8020 Z",
  tva_intracommunautaire: "FR 11 511 556 110",
  rcs: "VERSAILLES",
  
  // Bancaire
  iban: "FR76 XXXX XXXX XXXX XXXX XXXX XXX",
  bic: "XXXXXXXX",
  
  // Branding
  logo_url: "https://storage.../logo.png",
  couleur_primaire: "#1E3A5F",
  
  // Licence
  licence: {
    cle: "XXXX-XXXX-XXXX-XXXX",
    plan: "pro", // basic, pro, enterprise
    modules_actifs: ["energie", "chauffage", "incendie", "isolation"],
    date_activation: Timestamp,
    date_expiration: Timestamp,
    statut: "actif" // actif, expire, suspendu
  },
  
  // Paramètres
  parametres: {
    tva_defaut: 20,
    delai_paiement_defaut: 30,
    validite_devis_defaut: 30,
    devise: "EUR",
    fuseau_horaire: "Europe/Paris"
  },
  
  // CGV
  cgv_url: "https://aviss.fr/cgv",
  mention_legale_pied_page: "Toute commande implique l'acceptation des CGV...",
  
  // Notifications
  notifications: {
    client_rapport_disponible: true,
    client_devis_cree: true,
    client_relance_devis: true,
    client_facture_emise: true,
    client_relance_facture: true,
    client_alerte_critique: true,
    client_rappel_maintenance: true,
    stt_mission_assignee: true,
    stt_mission_modifiee: true,
    stt_rappel_j1: true
  },
  
  // Espace client
  espace_client: {
    sites_visible: true,
    materiel_visible: true,
    historique_interventions_visible: true,
    devis_visible: true,
    factures_visible: true,
    rapports_visible: true,
    alertes_visible: true,
    planning_visible: true,
    contrats_visible: true
  },
  
  // Métadonnées
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

### 2. organizations/{orgId}/users/{userId}

Utilisateurs de l'organisation (admin, techniciens bureau, etc.).

```javascript
{
  uid: "firebase_auth_uid",
  email: "valery@aviss.fr",
  nom: "FEVRY",
  prenom: "Valéry",
  telephone: "0679435913",
  
  role: "admin", // admin, gestionnaire, technicien, stt, client_payeur, client_final
  
  // Si technicien
  technicien_id: "tech_xxx" | null,
  
  // Si STT
  stt_id: "stt_xxx" | null,
  
  // Si client
  client_payeur_id: "cp_xxx" | null,
  client_final_id: "cf_xxx" | null,
  
  actif: true,
  derniere_connexion: Timestamp,
  
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

### 3. organizations/{orgId}/clients_payeurs/{id}

Clients payeurs (responsables financiers).

```javascript
{
  id: "cp_xxx",
  code: "RJA", // Code court pour numérotation (3-4 lettres)
  
  // Identité
  type: "societe", // societe, particulier
  raison_sociale: "RÉSIDENCE JEANNE D'ARC",
  siret: "XXX XXX XXX XXXXX",
  
  // Contact principal
  contact_nom: "DUPONT",
  contact_prenom: "Jean",
  contact_email: "contact@residence-jda.fr",
  contact_telephone: "01 XX XX XX XX",
  
  // Adresse facturation
  adresse: "12 rue de la Paix",
  code_postal: "75001",
  ville: "PARIS",
  
  // Conditions commerciales
  conditions_paiement: 45, // jours
  tva_applicable: 10, // % par défaut pour ce client
  remise_globale: 0, // % remise permanente
  
  // Compteurs
  nb_sites: 3,
  ca_total: 15000.00,
  ca_annee_courante: 5000.00,
  
  // Accès espace client
  espace_client_actif: true,
  
  // Statut
  statut: "actif", // actif, inactif, prospect
  
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

### 4. organizations/{orgId}/sites/{id}

Sites / Clients finaux (lieux d'intervention).

```javascript
{
  id: "site_xxx",
  
  // Lien client payeur
  client_payeur_id: "cp_xxx",
  
  // Identité
  nom: "Bâtiment A - Résidence Jeanne d'Arc",
  reference: "SITE-001",
  
  // Adresse
  adresse: "12 rue de la Paix",
  code_postal: "75001",
  ville: "PARIS",
  
  // Géolocalisation
  latitude: 48.8566,
  longitude: 2.3522,
  
  // Contact sur site
  contact_nom: "MARTIN",
  contact_prenom: "Pierre",
  contact_email: "gardien@residence-jda.fr",
  contact_telephone: "06 XX XX XX XX",
  
  // Caractéristiques
  type_batiment: "ERP", // ERP, IGH, habitation, tertiaire, industriel
  categorie_erp: "J", // Si ERP
  surface: 2500, // m²
  nb_niveaux: 5,
  
  // Notes
  observations: "Accès par le parking souterrain, badge nécessaire",
  
  // Lots actifs sur ce site
  lots_actifs: ["ssi", "baes", "desenfumage", "compartimentage"],
  
  // Compteurs
  nb_equipements: 45,
  nb_interventions: 12,
  
  statut: "actif",
  
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

### 5. organizations/{orgId}/techniciens/{id}

Techniciens internes.

```javascript
{
  id: "tech_xxx",
  user_id: "user_xxx", // Lien vers users/
  
  nom: "DUPONT",
  prenom: "Jean",
  email: "jean.dupont@aviss.fr",
  telephone: "06 XX XX XX XX",
  
  // Compétences
  lots_autorises: ["ssi", "baes", "pac", "clim"],
  certifications: [
    { nom: "Habilitation électrique", niveau: "BR", expiration: Timestamp },
    { nom: "Manipulation fluides frigorigènes", numero: "XXX", expiration: Timestamp }
  ],
  
  // Coûts (pour stats internes)
  cout_horaire: 35.00,
  
  // Couleur planning
  couleur: "#4CAF50",
  
  actif: true,
  
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

### 6. organizations/{orgId}/stt/{id}

Sous-traitants.

```javascript
{
  id: "stt_xxx",
  user_id: "user_xxx", // Lien vers users/ (pour connexion)
  
  // Identité société
  raison_sociale: "ELEC SERVICES",
  siret: "XXX XXX XXX XXXXX",
  
  // Contact
  contact_nom: "MARTIN",
  contact_prenom: "Paul",
  email: "contact@elec-services.fr",
  telephone: "01 XX XX XX XX",
  
  // Adresse
  adresse: "10 rue de l'Industrie",
  code_postal: "78000",
  ville: "VERSAILLES",
  
  // Lots autorisés
  lots_autorises: ["ssi", "baes"],
  
  // Budget
  budget_annuel: 15000.00,
  budget_consomme: 8500.00,
  
  // Coûts
  cout_horaire: 45.00,
  cout_deplacement: 50.00,
  
  // Couleur planning
  couleur: "#FF9800",
  
  actif: true,
  
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

### 7. organizations/{orgId}/materiel/{id}

Référentiel matériel (catalogue).

```javascript
{
  id: "mat_xxx",
  
  // Identification
  code_article: "77777263",
  reference: "PCF-13",
  designation: "Remise en jeu d'une porte coupe feu",
  description: "Réglages des contacts de positions et remise en jeu sous réserve du bon état du bloc porte",
  
  // Catégorisation
  categorie: "COMPARTIMENTAGE", // COMPARTIMENTAGE, PERIPHERIQUE, DESENFUMAGE, PAC, CLIM...
  lot: "incendie", // energie, chauffage, incendie, isolation
  sous_lot: "compartimentage",
  
  // Prix (5 colonnes)
  prix_revient: 180.00,
  prix_vente_install: 250.00,
  prix_vente_public: 300.00,
  
  // TVA
  taux_tva: 10,
  
  // Unité
  unite: "unité", // unité, mètre, kg, heure, forfait
  
  // Stock (optionnel)
  gestion_stock: false,
  stock_actuel: null,
  stock_minimum: null,
  
  // Temps (pour planning)
  temps_pose_minutes: 60,
  
  // Garantie
  duree_garantie_mois: 12,
  
  actif: true,
  
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

### 8. organizations/{orgId}/interventions/{id}

Interventions (SAV, Travaux, MES, etc.).

```javascript
{
  id: "int_xxx",
  
  // Numéro auto-généré
  numero: "SAV-RJA-251216-001",
  
  // Type
  type: "sav", // sav, travaux, mes, audit, visite, reception
  
  // Liens
  client_payeur_id: "cp_xxx",
  site_id: "site_xxx",
  devis_id: "dev_xxx" | null, // Si lié à un devis
  contrat_id: "ctr_xxx" | null, // Si lié à un contrat maintenance
  
  // Assignation
  assignation_type: "technicien", // technicien, stt
  technicien_id: "tech_xxx" | null,
  stt_id: "stt_xxx" | null,
  
  // Planification
  date_planifiee: Timestamp,
  heure_debut: "09:00",
  heure_fin: "12:00",
  duree_prevue_minutes: 180,
  
  // Exécution
  date_debut_reelle: Timestamp | null,
  date_fin_reelle: Timestamp | null,
  duree_reelle_minutes: null,
  
  // Lot
  lot: "incendie",
  sous_lot: "ssi",
  
  // Description
  objet: "Remise en état suite au rapport du 30/09/2024",
  description: "Vérification et remise en conformité SSI",
  
  // Matériel concerné (équipements du site)
  equipements_concernes: ["equip_xxx", "equip_yyy"],
  
  // Statut
  statut: "planifiee", // planifiee, en_cours, terminee, annulee, reportee
  
  // Rapport
  rapport_id: "rap_xxx" | null,
  rapport_genere: false,
  
  // Priorité
  priorite: "normale", // basse, normale, haute, urgente
  
  // Notes internes
  notes_internes: "Client demande intervention avant 10h",
  
  created_at: Timestamp,
  updated_at: Timestamp,
  created_by: "user_xxx"
}
```

---

### 9. organizations/{orgId}/rapports/{id}

Rapports d'intervention.

```javascript
{
  id: "rap_xxx",
  
  // Numéro auto-généré
  numero: "RAP-RJA-251216-001",
  
  // Lien intervention
  intervention_id: "int_xxx",
  
  // Infos héritées (pour affichage PDF)
  type_intervention: "sav",
  client_payeur: { id, nom, adresse... },
  site: { id, nom, adresse... },
  technicien: { id, nom, prenom } | null,
  stt: { id, raison_sociale } | null,
  
  // Dates
  date_intervention: Timestamp,
  heure_arrivee: "09:15",
  heure_depart: "11:45",
  duree_minutes: 150,
  
  // Contenu (structure modulable selon type)
  contenu: {
    // SAV
    probleme_signale: "Détecteur zone 3 en défaut",
    diagnostic: "Détecteur encrassé",
    actions_realisees: "Nettoyage détecteur, test fonctionnel OK",
    
    // Checklists (selon lot)
    checklist: [
      { item: "Test détecteurs", ok: true, observation: "" },
      { item: "Test centrale", ok: true, observation: "" },
      { item: "Test sirènes", ok: false, observation: "Sirène RDC faible" }
    ],
    
    // Mesures (selon lot)
    mesures: [
      { type: "Pression fluide", valeur: 4.2, unite: "bar", conforme: true },
      { type: "Température départ", valeur: 45, unite: "°C", conforme: true }
    ],
    
    // Observations
    observations: "RAS",
    recommandations: "Prévoir remplacement sirène RDC sous 3 mois"
  },
  
  // Matériel utilisé
  materiel_utilise: [
    { materiel_id: "mat_xxx", designation: "Détecteur XYZ", quantite: 1, prix_unitaire: 85.00 }
  ],
  
  // Photos
  photos: [
    { url: "https://storage.../photo1.jpg", legende: "Détecteur avant nettoyage" },
    { url: "https://storage.../photo2.jpg", legende: "Détecteur après nettoyage" }
  ],
  
  // Signatures
  signature_technicien: {
    url: "https://storage.../signature_tech.png",
    date: Timestamp,
    nom: "Jean DUPONT"
  },
  signature_client: {
    url: "https://storage.../signature_client.png",
    date: Timestamp,
    nom: "Pierre MARTIN"
  },
  
  // PDF généré
  pdf_url: "https://storage.../rapport_xxx.pdf",
  
  // Alertes déclenchées
  alertes_declenchees: ["alerte_xxx"],
  
  // Statut
  statut: "valide", // brouillon, signe, valide
  
  // Envoi client
  envoye_client: true,
  date_envoi_client: Timestamp,
  
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

### 10. organizations/{orgId}/devis/{id}

Devis.

```javascript
{
  id: "dev_xxx",
  
  // Numéro auto-généré
  numero: "DEV-RJA-251105-001",
  
  // Liens
  client_payeur_id: "cp_xxx",
  site_id: "site_xxx" | null,
  intervention_id: "int_xxx" | null,
  rapport_id: "rap_xxx" | null,
  
  // Objet
  objet: "Remise en état suite au rapport du 30/09/2024",
  
  // Interlocuteur
  interlocuteur: {
    nom: "Valéry FEVRY",
    telephone: "0679435913",
    email: "valery-fevry@aviss-securite.fr"
  },
  
  // Lignes
  lignes: [
    {
      id: "ligne_1",
      categorie: "MATERIEL COMPARTIMENTAGE",
      code_article: "77777263",
      reference: "PCF-13",
      designation: "Remise en jeu d'une porte coupe feu",
      description: "Réglages des contacts de positions...\n- DAS COMMUN PCF RDCB\n- DAS COMMUN PCF 2ÈME",
      quantite: 2,
      prix_unitaire: 250.00,
      taux_tva: 10,
      remise_ligne: 0,
      total_ht: 500.00,
      est_option: false
    },
    {
      id: "ligne_2",
      categorie: "MATERIEL PERIPHERIQUE",
      code_article: "50100302",
      reference: "VEM 48/50-R-I",
      designation: "Ventouse murale 48V 50DaN à rupture + inter + CPA",
      description: "- PCF RDCH côté ascenseur B",
      quantite: 1,
      prix_unitaire: 53.00,
      taux_tva: 10,
      remise_ligne: 0,
      total_ht: 53.00,
      est_option: false
    },
    // ... autres lignes
  ],
  
  // Totaux
  total_ht: 3503.00,
  total_remise: 0.00,
  total_ht_apres_remise: 3503.00,
  
  // TVA (multi-taux)
  tva_details: [
    { taux: 10, base: 3503.00, montant: 350.30 }
  ],
  total_tva: 350.30,
  
  total_ttc: 3853.30,
  
  // Options
  total_ht_avec_options: 3503.00,
  
  // Remise globale
  remise_globale_type: "pourcentage", // pourcentage, montant
  remise_globale_valeur: 0,
  
  // Acompte
  acompte_type: "pourcentage", // pourcentage, montant
  acompte_valeur: 30,
  acompte_montant: 1155.99,
  
  // Conditions
  validite_jours: 30,
  date_expiration: Timestamp,
  conditions_paiement: "45 jours nets",
  
  // Statut
  statut: "envoye", // brouillon, envoye, en_attente, accepte, refuse, sans_suite, expire
  
  // Signature client (en ligne)
  signature_client: {
    url: "https://storage.../signature.png",
    date: Timestamp,
    nom: "Jean DUPONT",
    ip: "192.168.1.1"
  } | null,
  
  // Dates suivi
  date_envoi: Timestamp | null,
  date_relance_1: Timestamp | null,
  date_relance_2: Timestamp | null,
  date_reponse: Timestamp | null,
  
  // Lien facture si accepté
  facture_id: "fac_xxx" | null,
  
  // PDF
  pdf_url: "https://storage.../devis_xxx.pdf",
  
  created_at: Timestamp,
  updated_at: Timestamp,
  created_by: "user_xxx"
}
```

---

### 11. organizations/{orgId}/factures/{id}

Factures.

```javascript
{
  id: "fac_xxx",
  
  // Numéro auto-généré
  numero: "FAC-RJA-251210-001",
  
  // Liens
  client_payeur_id: "cp_xxx",
  devis_id: "dev_xxx" | null,
  
  // Lignes (copiées du devis ou créées)
  lignes: [ /* même structure que devis */ ],
  
  // Totaux
  total_ht: 3503.00,
  total_tva: 350.30,
  total_ttc: 3853.30,
  
  // Acompte déjà versé
  acompte_verse: 1155.99,
  reste_a_payer: 2697.31,
  
  // Dates
  date_emission: Timestamp,
  date_echeance: Timestamp, // date_emission + conditions_paiement
  conditions_paiement: 45,
  
  // Paiement
  statut_paiement: "partiel", // non_paye, partiel, paye
  paiements: [
    { date: Timestamp, montant: 1155.99, mode: "virement", reference: "VIR-XXX" }
  ],
  montant_paye: 1155.99,
  
  // Relances
  relances: [
    { date: Timestamp, niveau: 1, mode: "email" },
    { date: Timestamp, niveau: 2, mode: "email" }
  ],
  
  // Statut
  statut: "emise", // brouillon, emise, payee, annulee
  
  // PDF
  pdf_url: "https://storage.../facture_xxx.pdf",
  
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

### 12. organizations/{orgId}/contrats/{id}

Contrats de maintenance.

```javascript
{
  id: "ctr_xxx",
  
  // Numéro
  numero: "CTR-RJA-2025-001",
  
  // Client
  client_payeur_id: "cp_xxx",
  
  // Sites couverts
  sites: ["site_xxx", "site_yyy"],
  
  // Lots couverts
  lots: ["ssi", "baes", "desenfumage"],
  
  // Périodicité
  periodicite: "annuel", // mensuel, trimestriel, semestriel, annuel
  nb_visites_an: 1,
  
  // Dates
  date_debut: Timestamp,
  date_fin: Timestamp,
  renouvellement_auto: true,
  
  // Tarif
  montant_annuel_ht: 2500.00,
  taux_tva: 10,
  montant_annuel_ttc: 2750.00,
  
  // Prochaine échéance
  prochaine_visite: Timestamp,
  
  // Interventions générées
  interventions_generees: ["int_xxx", "int_yyy"],
  
  // Statut
  statut: "actif", // actif, expire, resilie, en_renouvellement
  
  // Alertes
  alerte_expiration_jours: 60, // Alerte X jours avant expiration
  
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

### 13. organizations/{orgId}/alertes/{id}

Alertes.

```javascript
{
  id: "alerte_xxx",
  
  // Type et niveau
  type: "rapport", // rapport, devis, facture, contrat, maintenance
  niveau: "critique", // critique, important, a_planifier
  
  // Source
  source_type: "rapport",
  source_id: "rap_xxx",
  
  // Déclencheur
  declencheur: {
    champ: "checklist.test_sirenes",
    condition: "ok == false",
    valeur: false
  },
  
  // Cible
  client_payeur_id: "cp_xxx",
  site_id: "site_xxx",
  lot: "incendie",
  
  // Message
  titre: "Sirène RDC défaillante",
  message: "Test sirène RDC non conforme - Intervention requise",
  action_suggeree: "Planifier intervention corrective",
  
  // Statut
  statut: "active", // active, traitee, ignoree
  
  // Traitement
  traitement: {
    date: Timestamp | null,
    user_id: "user_xxx" | null,
    action: "Intervention planifiée" | null,
    intervention_id: "int_xxx" | null
  },
  
  // Notifications envoyées
  notifications: [
    { destinataire: "bureau", date: Timestamp, canal: "dashboard" },
    { destinataire: "client", date: Timestamp, canal: "email" }
  ],
  
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

### 14. organizations/{orgId}/counters/{type}

Compteurs pour numérotation automatique.

```javascript
// Document: counters/sav
{
  // Compteur par jour et par client
  // Clé: "clientCode_AAMMJJ"
  "RJA_251216": 3, // 3 SAV créés pour client RJA le 16/12/2025
  "DUP_251216": 1,
  "RJA_251217": 0
}

// Document: counters/devis
{
  "RJA_251216": 2,
  "DUP_251216": 1
}

// Idem pour: counters/factures, counters/rapports, counters/travaux, etc.
```

---

### 15. organizations/{orgId}/audit_log/{id}

Historique des modifications (non modifiable).

```javascript
{
  id: "log_xxx",
  
  timestamp: Timestamp,
  
  // Utilisateur
  user_id: "user_xxx",
  user_email: "technicien@aviss.fr",
  user_role: "technicien",
  
  // Action
  action: "update", // create, update, delete
  
  // Cible
  collection: "interventions",
  document_id: "int_xxx",
  
  // Données
  before: { /* état avant */ } | null,
  after: { /* état après */ },
  
  // Champs modifiés (si update)
  champs_modifies: ["statut", "date_fin_reelle"],
  
  // Contexte
  ip_address: "192.168.1.1",
  user_agent: "Mozilla/5.0...",
  
  // Non modifiable
  created_at: Timestamp
}
```

---

### 16. organizations/{orgId}/materiel_installe/{id}

Matériel installé sur les sites.

```javascript
{
  id: "equip_xxx",
  
  // Liens
  site_id: "site_xxx",
  materiel_id: "mat_xxx" | null, // Lien vers référentiel si existe
  
  // Identification
  designation: "Détecteur optique de fumée",
  marque: "SIEMENS",
  modele: "OP720",
  numero_serie: "SN-123456789",
  
  // Localisation sur site
  zone: "RDC",
  emplacement: "Hall d'entrée",
  repere: "D01",
  
  // Lot
  lot: "incendie",
  sous_lot: "ssi",
  
  // Dates
  date_installation: Timestamp,
  date_mise_en_service: Timestamp,
  
  // Garantie
  garantie_fin: Timestamp,
  garantie_active: true,
  
  // Maintenance
  derniere_maintenance: Timestamp | null,
  prochaine_maintenance: Timestamp | null,
  periodicite_maintenance_mois: 12,
  
  // Historique (résumé)
  nb_interventions: 5,
  derniere_intervention: Timestamp,
  
  // Observations
  observations: "RAS",
  
  // Statut
  statut: "actif", // actif, hs, remplace, depose
  
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

## Règles de sécurité Firestore

Voir fichier `firestore.rules` pour les règles complètes d'isolation multi-tenant.

---

## Index Firestore

```
// Index composites à créer

// Interventions par organisation, date
organizations/{orgId}/interventions
  - date_planifiee ASC
  - statut ASC

// Interventions par technicien
organizations/{orgId}/interventions
  - technicien_id ASC
  - date_planifiee ASC

// Devis par client et statut
organizations/{orgId}/devis
  - client_payeur_id ASC
  - statut ASC
  - created_at DESC

// Alertes actives
organizations/{orgId}/alertes
  - statut ASC
  - niveau ASC
  - created_at DESC

// Audit log
organizations/{orgId}/audit_log
  - collection ASC
  - document_id ASC
  - timestamp DESC
```
