
# Enhanced Global Search with Multi-Language Filters

## What exists today
A `CommandPalette` (Cmd+K) already searches across documents, forum posts, and projects using `useUnifiedSearch`. However, it has no filtering -- all three content types are always queried with no way to narrow results by type, country, or document category.

## What we will add

### 1. Filter chips in the Command Palette
Below the search input, add a row of toggle chips that let users narrow results:
- **Content type**: Documents / Forum / Projects (toggle each on/off)
- **Country**: Dropdown from the `countries` table
- **Document type**: guide, rapport, presentation, formulaire, autre

All labels will be translated (FR/EN/AR/PT) using existing i18n keys.

### 2. Updated search hook with filter support

Extend `useUnifiedSearch` to accept a filters object:

```text
filters: {
  types: ('document' | 'forum' | 'project')[]   -- which content types to query
  country?: string                                -- filter documents/projects by country
  documentType?: string                           -- filter documents by type enum
}
```

When a content type is toggled off, its Supabase query is skipped entirely. Country and documentType filters are applied as `.eq()` clauses on the relevant queries.

### 3. Translated filter labels

Add i18n keys under `search.filters.*` in each language JSON file (fr, en, ar, pt) for:
- "Tous", "Documents", "Forum", "Projets"
- "Pays", "Type de document"
- Document type values (guide, rapport, presentation, formulaire, autre)

## Files to change

| File | Change |
|------|--------|
| `src/hooks/useUnifiedSearch.ts` | Add `filters` parameter; conditionally skip queries; apply `.eq()` for country/documentType |
| `src/components/ui/command-palette.tsx` | Add filter state; render filter chips row below `CommandInput`; pass filters to hook |
| `public/locales/fr/translation.json` | Add `search.filters.*` keys |
| `public/locales/en/translation.json` | Add `search.filters.*` keys |
| `public/locales/ar/translation.json` | Add `search.filters.*` keys |
| `public/locales/pt/translation.json` | Add `search.filters.*` keys |

## Technical details

### `useUnifiedSearch` changes
- New interface `SearchFilters` with `types`, `country`, `documentType`
- Default: all types enabled, no country/documentType filter
- Each `Promise.all` branch wrapped in conditional: only query if `filters.types` includes that type
- Documents query: add `.eq('country', filters.country)` and `.eq('document_type', filters.documentType)` when set
- Projects query: add `.eq('location', filters.country)` when country is set (projects use `location` field)

### `CommandPalette` filter UI
- State: `activeTypes` (Set of 'document'|'forum'|'project'), `country` (string|null), `documentType` (string|null)
- Render a flex-wrap row of small toggle buttons (Badge-like) below the input
- Three type toggles: Documents, Forum, Projects -- clicking toggles inclusion
- A small Select dropdown for Country (fetched from `countries` table or hardcoded SUTEL list)
- A small Select dropdown for Document Type (from the enum values)
- All labels use `t('search.filters.xxx')` with fallbacks
- Filters are passed to `useUnifiedSearch(query, filters)`
- A "Clear filters" button appears when any filter is active

### i18n keys added
```
search.filters.all: "Tous" / "All" / "الكل" / "Todos"
search.filters.documents: "Documents" / "Documents" / "وثائق" / "Documentos"
search.filters.forum: "Forum" / "Forum" / "منتدى" / "Fórum"
search.filters.projects: "Projets" / "Projects" / "مشاريع" / "Projetos"
search.filters.country: "Pays" / "Country" / "البلد" / "País"
search.filters.document_type: "Type" / "Type" / "النوع" / "Tipo"
search.filters.clear: "Effacer" / "Clear" / "مسح" / "Limpar"
```
