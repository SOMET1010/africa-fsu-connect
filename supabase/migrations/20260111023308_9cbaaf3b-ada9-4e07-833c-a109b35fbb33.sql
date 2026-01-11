-- =====================================================
-- MIGRATION DE SÉCURITÉ - PHASE 2 (Suite corrigée)
-- Avec les bons noms de colonnes
-- =====================================================

-- PAYMENTS - tenant_id uniquement (pas de landlord_id)
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create payments" ON public.payments;

CREATE POLICY "Users can view own payments"
ON public.payments FOR SELECT
TO authenticated
USING (tenant_id = auth.uid());

CREATE POLICY "Users can create payments"
ON public.payments FOR INSERT
TO authenticated
WITH CHECK (tenant_id = auth.uid());

-- ESCROW_ACCOUNTS - tenant_id et landlord_id existent
DROP POLICY IF EXISTS "Parties can view escrow" ON public.escrow_accounts;

CREATE POLICY "Parties can view escrow"
ON public.escrow_accounts FOR SELECT
TO authenticated
USING (tenant_id = auth.uid() OR landlord_id = auth.uid());

-- RENTAL_CONTRACTS - tenant_id et landlord_id existent
DROP POLICY IF EXISTS "Parties can view contracts" ON public.rental_contracts;
DROP POLICY IF EXISTS "Landlords can manage contracts" ON public.rental_contracts;

CREATE POLICY "Parties can view contracts"
ON public.rental_contracts FOR SELECT
TO authenticated
USING (tenant_id = auth.uid() OR landlord_id = auth.uid());

CREATE POLICY "Landlords can manage contracts"
ON public.rental_contracts FOR ALL
TO authenticated
USING (landlord_id = auth.uid())
WITH CHECK (landlord_id = auth.uid());

-- IDENTITY_VERIFICATIONS
DROP POLICY IF EXISTS "Users can view own verifications" ON public.identity_verifications;
DROP POLICY IF EXISTS "Admins can manage verifications" ON public.identity_verifications;

CREATE POLICY "Users can view own verifications"
ON public.identity_verifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage verifications"
ON public.identity_verifications FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- ANOMALY_ALERTS
DROP POLICY IF EXISTS "Users can view own alerts" ON public.anomaly_alerts;
DROP POLICY IF EXISTS "Admins can manage alerts" ON public.anomaly_alerts;

CREATE POLICY "Users can view own alerts"
ON public.anomaly_alerts FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage alerts"
ON public.anomaly_alerts FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- NETWORK_SECURITY_EVENTS
DROP POLICY IF EXISTS "Admins only network events" ON public.network_security_events;

CREATE POLICY "Admins only network events"
ON public.network_security_events FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));