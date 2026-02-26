# Schéma complet de la base de données — USF Digital Connect Africa

> Généré le 23/02/2026 — Supabase project `wsbawdvqfbmtjtdtyddy`

---

## Types énumérés (ENUMs)

| Enum | Valeurs |
|------|---------|
| `user_role` | `super_admin`, `country_admin`, `editor`, `contributor`, `reader`, `focal_point` |
| `participant_role` | `delegate`, `rapporteur`, `president`, `moderator`, `admin` |
| `document_type` | `guide`, `report`, `presentation`, `form`, `other` |
| `contribution_type` | `afcp`, `proposal`, `amendment`, `comment` |
| `submission_status` | `draft`, `submitted`, `in_review`, `approved`, `rejected` |
| `session_type` | `plenary`, `working_group`, `presentation`, `break` |
| `poll_type` | `simple`, `multiple_choice`, `nomination`, `adoption` |
| `question_status` | `pending`, `approved`, `rejected`, `answered` |

---

## Tables par domaine fonctionnel

### 🌍 1. RÉSEAU & MEMBRES

#### `countries`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `code` | text | NO | — |
| `name_fr` | text | NO | — |
| `name_en` | text | NO | — |
| `region` | text | YES | — |
| `continent` | text | YES | — |
| `latitude` | numeric | YES | — |
| `longitude` | numeric | YES | — |
| `capital_city` | text | YES | — |
| `official_language` | text | YES | — |
| `working_languages` | text[] | YES | — |
| `sutel_community` | text | YES | — |
| `created_at` | timestamptz | NO | `now()` |
| `updated_at` | timestamptz | NO | `now()` |

> **Note** : `region` = nom géographique (`"Afrique de l'Ouest"`, `"Afrique Centrale"`, etc.)
> `sutel_community` = code communauté (`CRTEL`, `EACO`, `ECOWAS`, `COMESA`, `SADC`, `UMA`, `CPLP`, `CEMAC`)

#### `agencies`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `name` | text | NO | — |
| `acronym` | text | NO | — |
| `country` | text | NO | — |
| `region` | text | NO | — |
| `website_url` | text | NO | — |
| `api_endpoint` | text | YES | — |
| `logo_url` | text | YES | — |
| `description` | text | YES | — |
| `contact_email` | text | YES | — |
| `phone` | text | YES | — |
| `address` | text | YES | — |
| `established_date` | date | YES | — |
| `is_active` | boolean | YES | `true` |
| `last_sync_at` | timestamptz | YES | — |
| `sync_status` | text | YES | `'pending'` |
| `metadata` | jsonb | YES | `'{}'` |
| `created_at` | timestamptz | NO | `now()` |
| `updated_at` | timestamptz | NO | `now()` |

> **⚠️ Attention** : `region` dans agencies utilise des codes communauté (`CEDEAO`, `EACO`, `SADC`), pas des noms géographiques comme dans `countries`.

#### `agency_connectors`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `agency_id` | uuid | NO | — → `agencies.id` |
| `connector_type` | text | NO | — |
| `endpoint_url` | text | YES | — |
| `auth_method` | text | YES | — |
| `auth_config` | jsonb | YES | `'{}'` |
| `sync_frequency` | integer | YES | `3600` |
| `last_sync_at` | timestamptz | YES | — |
| `sync_status` | text | YES | `'inactive'` |
| `error_message` | text | YES | — |
| `is_active` | boolean | YES | `true` |
| `created_at` | timestamptz | NO | `now()` |
| `updated_at` | timestamptz | NO | `now()` |

#### `agency_members`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `agency_id` | uuid | NO | — |
| `user_id` | uuid | NO | — |
| `role` | text | NO | — |
| `permissions` | text[] | YES | — |
| `active` | boolean | YES | `true` |
| `joined_at` | timestamptz | YES | `now()` |

