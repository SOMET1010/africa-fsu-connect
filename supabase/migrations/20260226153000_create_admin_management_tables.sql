-- migration: create admin management tables
-- purpose: expose the additional admin modules (alerts, training, support, watch, exports)
-- notes: each table supports the new Administration menu and keeps track of security/contact artifacts

-- Enumerations -------------------------------------------------------------------
create type public.admin_alert_severity as enum ('info', 'warning', 'critical');
alter type public.admin_alert_severity owner to postgres;
comment on type public.admin_alert_severity is 'Niveaux de gravité des alertes système';

create type public.admin_alert_status as enum ('new', 'acknowledged', 'resolved');
alter type public.admin_alert_status owner to postgres;
comment on type public.admin_alert_status is 'Statuts de traitement des alertes';

create type public.admin_validation_status as enum ('pending', 'approved', 'rejected');
alter type public.admin_validation_status owner to postgres;
comment on type public.admin_validation_status is 'Statuts de validation des comptes';

create type public.training_status as enum ('draft', 'published', 'archived');
alter type public.training_status owner to postgres;
comment on type public.training_status is 'Stades de publication des formations';

create type public.training_participant_status as enum ('enrolled', 'completed', 'dropped');
alter type public.training_participant_status owner to postgres;
comment on type public.training_participant_status is 'Avancement des participants';

create type public.support_ticket_priority as enum ('low', 'medium', 'high', 'urgent');
alter type public.support_ticket_priority owner to postgres;
comment on type public.support_ticket_priority is 'Priorités de tickets de support';

create type public.support_ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');
alter type public.support_ticket_status owner to postgres;
comment on type public.support_ticket_status is 'Statuts des tickets de support';

create type public.export_status as enum ('pending', 'completed', 'failed');
alter type public.export_status owner to postgres;
comment on type public.export_status is 'Suivi des exports administratifs';

create type public.connector_status as enum ('idle', 'syncing', 'error');
alter type public.connector_status owner to postgres;
comment on type public.connector_status is 'État des connecteurs externes';

create type public.backup_status as enum ('scheduled', 'running', 'completed', 'failed');
alter type public.backup_status owner to postgres;
comment on type public.backup_status is 'Statuts des sauvegardes';

create type public.request_status as enum ('pending', 'fulfilled', 'rejected');
alter type public.request_status owner to postgres;
comment on type public.request_status is 'Statuts des demandes RGPD';

-- Tables -------------------------------------------------------------------------
create table public.admin_activity_stream (
  id uuid not null default gen_random_uuid(),
  action_type text not null,
  resource text,
  details text,
  user_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint admin_activity_stream_pkey primary key (id),
  constraint admin_activity_stream_user_id_fkey foreign key (user_id) references auth.users(id)
);
alter table public.admin_activity_stream enable row level security;
create policy "authenticated select admin_activity_stream" on public.admin_activity_stream for select to authenticated using (true);
create policy "authenticated insert admin_activity_stream" on public.admin_activity_stream for insert to authenticated with check (true);

create table public.admin_alerts (
  id uuid not null default gen_random_uuid(),
  title text not null,
  severity public.admin_alert_severity not null default 'info',
  status public.admin_alert_status not null default 'new',
  category text,
  details text,
  resolver_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint admin_alerts_pkey primary key (id),
  constraint admin_alerts_resolver_fkey foreign key (resolver_id) references auth.users(id)
);
alter table public.admin_alerts enable row level security;
create policy "authenticated select admin_alerts" on public.admin_alerts for select to authenticated using (true);
create policy "authenticated insert admin_alerts" on public.admin_alerts for insert to authenticated with check (true);

create table public.admin_account_validations (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  status public.admin_validation_status not null default 'pending',
  reviewed_by uuid,
  notes text,
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint admin_account_validations_pkey primary key (id),
  constraint admin_account_validations_user_id_fkey foreign key (user_id) references auth.users(id),
  constraint admin_account_validations_reviewed_by_fkey foreign key (reviewed_by) references auth.users(id)
);
alter table public.admin_account_validations enable row level security;
create policy "authenticated select admin_account_validations" on public.admin_account_validations for select to authenticated using (true);
create policy "authenticated insert admin_account_validations" on public.admin_account_validations for insert to authenticated with check (true);

create table public.admin_watch_sources (
  id uuid not null default gen_random_uuid(),
  name text not null,
  provider text,
  url text,
  tags text[] default '{}'::text[],
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  constraint admin_watch_sources_pkey primary key (id)
);
alter table public.admin_watch_sources enable row level security;
create policy "authenticated select admin_watch_sources" on public.admin_watch_sources for select to authenticated using (true);
create policy "authenticated insert admin_watch_sources" on public.admin_watch_sources for insert to authenticated with check (true);

