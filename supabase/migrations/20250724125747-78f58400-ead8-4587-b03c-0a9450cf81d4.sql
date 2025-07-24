-- PHASE 1B - CORRECTION DES POLITIQUES D'ADMINISTRATION

-- Corriger les politiques d'administration pour restreindre l'accès anonyme aux fonctions d'administration
-- Toutes les politiques d'administration doivent être réservées aux utilisateurs authentifiés avec des rôles admin

-- 1. Mettre à jour les politiques d'administration pour les restreindre aux utilisateurs authentifiés
DROP POLICY IF EXISTS "Admins can manage agencies" ON public.agencies;
DROP POLICY IF EXISTS "Admins can manage agency connectors" ON public.agency_connectors;
DROP POLICY IF EXISTS "Admins can manage agency projects" ON public.agency_projects;
DROP POLICY IF EXISTS "Admins can manage agency resources" ON public.agency_resources;
DROP POLICY IF EXISTS "Admins can view all anomaly alerts" ON public.anomaly_alerts;
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can manage compliance reports" ON public.compliance_reports;
DROP POLICY IF EXISTS "Admins can view all compliance reports" ON public.compliance_reports;
DROP POLICY IF EXISTS "Admins can manage data sources" ON public.data_sources;
DROP POLICY IF EXISTS "Admins can manage all documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage forum categories" ON public.forum_categories;
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Admins can manage all replies" ON public.forum_replies;
DROP POLICY IF EXISTS "Admins can manage indicator definitions" ON public.indicator_definitions;
DROP POLICY IF EXISTS "Admins can manage network security events" ON public.network_security_events;
DROP POLICY IF EXISTS "Admins can view all network security events" ON public.network_security_events;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.submissions;
DROP POLICY IF EXISTS "Reviewers can update assigned submissions" ON public.submissions;
DROP POLICY IF EXISTS "Reviewers can view assigned submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins can view sync logs" ON public.sync_logs;
DROP POLICY IF EXISTS "Admins can manage indicators" ON public.universal_service_indicators;

-- Recréer toutes les politiques d'administration avec restriction aux utilisateurs authentifiés uniquement
CREATE POLICY "Authenticated admins can manage agencies" 
ON public.agencies FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can manage agency connectors" 
ON public.agency_connectors FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can manage agency projects" 
ON public.agency_projects FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can manage agency resources" 
ON public.agency_resources FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can view all anomaly alerts" 
ON public.anomaly_alerts FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = ANY (ARRAY['super_admin'::user_role, 'admin_pays'::user_role])));

CREATE POLICY "Authenticated admins can view all audit logs" 
ON public.audit_logs FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = ANY (ARRAY['super_admin'::user_role, 'admin_pays'::user_role])));

CREATE POLICY "Authenticated admins can manage compliance reports" 
ON public.compliance_reports FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = ANY (ARRAY['super_admin'::user_role, 'admin_pays'::user_role])));

CREATE POLICY "Authenticated admins can view all compliance reports" 
ON public.compliance_reports FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = ANY (ARRAY['super_admin'::user_role, 'admin_pays'::user_role])));

CREATE POLICY "Authenticated admins can manage data sources" 
ON public.data_sources FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can manage all documents" 
ON public.documents FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can view all registrations" 
ON public.event_registrations FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can manage events" 
ON public.events FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can manage forum categories" 
ON public.forum_categories FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can manage all posts" 
ON public.forum_posts FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can manage all replies" 
ON public.forum_replies FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can manage indicator definitions" 
ON public.indicator_definitions FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can manage network security events" 
ON public.network_security_events FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = ANY (ARRAY['super_admin'::user_role, 'admin_pays'::user_role])));

CREATE POLICY "Authenticated admins can view all network security events" 
ON public.network_security_events FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = ANY (ARRAY['super_admin'::user_role, 'admin_pays'::user_role])));

CREATE POLICY "Authenticated admins can update any profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can view all submissions" 
ON public.submissions FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated reviewers can update assigned submissions" 
ON public.submissions FOR UPDATE 
TO authenticated 
USING (auth.uid() = reviewed_by AND is_admin(auth.uid()));

CREATE POLICY "Authenticated reviewers can view assigned submissions" 
ON public.submissions FOR SELECT 
TO authenticated 
USING (auth.uid() = reviewed_by);

CREATE POLICY "Authenticated admins can view sync logs" 
ON public.sync_logs FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can manage indicators" 
ON public.universal_service_indicators FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));

-- 2. Corriger les politiques système pour les restreindre aux utilisateurs authentifiés
DROP POLICY IF EXISTS "System can insert anomaly alerts" ON public.anomaly_alerts;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert network security events" ON public.network_security_events;
DROP POLICY IF EXISTS "System can insert sync logs" ON public.sync_logs;

-- Recréer les politiques système avec des restrictions appropriées
-- Note: Les insertions système peuvent nécessiter des permissions spéciales, 
-- mais nous les limitons aux utilisateurs authentifiés pour la sécurité
CREATE POLICY "Authenticated system can insert anomaly alerts" 
ON public.anomaly_alerts FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated system can insert audit logs" 
ON public.audit_logs FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated system can create notifications" 
ON public.notifications FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated system can insert network security events" 
ON public.network_security_events FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated system can insert sync logs" 
ON public.sync_logs FOR INSERT 
TO authenticated 
WITH CHECK (true);