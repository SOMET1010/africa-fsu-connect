
# Fine-tuning UX institutionnel

## 1. Corriger le composant GlassCard pour le theme clair

Le `GlassCard` utilise `bg-white/5` et `border-white/10` -- concu pour un fond sombre. Sur fond clair, cela rend les cartes quasi invisibles.

**Changements :**
- `default` : `bg-white` avec `border border-border` et `shadow-sm`
- `strong` : `bg-white` avec `shadow-md`
- `subtle` : `bg-secondary/50` avec `border border-border/50`
- Supprimer le pseudo-element `before:` gradient overlay
- Hover : `hover:shadow-md hover:border-primary/20` au lieu de glow

## 2. Renforcer les icones stats admin (WCAG AA)

Dans `AdminStatsGrid`, les icones utilisent `bg-primary/10` qui manque de contraste sur fond blanc.

**Changements :**
- Passer le fond icone a `bg-primary/15` avec l'icone en `text-primary`
- Ajouter des variantes de couleur par stat : bleu, vert, violet, orange avec des fonds suffisamment contrastes (ex: `bg-blue-100 text-blue-700`, `bg-emerald-100 text-emerald-700`)
- S'assurer que le ratio de contraste depasse 4.5:1

## 3. Boutons CTA : hover plus distinct

Dans `button.tsx`, les variantes actuelles perdent l'indicateur visuel des anciens glows.

**Changements :**
- Variante `default` : ajouter `hover:shadow-md hover:translate-y-[-1px]` pour un feedback physique
- Variante `outline` : ajouter `hover:border-primary hover:shadow-sm` pour un contour plus marque
- Variante `glass` : remplacer par un style compatible theme clair (`bg-secondary hover:bg-secondary/80 border-border`)

## 4. Typographie : deja en place (aucun changement)

Inter est deja configure comme police principale du body, Poppins pour les titres, et Noto Sans Arabic pour le RTL. La configuration est conforme a l'objectif "gouvernemental moderne". Pas de modification necessaire.

---

## Details techniques

### Fichiers modifies

| Fichier | Nature du changement |
|---|---|
| `src/components/ui/glass-card.tsx` | Refonte des variantes pour theme clair |
| `src/pages/admin/components/AdminStatsGrid.tsx` | Couleurs icones avec meilleur contraste |
| `src/components/ui/button.tsx` | Hover states plus marques |

### Pas de nouvelles dependances

Toutes les modifications utilisent Tailwind CSS existant.
