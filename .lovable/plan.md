
# CMS Supabase -- Plan d'implementation

## Etat des lieux

### Ce qui existe deja

- **Table `homepage_content_blocks`** avec 5 blocs (hero, features, partners, cta, stats) -- multilingue (fr/en/ar/pt)
- **Hook `useHomepageContent`** avec fallback local et cache 10 min
- **Admin `/admin/homepage-editor`** pour editer les blocs homepage
- Hero, Features, CTA, Partners utilisent deja les donnees CMS

### Ce qui est encore hardcode

| Composant | Contenu hardcode |
|-----------|-----------------|
| `PublicHeader` | `NAV_ITEMS` (6 liens) |
| `Footer` | Liens modules, partenaires, contact (email, tel, adresse) |
| `HomeTrustSection` | 4 features securite |
| `HomeMessagesBlock` | 2 messages officiels |
| `HomeTrustBadge` | 5 badges de confiance |
| `usePlatformConfig` | localStorage uniquement, pas Supabase |

---

## Tables Supabase a creer

### 1. `site_settings`

Stockage cle-valeur pour la configuration globale (nom du site, email contact, telephone, adresse, reseaux sociaux, couleurs, etc.).

```sql
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Lecture publique (contenu du site)
CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- Ecriture admin uniquement
CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
```

Donnees initiales :
- `platform_name` : `{"fr": "UDC", "en": "UDC"}`
- `contact_email` : `{"value": "secretariat@atuuat.africa"}`
- `contact_phone` : `{"value": "+225 27 22 44 44 44"}`
- `contact_location` : `{"fr": "Abidjan, Côte d'Ivoire", "en": "Abidjan, Ivory Coast"}`

### 2. `navigation_items`

Liens de navigation pour header et footer.

```sql
CREATE TABLE public.navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL CHECK (location IN ('header', 'footer_modules', 'footer_partners', 'footer_legal')),
  label JSONB NOT NULL DEFAULT '{}',
  href TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_external BOOLEAN NOT NULL DEFAULT false,
  icon TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read nav items"
  ON public.navigation_items FOR SELECT USING (true);

CREATE POLICY "Admins can manage nav items"
  ON public.navigation_items FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
```

### 3. Pas de table `pages` pour l'instant

Les pages sont des composants React avec des routes declarees. Creer une table `pages` avec `sections jsonb` reviendrait a construire un page builder complet -- hors scope pour cette iteration. Les blocs homepage existants couvrent deja le besoin CMS de la landing page.

---

## Hooks et loaders

### `useSiteConfig()` -- Nouveau hook

```
src/hooks/useSiteConfig.ts
```

- Charge `site_settings` et `navigation_items` en une seule requete (parallel)
- Cache React Query 10 min (`staleTime`)
- Fallback local si erreur reseau (valeurs par defaut hardcodees)
- Helpers : `getSetting(key)`, `getNavItems(location)`, `getSettingLocalized(key, lang)`

### Mise a jour de `useHomepageContent`

- Supprimer les `as any` -- utiliser les types generes Supabase
- Ajouter des mutations pour les blocs `trust`, `messages`, `trust_badges`

---

## Remplacement du hardcode (6 composants)

### A. `PublicHeader.tsx`

- Remplacer `NAV_ITEMS` hardcode par `getNavItems('header')` du hook `useSiteConfig`
- Fallback sur les items actuels si CMS vide

### B. `Footer.tsx`

- Remplacer les liens modules par `getNavItems('footer_modules')`
- Remplacer les liens partenaires par `getNavItems('footer_partners')`
- Remplacer les liens legaux par `getNavItems('footer_legal')`
- Remplacer email/tel/adresse par `getSetting('contact_*')`
- Fallback sur les valeurs actuelles

### C. `HomeTrustSection.tsx`

- Ajouter un bloc `trust_section` dans `homepage_content_blocks` (donnees initiales via INSERT)
- Utiliser `getBlock('trust_section')` avec fallback sur `TRUST_FEATURES` actuel

### D. `HomeMessagesBlock.tsx`

- Ajouter un bloc `messages` dans `homepage_content_blocks`
- Utiliser `getBlock('messages')` avec fallback sur `OFFICIAL_MESSAGES` actuel

### E. `HomeTrustBadge.tsx`

- Ajouter un bloc `trust_badges` dans `homepage_content_blocks`
- Utiliser `getBlock('trust_badges')` avec fallback sur `TRUST_ITEMS` actuel

### F. `usePlatformConfig.ts`

- Migrer de localStorage vers `site_settings` Supabase
- Conserver localStorage comme cache local pour perf

---

## Admin UI : `/admin/content`

### Nouvelle page unifiee

```
src/pages/admin/ContentManager.tsx
```

Structure en onglets :

| Onglet | Contenu |
|--------|---------|
| **Parametres du site** | CRUD sur `site_settings` (nom, contact, reseaux sociaux) |
| **Navigation** | CRUD sur `navigation_items` avec drag-and-drop pour l'ordre |
| **Blocs Homepage** | Lien vers l'editeur existant `/admin/homepage-editor` enrichi |

### Permissions

- Route protegee avec `requiredRoles: ['super_admin', 'admin_pays', 'editeur']`
- RLS cote Supabase via `is_admin(auth.uid())`

### Upload images

- Utilisation du bucket `user-avatars` existant ou creation d'un bucket `cms-assets` public
- Composant d'upload reutilisable dans l'editeur

---

## Fichiers concernes

### Fichiers crees (4)

```text
src/hooks/useSiteConfig.ts              -- Hook principal CMS
src/pages/admin/ContentManager.tsx      -- Admin UI unifiee
src/components/admin/content/SiteSettingsEditor.tsx  -- Editeur settings
src/components/admin/content/NavigationEditor.tsx    -- Editeur navigation
CMS_GUIDE.md                            -- Documentation
```

### Fichiers modifies (7)

```text
src/components/layout/PublicHeader.tsx   -- Nav items depuis CMS
src/components/layout/Footer.tsx         -- Liens + contact depuis CMS
src/components/home/HomeTrustSection.tsx -- Contenu depuis CMS
src/components/home/HomeMessagesBlock.tsx -- Contenu depuis CMS
src/components/home/HomeTrustBadge.tsx   -- Contenu depuis CMS
src/config/routes.ts                     -- Ajout route /admin/content
src/hooks/useHomepageContent.ts          -- Nettoyage types
```

### Migration SQL

- Creation tables `site_settings` + `navigation_items`
- Politiques RLS (lecture publique, ecriture admin)
- Donnees initiales (settings + nav items actuels)
- Ajout blocs `trust_section`, `messages`, `trust_badges` dans `homepage_content_blocks`

---

## Validation

- Aucun redesploiement necessaire pour modifier textes, liens, contact
- Fallback local sur chaque composant si CMS vide ou erreur reseau
- Cache React Query 10 min pour les performances
- Admin protege par role + RLS

---

## Ce qui n'est PAS inclus (hors scope)

- Table `pages` avec editeur de pages dynamiques (trop complexe pour cette iteration)
- Page builder visuel (drag-and-drop de sections)
- Versioning du contenu (historique des modifications)
- Preview avant publication
