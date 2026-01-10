-- =====================================================
-- MIGRATION DE SÉCURITÉ - CORRECTIONS FINALES
-- Utilisation des bons noms de colonnes
-- =====================================================

-- RENTAL_APPLICATIONS - user_id correct = applicant_user_id
DROP POLICY IF EXISTS "Applicants can view their own applications" ON public.rental_applications;
DROP POLICY IF EXISTS "Applicants can create applications" ON public.rental_applications;
DROP POLICY IF EXISTS "Applicants can update their own applications" ON public.rental_applications;

CREATE POLICY "Applicants can view their own applications"
ON public.rental_applications FOR SELECT
TO authenticated
USING (applicant_user_id = auth.uid());

CREATE POLICY "Applicants can create applications"
ON public.rental_applications FOR INSERT
TO authenticated
WITH CHECK (applicant_user_id = auth.uid());

CREATE POLICY "Applicants can update their own applications"
ON public.rental_applications FOR UPDATE
TO authenticated
USING (applicant_user_id = auth.uid());

-- APPLICATION_DOCUMENTS avec bonne référence
DROP POLICY IF EXISTS "Users can view their own app documents" ON public.application_documents;
DROP POLICY IF EXISTS "Users can upload their own app documents" ON public.application_documents;

CREATE POLICY "Users can view their own app documents"
ON public.application_documents FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.rental_applications ra
    WHERE ra.id = application_id AND ra.applicant_user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload their own app documents"
ON public.application_documents FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.rental_applications ra
    WHERE ra.id = application_id AND ra.applicant_user_id = auth.uid()
  )
);

-- INVOICES - déjà OK avec tenant_id et landlord_id
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Landlords can create invoices" ON public.invoices;
DROP POLICY IF EXISTS "Landlords can update their invoices" ON public.invoices;

CREATE POLICY "Users can view their own invoices"
ON public.invoices FOR SELECT
TO authenticated
USING (tenant_id = auth.uid() OR landlord_id = auth.uid());

CREATE POLICY "Landlords can create invoices"
ON public.invoices FOR INSERT
TO authenticated
WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Landlords can update their invoices"
ON public.invoices FOR UPDATE
TO authenticated
USING (landlord_id = auth.uid());

-- LEASES - OK avec tenant_id et landlord_id
DROP POLICY IF EXISTS "Parties can view their leases" ON public.leases;
DROP POLICY IF EXISTS "Landlords can manage leases" ON public.leases;

CREATE POLICY "Parties can view their leases"
ON public.leases FOR SELECT
TO authenticated
USING (tenant_id = auth.uid() OR landlord_id = auth.uid());

CREATE POLICY "Landlords can manage leases"
ON public.leases FOR ALL
TO authenticated
USING (landlord_id = auth.uid())
WITH CHECK (landlord_id = auth.uid());

-- LATE_PAYMENTS - tenant_id seulement (pas de landlord_id)
DROP POLICY IF EXISTS "Parties can view their late payments" ON public.late_payments;
DROP POLICY IF EXISTS "Admins can manage late payments" ON public.late_payments;

CREATE POLICY "Tenants can view their late payments"
ON public.late_payments FOR SELECT
TO authenticated
USING (tenant_id = auth.uid());

CREATE POLICY "Admins can manage late payments"
ON public.late_payments FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));