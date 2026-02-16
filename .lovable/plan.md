
# Document de Presentation - Cahier des Charges et Perimetre Fonctionnel

## Objectif
Creer un document Markdown complet dans `docs/CAHIER_DES_CHARGES.md` qui servira de reference officielle pour toute personne souhaitant comprendre le systeme SUTEL Nexus : son contexte, ses objectifs, son perimetre fonctionnel detaille et son architecture technique.

---

## Structure du document

Le document couvrira les sections suivantes :

### 1. Page de garde
- Titre du projet : **Plateforme SUTEL Nexus**
- Commanditaire : Union Africaine des Telecommunications (UAT)
- Partenaire technique : ANSUT
- Version et date

### 2. Contexte et justification
- La fracture numerique en Afrique
- Le role de l'UAT dans la coordination (pas la presidence)
- La presidence tournante par un Etat membre
- Le besoin d'harmonisation des indicateurs SUT

### 3. Objectifs du projet
- Objectif general : reduire la fracture numerique via des donnees fiables
- Objectifs specifiques : collecte, harmonisation, analyse, outillage methodologique

### 4. Acteurs et gouvernance
- Etat Membre President (presidence tournante)
- UAT (coordination technique, secretariat)
- Points Focaux (2 par pays, saisie des indicateurs)
- Consultants, ANSUT

### 5. Perimetre fonctionnel detaille
Organisation par univers UX existants :

**A. Reseau et Pilotage**
- Vue Reseau (/network) - coordination collective
- Pays membres (/members) - annuaire des 54 pays
- Carte interactive (/map) - visualisation Leaflet
- Activite recente (/activity) - timeline
- Indicateurs (/indicators) - 20+ indicateurs harmonises ITU
- Mon Pays (/my-country) - vue privee FSU
- Tableau de bord public (/public-dashboard)

**B. Collaboration et Communaute**
- Projets inspirants (/projects) - partage d'initiatives
- Bonnes pratiques (/practices)
- Forum de discussions (/forum)
- Proposer un projet (/submit)
- Communautes linguistiques (/community) - 4 communautes
- Evenements (/events) - agenda collaboratif

**C. Capacites et Intelligence**
- E-Learning (/elearning) - formations en ligne
- Webinaires (/webinars)
- Veille strategique (/watch)
- Co-redaction (/coauthoring) - edition collaborative
- Assistant IA SUTA (/assistant)

**D. Boite a Outils FSU** (nouveaux modules)
- Calculateur de couts FSU (/tools/fsu-calculator)
- Auto-evaluation FSU (/tools/fsu-assessment)
- Simulateur de taux de contribution (/tools/fsu-simulator)
- Generateur de rapports FSU (/tools/fsu-reports)

**E. Administration**
- Gestion des utilisateurs
- Moderation du forum
- Gestion des ressources
- Tableau de pilotage admin
- Gestion des points focaux
- Configuration plateforme
- Export des traductions

### 6. Systeme de roles et permissions
Les 6 roles : SUPER_ADMIN, ADMIN_PAYS, EDITEUR, CONTRIBUTEUR, POINT_FOCAL, LECTEUR avec matrice d'acces

### 7. Architecture technique
- Frontend : React 18 + TypeScript + Tailwind CSS + Vite
- Backend : Supabase (PostgreSQL, Auth, Realtime, Edge Functions, Storage)
- Securite : RLS (Row Level Security), audit trail
- i18n : Francais, Anglais (i18next)
- Cartographie : Leaflet
- Graphiques : Recharts
- Export : jsPDF, html2canvas, xlsx

### 8. Exigences non-fonctionnelles
- Performance, accessibilite, multilinguisme
- Securite (RGPD, chiffrement)
- Disponibilite, scalabilite

### 9. Livrables
- Plateforme web responsive
- Documentation technique et utilisateur
- Modules de formation e-learning

---

## Details techniques

- **Fichier cree** : `docs/CAHIER_DES_CHARGES.md`
- **Format** : Markdown structure avec tableaux, listes, et diagrammes texte
- **Langue** : Francais
- **Taille estimee** : ~400-500 lignes

Le document sera base sur l'analyse reelle du code source (routes, composants, configuration de navigation, roles) et non sur des hypotheses.
