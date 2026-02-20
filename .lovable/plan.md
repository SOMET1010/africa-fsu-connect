

# Eclaircir le site -- Inspiration Carnegie Endowment

## Analyse du modele de reference

Le site Carnegie utilise une structure visuelle en deux zones distinctes :

1. **Zone haute (Hero)** : Fond bleu profond avec l'image de l'Afrique connectee -- conserve l'impact visuel
2. **Zone basse (Contenu)** : Fond blanc/clair avec texte sombre -- lisibilite maximale, professionnalisme institutionnel

Votre site actuel est entierement sombre (`nx-night`) du haut en bas, ce qui le rend visuellement lourd et difficile a lire.

## Strategie de transformation

Conserver le hero sombre (impact visuel fort) mais basculer toutes les sections de contenu en fond clair avec texte sombre, comme Carnegie.

### Zones qui restent sombres
- Header (navigation)
- Hero (image Afrique + badge + titre)
- Trust Badge (bandeau de confiance)
- Footer

### Zones qui passent en fond clair
- Carte des membres
- Features (54 pays, projets, ressources)
- Section Securite/Trust
- Messages officiels
- CTA "Rejoignez-nous"
- Partenaires

## Modifications fichier par fichier

### 1. `src/pages/Index.tsx` -- Structure de la page

Couper la page en deux zones :
- Zone hero : conserve le fond sombre `nx-night` avec l'image de fond
- Zone contenu : nouveau conteneur avec fond `bg-white` (ou `bg-[hsl(var(--nx-bg))]` ivoire clair) pour toutes les sections apres le trust badge

### 2. `src/components/home/HomeMemberMapBlock.tsx`

- Titres : `text-white` remplace par `text-[hsl(var(--nx-text-900))]` (texte sombre)
- Sous-titres : `text-white/70` remplace par `text-[hsl(var(--nx-text-500))]`
- Badges/pills : fond `bg-white/5` remplace par `bg-[hsl(var(--nx-brand-900))]/5`
- Boutons de filtre : adapter les couleurs pour fond clair
- Conteneur carte : conserver le fond sombre (`nx-night`) uniquement pour la carte elle-meme
- Legende : textes en gris fonce au lieu de blanc

### 3. `src/components/home/HomeFeaturesBlock.tsx`

- Cartes : fond `bg-white/5` remplace par `bg-white shadow-sm border border-[hsl(var(--nx-border))]`
- Titres cartes : `text-white` remplace par `text-[hsl(var(--nx-text-900))]`
- Descriptions : `text-white/70` remplace par `text-[hsl(var(--nx-text-500))]`
- Icones : conserver l'or `nx-gold` sur fond or leger

### 4. `src/components/home/HomeTrustSection.tsx`

- Fond section : ajouter `bg-[hsl(var(--nx-section-cool))]` (bleu tres pale)
- Titres : `text-white` vers `text-[hsl(var(--nx-text-900))]`
- Descriptions : `text-white/80` vers `text-[hsl(var(--nx-text-700))]`
- Cartes : `bg-white/5 border-white/10` vers `bg-white border border-[hsl(var(--nx-border))] shadow-sm`

### 5. `src/components/home/HomeMessagesBlock.tsx`

- Titre : `text-white` vers `text-[hsl(var(--nx-text-900))]`
- Cartes messages : `bg-white/5 border-white/10` vers `bg-white border border-[hsl(var(--nx-border))] shadow-sm`
- Textes : `text-white` vers `text-[hsl(var(--nx-text-900))]`, `text-white/85` vers `text-[hsl(var(--nx-text-700))]`

### 6. `src/components/home/HomeCtaBlock.tsx`

- Fond du bloc CTA : passer de `from-[hsl(var(--nx-gold))]/10` a un fond brand institutionnel `bg-[hsl(var(--nx-brand-900))]` avec texte blanc (comme Carnegie utilise un bloc accent)
- Bouton CTA : conserver le gradient or

### 7. `src/components/home/HomePartnersBlock.tsx`

- Texte "Partenaires" : `text-white/70` vers `text-[hsl(var(--nx-text-500))]`
- Badges partenaires : `text-white/75 border-white/20` vers `text-[hsl(var(--nx-text-700))] border-[hsl(var(--nx-border))]`

## Resultat attendu

```text
+------------------------------------------+
|  Header (sombre - nx-night)              |
+------------------------------------------+
|  Hero + Image Afrique (sombre)           |
|  Badge USF + Titre + CTA                 |
+------------------------------------------+
|  Trust Badge (sombre)                    |
+==========================================+
|  FOND CLAIR (blanc/ivoire)               |
|                                          |
|  Carte des Membres                       |
|  Features (54 pays, projets...)          |
|  Securite & Protection                   |
|  Messages officiels                      |
|  CTA "Rejoignez-nous" (bloc accent)     |
|  Partenaires                             |
+==========================================+
|  Footer (sombre - nx-night)              |
+------------------------------------------+
```

## Impact

- 8 fichiers modifies (Index.tsx + 6 composants home + 0 nouveau fichier)
- Aucune dependance ajoutee
- Le footer et le header conservent leur style sombre actuel
- Les design tokens `nx-text-900`, `nx-text-700`, `nx-text-500`, `nx-bg`, `nx-border` deja definis dans `nexus-tokens.css` sont reutilises

