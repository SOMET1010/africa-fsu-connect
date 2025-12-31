-- Phase 5D: Activation RLS - Migration finale corrigée
-- Toutes les tables restantes sans RLS

-- agency_members
ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own agency_members" ON public.agency_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage agency_members" ON public.agency_members FOR ALL USING (public.is_admin(auth.uid()));

-- collection_actions
ALTER TABLE public.collection_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage collection_actions" ON public.collection_actions FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Performers can view own actions" ON public.collection_actions FOR SELECT USING (auth.uid() = performed_by);

-- commission_rates
ALTER TABLE public.commission_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view commission_rates" ON public.commission_rates FOR SELECT USING (true);
CREATE POLICY "Admins can manage commission_rates" ON public.commission_rates FOR ALL USING (public.is_admin(auth.uid()));

-- escrow_conditions
ALTER TABLE public.escrow_conditions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties can view escrow_conditions" ON public.escrow_conditions FOR SELECT 
  USING (escrow_account_id IN (SELECT id FROM public.escrow_accounts WHERE tenant_id = auth.uid() OR landlord_id = auth.uid()));
CREATE POLICY "System can manage escrow_conditions" ON public.escrow_conditions FOR ALL USING (true);

-- favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- financial_kpis
ALTER TABLE public.financial_kpis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landlords can view own kpis" ON public.financial_kpis FOR SELECT USING (auth.uid() = landlord_id);
CREATE POLICY "System can manage kpis" ON public.financial_kpis FOR ALL USING (true);

-- financial_reports
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own financial_reports" ON public.financial_reports FOR SELECT USING (auth.uid() = generated_for_user);
CREATE POLICY "Admins can manage financial_reports" ON public.financial_reports FOR ALL USING (public.is_admin(auth.uid()));

-- identity_verifications
ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own verifications" ON public.identity_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage verifications" ON public.identity_verifications FOR ALL USING (true);

-- intouch_simulation_logs
ALTER TABLE public.intouch_simulation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage intouch_simulation_logs" ON public.intouch_simulation_logs FOR ALL USING (public.is_admin(auth.uid()));

-- invoice_line_items
ALTER TABLE public.invoice_line_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view invoice_line_items" ON public.invoice_line_items FOR SELECT 
  USING (invoice_id IN (SELECT id FROM public.invoices WHERE tenant_id = auth.uid() OR landlord_id = auth.uid()));
CREATE POLICY "System can manage invoice_line_items" ON public.invoice_line_items FOR ALL USING (true);

-- invoice_templates
ALTER TABLE public.invoice_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view invoice_templates" ON public.invoice_templates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Creators can manage own templates" ON public.invoice_templates FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Admins can manage all templates" ON public.invoice_templates FOR ALL USING (public.is_admin(auth.uid()));

-- invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants can view own invoices" ON public.invoices FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "Landlords can view own invoices" ON public.invoices FOR SELECT USING (auth.uid() = landlord_id);
CREATE POLICY "Landlords can manage invoices" ON public.invoices FOR ALL USING (auth.uid() = landlord_id);
CREATE POLICY "System can manage invoices" ON public.invoices FOR ALL USING (true);

-- late_payments
ALTER TABLE public.late_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants can view own late_payments" ON public.late_payments FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "System can manage late_payments" ON public.late_payments FOR ALL USING (true);

-- leases
ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants can view own leases" ON public.leases FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "Landlords can view own leases" ON public.leases FOR SELECT USING (auth.uid() = landlord_id);
CREATE POLICY "Landlords can manage leases" ON public.leases FOR ALL USING (auth.uid() = landlord_id) WITH CHECK (auth.uid() = landlord_id);
CREATE POLICY "Admins can manage all leases" ON public.leases FOR ALL USING (public.is_admin(auth.uid()));

-- messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own sent messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id);

-- mobile_money_transactions
ALTER TABLE public.mobile_money_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own mobile_money_transactions" ON public.mobile_money_transactions FOR SELECT 
  USING (payment_id IN (SELECT id FROM public.payments WHERE tenant_id = auth.uid()));
CREATE POLICY "System can manage mobile_money_transactions" ON public.mobile_money_transactions FOR ALL USING (true);

-- payment_disputes
ALTER TABLE public.payment_disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own disputes" ON public.payment_disputes FOR SELECT USING (auth.uid() = initiated_by);
CREATE POLICY "Users can create disputes" ON public.payment_disputes FOR INSERT WITH CHECK (auth.uid() = initiated_by);
CREATE POLICY "Admins can manage all disputes" ON public.payment_disputes FOR ALL USING (public.is_admin(auth.uid()));

-- payment_notifications
ALTER TABLE public.payment_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.payment_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage notifications" ON public.payment_notifications FOR INSERT WITH CHECK (true);

-- payment_plans
ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants can view own payment_plans" ON public.payment_plans FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "System can manage payment_plans" ON public.payment_plans FOR ALL USING (true);

-- payment_reminders
ALTER TABLE public.payment_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants can view own reminders" ON public.payment_reminders FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "System can manage reminders" ON public.payment_reminders FOR ALL USING (true);

-- payment_schedules
ALTER TABLE public.payment_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants can view own schedules" ON public.payment_schedules FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "Landlords can view schedules" ON public.payment_schedules FOR SELECT USING (auth.uid() = landlord_id);
CREATE POLICY "System can manage schedules" ON public.payment_schedules FOR ALL USING (true);

-- payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants can view own payments" ON public.payments FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "System can manage payments" ON public.payments FOR ALL USING (true);

