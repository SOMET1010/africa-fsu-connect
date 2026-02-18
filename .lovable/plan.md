
# Plan: Multilingual Instant Search across Docs, Forum, and Projects

## Overview

Upgrade the existing `CommandPalette` (Cmd+K) into a unified, multilingual instant search that queries three Supabase tables in parallel: `documents`, `forum_posts`, and `projects`. Results are grouped by type with live feedback as the user types.

## Architecture

The search bar trigger will remain in the header (Cmd+K shortcut preserved). When the user types 2+ characters, three parallel Supabase queries fire with a 300ms debounce. Results are displayed grouped by category (Documents, Forum, Projects) inside the existing `CommandDialog`.

```text
User types query
       |
  [300ms debounce]
       |
  3 parallel Supabase queries
  +-----------+  +-----------+  +-----------+
  | documents |  | forum_    |  | projects  |
  | .ilike()  |  | posts     |  | .ilike()  |
  +-----------+  | .ilike()  |  +-----------+
                 +-----------+
       |
  Merge + group by type
       |
  Display in CommandDialog
```

## Changes

### 1. Rewrite `src/components/ui/command-palette.tsx`

- Add a `useUnifiedSearch` custom hook that:
  - Debounces input (300ms)
  - Fires 3 parallel `supabase.from(table).select().ilike()` queries:
    - `documents`: search `title` and `description`, filter `is_public = true`, limit 5
    - `forum_posts`: search `title` and `content`, limit 5
    - `projects`: search `title` and `description`/`location`, limit 5
  - Returns `{ results, loading }` grouped by category
- Replace the static command list with live search results
- Keep static navigation commands as fallback when query is empty
- Each result navigates to the appropriate page (`/resources`, `/forum`, `/projects`)
- Add i18n labels for group headings and placeholder using `useTranslation`

### 2. Create `src/hooks/useUnifiedSearch.ts`

New hook encapsulating the search logic:
- Input: search query string
- Output: `{ results: SearchResult[], loading: boolean }`
- Uses `Promise.all` for parallel queries
- Each result has: `id`, `title`, `description`, `type` (document/forum/project), `url`
- Debounce built-in (300ms)
- Minimum query length: 2 characters

### 3. Update i18n files (`fr.json`, `en.json`, `ar.json`, `pt.json`)

Add keys:
- `search.placeholder`: "Search documents, forum, projects..."
- `search.documents`: "Documents"
- `search.forum`: "Forum Discussions"
- `search.projects`: "Projects"
- `search.no_results`: "No results found"
- `search.hint`: "Cmd+K to search"

## Technical Details

### Supabase Queries (no migration needed)

```sql
-- Documents (public only)
SELECT id, title, description, document_type, country
FROM documents
WHERE is_public = true
AND (title ILIKE '%query%' OR description ILIKE '%query%')
LIMIT 5;

-- Forum posts
SELECT id, title, content, created_at
FROM forum_posts
WHERE title ILIKE '%query%' OR content ILIKE '%query%'
LIMIT 5;

-- Projects (uses existing projects table via Supabase SDK)
SELECT id, title, description, status, location
FROM projects
WHERE title ILIKE '%query%' OR description ILIKE '%query%'
LIMIT 5;
```

### Files Modified

| File | Change |
|---|---|
| `src/hooks/useUnifiedSearch.ts` | New hook - parallel Supabase search with debounce |
| `src/components/ui/command-palette.tsx` | Rewrite to use live search + static fallback |
| `src/i18n/translations/fr.json` | Add `search.*` keys |
| `src/i18n/translations/en.json` | Add `search.*` keys |
| `src/i18n/translations/ar.json` | Add `search.*` keys |
| `src/i18n/translations/pt.json` | Add `search.*` keys |

No database migrations required - uses existing tables and columns with client-side `ilike` filtering.
