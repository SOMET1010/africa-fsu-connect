-- PHASE 1 - CORRECTION SÉCURITÉ CRITIQUE: Restreindre l'accès anonyme

-- 1. Mise à jour des politiques pour restreindre l'accès anonyme sur les tables publiques
-- Seuls les utilisateurs authentifiés peuvent voir les données, sauf exceptions spécifiques

-- Supprimer les politiques actuelles trop permissives
DROP POLICY IF EXISTS "Anyone can view agencies" ON public.agencies;
DROP POLICY IF EXISTS "Anyone can view agency projects" ON public.agency_projects;
DROP POLICY IF EXISTS "Anyone can view agency resources" ON public.agency_resources;
DROP POLICY IF EXISTS "Anyone can view data sources" ON public.data_sources;
DROP POLICY IF EXISTS "Anyone can view public documents" ON public.documents;
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
DROP POLICY IF EXISTS "Anyone can view forum categories" ON public.forum_categories;
DROP POLICY IF EXISTS "Anyone can view forum posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Anyone can view forum replies" ON public.forum_replies;
DROP POLICY IF EXISTS "Anyone can view indicator definitions" ON public.indicator_definitions;
DROP POLICY IF EXISTS "Anyone can view indicators" ON public.universal_service_indicators;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Créer des politiques plus sécurisées - accès restreint aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can view agencies" 
ON public.agencies FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view agency projects" 
ON public.agency_projects FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view agency resources" 
ON public.agency_resources FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view data sources" 
ON public.data_sources FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view public documents" 
ON public.documents FOR SELECT 
TO authenticated 
USING (is_public = true);

CREATE POLICY "Authenticated users can view events" 
ON public.events FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view forum categories" 
ON public.forum_categories FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view forum posts" 
ON public.forum_posts FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view forum replies" 
ON public.forum_replies FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view indicator definitions" 
ON public.indicator_definitions FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view indicators" 
ON public.universal_service_indicators FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

-- 2. Sécuriser les politiques d'accès aux données utilisateur - Restreindre aux utilisateurs authentifiés uniquement
-- Supprimer les politiques anonymes existantes
DROP POLICY IF EXISTS "Users can view their own anomaly alerts" ON public.anomaly_alerts;
DROP POLICY IF EXISTS "Users can view their own anomaly settings" ON public.anomaly_settings;
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can view their own compliance reports" ON public.compliance_reports;
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can view their own encryption keys" ON public.encryption_keys;
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their own security preferences" ON public.security_preferences;
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can view their own WebAuthn credentials" ON public.webauthn_credentials;

-- Recréer avec restriction explicite aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can view their own anomaly alerts" 
ON public.anomaly_alerts FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own anomaly settings" 
ON public.anomaly_settings FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own audit logs" 
ON public.audit_logs FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own compliance reports" 
ON public.compliance_reports FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own documents" 
ON public.documents FOR SELECT 
TO authenticated 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated users can view their own encryption keys" 
ON public.encryption_keys FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own registrations" 
ON public.event_registrations FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own notifications" 
ON public.notifications FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own security preferences" 
ON public.security_preferences FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own submissions" 
ON public.submissions FOR SELECT 
TO authenticated 
USING (auth.uid() = submitted_by);

CREATE POLICY "Authenticated users can view their own preferences" 
ON public.user_preferences FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own sessions" 
ON public.user_sessions FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own WebAuthn credentials" 
ON public.webauthn_credentials FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- 3. Sécuriser les politiques de mise à jour - Restreindre aux utilisateurs authentifiés
DROP POLICY IF EXISTS "Users can update their own anomaly alerts" ON public.anomaly_alerts;
DROP POLICY IF EXISTS "Users can update their own anomaly settings" ON public.anomaly_settings;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update their own encryption keys" ON public.encryption_keys;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Users can update their own replies" ON public.forum_replies;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own security preferences" ON public.security_preferences;
DROP POLICY IF EXISTS "Users can update their own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can update their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can update their own WebAuthn credentials" ON public.webauthn_credentials;

-- Recréer avec restriction explicite aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can update their own anomaly alerts" 
ON public.anomaly_alerts FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own anomaly settings" 
ON public.anomaly_settings FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own documents" 
ON public.documents FOR UPDATE 
TO authenticated 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated users can update their own encryption keys" 
ON public.encryption_keys FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own notifications" 
ON public.notifications FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own posts" 
ON public.forum_posts FOR UPDATE 
TO authenticated 
USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can update their own replies" 
ON public.forum_replies FOR UPDATE 
TO authenticated 
USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can update their own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own security preferences" 
ON public.security_preferences FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own submissions" 
ON public.submissions FOR UPDATE 
TO authenticated 
USING (auth.uid() = submitted_by AND status = 'brouillon'::submission_status);

CREATE POLICY "Authenticated users can update their own preferences" 
ON public.user_preferences FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own sessions" 
ON public.user_sessions FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own WebAuthn credentials" 
ON public.webauthn_credentials FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- 4. Politiques d'insertion sécurisées pour les utilisateurs authentifiés
DROP POLICY IF EXISTS "Users can insert their own anomaly settings" ON public.anomaly_settings;
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert their own encryption keys" ON public.encryption_keys;
DROP POLICY IF EXISTS "Users can register for events" ON public.event_registrations;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Authenticated users can create replies" ON public.forum_replies;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own security preferences" ON public.security_preferences;
DROP POLICY IF EXISTS "Users can create submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can create their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "System can insert sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can insert their own WebAuthn credentials" ON public.webauthn_credentials;

-- Recréer avec restriction explicite aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can insert their own anomaly settings" 
ON public.anomaly_settings FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can upload documents" 
ON public.documents FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated users can insert their own encryption keys" 
ON public.encryption_keys FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can register for events" 
ON public.event_registrations FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create posts" 
ON public.forum_posts FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create replies" 
ON public.forum_replies FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authenticated users can insert their own profile" 
ON public.profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own security preferences" 
ON public.security_preferences FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create submissions" 
ON public.submissions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Authenticated users can create their own preferences" 
ON public.user_preferences FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert sessions" 
ON public.user_sessions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own WebAuthn credentials" 
ON public.webauthn_credentials FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 5. Politiques de suppression sécurisées
DROP POLICY IF EXISTS "Users can cancel their own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can delete their own encryption keys" ON public.encryption_keys;
DROP POLICY IF EXISTS "Users can delete their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can delete their own WebAuthn credentials" ON public.webauthn_credentials;

-- Recréer avec restriction explicite aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can cancel their own registrations" 
ON public.event_registrations FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own encryption keys" 
ON public.encryption_keys FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own preferences" 
ON public.user_preferences FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own sessions" 
ON public.user_sessions FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own WebAuthn credentials" 
ON public.webauthn_credentials FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);