-- penalty_calculations
ALTER TABLE public.penalty_calculations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view related penalties" ON public.penalty_calculations FOR SELECT 
  USING (late_payment_id IN (SELECT id FROM public.late_payments WHERE tenant_id = auth.uid()));
CREATE POLICY "System can manage penalties" ON public.penalty_calculations FOR ALL USING (true);

-- plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view plans" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage plans" ON public.plans FOR ALL USING (public.is_admin(auth.uid()));

-- properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active properties" ON public.properties FOR SELECT USING (status = 'available' OR owner_id = auth.uid());
CREATE POLICY "Owners can manage own properties" ON public.properties FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins can manage all properties" ON public.properties FOR ALL USING (public.is_admin(auth.uid()));

-- property_analytics
ALTER TABLE public.property_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own analytics" ON public.property_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage analytics" ON public.property_analytics FOR ALL USING (true);

-- property_filters
ALTER TABLE public.property_filters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own filters" ON public.property_filters FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- property_images
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view property_images" ON public.property_images FOR SELECT USING (true);
CREATE POLICY "Owners can manage property_images" ON public.property_images FOR ALL 
  USING (property_id IN (SELECT id FROM public.properties WHERE owner_id = auth.uid()));

-- property_visits
ALTER TABLE public.property_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own visits" ON public.property_visits FOR SELECT USING (auth.uid() = visitor_id);
CREATE POLICY "Owners can view property visits" ON public.property_visits FOR SELECT 
  USING (property_id IN (SELECT id FROM public.properties WHERE owner_id = auth.uid()));
CREATE POLICY "Users can create visits" ON public.property_visits FOR INSERT WITH CHECK (auth.uid() = visitor_id);

-- receivables_tracking
ALTER TABLE public.receivables_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants can view own receivables" ON public.receivables_tracking FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "System can manage receivables" ON public.receivables_tracking FOR ALL USING (true);

-- referral_codes
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own referral_codes" ON public.referral_codes FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Users can create own referral_codes" ON public.referral_codes FOR INSERT WITH CHECK (auth.uid() = referrer_id);
CREATE POLICY "Admins can manage all referral_codes" ON public.referral_codes FOR ALL USING (public.is_admin(auth.uid()));

-- referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);
CREATE POLICY "System can manage referrals" ON public.referrals FOR ALL USING (true);

-- refund_calculations
ALTER TABLE public.refund_calculations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own refund_calculations" ON public.refund_calculations FOR SELECT 
  USING (refund_request_id IN (SELECT id FROM public.refund_requests WHERE user_id = auth.uid()));
CREATE POLICY "System can manage refund_calculations" ON public.refund_calculations FOR ALL USING (true);

-- reminder_templates
ALTER TABLE public.reminder_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage reminder_templates" ON public.reminder_templates FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Authenticated can view reminder_templates" ON public.reminder_templates FOR SELECT USING (auth.role() = 'authenticated');

-- revenue_analytics
ALTER TABLE public.revenue_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage revenue_analytics" ON public.revenue_analytics FOR ALL USING (public.is_admin(auth.uid()));

-- service_categories
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view service_categories" ON public.service_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage service_categories" ON public.service_categories FOR ALL USING (public.is_admin(auth.uid()));

-- service_orders
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.service_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.service_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all orders" ON public.service_orders FOR ALL USING (public.is_admin(auth.uid()));

-- service_revenue
ALTER TABLE public.service_revenue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage service_revenue" ON public.service_revenue FOR ALL USING (public.is_admin(auth.uid()));

-- subscription_invoices (admin only car subscription.id est integer)
ALTER TABLE public.subscription_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage subscription_invoices" ON public.subscription_invoices FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Authenticated can view subscription_invoices" ON public.subscription_invoices FOR SELECT USING (auth.role() = 'authenticated');

-- subscription_plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view subscription_plans" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage subscription_plans" ON public.subscription_plans FOR ALL USING (public.is_admin(auth.uid()));

-- subscription_plans_detailed
ALTER TABLE public.subscription_plans_detailed ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view subscription_plans_detailed" ON public.subscription_plans_detailed FOR SELECT USING (true);
CREATE POLICY "Admins can manage subscription_plans_detailed" ON public.subscription_plans_detailed FOR ALL USING (public.is_admin(auth.uid()));

-- subscription_revenue
ALTER TABLE public.subscription_revenue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage subscription_revenue" ON public.subscription_revenue FOR ALL USING (public.is_admin(auth.uid()));

-- subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions_table" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage subscriptions_table" ON public.subscriptions FOR ALL USING (true);

-- system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage system_settings" ON public.system_settings FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Authenticated can view system_settings" ON public.system_settings FOR SELECT USING (auth.role() = 'authenticated');

-- transaction_commissions
ALTER TABLE public.transaction_commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own commissions" ON public.transaction_commissions FOR SELECT USING (auth.uid() = landlord_id OR auth.uid() = tenant_id);
CREATE POLICY "Admins can manage transaction_commissions" ON public.transaction_commissions FOR ALL USING (public.is_admin(auth.uid()));

-- user_dashboard_preferences
ALTER TABLE public.user_dashboard_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own preferences" ON public.user_dashboard_preferences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- user_subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage subscriptions" ON public.user_subscriptions FOR ALL USING (true);

-- user_verifications
ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own user_verifications" ON public.user_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage user_verifications" ON public.user_verifications FOR ALL USING (true);

-- value_added_services
ALTER TABLE public.value_added_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view value_added_services" ON public.value_added_services FOR SELECT USING (true);
CREATE POLICY "Admins can manage value_added_services" ON public.value_added_services FOR ALL USING (public.is_admin(auth.uid()));