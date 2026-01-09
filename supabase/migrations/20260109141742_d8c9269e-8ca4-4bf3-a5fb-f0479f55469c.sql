-- Fix remaining overly permissive RLS policies with correct column names

-- 12. payments (has tenant_id only, not landlord_id)
DROP POLICY IF EXISTS "System can manage payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = tenant_id OR is_admin(auth.uid()));
CREATE POLICY "Users can create payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = tenant_id OR is_admin(auth.uid()));
CREATE POLICY "Admins can manage payments"
  ON public.payments FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- 14. presentation_sessions (no presenter_id, only session_id)
DROP POLICY IF EXISTS "Users can update their own sessions" ON public.presentation_sessions;
CREATE POLICY "Authenticated users can update sessions"
  ON public.presentation_sessions FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- 17. referrals (has referrer_id, referred_user_id instead of referred_id)
DROP POLICY IF EXISTS "System can manage referrals" ON public.referrals;
DROP POLICY IF EXISTS "Users can view own referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admins can manage referrals" ON public.referrals;
CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id OR is_admin(auth.uid()));
CREATE POLICY "Users can create referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (auth.uid() = referrer_id OR is_admin(auth.uid()));
CREATE POLICY "Admins can manage referrals"
  ON public.referrals FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));