#### `agency_projects`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `agency_id` | uuid | NO | — → `agencies.id` |
| `title` | text | NO | — |
| `description` | text | YES | — |
| `status` | text | NO | — |
| `location` | text | YES | — |
| `coordinates` | geometry | NO | — |
| `budget` | numeric | YES | — |
| `beneficiaries` | integer | YES | — |
| `start_date` | date | YES | — |
| `end_date` | date | YES | — |
| `completion_percentage` | integer | YES | — |
| `tags` | text[] | YES | — |
| `external_id` | text | YES | — |
| `source_url` | text | YES | — |
| `sync_status` | text | YES | — |
| `last_updated_at` | timestamptz | YES | — |
| `created_at` | timestamptz | NO | `now()` |
| `updated_at` | timestamptz | NO | `now()` |

#### `agency_resources`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `agency_id` | uuid | NO | — → `agencies.id` |
| `title` | text | NO | — |
| `description` | text | YES | — |
| `resource_type` | text | NO | — |
| `file_url` | text | YES | — |
| `file_size` | integer | YES | — |
| `mime_type` | text | YES | — |
| `access_level` | text | NO | `'agency'` |
| `is_public` | boolean | NO | `false` |
| `allowed_roles` | text[] | YES | — |
| `shared_with_agencies` | text[] | YES | — |
| `tags` | text[] | YES | — |
| `download_count` | integer | YES | `0` |
| `current_version` | text | YES | — |
| `external_id` | text | YES | — |
| `source_url` | text | YES | — |
| `sync_status` | text | YES | — |
| `uploaded_by` | text | YES | — |
| `last_updated_at` | timestamptz | YES | — |
| `created_at` | timestamptz | NO | `now()` |
| `updated_at` | timestamptz | NO | `now()` |

#### `agency_resource_comments`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `resource_id` | uuid | NO | — → `agency_resources.id` |
| `user_id` | text | NO | — |
| `user_name` | text | NO | — |
| `comment` | text | NO | — |
| `created_at` | timestamptz | NO | `now()` |

#### `agency_resource_versions`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `resource_id` | uuid | NO | — → `agency_resources.id` |
| `version` | text | NO | — |
| `file_name` | text | NO | — |
| `file_url` | text | NO | — |
| `file_size` | integer | YES | — |
| `changes_summary` | text | NO | — |
| `uploaded_by` | text | NO | — |
| `uploaded_at` | timestamptz | NO | `now()` |

---

### 👤 2. PROFILS & UTILISATEURS

#### `profiles`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `user_id` | uuid | NO | — |
| `email` | text | YES | — |
| `first_name` | text | YES | — |
| `last_name` | text | YES | — |
| `country` | text | YES | — |
| `organization` | text | YES | — |
| `role` | user_role | NO | `'reader'` |
| `avatar_url` | text | YES | — |
| `created_at` | timestamptz | NO | `now()` |
| `updated_at` | timestamptz | NO | `now()` |

#### `user_profiles` (table étendue)
Contient des informations étendues sur les utilisateurs (préférences, bio, etc.).

#### `user_preferences`
Préférences utilisateur (langue, thème, notifications).

#### `user_dashboard_preferences`
Configuration personnalisée du tableau de bord.

#### `user_sessions`
Sessions actives de l'utilisateur.

#### `user_favorites`
Éléments favoris par utilisateur.

#### `user_subscriptions`
Abonnements utilisateur.

---

### 🏛️ 3. POINTS FOCAUX

#### `focal_points`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `country_code` | text | NO | — |
| `first_name` | text | NO | — |
| `last_name` | text | NO | — |
| `email` | text | NO | — |
| `organization` | text | YES | — |
| `job_title` | text | YES | — |
| `designation_type` | text | NO | — |
| `status` | text | NO | `'pending'` |
| `user_id` | uuid | YES | — |
| `created_by` | uuid | YES | — |
| `designated_by` | text | YES | — |
| `designation_date` | date | YES | — |
| `designation_document_url` | text | YES | — |
| `activated_at` | timestamptz | YES | — |
| `expires_at` | timestamptz | YES | — |
| `created_at` | timestamptz | NO | `now()` |

