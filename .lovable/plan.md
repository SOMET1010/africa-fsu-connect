

# Refonte de la page d'accueil -- Design Institutionnel "Portail UDC"

## Constat

La page d'accueil actuelle a un hero sombre avec image de fond, des badges de confiance, puis des sections empilees verticalement (carte, features, messages, CTA, partenaires). Le design ressemble a un site marketing.

Vos maquettes montrent un design completement different : un **portail institutionnel** structure en grille, fond blanc, avec des donnees visibles immediatement -- pays membres, projets en cours, activites recentes, statistiques du reseau. C'est clair, stable, professionnel.

## Plan de refonte

### 1. Nouveau Header -- Branding "UDC"

**Fichier : `src/components/layout/PublicHeader.tsx`**

- Remplacer "USF Digital Connect / AFRICA" par **"UDC"** en gras + **"Union Digitale de la Connectivite Africaine"** a cote
- Ajouter une barre de recherche dans le header (visible sur desktop)
- Icones de notification, messagerie, globe (langue) a droite
- Navigation : Reseau, Collaboration, Evenements, Ressources, Tableaux de bord
- Style : fond blanc, `border-b border-gray-200`, pas de shadow

### 2. Nouveau Hero -- Structure en grille

**Fichier : `src/components/home/HomeHeroBlock.tsx` (refonte complete)**

Remplacer le hero sombre par un hero clair structure :

- **Colonne gauche** : 
  - Fil d'Ariane : Accueil > Reseau
  - Badge : "Reseau actif -- 54 pays"
  - Titre : **"Connecter l'Afrique, Ensemble"** en noir, typographie forte
  - Sous-titre descriptif
  - Deux boutons : "Explorer le Reseau" (primaire bleu) + "Voir les Projets" (outline)

- **Colonne droite** :
  - Carte d'Afrique stylisee (reutiliser le composant `HomeMemberMap` existant mais dans un conteneur plus petit, sans le fond sombre)
  - Legende : Pays membres / En integration / Projets actifs

- **Sous le hero** : 4 cartes KPI en ligne
  - 54 Pays membres (+3 cette annee)
  - 127 Projets actifs (+18 ce trimestre)
  - 892 Partenariats (+24 ce mois)
  - 45 Evenements (cette annee)
  - Chaque carte : fond blanc, bordure grise fine, icone bleue/verte, fleche de navigation

### 3. Section centrale -- Grille a 3 colonnes

**Nouveau fichier : `src/components/home/HomeGridSection.tsx`**

Layout en 3 colonnes :

- **Colonne 1 -- Pays Membres** :
  - Titre avec icone globe + lien "Voir tout"
  - Grille de cartes pays (drapeau, nom, badge statut "Actif" / "En integration")
  - 6 pays affiches + "+48 autres pays"
  - Donnees depuis `useAfricanCountries()`

- **Colonne 2 -- Carte du Reseau UDC** :
  - Carte Leaflet interactive reduite
  - Legende en bas
  - Boutons zoom +/-
  - Reutiliser `HomeMemberMap` avec styles adaptes

- **Colonne 3 -- Activite Recente + Prochains Evenements** :
  - Timeline verticale : points colores + titre + description + horodatage
  - Section "Prochains Evenements" : date en bloc (JUIL 15) + titre + lieu
  - Donnees depuis hooks existants

### 4. Section Statistiques

**Nouveau fichier : `src/components/home/HomeStatsSection.tsx`**

- Titre "Statistiques 2024"
- 3 colonnes : Croissance du Reseau (graphique ligne), Projets par Domaine (donut), Impact (chiffres)
- Utiliser `recharts` deja installe
- Style : cartes blanches, bordures fines, typographie contrastee

### 5. Barre partenaires en bas

**Fichier : `src/components/home/HomePartnersBlock.tsx` (modifier)**

- Fond gris tres clair `bg-gray-50`
- Logos UAT, ANSUT, UA, CEDEAO alignes horizontalement
- Bouton "Proposer un Projet" en jaune/or a droite

### 6. Page Index -- Assemblage

**Fichier : `src/pages/Index.tsx` (refonte)**

Supprimer :
- Le wrapper sombre `bg-[hsl(var(--nx-night))]`
- L'image de fond `nexus-hero-africa.png` en arriere-plan
- `HomeTrustBadge` (les infos confiance seront dans le footer ou page dediee)
- `HomeMessagesBlock` (messages officiels -- deplacer vers /about)
- `HomeCtaBlock` (le CTA sera integre dans le hero et la barre partenaires)

Nouvelle structure :
```text
PublicHeader
HomeHeroBlock (clair, grille 2 colonnes)
HomeKPIBar (4 cartes stats)
HomeGridSection (3 colonnes : pays, carte, activite)
HomeStatsSection (statistiques avec graphiques)
HomePartnersBlock (barre logos + CTA)
Footer
```

### 7. Nettoyage CSS

- Supprimer les references a `--nx-night` dans la page d'accueil
- Fond global : `bg-white` ou `bg-gray-50`
- Cartes : `bg-white border border-gray-200 rounded-xl`
- Typographie : noir `text-gray-900` pour titres, `text-gray-600` pour descriptions
- Couleurs d'accent : bleu primaire pour actions, vert pour statuts positifs, or/jaune pour boutons CTA

## Details techniques

### Composants reutilises
- `HomeMemberMap` -- carte Leaflet existante, juste re-stylisee
- `useAfricanCountries()` -- donnees pays
- `useHomepageContent()` -- contenus dynamiques
- `AnimatedCounter` -- compteurs animes
- `recharts` -- graphiques statistiques

### Composants crees
- `HomeKPIBar` -- barre de 4 cartes KPI
- `HomeGridSection` -- grille 3 colonnes
- `HomeStatsSection` -- section statistiques avec graphiques
- `HomeCountryCard` -- carte pays avec drapeau et badge statut
- `HomeActivityFeed` -- timeline d'activite recente
- `HomeUpcomingEvents` -- bloc evenements a venir

### Composants supprimes/deplaces
- `HomeTrustBadge` -- supprime de l'accueil (redondant)
- `HomeMessagesBlock` -- deplace vers /about
- `HomeCtaBlock` -- integre dans hero + barre partenaires
- `HomeTrustSection` -- deplace vers /about ou /legal

### Principes de design appliques
- Fond blanc, pas de hero sombre
- Bordures fines `border-gray-200`, pas de shadows lourdes
- Typographie haute contraste (noir sur blanc)
- Donnees visibles immediatement (pas de scroll pour voir les KPIs)
- Navigation claire et institutionnelle
- Zero effet decoratif (pas de glow, blur, gradient de fond)

