

# Tableau de bord utilisateur avec KPIs et activite recente

## Objectif

Transformer la page `/dashboard` pour offrir un veritable tableau de bord personnel avec des widgets KPI exploitant les donnees Supabase et un fil d'activite recente en temps reel.

---

## Architecture

Le dashboard existant (`NetworkDashboard`) est oriente "vue reseau". Nous allons le remplacer par un dashboard hybride qui combine :
- Un hero d'accueil personnalise (existant : `DashboardHero`)
- Une rangee de KPI cards connectees a Supabase
- Un fil d'activite recente (soumissions, documents, evenements)
- Des raccourcis vers les espaces de travail

---

## Fichiers modifies

### 1. `src/hooks/useUserDashboardKPIs.ts` (nouveau)

Hook dedie qui recupere les KPIs personnels de l'utilisateur connecte :

- **Mes projets** : nombre de projets dans les agences dont l'utilisateur est membre
- **Documents** : nombre total de documents
- **Evenements a venir** : evenements futurs
- **Soumissions** : nombre de soumissions de l'utilisateur
- **Activite recente** : 8 dernieres activites (soumissions + documents) avec titre, date, type

Chaque KPI inclut un indicateur de tendance (comparaison periode precedente).

### 2. `src/components/dashboard/widgets/UserKPICards.tsx` (nouveau)

Composant qui affiche 4 cartes KPI en grille responsive :
- Design glassmorphism coherent avec le theme Nexus (fond sombre, bordures blanches/10)
- Icones colorees, valeurs en grand, tendance en badge
- Animation d'entree avec framer-motion
- Etats de chargement (skeleton)

### 3. `src/components/dashboard/widgets/UserRecentActivity.tsx` (nouveau)

Fil d'activite recente affichant les 8 dernieres actions :
- Timeline verticale avec points colores par type (soumission, document, evenement)
- Nom de l'auteur, date relative, description
- Bouton "Voir tout" renvoyant vers `/activity`
- Design coherent avec `NetworkActivityWidget` existant

### 4. `src/components/dashboard/NetworkDashboard.tsx` (modifie)

Integration des nouveaux widgets dans le layout existant :
- Ajout de `UserKPICards` entre le hero et la synthese reseau
- Remplacement du widget `NetworkActivityWidget` par `UserRecentActivity` dans la grille
- Conservation de la carte et des projets inspirants

### 5. `src/pages/Dashboard.tsx` (inchange)

Continue a rendre `NetworkDashboard` -- pas de modification necessaire.

---

## Donnees Supabase utilisees

Toutes les tables existent deja, aucune migration requise :

| Table | Donnee |
|---|---|
| `agency_projects` | Nombre de projets |
| `documents` | Nombre de documents |
| `events` | Evenements a venir |
| `submissions` | Soumissions utilisateur + activite recente |
| `profiles` | Nom de l'auteur des activites |

---

## Design

- Theme Nexus existant : fond `nx-night`, cartes `bg-white/5`, bordures `border-white/10`
- Couleurs KPI : bleu electrique (projets), or (documents), emeraude (evenements), violet (soumissions)
- Responsive : 1 colonne mobile, 2 colonnes tablette, 4 colonnes desktop
- Animations framer-motion avec delais progressifs

---

## Resume

| Action | Fichier |
|---|---|
| Creer | `src/hooks/useUserDashboardKPIs.ts` |
| Creer | `src/components/dashboard/widgets/UserKPICards.tsx` |
| Creer | `src/components/dashboard/widgets/UserRecentActivity.tsx` |
| Modifier | `src/components/dashboard/NetworkDashboard.tsx` |

Total : 3 fichiers crees, 1 fichier modifie, 0 migration SQL, 0 dependance ajoutee.
