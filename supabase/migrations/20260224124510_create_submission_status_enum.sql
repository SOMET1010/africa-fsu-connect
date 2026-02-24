-- migration: create submission_status enum
-- purpose: capture lifecycle states for indicator submissions and other review flows
-- notes: used by the submissions table and any services that track moderation state

-- define the enum values to mirror the existing business vocabulary
create type public.submission_status as enum (
  'brouillon',
  'soumis',
  'en_revision',
  'approuve',
  'rejete'
);

-- keep ownership consistent with the postgres superuser
alter type public.submission_status owner to postgres;