#### `focal_point_invitations`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `focal_point_id` | uuid | NO | — → `focal_points.id` |
| `email` | text | NO | — |
| `token` | text | NO | `gen_random_uuid()` |
| `status` | text | NO | `'pending'` |
| `sent_at` | timestamptz | YES | — |
| `expires_at` | timestamptz | YES | — |
| `accepted_at` | timestamptz | YES | — |
| `created_at` | timestamptz | NO | `now()` |

#### `focal_conversations`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `type` | text | NO | — |
| `country_code` | text | YES | — |
| `name` | text | YES | — |
| `created_by` | uuid | YES | — → `profiles.id` |
| `created_at` | timestamptz | YES | `now()` |
| `updated_at` | timestamptz | YES | `now()` |

#### `focal_conversation_participants`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `conversation_id` | uuid | YES | — → `focal_conversations.id` |
| `focal_point_id` | uuid | YES | — → `focal_points.id` |
| `user_id` | uuid | YES | — → `profiles.id` |
| `joined_at` | timestamptz | YES | `now()` |
| `last_read_at` | timestamptz | YES | — |
| `is_muted` | boolean | YES | `false` |

#### `focal_messages`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `conversation_id` | uuid | YES | — → `focal_conversations.id` |
| `sender_id` | uuid | YES | — → `focal_points.id` |
| `sender_user_id` | uuid | YES | — → `profiles.id` |
| `content` | text | NO | — |
| `attachment_url` | text | YES | — |
| `attachment_type` | text | YES | — |
| `indicator_reference` | text | YES | — |
| `is_system_message` | boolean | YES | `false` |
| `edited_at` | timestamptz | YES | — |
| `created_at` | timestamptz | YES | `now()` |

---

### 📊 4. INDICATEURS & SOUMISSIONS

#### `indicator_definitions`
Définitions des indicateurs de service universel.

#### `indicator_submissions`
Soumissions de données d'indicateurs par pays.

#### `indicator_translations`
Traductions multilingues des indicateurs.

#### `universal_service_indicators`
Indicateurs consolidés du service universel.

#### `submissions`
Soumissions générales (status: `submission_status` enum).

---

### 📄 5. DOCUMENTS & RESSOURCES

#### `documents`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `title` | text | NO | — |
| `description` | text | YES | — |
| `document_type` | document_type (enum) | NO | `'other'` |
| `file_url` | text | YES | — |
| `file_name` | text | YES | — |
| `file_size` | integer | YES | — |
| `mime_type` | text | YES | — |
| `uploaded_by` | uuid | NO | — |
| `is_public` | boolean | NO | `false` |
| `access_level` | text | NO | `'public'` |
| `allowed_roles` | text[] | YES | — |
| `tags` | text[] | YES | — |
| `country` | text | YES | — |
| `featured` | boolean | YES | `false` |
| `download_count` | integer | NO | `0` |
| `view_count` | integer | YES | `0` |
| `created_at` | timestamptz | NO | `now()` |
| `updated_at` | timestamptz | NO | `now()` |

#### `document_comments` → `documents.id`
#### `document_versions` → `documents.id`

---

### 🎪 6. ÉVÉNEMENTS

#### `events`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `title` | text | NO | — |
| `description` | text | YES | — |
| `start_date` | timestamptz | NO | — |
| `end_date` | timestamptz | NO | — |
| `location` | text | YES | — |
| `is_virtual` | boolean | NO | `false` |
| `virtual_link` | text | YES | — |
| `max_attendees` | integer | YES | — |
| `current_attendees` | integer | NO | `0` |
| `created_by` | uuid | NO | — |
| `created_at` | timestamptz | NO | `now()` |
| `updated_at` | timestamptz | NO | `now()` |

#### `event_registrations` → `events.id`

---

### 💬 7. FORUM

#### `forum_categories`
Catégories de discussion du forum.

#### `forum_posts`
Posts du forum (avec `reply_count`, `last_reply_at`).

#### `forum_replies` → `forum_posts.id`

---

### 🏛️ 8. CONFÉRENCES UAT

