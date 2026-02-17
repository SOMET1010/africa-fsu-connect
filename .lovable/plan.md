

# Tableau de bord Collaboration Transfrontaliere

## Objectif
Creer une page dediee aux projets inter-agences impliquant plusieurs pays, avec des vues filtrees par pays, theme et region. Cette page met en avant la dimension collaborative du reseau SUTEL.

## Ce qui sera cree

### 1. Page `src/pages/CrossBorderCollaboration.tsx`

Page principale avec le layout NexusLayout (Premium Dark), organisee en sections :

- **Hero** : NexusSectionHero avec badge "Collaboration transfrontaliere", titre et sous-titre narratif
- **KPI Cards** (4 cartes) : Projets conjoints, Pays impliques, Budget total mobilise, Beneficiaires
- **Filtres** : Recherche textuelle + filtres par pays, theme (Connectivite, Education, Sante, Agriculture, Gouvernance) et statut
- **Grille de projets** : Cartes de projets avec badges multi-pays, barre de progression, tags thematiques
- **Carte de collaboration** : Visualisation des liens entre pays partenaires (widget simplifie)

### 2. Composants dans `src/components/collaboration/`

**`CrossBorderFilters.tsx`**
- Barre de recherche + 3 selects (pays, theme, statut)
- Style dark coherent avec ProjectFilters existant
- Bouton "Effacer les filtres"

**`CrossBorderProjectCard.tsx`**
- Carte affichant : titre, description, pays partenaires (drapeaux), theme, budget, progression
- Badges multi-pays avec drapeaux emoji
- Barre de progression visuelle (completion_percentage)
- Style hover avec effet gold (nx-gold)

**`CrossBorderStats.tsx`**
- 4 KPI cards reutilisant le pattern ImpactKPICard
- Statistiques calculees a partir des donnees (demo ou reelles)

**`CollaborationNetworkMini.tsx`**
- Widget compact montrant les connexions entre pays sous forme de liste groupee
- Pas de dependance cartographique lourde, simplement une grille visuelle des liens

### 3. Donnees de demonstration

Comme la table `agency_projects` est actuellement vide, la page inclura un jeu de donnees demo (8-10 projets transfrontaliers fictifs mais realistes) affiche par defaut, avec un bouton pour charger les donnees reelles depuis Supabase quand elles seront disponibles.

Exemples de projets demo :
- "Dorsale fibre optique Abidjan-Accra" (Cote d'Ivoire + Ghana) - Connectivite
- "Programme scolaire numerique CEDEAO" (Senegal + Mali + Burkina Faso) - Education
- "Corridor numerique de sante Est-africain" (Kenya + Tanzanie + Ouganda) - Sante

### 4. Route dans `src/config/routes.ts`

- Path : `/collaboration`
- Univers : `projets`
- Accessible a tous les utilisateurs authentifies
- Visible dans la sidebar sous la categorie "management"
- Icone : `Handshake` (lucide-react)

## Details techniques

- Reutilise `NexusLayout`, `NexusSectionHero`, `Badge`, `Select`, `Input`, `Progress` existants
- Les filtres operent cote client sur les donnees chargees (demo ou Supabase)
- Les projets demo sont structures avec les memes champs que `agency_projects` + un champ `partner_countries` supplementaire (tableau de pays)
- Pattern de style coherent avec la page Projects existante (variant dark)
- Aucune migration de base de donnees requise : les champs `tags` et `location` existants dans `agency_projects` suffisent pour stocker les themes et pays partenaires
- Support i18n via `useTranslation` pour les labels principaux
- Animations framer-motion coherentes avec le reste de l'application

## Structure des fichiers

```text
src/
  pages/
    CrossBorderCollaboration.tsx        -- Page principale
  components/
    collaboration/
      CrossBorderFilters.tsx            -- Filtres dedies
      CrossBorderProjectCard.tsx        -- Carte projet transfrontalier
      CrossBorderStats.tsx              -- KPIs de collaboration
      CollaborationNetworkMini.tsx      -- Widget reseau de liens
```