create table public.admin_alert_rules (
  id uuid not null default gen_random_uuid(),
  name text not null,
  trigger text,
  channel text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint admin_alert_rules_pkey primary key (id)
);
alter table public.admin_alert_rules enable row level security;
create policy "authenticated select admin_alert_rules" on public.admin_alert_rules for select to authenticated using (true);
create policy "authenticated insert admin_alert_rules" on public.admin_alert_rules for insert to authenticated with check (true);

create table public.training_courses (
  id uuid not null default gen_random_uuid(),
  title text not null,
  summary text,
  status public.training_status not null default 'draft',
  start_date date,
  end_date date,
  created_by uuid,
  created_at timestamptz not null default now(),
  constraint training_courses_pkey primary key (id),
  constraint training_courses_created_by_fkey foreign key (created_by) references auth.users(id)
);
alter table public.training_courses enable row level security;
create policy "authenticated select training_courses" on public.training_courses for select to authenticated using (true);
create policy "authenticated insert training_courses" on public.training_courses for insert to authenticated with check (true);

create table public.training_participants (
  id uuid not null default gen_random_uuid(),
  course_id uuid not null,
  user_id uuid not null,
  status public.training_participant_status not null default 'enrolled',
  enrolled_at timestamptz not null default now(),
  constraint training_participants_pkey primary key (id),
  constraint training_participants_course_id_fkey foreign key (course_id) references public.training_courses(id),
  constraint training_participants_user_id_fkey foreign key (user_id) references auth.users(id)
);
alter table public.training_participants enable row level security;
create policy "authenticated select training_participants" on public.training_participants for select to authenticated using (true);
create policy "authenticated insert training_participants" on public.training_participants for insert to authenticated with check (true);

create table public.training_certifications (
  id uuid not null default gen_random_uuid(),
  participant_id uuid not null,
  certificate_url text,
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  constraint training_certifications_pkey primary key (id),
  constraint training_certifications_participant_id_fkey foreign key (participant_id) references public.training_participants(id)
);
alter table public.training_certifications enable row level security;
create policy "authenticated select training_certifications" on public.training_certifications for select to authenticated using (true);
create policy "authenticated insert training_certifications" on public.training_certifications for insert to authenticated with check (true);

create table public.admin_support_tickets (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text,
  priority public.support_ticket_priority not null default 'medium',
  status public.support_ticket_status not null default 'open',
  created_by uuid,
  assigned_to uuid,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint admin_support_tickets_pkey primary key (id),
  constraint admin_support_tickets_created_by_fkey foreign key (created_by) references auth.users(id),
  constraint admin_support_tickets_assigned_to_fkey foreign key (assigned_to) references auth.users(id)
);
alter table public.admin_support_tickets enable row level security;
create policy "authenticated select admin_support_tickets" on public.admin_support_tickets for select to authenticated using (true);
create policy "authenticated insert admin_support_tickets" on public.admin_support_tickets for insert to authenticated with check (true);

create table public.admin_support_faq (
  id uuid not null default gen_random_uuid(),
  question text not null,
  answer text,
  category text,
  is_visible boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint admin_support_faq_pkey primary key (id)
);
alter table public.admin_support_faq enable row level security;
create policy "authenticated select admin_support_faq" on public.admin_support_faq for select to authenticated using (true);
create policy "authenticated insert admin_support_faq" on public.admin_support_faq for insert to authenticated with check (true);

create table public.admin_export_jobs (
  id uuid not null default gen_random_uuid(),
  name text,
  format text,
  status public.export_status not null default 'pending',
  file_url text,
  initiated_by uuid,
  created_at timestamptz not null default now(),
  finished_at timestamptz,
  constraint admin_export_jobs_pkey primary key (id),
  constraint admin_export_jobs_initiated_by_fkey foreign key (initiated_by) references auth.users(id)
);
alter table public.admin_export_jobs enable row level security;
create policy "authenticated select admin_export_jobs" on public.admin_export_jobs for select to authenticated using (true);
create policy "authenticated insert admin_export_jobs" on public.admin_export_jobs for insert to authenticated with check (true);

create table public.admin_calendar_deadlines (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text,
  due_date date,
  source text,
  created_at timestamptz not null default now(),
  constraint admin_calendar_deadlines_pkey primary key (id)
);
alter table public.admin_calendar_deadlines enable row level security;
create policy "authenticated select admin_calendar_deadlines" on public.admin_calendar_deadlines for select to authenticated using (true);
create policy "authenticated insert admin_calendar_deadlines" on public.admin_calendar_deadlines for insert to authenticated with check (true);

create table public.admin_calendar_reminders (
  id uuid not null default gen_random_uuid(),
  deadline_id uuid not null,
  channel text not null,
  days_before integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint admin_calendar_reminders_pkey primary key (id),
  constraint admin_calendar_reminders_deadline_id_fkey foreign key (deadline_id) references public.admin_calendar_deadlines(id)
);
alter table public.admin_calendar_reminders enable row level security;
create policy "authenticated select admin_calendar_reminders" on public.admin_calendar_reminders for select to authenticated using (true);
create policy "authenticated insert admin_calendar_reminders" on public.admin_calendar_reminders for insert to authenticated with check (true);