#### `uat_participants`
| Colonne clés | Type |
|-------------|------|
| `id` | uuid |
| `user_id` | uuid |
| `first_name`, `last_name` | text |
| `email` | text |
| `organization` | text |
| `country` | text |
| `cer_region` | text |
| `role` | participant_role (enum) |
| `badge_number` | text |
| `is_verified` | boolean |
| `registered_at` | timestamptz |

#### `uat_sessions` (type: `session_type` enum)
#### `uat_session_attendance` → `uat_sessions.id`
#### `uat_contributions` (type: `contribution_type` enum)
#### `uat_nominations`
#### `uat_polls` (type: `poll_type` enum)
#### `uat_poll_votes` → `uat_polls.id`
#### `uat_questions` (status: `question_status` enum)
#### `uat_question_votes` → `uat_questions.id`

---

### 🤝 9. PARTENAIRES

#### `partner_organizations`
| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `name` | text | NO | — |
| `acronym` | text | YES | — |
| `logo_url` | text | YES | — |
| `website_url` | text | YES | — |
| `display_order` | integer | NO | `0` |
| `is_visible` | boolean | NO | `true` |
| `created_at` | timestamptz | NO | `now()` |

---

### 🔐 10. SÉCURITÉ & AUDIT

| Table | Description |
|-------|-------------|
| `audit_logs` | Journaux d'audit (action_type, resource, IP, user_agent) |
| `anomaly_alerts` | Alertes d'anomalie (type, severity, auto_blocked) |
| `anomaly_settings` | Paramètres de détection d'anomalies par utilisateur |
| `security_preferences` | Préférences sécurité (2FA, e2e, timeout) |
| `encryption_keys` | Clés de chiffrement utilisateur |
| `webauthn_credentials` | Credentials WebAuthn/FIDO2 |
| `network_security_events` | Événements de sécurité réseau |
| `user_sessions` | Sessions utilisateur actives |

---

### 🌐 11. CMS & NAVIGATION

| Table | Description |
|-------|-------------|
| `navigation_items` | Items de navigation (header/footer, multilingue) |
| `homepage_content_blocks` | Blocs de contenu de la page d'accueil (hero, features, stats, CTA) |
| `site_settings` | Paramètres du site (nom, contact, slogan) |
| `translations` | Traductions clé/valeur |
| `translation_namespaces` | Espaces de noms de traduction |
| `languages` | Langues supportées |

---

### 🔄 12. SYNCHRONISATION

| Table | Description |
|-------|-------------|
| `data_sources` | Sources de données externes (acronyme, API endpoint) |
| `data_versions` | Versioning des données (snapshots) |
| `sync_logs` | Logs de synchronisation |
| `sync_sessions` | Sessions de sync |
| `sync_conflicts` | Conflits de synchronisation |
| `sync_workflows` | Workflows de sync automatisés |

---

### 📈 13. ANALYTICS & MÉTRIQUES

| Table | Description |
|-------|-------------|
| `analytics_events` | Événements analytics (page_url, session_id, event_data) |
| `dashboard_metrics` | Métriques calculées du tableau de bord |
| `compliance_reports` | Rapports de conformité |
| `presentation_sessions` | Sessions de présentation |

---

### 💰 14. FINANCES & PAIEMENTS (hérité — non utilisé par le module UAT)

Ces tables proviennent d'un module immobilier/gestion locative. Elles ne sont **pas** utilisées par le cœur fonctionnel UAT :

| Table | Description |
|-------|-------------|
| `transactions` | Transactions financières |
| `payments` | Paiements |
| `payment_accounts` | Comptes de paiement |
| `payment_methods` | Méthodes de paiement |
| `payment_schedules` | Échéanciers |
| `payment_notifications` | Notifications de paiement |
| `payment_reminders` | Rappels de paiement |
| `payment_disputes` | Litiges |
| `payment_plans` | Plans de paiement |
| `recurring_payments` | Paiements récurrents |
| `mobile_money_transactions` | Transactions mobile money |
| `escrow_accounts` / `escrow_conditions` | Comptes séquestre |
| `invoices` / `invoice_line_items` / `invoice_templates` | Factures |
| `refund_requests` / `refund_calculations` | Remboursements |
| `collection_actions` | Actions de recouvrement |
| `late_payments` | Retards de paiement |
| `receivables_tracking` | Suivi des créances |
| `penalty_calculations` | Calcul de pénalités |
| `transaction_fees` / `transaction_commissions` | Frais |
| `commission_rates` | Taux de commission |
| `financial_kpis` / `financial_reports` | KPIs financiers |
| `revenue_analytics` | Analytics revenus |
| `subscription_revenue` / `service_revenue` | Revenus |

