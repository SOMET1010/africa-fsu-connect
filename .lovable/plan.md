
# Audit Navigation & UX -- Plan de corrections

## Inventaire des problemes detectes

### P0 -- Liens casses (404 garanti)

| # | Fichier | Lien casse | Probleme | Correction |
|---|---------|-----------|----------|------------|
| 1 | `src/pages/FocalDashboard.tsx` (l.117, 226, 347) | `href="/indicators/submit"` | Route `/indicators/submit` n'existe pas dans `routes.ts`. Aucune page correspondante. | Remplacer par `/submit` (formulaire de contribution existant) ou `/indicators` selon l'intention |
| 2 | `src/components/dashboard/NetworkDashboard.tsx` (l.72) | `navigate('/community')` | `/community` est la page "Communautes linguistiques", pas "Activite recente". Le label `onViewAll` de `UserRecentActivity` devrait pointer vers `/activity` | Remplacer par `navigate('/activity')` |
| 3 | `src/pages/Forum.tsx` (l.270) | `"/api/placeholder/40/40"` | Image placeholder qui 404 en prod -- avatar casse visible | Supprimer le fallback `src`, laisser le composant `AvatarFallback` gerer |
| 4 | `src/components/dashboard/widgets/LearningWidget.tsx` (l.170) | `to="/projects?filter=inspiring"` | Le query param `filter=inspiring` n'est pas lu par `Projects.tsx` -- le filtre ne s'applique pas | Soit supprimer le query param, soit implementer la lecture dans Projects.tsx |

### P1 -- Incoherences de navigation

| # | Fichier | Probleme | Correction |
|---|---------|----------|------------|
| 5 | `src/components/community/CommunityLanguageMap.tsx` (l.139) | `href="/members?country=${country.code}"` -- utilise `<a href>` au lieu de React Router `<Link>`, provoque un full reload. De plus, `MembersDirectory` ne lit pas le param `country` | Convertir en `Link to=` et ajouter la lecture du param `country` dans MembersDirectory |
| 6 | `src/components/organizations/LeafletInteractiveMap.tsx` (l.219, 230) | `href="/organizations"` et `href="/forum"` dans un popup Leaflet -- utilise `<a href>` natif, provoque full reload | Acceptable dans un popup Leaflet (pas de contexte React), mais a documenter |
| 7 | `src/pages/PublicDashboard.tsx` (l.207) | `href="/map"` -- utilise `<a href>` au lieu de `<Link>` | Convertir en `Link to="/map"` |

### P2 -- Ameliorations UX

| # | Fichier | Probleme | Correction |
|---|---------|----------|------------|
| 8 | `src/components/network/NexusRegions.tsx` | Les liens `?region=slug` fonctionnent grace a la validation ajoutee precedemment, mais RegionCards.tsx utilise `region.name` tandis que NexusRegions.tsx utilise `region.slug` -- risque d'incoherence | Harmoniser sur `region.slug` dans les deux fichiers |
| 9 | Preloader `routePredictions` | Contient encore des predictions vers routes obsoletes ou rarement visitees | Nettoyer et aligner avec l'architecture actuelle |

---

## Plan d'implementation

### Etape 1 : Fix P0 -- Liens casses

**Fichier `src/pages/FocalDashboard.tsx`**
- Remplacer les 3 occurrences de `href="/indicators/submit"` par `href="/submit"` (page de soumission existante)
- Convertir les `<a href>` en `<Link to>` pour eviter les full reload

**Fichier `src/components/dashboard/NetworkDashboard.tsx`**
- Ligne 72 : remplacer `navigate('/community')` par `navigate('/activity')`

**Fichier `src/pages/Forum.tsx`**
- Ligne 270 : remplacer `"/api/placeholder/40/40"` par `""` (laisser AvatarFallback prendre le relais avec les initiales)

**Fichier `src/components/dashboard/widgets/LearningWidget.tsx`**
- Ligne 170 : remplacer `to="/projects?filter=inspiring"` par `to="/practices"` (page dediee aux bonnes pratiques, plus coherent)

### Etape 2 : Fix P1 -- Incoherences

**Fichier `src/components/community/CommunityLanguageMap.tsx`**
- Convertir le `<a href="/members?country=...">` en URL interne coherente. Comme c'est dans un popup Leaflet (string HTML), on garde `<a href>` mais on pointe vers `/country/${country.code}` (route existante avec fiche pays)

**Fichier `src/pages/PublicDashboard.tsx`**
- Convertir `<a href="/map">` en `<Link to="/map">`

### Etape 3 : Fix P2 -- Harmonisation

**Fichier `src/components/network/RegionCards.tsx`**
- Verifier si `region.name` vs `region.slug` pose un probleme reel (audit rapide)

### Etape 4 : Garde-fous -- Test de verification

**Nouveau fichier `src/test/navigation-routes.test.ts`**
- Test automatise qui :
  1. Extrait toutes les routes declarees dans `ROUTES` de `src/config/routes.ts`
  2. Scanne les liens hardcodes connus (via un tableau de reference)
  3. Verifie que chaque lien pointe vers une route declaree
  4. Verifie l'absence de `/api/placeholder` dans le code

**Nouveau fichier `AUDIT_REPORT.md`**
- Document complet avec tous les fix appliques, les routes validees, et les points restants

---

## Details techniques

### Fichiers modifies (7 fichiers)

```text
src/pages/FocalDashboard.tsx           -- 3x href="/indicators/submit" -> Link to="/submit"
src/components/dashboard/NetworkDashboard.tsx -- navigate('/community') -> navigate('/activity')
src/pages/Forum.tsx                    -- "/api/placeholder/40/40" -> ""
src/components/dashboard/widgets/LearningWidget.tsx -- /projects?filter=inspiring -> /practices
src/components/community/CommunityLanguageMap.tsx   -- /members?country= -> /country/
src/pages/PublicDashboard.tsx          -- <a href="/map"> -> <Link to="/map">
```

### Fichiers crees (2 fichiers)

```text
AUDIT_REPORT.md                        -- Rapport d'audit complet
src/test/navigation-routes.test.ts     -- Test smoke navigation
```

### Routes declarees validees (exhaustif)

Toutes les routes dans `src/config/routes.ts` ont un composant lazy existant dans `src/pages/`. Les routes du footer, header public, header prive, et navigation mobile pointent toutes vers des routes declarees. Aucune route orpheline detectee.

### Aucune dependance ajoutee, aucune migration SQL.
