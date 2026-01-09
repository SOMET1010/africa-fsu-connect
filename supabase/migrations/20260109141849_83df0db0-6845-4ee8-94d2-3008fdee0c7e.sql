-- Fix all remaining overly permissive RLS policies

-- 1. analytics_events - require authentication for inserts
DROP POLICY IF EXISTS "Anyone can create analytics events" ON public.analytics_events;
CREATE POLICY "Authenticated users can create analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 2. anomaly_alerts - require authentication
DROP POLICY IF EXISTS "Authenticated system can insert anomaly alerts" ON public.anomaly_alerts;
CREATE POLICY "Authenticated users can insert anomaly alerts"
  ON public.anomaly_alerts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 3. audit_logs - require authentication
DROP POLICY IF EXISTS "Authenticated system can insert audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated users can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 4. data_versions - require authentication
DROP POLICY IF EXISTS "Authenticated system can insert data versions" ON public.data_versions;
CREATE POLICY "Authenticated users can insert data versions"
  ON public.data_versions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 5. document_validations - require authentication/admin
DROP POLICY IF EXISTS "System can insert document validations" ON public.document_validations;
CREATE POLICY "Admins can insert document validations"
  ON public.document_validations FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- 6. escrow_accounts - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage escrow accounts" ON public.escrow_accounts;

-- 7. escrow_conditions - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage escrow_conditions" ON public.escrow_conditions;

-- 8. financial_kpis - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage kpis" ON public.financial_kpis;

-- 9. fraud_alerts - require authentication
DROP POLICY IF EXISTS "System can insert fraud alerts" ON public.fraud_alerts;
CREATE POLICY "Admins can insert fraud alerts"
  ON public.fraud_alerts FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- 10. fraud_checks - require authentication
DROP POLICY IF EXISTS "System can insert fraud checks" ON public.fraud_checks;
CREATE POLICY "Admins can insert fraud checks"
  ON public.fraud_checks FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- 11. identity_verifications - already have select policy, fix the ALL  
DROP POLICY IF EXISTS "System can manage verifications" ON public.identity_verifications;

-- 12. invoice_line_items - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage invoice_line_items" ON public.invoice_line_items;

-- 13. invoices - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage invoices" ON public.invoices;

-- 14. late_payments - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage late_payments" ON public.late_payments;

-- 15. mobile_money_transactions - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage mobile_money_transactions" ON public.mobile_money_transactions;

-- 16. network_security_events - require authentication
DROP POLICY IF EXISTS "Authenticated system can insert network security events" ON public.network_security_events;
CREATE POLICY "Authenticated users can insert network security events"
  ON public.network_security_events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 17. notifications - require authentication
DROP POLICY IF EXISTS "Authenticated system can create notifications" ON public.notifications;
CREATE POLICY "Authenticated users can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 18. payment_notifications - require authentication
DROP POLICY IF EXISTS "System can manage notifications" ON public.payment_notifications;
CREATE POLICY "Authenticated users can insert payment notifications"
  ON public.payment_notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 19. payment_plans - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage payment_plans" ON public.payment_plans;

-- 20. payment_reminders - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage reminders" ON public.payment_reminders;

-- 21. payment_schedules - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage schedules" ON public.payment_schedules;

-- 22. penalty_calculations - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage penalties" ON public.penalty_calculations;

-- 23. presentation_sessions - require authentication
DROP POLICY IF EXISTS "Anyone can insert presentation sessions" ON public.presentation_sessions;
CREATE POLICY "Authenticated users can insert presentation sessions"
  ON public.presentation_sessions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 24. property_analytics - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage analytics" ON public.property_analytics;

-- 25. qr_code_scans - require authentication
DROP POLICY IF EXISTS "System can insert QR scans" ON public.qr_code_scans;
CREATE POLICY "Authenticated users can insert QR scans"
  ON public.qr_code_scans FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 26. receivables_tracking - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage receivables" ON public.receivables_tracking;

-- 27. refund_calculations - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage refund_calculations" ON public.refund_calculations;

-- 28. subscriptions - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage subscriptions_table" ON public.subscriptions;

-- 29. sync_logs - require authentication
DROP POLICY IF EXISTS "Authenticated system can insert sync logs" ON public.sync_logs;
CREATE POLICY "Authenticated users can insert sync logs"
  ON public.sync_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 30. transaction_fees - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage transaction fees" ON public.transaction_fees;

-- 31. transactions - fix the permissive policies
DROP POLICY IF EXISTS "System can create transactions" ON public.transactions;
DROP POLICY IF EXISTS "System can update transactions" ON public.transactions;

-- 32. user_subscriptions - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage subscriptions" ON public.user_subscriptions;

-- 33. user_verifications - already have select policy, fix the ALL
DROP POLICY IF EXISTS "System can manage user_verifications" ON public.user_verifications;

-- 34. verification_history - require authentication
DROP POLICY IF EXISTS "System can insert verification history" ON public.verification_history;
CREATE POLICY "Authenticated users can insert verification history"
  ON public.verification_history FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);