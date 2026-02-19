

# Plan : Rebranding ADCA et Carte Interactive des Membres

## 1. Rebranding : NEXUS/SUTEL vers "UAT Digital Connect Africa (ADCA)"

Remplacement systematique du nom et du slogan dans tous les fichiers concernes.

**Nouveau nom** : UAT Digital Connect Africa (ADCA)
**Nouveau slogan** : "Connecter l'ecosysteme numerique de l'Afrique"

### Fichiers a modifier pour le rebranding

| Fichier | Changement |
|---|---|
| `src/components/layout/PublicHeader.tsx` | "NEXUS" -> "ADCA", "| UAT" -> "| Digital Connect Africa" |
| `src/components/layout/Footer.tsx` | Logo "NEXUS" -> "ADCA", slogan mis a jour |
| `src/pages/auth/components/AuthHeader.tsx` | "NEXUS" -> "ADCA", sous-titre -> nouveau slogan |
| `src/components/home/HomeHeroBlock.tsx` | Badge "Reseau SUTEL" -> "UAT Digital Connect Africa", titre par defaut -> nouveau slogan |
| `src/components/home/HomeCtaBlock.tsx` | "Rejoignez le reseau SUTEL" -> "Rejoignez ADCA" |
| `src/components/home/HomeMessagesBlock.tsx` | "plateforme NEXUS" -> "plateforme ADCA" |
| `src/components/home/HomeTrustSection.tsx` | "plateforme NEXUS" -> "plateforme ADCA" |
| `src/pages/Roadmap.tsx` | "aventure SUTEL" -> "aventure ADCA" |
| `src/pages/About.tsx` | "Plateforme NEXUS" -> "Plateforme ADCA" |
| `src/pages/SutaAssistant.tsx` | "plateforme NEXUS" -> "plateforme ADCA" |
| `src/pages/legal/TermsOfUse.tsx` | "plateforme NEXUS" -> "plateforme ADCA" |
| `src/pages/legal/PrivacyPolicy.tsx` | "plateforme NEXUS" -> "plateforme ADCA" |
| `src/components/network/UATCoordinationSection.tsx` | "Reseau SUTEL" -> "ADCA" |
| `src/components/dashboard/ImpactDashboard.tsx` | "Vue Reseau SUTEL" -> "Vue Reseau ADCA" |
| `src/components/shared/NexusLogo.tsx` | Texte interne "NEXUS" -> "ADCA" (si applicable) |

## 2. Carte Interactive des Membres sur la page d'accueil

Ajouter une section entre les blocs existants de la homepage qui affiche une carte Leaflet interactive montrant la participation des pays membres.

### Nouveau composant : `src/components/home/HomeMemberMapBlock.tsx`

- Carte Leaflet sombre (CartoDB Dark Matter) centree sur l'Afrique
- Marqueurs animes pour chaque pays membre avec drapeaux emoji
- Indicateur de niveau de participation (couleur : vert/jaune/orange)
- Popup au survol avec nom du pays et nombre de contributions
- Bouton "Explorer la carte complete" renvoyant vers `/map`
- Hauteur fixe de 500px sur desktop, 350px sur mobile
- Titre de section : "Participation des Membres" avec sous-titre descriptif
- Reutilisation des composants existants (`CommandCenterMap`, `activityData`, `useAfricanCountries`)

### Integration dans `src/pages/Index.tsx`

Ajout du composant `HomeMemberMapBlock` entre `HomeTrustBadge` et `HomeFeaturesBlock` :

```text
HomeHeroBlock
HomeTrustBadge
HomeMemberMapBlock   <-- NOUVEAU
HomeFeaturesBlock
HomeTrustSection
HomeMessagesBlock
HomeCtaBlock
HomePartnersBlock
```

### Details techniques

- Le composant encapsule `CommandCenterMap` dans un conteneur a hauteur fixe avec `rounded-2xl` et `overflow-hidden`
- Mode par defaut : `members` (affiche le nombre de membres/contributions)
- Clic sur un pays : navigation vers `/map` avec le pays pre-selectionne (optionnel, peut simplement ouvrir le popup)
- Chargement conditionnel : skeleton pendant le fetch des pays
- Aucune nouvelle dependance requise (Leaflet et les hooks sont deja installes)

