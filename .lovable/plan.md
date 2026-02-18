

# Homepage Content Blocks with CMS Editor for i18n Strings

## Context

The current homepage (`Index.tsx`) has a hero section and 3 feature cards with hardcoded French fallbacks. Several i18n keys are missing (e.g., `home.features.network.title`), and there is no way for admins to edit homepage content without touching code.

## What will be created

### 1. Supabase table `homepage_content_blocks`

A lightweight CMS table to store editable content blocks:

```text
id (uuid, PK)
block_key (text, unique)        -- e.g. "hero", "features", "cta", "partners", "stats"
content_fr (jsonb)              -- { title, subtitle, description, cta_label, cta_link, ... }
content_en (jsonb)
content_ar (jsonb)
content_pt (jsonb)
is_visible (boolean, default true)
sort_order (integer)
updated_at (timestamptz)
updated_by (uuid, FK to auth.users)
```

RLS: read for all, write for `super_admin` and `admin_pays`.

### 2. Default content blocks (seed data)

5 blocks seeded with current homepage content:
- **hero**: badge, title lines, description, CTAs
- **features**: 3 feature items (icon key, title, description)
- **partners**: partner organizations list
- **cta**: bottom call-to-action section
- **stats**: optional statistics row (countries, projects, etc.)

### 3. Hook `src/hooks/useHomepageContent.ts`

- Fetches blocks from Supabase with React Query
- Falls back to i18n JSON keys if DB returns empty
- Returns typed content per block, resolved for current language
- Caches aggressively (staleTime: 10 min)

### 4. Refactored `src/pages/Index.tsx`

Split into composable content blocks:
- `src/components/home/HomeHeroBlock.tsx` -- Hero with dynamic title/description/CTAs
- `src/components/home/HomeFeaturesBlock.tsx` -- Feature cards grid (dynamic count)
- `src/components/home/HomeCtaBlock.tsx` -- Bottom CTA section
- `src/components/home/HomePartnersBlock.tsx` -- Trust/partners bar

Each block:
- Reads from `useHomepageContent` hook
- Shows placeholder skeleton while loading
- Supports RTL via existing `useDirection`
- Keeps current dark/gold visual style

### 5. Admin CMS editor page `src/pages/admin/HomepageEditor.tsx`

An admin-only page at `/admin/homepage-editor` with:
- List of content blocks with drag-to-reorder (sort_order)
- Inline editing for each language tab (FR/EN/AR/PT) side by side
- Toggle visibility per block
- Live preview button (opens homepage in new tab)
- Save with optimistic updates via React Query mutation

### 6. Missing i18n keys

Add `home.features.*` keys to all 4 translation files (fr/en/ar/pt) so the fallback chain always works even without DB content.

### 7. Route registration

Add `/admin/homepage-editor` to `routes.ts` as a protected admin route.

## Technical details

- No new dependencies required
- Reuses existing UI components: `Card`, `Tabs`, `Input`, `Textarea`, `Switch`, `Badge`
- Content resolution order: Supabase DB > i18n JSON files > hardcoded fallback
- The `block_key` system is extensible -- new sections can be added without code changes
- Framer-motion animations preserved on all blocks
- All existing dark theme styling (`nx-night`, `nx-gold`) maintained

## File structure

```text
src/
  components/home/
    HomeHeroBlock.tsx
    HomeFeaturesBlock.tsx
    HomeCtaBlock.tsx
    HomePartnersBlock.tsx
  hooks/
    useHomepageContent.ts
  pages/
    Index.tsx                    -- refactored to use block components
    admin/
      HomepageEditor.tsx         -- CMS editor
  i18n/translations/
    fr.json                      -- add home.features.* keys
    en.json                      -- add home.features.* keys
    ar.json                      -- add home.features.* keys
    pt.json                      -- add home.features.* keys
```

