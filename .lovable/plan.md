

# Fix and Complete DB-Driven Country Filter for Document Library

## Problem

The country filter dropdown correctly loads countries from the `countries` table, but filtering is broken:

1. **Country mismatch**: The filter sends a country `code` (e.g., "SN") but `documents.country` stores French names (e.g., "Senegal"). The comparison always fails.
2. **Missing columns**: The `documents` table has no `theme` or `language` column, so those two filter dropdowns do nothing.
3. **Missing filter logic**: `Resources.tsx` does not apply theme or language filters even if they were present.

## Plan

### Step 1 -- Database migration

Add two new nullable columns to the `documents` table:

- `theme TEXT` -- stores the thematic tag (connectivity, funding, regulation, etc.)
- `language VARCHAR(5)` -- stores the document language code (fr, en, pt, ar)

### Step 2 -- Fix country filtering logic in `Resources.tsx`

Instead of comparing `doc.country` (a name) to `filters.country` (a code), resolve the code to a name using the countries list fetched in the filters component. Two options:

- **Option A (simpler)**: Change `ResourceFilters` to send the country **name** instead of the code when a country is selected.
- **Option B**: Pass the countries list up and do the lookup in Resources.

We will go with **Option A** -- update `ResourceFilters` to emit the country name (matching what is stored in `documents.country`).

### Step 3 -- Apply theme and language filters in `Resources.tsx`

Add the missing filter branches (lines ~60-74):

```
if (filters.theme) {
  docs = docs.filter(doc => doc.theme === filters.theme);
}
if (filters.language) {
  docs = docs.filter(doc => doc.language === filters.language);
}
```

### Step 4 -- Update `ResourceFilters.tsx` country value emission

In the country `Select`, change the emitted value from `c.code` to the country name (`c.name_fr` or `c.name_en` depending on current language). This ensures the filter value matches what is stored in the `documents` table (French names).

### Summary of file changes

| File | Change |
|------|--------|
| Database migration | Add `theme` and `language` columns to `documents` |
| `src/pages/Resources.tsx` | Add theme and language filter branches |
| `src/components/resources/ResourceFilters.tsx` | Emit country **name** (not code) so it matches `documents.country` |