---

### 🏠 15. IMMOBILIER (hérité — non utilisé par le module UAT)

| Table | Description |
|-------|-------------|
| `properties` | Biens immobiliers |
| `property_amenities` / `property_analytics` / `property_filters` / `property_images` / `property_visits` | Détails biens |
| `leases` / `rental_contracts` | Baux et contrats |
| `rental_applications` / `application_documents` / `application_evaluations` / `application_status_history` | Candidatures |
| `company_verifications` / `document_validations` | Vérifications |
| `favorites` | Favoris biens |
| `maintenance_requests` / `maintenance_categories` / `maintenance_quotes` | Maintenance |
| `intervention_tracking` / `intervention_photos` | Suivi interventions |
| `artisan_profiles` / `artisan_evaluations` | Artisans |
| `plans` / `subscriptions` / `subscription_plans` / `subscription_plans_detailed` / `subscription_invoices` | Abonnements |
| `service_categories` / `service_orders` / `value_added_services` | Services |
| `qr_code_configs` / `qr_code_scans` | QR Codes |
| `referral_codes` / `referrals` | Parrainage |
| `identity_verifications` / `user_verifications` / `verification_history` | Vérifications identité |
| `fraud_alerts` / `fraud_checks` | Anti-fraude |
| `intouch_simulation_logs` | Simulations InTouch |
| `report_templates` / `scheduled_reports` / `reminder_templates` | Templates |
| `system_settings` | Paramètres système |

---

## Mapping Régions ↔ Communautés

| Région géographique | Code communauté | `countries.region` | `agencies.region` | `countries.sutel_community` |
|---------------------|----------------|--------------------|--------------------|-----------------------------|
| Afrique de l'Ouest | CEDEAO | ✅ | ✅ | `CRTEL`, `ECOWAS` |
| Afrique Centrale | CEMAC | ✅ | ✅ | `CRTEL` |
| Afrique de l'Est | EAC | ✅ | ✅ | `EACO` |
| Afrique du Nord | COMESA | ✅ | ✅ | `COMESA`, `UMA` |
| Afrique Australe | SADC | ✅ | ✅ | `SADC` |

> ✅ **Corrigé le 23/02/2026** : Les `agencies` et `countries` utilisent désormais le même format de région géographique. Une contrainte CHECK garantit les valeurs valides. Le champ `sutel_community` dans `countries` reste un code communauté distinct.

---

## Fonctions SQL notables

| Fonction | Description |
|----------|-------------|
| `handle_new_user()` | Trigger : crée un profil lors de l'inscription |
| `is_admin(user_id)` | Vérifie si l'utilisateur a un rôle admin |
| `is_focal_point(user_id, country?)` | Vérifie le statut de point focal |
| `get_country_focal_points(country)` | Liste les points focaux d'un pays |
| `get_user_role(user_id)` | Retourne le rôle de l'utilisateur |
| `check_uat_admin()` | Vérifie si l'utilisateur courant est admin UAT |
| `create_country_team_conversation()` | Trigger : crée une conversation d'équipe pays |
| `audit_role_change()` | Trigger : journalise les changements de rôle |
| `log_security_event(...)` | Enregistre un événement de sécurité |

---

## Nombre total de tables : **130**

### Répartition :
- **Tables cœur UAT** : ~40 (réseau, profils, points focaux, indicateurs, documents, événements, forum, conférence, partenaires, CMS)
- **Tables sécurité/audit** : ~10
- **Tables synchronisation** : ~6
- **Tables héritage immobilier** : ~74 (non utilisées par UAT)
