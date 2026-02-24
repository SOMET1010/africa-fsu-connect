-- migration: create document_type enum
-- purpose: define the document_type enum before any dependent tables are created
-- notes: the documents table and associated filters rely on these canonical values

-- define the enum to represent the different document classifications
create type public.document_type as enum (
  'guide',
  'rapport',
  'presentation',
  'formulaire',
  'autre'
);

-- this enum is owned by the postgres superuser by default
alter type public.document_type owner to postgres;