create table public.admin_map_configurations (
  id uuid not null default gen_random_uuid(),
  provider text not null,
  layer text,
  config jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint admin_map_configurations_pkey primary key (id)
);
alter table public.admin_map_configurations enable row level security;
create policy "authenticated select admin_map_configurations" on public.admin_map_configurations for select to authenticated using (true);
create policy "authenticated insert admin_map_configurations" on public.admin_map_configurations for insert to authenticated with check (true);

create table public.admin_connectors (
  id uuid not null default gen_random_uuid(),
  service_name text not null,
  endpoint text,
  status public.connector_status not null default 'idle',
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  constraint admin_connectors_pkey primary key (id)
);
alter table public.admin_connectors enable row level security;
create policy "authenticated select admin_connectors" on public.admin_connectors for select to authenticated using (true);
create policy "authenticated insert admin_connectors" on public.admin_connectors for insert to authenticated with check (true);

create table public.admin_internal_messages (
  id uuid not null default gen_random_uuid(),
  subject text,
  body text,
  sender_id uuid,
  target_role text,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  constraint admin_internal_messages_pkey primary key (id),
  constraint admin_internal_messages_sender_id_fkey foreign key (sender_id) references auth.users(id)
);
alter table public.admin_internal_messages enable row level security;
create policy "authenticated select admin_internal_messages" on public.admin_internal_messages for select to authenticated using (true);
create policy "authenticated insert admin_internal_messages" on public.admin_internal_messages for insert to authenticated with check (true);

create table public.admin_security_policies (
  id uuid not null default gen_random_uuid(),
  name text not null,
  description text,
  enforcement_level text,
  created_at timestamptz not null default now(),
  constraint admin_security_policies_pkey primary key (id)
);
alter table public.admin_security_policies enable row level security;
create policy "authenticated select admin_security_policies" on public.admin_security_policies for select to authenticated using (true);
create policy "authenticated insert admin_security_policies" on public.admin_security_policies for insert to authenticated with check (true);

create table public.admin_backups (
  id uuid not null default gen_random_uuid(),
  label text,
  status public.backup_status not null default 'scheduled',
  backup_time timestamptz,
  restored_at timestamptz,
  created_at timestamptz not null default now(),
  constraint admin_backups_pkey primary key (id)
);
alter table public.admin_backups enable row level security;
create policy "authenticated select admin_backups" on public.admin_backups for select to authenticated using (true);
create policy "authenticated insert admin_backups" on public.admin_backups for insert to authenticated with check (true);

create table public.admin_data_requests (
  id uuid not null default gen_random_uuid(),
  requestor_id uuid,
  request_type text,
  status public.request_status not null default 'pending',
  details text,
  created_at timestamptz not null default now(),
  constraint admin_data_requests_pkey primary key (id),
  constraint admin_data_requests_requestor_id_fkey foreign key (requestor_id) references auth.users(id)
);
alter table public.admin_data_requests enable row level security;
create policy "authenticated select admin_data_requests" on public.admin_data_requests for select to authenticated using (true);
create policy "authenticated insert admin_data_requests" on public.admin_data_requests for insert to authenticated with check (true);

-- Documentation comments -----------------------------------------------------------
comment on table public.admin_activity_stream is 'Journal des actions administratives';
comment on table public.admin_alerts is 'Alertes critiques et modération en cabine';
comment on table public.admin_account_validations is 'Validation manuelle des comptes';
comment on table public.admin_watch_sources is 'Sources de veille RSS externes';
comment on table public.admin_alert_rules is 'Règles de déclenchement d''alertes personnalisées';
comment on table public.training_courses is 'Catalogue des formations';
comment on table public.training_participants is 'Participants inscrits aux formations';
comment on table public.training_certifications is 'Certificats de formation émis';
comment on table public.admin_support_tickets is 'Tickets d''incidents tracking';
comment on table public.admin_support_faq is 'Base de connaissances support';
comment on table public.admin_export_jobs is 'Historique des exports';
comment on table public.admin_calendar_deadlines is 'Échéances CMDT';
comment on table public.admin_calendar_reminders is 'Rappels automatiques confiés aux échéances';
comment on table public.admin_map_configurations is 'Configurations des APIs cartographiques';
comment on table public.admin_connectors is 'Connecteurs externes (SSO, stats)';
comment on table public.admin_internal_messages is 'Messagerie interne admins / utilisateurs';
comment on table public.admin_security_policies is 'Politiques de sécurité supervisées';
comment on table public.admin_backups is 'Sauvegardes et restaurations';
comment on table public.admin_data_requests is 'Demandes liées au RGPD';
