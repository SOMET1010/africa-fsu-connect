-- migration: create submission_status enum
-- purpose: capture lifecycle states for indicator submissions, projects, and other review flows
-- notes: used by the submissions table and any services that track moderation state
-- reference: CDC ANSUT/DSIS Section 4.2 (Validation et publication des contenus)

-- define the enum values to mirror the existing business vocabulary
create type public.submission_status as enum (
  'draft',          -- Brouillon: Initial state, editable by owner
  'submitted',      -- Soumis: Sent for review, pending admin action
  'in_review',      -- En revision: Being evaluated by editor/admin
  'approved',       -- Approuvé: Validated and ready for publication
  'rejected'        -- Rejeté: Returned to owner with comments
);

-- keep ownership consistent with the postgres superuser
alter type public.submission_status owner to postgres;

-- add comment for documentation
comment on type public.submission_status is 'Lifecycle states for submissions per CDC Section 4.2 workflow';