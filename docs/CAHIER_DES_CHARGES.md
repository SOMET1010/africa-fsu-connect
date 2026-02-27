# CAHIER DES CHARGES ET PÉRIMÈTRE FONCTIONNEL

## Plateforme SUTEL Nexus

---

|                          |                                                                      |
| ------------------------ | -------------------------------------------------------------------- |
| **Projet**               | Plateforme SUTEL Nexus                                               |
| **Commanditaire**        | Union Africaine des Télécommunications (UAT)                         |
| **Partenaire technique** | ANSUT (Agence Nationale du Service Universel des Télécommunications) |
| **Version**              | 2.0                                                                  |
| **Date**                 | Février 2026                                                         |
| **Statut**               | En cours de développement                                            |

---

## Table des matières

1. [Contexte et justification](#1-contexte-et-justification)
2. [Objectifs du projet](#2-objectifs-du-projet)
3. [Acteurs et gouvernance](#3-acteurs-et-gouvernance)
4. [Périmètre fonctionnel détaillé](#4-périmètre-fonctionnel-détaillé)
5. [Système de rôles et permissions](#5-système-de-rôles-et-permissions)
6. [Architecture technique](#6-architecture-technique)
7. [Exigences non-fonctionnelles](#7-exigences-non-fonctionnelles)
8. [Livrables](#8-livrables)

---

## 1. Contexte et justification

### 1.1 La fracture numérique en Afrique

L'Afrique fait face à des disparités significatives en matière d'accès aux services de télécommunications. Les Fonds de Service Universel (FSU), mis en place dans de nombreux pays africains, constituent le principal levier pour réduire cette fracture numérique. Cependant, l'absence d'outils harmonisés de collecte, de suivi et d'analyse rend difficile la coordination régionale et l'évaluation comparée des progrès.

### 1.2 Rôle des acteurs institutionnels

- **L'UAT** (Union Africaine des Télécommunications) assure la **coordination technique** et le **secrétariat** du réseau SUTEL. Elle ne préside pas le réseau.
- **La présidence est tournante**, assurée par un **État membre** élu par ses pairs pour un mandat défini.
- **L'ANSUT** (Côte d'Ivoire) intervient comme partenaire technique dans le développement et le déploiement de la plateforme.

### 1.3 Besoin identifié

Il n'existe pas à ce jour de plateforme unifiée permettant aux 54 pays africains de :

- Collecter et harmoniser leurs indicateurs SUT selon les standards ITU/UIT
- Partager leurs bonnes pratiques et projets inspirants
- Disposer d'outils méthodologiques adaptés (calculateurs, simulateurs, auto-évaluation)
- Collaborer efficacement malgré la diversité linguistique (4 communautés linguistiques)

La plateforme **SUTEL Nexus** répond à ce besoin.

---

## 2. Objectifs du projet

### 2.1 Objectif général

Réduire la fracture numérique en Afrique en dotant les Fonds de Service Universel d'une plateforme collaborative de collecte, d'harmonisation et d'analyse des données, accompagnée d'outils méthodologiques.

### 2.2 Objectifs spécifiques

| #   | Objectif                                            | Indicateur de succès                                                        |
| --- | --------------------------------------------------- | --------------------------------------------------------------------------- |
| 1   | Collecter les indicateurs SUT de manière structurée | 20+ indicateurs harmonisés ITU/UIT par pays                                 |
| 2   | Harmoniser les méthodologies de mesure              | Référentiel commun adopté par les États                                     |
| 3   | Analyser et comparer les performances régionales    | Tableaux de bord interactifs et exports                                     |
| 4   | Outiller méthodologiquement les FSU                 | 4 outils opérationnels (calculateur, simulateur, auto-évaluation, rapports) |
| 5   | Faciliter le partage de connaissances               | Forum, bonnes pratiques, e-learning                                         |
| 6   | Renforcer les capacités des points focaux           | Parcours de formation intégrés                                              |

---

## 3. Acteurs et gouvernance

### 3.1 Organigramme fonctionnel

```
┌─────────────────────────────────────┐
│   État Membre Président (tournant)  │
│   Présidence du réseau SUTEL        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   UAT - Coordination technique      │
│   Secrétariat du réseau             │
└──────────────┬──────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌───▼───┐ ┌───▼────┐
│ ANSUT │ │Points │ │Consul- │
│(tech) │ │Focaux │ │tants   │
└───────┘ └───────┘ └────────┘
```

### 3.2 Rôles des acteurs

| Acteur                    | Rôle                         | Responsabilités                                            |
| ------------------------- | ---------------------------- | ---------------------------------------------------------- |
| **État Membre Président** | Présidence tournante         | Orientation stratégique, représentation du réseau          |
| **UAT**                   | Coordination technique       | Secrétariat, animation du réseau, coordination des travaux |
| **ANSUT**                 | Partenaire technique         | Développement et maintenance de la plateforme              |
| **Points Focaux**         | Référents nationaux (2/pays) | Saisie des indicateurs, validation des données nationales  |
| **Consultants**           | Appui ponctuel               | Études, formations, accompagnement méthodologique          |

---

## 4. Périmètre fonctionnel détaillé

Le périmètre est organisé en **5 univers fonctionnels** correspondant aux grandes familles de besoins.

### 4.A — Réseau et Pilotage

Cet univers constitue le cœur de la plateforme : le suivi des indicateurs et la coordination du réseau.

| Module                     | Route               | Description                                                                                                        | Accès       |
| -------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------- |
| **Vue Réseau**             | `/network`          | Page d'accueil du réseau. Coordination collective, synthèse des activités, statistiques clés                       | Public      |
| **Pays membres**           | `/members`          | Annuaire des 54 pays du réseau avec fiches détaillées                                                              | Public      |
| **Fiche Pays**             | `/country/:code`    | Profil complet d'un pays : indicateurs, projets, points focaux                                                     | Public      |
| **Carte interactive**      | `/map`              | Visualisation géographique des données (Leaflet). Couches thématiques par indicateur                               | Authentifié |
| **Activité récente**       | `/activity`         | Timeline des activités du réseau : nouvelles données, projets, événements                                          | Public      |
| **Indicateurs**            | `/indicators`       | Tableau de bord des 20+ indicateurs harmonisés ITU/UIT. Graphiques comparatifs, tendances, filtres par pays/région | Authentifié |
| **Mon Pays**               | `/my-country`       | Vue privée du Fonds de Service Universel de l'utilisateur connecté                                                 | Authentifié |
| **Tableau de bord public** | `/public-dashboard` | Indicateurs agrégés et progrès régional, accessible sans authentification                                          | Public      |
| **Dashboard Point Focal**  | `/focal-dashboard`  | Tableau de bord dédié aux points focaux pour le suivi de leur pays                                                 | Point Focal |

#### Indicateurs harmonisés

Les indicateurs collectés suivent les recommandations ITU/UIT et couvrent :

- **Connectivité** : taux de pénétration mobile, fixe, internet
- **Couverture** : couverture réseau 2G/3G/4G/5G, fibre optique
- **Accessibilité** : coût des services rapporté au revenu
- **Usage** : abonnements data, trafic, services numériques
- **Gouvernance FSU** : budget, taux de décaissement, projets financés
- **Impact** : bénéficiaires, zones couvertes, emplois créés

### 4.B — Collaboration et Communauté

Modules de partage et d'échange entre les membres du réseau.

| Module                        | Route               | Description                                                                                      | Accès       |
| ----------------------------- | ------------------- | ------------------------------------------------------------------------------------------------ | ----------- |
| **Ressources**                | `/resources`        | Bibliothèque documentaire partagée : rapports, études, guides méthodologiques                    | Authentifié |
| **Bonnes pratiques**          | `/practices`        | Partage d'expériences réussies entre pays. Fiches structurées avec contexte, résultats et leçons | Authentifié |
| **Forum**                     | `/forum`            | Discussions thématiques entre membres du réseau. Modération intégrée                             | Authentifié |
| **Proposer**                  | `/submit`           | Formulaire de soumission de projets, bonnes pratiques ou ressources                              | Authentifié |
| **Mes contributions**         | `/my-contributions` | Suivi personnel des soumissions et de leur statut                                                | Authentifié |
| **Projets**                   | `/projects`         | Catalogue des Projets inspirants. Filtrage par pays, thématique, budget                          | Authentifié |
| **Organisations**             | `/organizations`    | Annuaire des agences et organismes impliqués                                                     | Authentifié |
| **Communautés linguistiques** | `/community`        | Les 4 communautés du réseau SUTEL : francophone, anglophone, lusophone, arabophone               | Public      |
| **Événements**                | `/events`           | Agenda collaboratif : conférences, ateliers, réunions du réseau                                  | Authentifié |

### 4.C — Capacités et Intelligence

Modules de renforcement des capacités et d'intelligence stratégique.

| Module                 | Route           | Description                                                                                      | Accès       |
| ---------------------- | --------------- | ------------------------------------------------------------------------------------------------ | ----------- |
| **E-Learning**         | `/elearning`    | Plateforme de formation en ligne. Parcours métiers, modules thématiques, certifications          | Authentifié |
| **Webinaires**         | `/webinars`     | Sessions en direct et replays. Inscription, rappels, ressources associées                        | Authentifié |
| **Veille stratégique** | `/watch`        | Actualités sectorielles, opportunités de financement, tendances technologiques                   | Authentifié |
| **Co-rédaction**       | `/coauthoring`  | Édition collaborative de documents. Versioning, commentaires, validation                         | Authentifié |
| **Assistant IA SUTA**  | `/assistant`    | Assistant conversationnel multilingue. Aide à la navigation, recherche intelligente, suggestions | Authentifié |
| **Note conceptuelle**  | `/concept-note` | Outil de rédaction structurée de notes conceptuelles pour Projets                                | Authentifié |

### 4.D — Boîte à Outils FSU

Outils méthodologiques spécifiques aux Fonds de Service Universel.

| Outil                                  | Route                   | Description                                                                            |
| -------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------- |
| **Calculateur de coûts FSU**           | `/tools/fsu-calculator` | Estimation des coûts de déploiement d'infrastructures télécoms en zones non desservies |
| **Auto-évaluation FSU**                | `/tools/fsu-assessment` | Diagnostic de maturité d'un Fonds de Service Universel selon une grille multi-critères |
| **Simulateur de taux de contribution** | `/tools/fsu-simulator`  | Modélisation de l'impact de différents taux de contribution sur les revenus du fonds   |
| **Générateur de rapports FSU**         | `/tools/fsu-reports`    | Génération automatisée de rapports d'activité normalisés                               |

### 4.E — Administration

Modules réservés aux administrateurs de la plateforme.

| Module                       | Route                    | Description                                                  | Rôles requis                     |
| ---------------------------- | ------------------------ | ------------------------------------------------------------ | -------------------------------- |
| **Administration générale**  | `/admin`                 | Panneau principal d'administration                           | Super Admin, Admin Pays, Éditeur |
| **Gestion des utilisateurs** | `/admin/users`           | Création, modification, désactivation des comptes            | Super Admin, Admin Pays, Éditeur |
| **Modération du forum**      | `/admin/forum`           | Modération des discussions, gestion des signalements         | Super Admin, Admin Pays, Éditeur |
| **Gestion des ressources**   | `/admin/resources`       | Administration de la bibliothèque documentaire, analytics    | Super Admin, Admin Pays, Éditeur |
| **Tableau de pilotage**      | `/admin/dashboard`       | KPIs de la plateforme, métriques d'utilisation               | Super Admin, Admin Pays          |
| **Points focaux**            | `/admin/focal-points`    | Gestion des points focaux des États membres, invitations     | Super Admin, Admin Pays          |
| **Configuration plateforme** | `/admin/platform-config` | Paramétrage initial et configuration générale de SUTEL Nexus | Super Admin                      |
| **Export traductions**       | `/admin/translations`    | Gestion et export de toutes les traductions (FR/EN)          | Super Admin, Admin Pays          |

---

## 5. Système de rôles et permissions

### 5.1 Les 6 rôles

| Rôle                     | Code            | Description                                                                        |
| ------------------------ | --------------- | ---------------------------------------------------------------------------------- |
| **Super Administrateur** | `super_admin`   | Accès total à la plateforme. Gestion globale du système                            |
| **Administrateur Pays**  | `country_admin` | Administration au niveau national. Gestion des utilisateurs et données de son pays |
| **Éditeur**              | `editor`        | Création et modification de contenus (ressources, projets, événements)             |
| **Contributeur**         | `contributor`   | Soumission de contenus soumis à validation                                         |
| **Point Focal**          | `focal_point`   | Saisie et validation des indicateurs nationaux. Rôle clé de la collecte            |
| **Lecteur**              | `reader`        | Consultation des données publiques et des ressources partagées                     |

### 5.2 Matrice d'accès

| Fonctionnalité           | Super Admin | Admin Pays | Éditeur  | Contributeur | Point Focal | Lecteur |
| ------------------------ | :---------: | :--------: | :------: | :----------: | :---------: | :-----: |
| Vue Réseau               |     ✅      |     ✅     |    ✅    |      ✅      |     ✅      |   ✅    |
| Indicateurs (lecture)    |     ✅      |     ✅     |    ✅    |      ✅      |     ✅      |   ✅    |
| Indicateurs (saisie)     |     ✅      |     ✅     |    —     |      —       |     ✅      |    —    |
| Mon Pays                 |     ✅      |     ✅     |    —     |      —       |     ✅      |    —    |
| Ressources (lecture)     |     ✅      |     ✅     |    ✅    |      ✅      |     ✅      |   ✅    |
| Ressources (ajout)       |     ✅      |     ✅     |    ✅    |     ✅\*     |      —      |    —    |
| Forum (participation)    |     ✅      |     ✅     |    ✅    |      ✅      |     ✅      |    —    |
| Forum (modération)       |     ✅      |     ✅     |    ✅    |      —       |      —      |    —    |
| Projets (soumission)     |     ✅      |     ✅     |    ✅    |      ✅      |     ✅      |    —    |
| E-Learning               |     ✅      |     ✅     |    ✅    |      ✅      |     ✅      |   ✅    |
| Outils FSU               |     ✅      |     ✅     |    ✅    |      ✅      |     ✅      |    —    |
| Administration           |     ✅      |   ✅\*\*   | ✅\*\*\* |      —       |      —      |    —    |
| Configuration plateforme |     ✅      |     —      |    —     |      —       |      —      |    —    |

_\* Soumis à validation par un éditeur ou admin_
_\*\* Limité à son pays_
_\*\*\* Limité à la gestion de contenus_

---

## 6. Architecture technique

### 6.1 Stack technologique

```
┌─────────────────────────────────────────────┐
│                 FRONTEND                     │
│  React 18 + TypeScript + Tailwind CSS + Vite│
│  Routage : React Router v6                   │
│  État : TanStack Query + Zustand             │
│  UI : shadcn/ui + Radix UI + Framer Motion   │
│  i18n : i18next (FR/EN)                      │
│  Graphiques : Recharts                       │
│  Cartographie : Leaflet                      │
│  Export : jsPDF + html2canvas + xlsx          │
└──────────────────┬──────────────────────────┘
                   │ HTTPS / REST / Realtime
┌──────────────────▼──────────────────────────┐
│                 BACKEND                      │
│            Supabase (BaaS)                   │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │PostgreSQL│  │   Auth   │  │ Realtime │  │
│  │  + RLS   │  │  (JWT)   │  │(WebSocket)│  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                              │
│  ┌──────────┐  ┌──────────┐                 │
│  │  Edge    │  │ Storage  │                 │
│  │Functions │  │ (S3)     │                 │
│  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────┘
```

### 6.2 Sécurité

| Couche                    | Mécanisme                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------ |
| **Authentification**      | Supabase Auth (email/password, JWT)                                                  |
| **Autorisation**          | Row Level Security (RLS) sur toutes les tables                                       |
| **Rôles**                 | Table dédiée `user_roles` (séparée des profils pour éviter l'escalade de privilèges) |
| **Audit**                 | Table `audit_logs` avec traçabilité complète des actions                             |
| **Chiffrement**           | HTTPS en transit, chiffrement au repos (PostgreSQL)                                  |
| **Détection d'anomalies** | Monitoring des connexions, alertes automatiques                                      |

### 6.3 Base de données

Tables principales :

| Table              | Description                                                                             |
| ------------------ | --------------------------------------------------------------------------------------- |
| `profiles`         | Profils utilisateurs (nom, pays, langue, avatar)                                        |
| `user_roles`       | Rôles des utilisateurs (séparé pour sécurité)                                           |
| `countries`        | Référentiel des 54 pays (code, nom FR/EN, région, communauté linguistique, coordonnées) |
| `agencies`         | Agences et organismes FSU                                                               |
| `agency_projects`  | Projets des agences                                                                     |
| `documents`        | Bibliothèque documentaire                                                               |
| `events`           | Événements et calendrier                                                                |
| `focal_points`     | Points focaux des États membres                                                         |
| `focal_messages`   | Messagerie entre points focaux                                                          |
| `analytics_events` | Suivi d'utilisation de la plateforme                                                    |
| `audit_logs`       | Journal d'audit                                                                         |
| `data_sources`     | Sources de données externes (ITU, Banque Mondiale, etc.)                                |

### 6.4 Internationalisation

- **Langues supportées** : Français (par défaut), Anglais
- **Framework** : i18next + react-i18next
- **Couverture** : Interface complète, messages d'erreur, contenus statiques
- **Export** : Outil d'export des traductions pour traducteurs externes (`/admin/translations`)

---

## 7. Exigences non-fonctionnelles

### 7.1 Performance

| Critère                     | Cible                      |
| --------------------------- | -------------------------- |
| Temps de chargement initial | < 3 secondes               |
| Temps de réponse API        | < 500 ms                   |
| Code splitting              | Lazy loading par route     |
| Optimisation bundle         | Tree shaking, minification |

### 7.2 Accessibilité

- Conformité WCAG 2.1 niveau AA
- Navigation clavier complète
- Composants accessibles (Radix UI)
- Contrastes conformes

### 7.3 Compatibilité

- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Responsive design (mobile, tablette, desktop)
- Progressive Web App (PWA) envisagée

### 7.4 Sécurité

- Chiffrement HTTPS obligatoire
- Tokens JWT avec expiration
- Protection CSRF
- Row Level Security sur toutes les tables
- Séparation des rôles dans une table dédiée
- Audit trail complet

### 7.5 Scalabilité

- Architecture serverless (Edge Functions)
- Base de données PostgreSQL managée
- CDN pour les assets statiques
- Pas de limite théorique sur le nombre d'utilisateurs

---

## 8. Livrables

| #   | Livrable                  | Format                                  | Statut   |
| --- | ------------------------- | --------------------------------------- | -------- |
| 1   | Plateforme web responsive | Application React déployée              | En cours |
| 2   | Documentation technique   | Markdown (ce document)                  | ✅       |
| 3   | Guide de découverte       | Markdown (`docs/GUIDE_DECOUVERTE.md`)   | ✅       |
| 4   | Modules e-learning        | Intégrés à la plateforme (`/elearning`) | En cours |
| 5   | API documentée            | Supabase auto-générée                   | ✅       |
| 6   | Exports de données        | PDF, Excel, CSV                         | En cours |

---

## Annexe : Couverture géographique

Le réseau SUTEL couvre les **54 pays** du continent africain, organisés en **4 communautés linguistiques** :

- 🇫🇷 **Francophone** : Afrique de l'Ouest et Centrale francophone
- 🇬🇧 **Anglophone** : Afrique de l'Est et Australe anglophone
- 🇵🇹 **Lusophone** : Angola, Mozambique, Cap-Vert, Guinée-Bissau, São Tomé
- 🇸🇦 **Arabophone** : Afrique du Nord et Corne de l'Afrique

---

_Document généré à partir de l'analyse du code source de la plateforme SUTEL Nexus — Février 2026_
