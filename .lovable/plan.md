

# Nettoyage des effets visuels parasites -- Audit complet et suppression

## Composants et fichiers identifies

Voici l'inventaire complet des elements a supprimer ou nettoyer, organise par priorite.

---

### 1. Supprimer `AdminHeatmapOverlay` (canvas monte dans le DOM)

**Fichiers concernes :**
- `src/App.tsx` -- supprimer l'import et `<AdminHeatmapOverlay />`
- `src/components/analytics/AdminHeatmapOverlay.tsx` -- supprimer le fichier
- `src/components/analytics/HeatmapOverlay.tsx` -- supprimer le fichier (contient un `<canvas>` avec `fixed inset-0 pointer-events-none z-50`)
- `src/hooks/useAdvancedAnalytics.ts` -- supprimer le fichier (contient `canvasRef`, `renderHeatmap`)

C'est le seul `<canvas>` monte dans le DOM au niveau global. Il persiste entre les routes car il est dans `App.tsx`.

---

### 2. Supprimer `NexusNetworkPattern` (SVG `absolute inset-0 pointer-events-none`)

**Fichiers concernes :**
- `src/components/shared/NexusNetworkPattern.tsx` -- supprimer le fichier
- `src/components/shared/NexusSectionBackground.tsx` -- supprimer le fichier (wrapper qui utilise uniquement NexusNetworkPattern)
- `src/components/practices/PracticesHero.tsx` -- supprimer l'import et `<NexusNetworkPattern variant="subtle" />`

---

### 3. Supprimer `NexusHero` et composants lies (parallax, overlays, patterns)

Le composant `NexusHero` contient 5 couches `absolute inset-0` superposees (image parallax, carte animee, gradients, patterns africains). Il n'est plus utilise sur la homepage mais reste importe dans `src/components/landing/HeroSection.tsx`.

**Fichiers concernes :**
- `src/components/shared/NexusHero.tsx` -- supprimer le fichier (contient NoiseOverlay, AfricanPattern inline, 5 couches absolute, parallax framer-motion)
- `src/components/landing/HeroSection.tsx` -- supprimer le fichier (seul consommateur de NexusHero, non importe nulle part)
- `src/components/shared/NexusAfricaMap.tsx` -- supprimer le fichier (uniquement utilise par NexusHero)

---

### 4. Nettoyer `AfricanSection` (overlay `absolute inset-0 pointer-events-none`)

**Fichier : `src/components/shared/AfricanPattern.tsx`**

Le composant `AfricanSection` contient :
```
<div className="absolute inset-0 african-pattern-bogolan-subtle opacity-50 pointer-events-none" />
```

Supprimer cette couche overlay. Garder le composant `AfricanSection` mais sans le pattern superpose -- il ne restera que le fond en gradient subtil.

Garder `AfricanDivider`, `AfricanStatNumber`, `AfricanAccentCard` (pas de couche parasite).

---

### 5. Nettoyer `CommandCenterMap` (overlays decoratifs)

**Fichier : `src/components/map/CommandCenterMap.tsx`**

Supprimer les deux couches decoratives :
- "Tactical Grid Overlay" : `absolute inset-0 pointer-events-none` avec `radial-gradient` (lignes 246-253)
- "Vignette Effect" : `absolute inset-0 pointer-events-none` avec `radial-gradient` (lignes 255-261)
- L'animation `pulse-ring-hud` dans le `<style>` tag (lignes 264-269)

---

### 6. Supprimer le CSS des patterns africains

**Fichier : `src/styles/african-patterns.css`**

Supprimer :
- `.african-pattern-bogolan` et `.african-pattern-bogolan-subtle` (radial-gradient patterns)
- `.african-pattern-kente` et `.african-pattern-kente-border`
- `.african-pattern-adinkra` (les points roses)
- `.african-pattern-animated` (animation shimmer)

Garder :
- `.african-divider` et `.african-divider-subtle` (lignes simples)
- `.african-bg-warm`, `.african-bg-cool`, `.african-bg-premium` (fonds de section simples)
- Les card styles si utilises

**Fichier : `src/index.css`** -- garder l'import car le fichier CSS contiendra encore les styles utiles.

---

### 7. Supprimer la CSS inutilisee de `StatsHUD` (optionnel)

Le composant `src/components/map/StatsHUD.tsx` n'a pas de couche parasite mais contient des `z-index` et des couleurs de glow dans les bordures. Pas prioritaire car c'est un composant de carte, pas un overlay global.

---

## Resume des fichiers

| Action | Fichier |
|--------|---------|
| Supprimer | `src/components/analytics/HeatmapOverlay.tsx` |
| Supprimer | `src/components/analytics/AdminHeatmapOverlay.tsx` |
| Supprimer | `src/hooks/useAdvancedAnalytics.ts` |
| Supprimer | `src/components/shared/NexusNetworkPattern.tsx` |
| Supprimer | `src/components/shared/NexusSectionBackground.tsx` |
| Supprimer | `src/components/shared/NexusHero.tsx` |
| Supprimer | `src/components/shared/NexusAfricaMap.tsx` |
| Supprimer | `src/components/landing/HeroSection.tsx` |
| Modifier | `src/App.tsx` -- retirer AdminHeatmapOverlay |
| Modifier | `src/components/practices/PracticesHero.tsx` -- retirer NexusNetworkPattern |
| Modifier | `src/components/shared/AfricanPattern.tsx` -- retirer overlay dans AfricanSection |
| Modifier | `src/components/map/CommandCenterMap.tsx` -- retirer overlays decoratifs |
| Modifier | `src/styles/african-patterns.css` -- retirer les classes pattern (garder dividers et bg) |

## Garanties

- Zero `<canvas>` dans le DOM
- Zero couche `absolute inset-0 pointer-events-none` decorative
- Zero animation decorative persistante entre routes
- Fond propre sur toutes les pages
- Les composants fonctionnels (carte Leaflet, graphiques recharts) restent intacts

