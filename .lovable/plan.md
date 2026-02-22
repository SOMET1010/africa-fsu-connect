

# Redesign Header et Cards -- Branding institutionnel

## Objectif

Renforcer la hierarchie visuelle et l'espacement dans les headers (PublicHeader, ModernHeader, PageHeader) et les composants Card (card.tsx, SectionCard, PageHero, GlassCard) pour un rendu institutionnel clair, lisible et structure.

---

## 1. PublicHeader -- Renforcer la presence institutionnelle

**Fichier** : `src/components/layout/PublicHeader.tsx`

Changements :
- Augmenter la hauteur du header de `h-16` a `h-18` (4.5rem) pour plus de respiration
- Agrandir le logo ATU de `h-12` a `h-10` (ajuste pour etre proportionnel a la nouvelle hauteur)
- Ajouter un separateur vertical (`border-l border-border h-8`) entre le logo et le texte "UDC"
- Texte "UDC" passe de `text-lg` a `text-xl font-bold` + sous-texte "Digital Connect Africa" visible des `lg:` au lieu de `xl:`
- Bouton "S'inscrire" : remplacer `bg-primary/10 text-primary border-primary/30` par `bg-primary text-primary-foreground` pour un CTA plus affirme
- Espacement des nav links : passer `gap-1` a `gap-0.5` avec `px-3.5` pour plus de precision

## 2. ModernHeader -- Hierarchie et espacement

**Fichier** : `src/components/layout/ModernHeader.tsx`

Changements :
- Augmenter `h-16` a `h-18` pour coherence avec PublicHeader
- Logo "UDC" : ajouter un `border-l border-border/60 pl-3 h-8` comme separateur visuel
- Navigation desktop : uniformiser les liens a `px-3.5 py-2` au lieu de `px-4 py-2`
- Dropdown submenu : ajouter un header de section discret avec `DropdownMenuLabel` en `text-xs uppercase text-muted-foreground tracking-wider`
- Bouton CTA "Rejoindre" : passer en `bg-primary text-primary-foreground` plein (solide, institutionnel) au lieu du gradient shine effect
- Espacement actions droite : `space-x-3` au lieu de `space-x-2` pour une meilleure respiration

## 3. PageHeader -- Hierarchie typographique renforcee

**Fichier** : `src/components/layout/PageHeader.tsx`

Changements :
- Titre : passer de `text-3xl font-bold` a `text-2xl font-bold text-foreground` (plus compact, plus institutionnel)
- Description : passer de `text-lg` a `text-base text-muted-foreground` pour un meilleur ratio de taille
- Ajouter une ligne de separation visuelle sous le badge : `border-b border-border` implicite deja present
- Espacement vertical du conteneur : `py-6` a `py-5` pour un rendu plus compact et professionnel
- Badge : ajouter `font-medium` pour plus de lisibilite

## 4. Card base -- Fondation institutionnelle

**Fichier** : `src/components/ui/card.tsx`

Changements :
- Ajouter `rounded-xl` au lieu de `rounded-lg` pour un arrondi plus moderne
- Ajouter une transition douce : `transition-shadow duration-200`
- CardHeader : reduire l'espacement de `p-6` a `p-5` et `space-y-1.5` a `space-y-1` pour un rendu plus compact
- CardTitle : passer de `text-2xl` a `text-lg font-semibold` -- les titres de cartes doivent etre proportionnes
- CardContent : `p-6 pt-0` a `p-5 pt-0`
- CardFooter : `p-6 pt-0` a `p-5 pt-0`

## 5. PageHero -- Convertir aux tokens semantiques

**Fichier** : `src/components/shared/PageHero.tsx`

Le PageHero utilise encore des couleurs hardcodees (`bg-white/5`, `text-white`, `border-white/10`, `nx-gold`, `nx-cyan`). Conversion :
- Conteneur : `bg-white/5 backdrop-blur-md border-white/10` remplace par `bg-gradient-to-r from-primary to-primary-dark border border-border`
- Decorations background : supprimer les blobs `nx-gold` et `nx-cyan`, remplacer par des shapes en `bg-white/10` sur le gradient primaire
- Badge : `border-white/20 bg-white/5 text-white/80` remplace par `border-white/30 bg-white/10 text-white/90`
- Titre : `text-white` conserve (sur fond gradient primaire)
- Sous-titre : `text-white/80` conserve
- Meilleure lisibilite grace au fond solide au lieu du backdrop-blur fragile

## 6. SectionCard -- Espacement et hierarchie

**Fichier** : `src/components/layout/SectionCard.tsx`

Changements :
- `rounded-lg` implicite de Card remplace par le nouveau `rounded-xl` (via Card base)
- CardTitle : passer de `text-xl font-semibold` a `text-lg font-semibold` pour coherence
- Ajouter un `border-b border-border` entre le CardHeader et le CardContent quand un titre est present
- Variant "elevated" : ajouter `hover:shadow-lg transition-shadow duration-200`

---

## Details techniques

| Fichier | Nature du changement |
|---|---|
| `src/components/layout/PublicHeader.tsx` | Hauteur, logo separator, CTA solide |
| `src/components/layout/ModernHeader.tsx` | Hauteur, separator, espacement, CTA solide |
| `src/components/layout/PageHeader.tsx` | Typographie compacte, espacement |
| `src/components/ui/card.tsx` | Arrondi xl, tailles compactes, transition |
| `src/components/shared/PageHero.tsx` | Tokens semantiques, fond gradient solide |
| `src/components/layout/SectionCard.tsx` | Titre coherent, border separator |

### Pas de nouvelles dependances

Tout utilise les tokens CSS et Tailwind existants.

