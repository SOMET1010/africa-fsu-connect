-- migration: create document_type enum
-- purpose: define the document_type enum before any dependent tables are created
-- notes: the documents table and associated filters rely on these canonical values
-- reference: CDC ANSUT/DSIS Section 4.1 (Documentary Library)

-- define the enum to represent the different document classifications
create type public.document_type as enum (
  'guide',          -- Guides and manuals
  'report',         -- Reports (activity, impact, audits...)
  'presentation',   -- Slides and presentation decks
  'form',           -- Forms and templates
  'other'           -- Miscellaneous documents
  -- TODO: Consider adding 'policy', 'bulletin', 'regulation' per CDC Section 4.1
);

-- this enum is owned by the postgres superuser by default
alter type public.document_type owner to postgres;

-- add comment for documentation
comment on type public.document_type is 'Document classifications per CDC Section 4.1';
