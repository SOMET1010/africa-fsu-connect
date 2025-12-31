
-- Phase 3: Sécurisation des fonctions Supabase - Ajout de SET search_path TO ''
-- Cette migration corrige 18 fonctions vulnérables aux attaques par injection SQL

-- 1. check_uat_admin - Correction search_path
CREATE OR REPLACE FUNCTION public.check_uat_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.uat_participants
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'moderator')
  );
$function$;

-- 2. release_escrow_funds - Fonction financière critique
CREATE OR REPLACE FUNCTION public.release_escrow_funds(escrow_account_id uuid, release_amount numeric, release_reason text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    escrow_rec record;
    transaction_id UUID;
BEGIN
    SELECT * INTO escrow_rec
    FROM public.escrow_accounts
    WHERE id = escrow_account_id AND status = 'active';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Compte escrow non trouvé ou inactif';
    END IF;

    IF release_amount > escrow_rec.amount THEN
        RAISE EXCEPTION 'Montant de libération supérieur au solde escrow';
    END IF;

    INSERT INTO public.transactions (
        transaction_ref,
        user_id,
        transaction_type,
        amount,
        currency,
        status,
        description,
        metadata
    ) VALUES (
        'ESC_' || extract(epoch from now()) || '_' || substring(gen_random_uuid()::text, 1, 8),
        escrow_rec.landlord_id,
        'escrow_release',
        release_amount,
        escrow_rec.currency,
        'completed',
        'Libération de fonds d''escrow: ' || release_reason,
        jsonb_build_object(
            'escrow_account_id', escrow_account_id,
            'tenant_id', escrow_rec.tenant_id,
            'release_reason', release_reason
        )
    ) RETURNING id INTO transaction_id;

    UPDATE public.escrow_accounts
    SET 
        amount = amount - release_amount,
        status = CASE 
            WHEN amount - release_amount <= 0 THEN 'released'
            ELSE 'partially_released'
        END,
        actual_release_date = CASE 
            WHEN amount - release_amount <= 0 THEN NOW()
            ELSE actual_release_date
        END,
        updated_at = NOW()
    WHERE id = escrow_account_id;

    RETURN TRUE;
END;
$function$;

-- 3. get_user_role() sans paramètre
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role 
    FROM public.profiles 
    WHERE id = auth.uid();
    RETURN COALESCE(user_role, 'user');
END;
$function$;

-- 4. calculate_rental_income
CREATE OR REPLACE FUNCTION public.calculate_rental_income(user_id uuid, start_date date, end_date date)
RETURNS TABLE(total_income numeric, payment_count integer)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
    SELECT 
        COALESCE(SUM(rc.monthly_rent), 0) as total_income,
        COUNT(*)::INTEGER as payment_count
    FROM public.rental_contracts rc
    WHERE rc.landlord_id = user_id
        AND rc.start_date <= end_date
        AND rc.end_date >= start_date
        AND rc.status = 'active';
$function$;

-- 5. get_property_stats
CREATE OR REPLACE FUNCTION public.get_property_stats(owner_user_id uuid)
RETURNS TABLE(total_properties integer, occupied_properties integer, vacant_properties integer, occupancy_rate numeric)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
    SELECT 
        COUNT(*)::INTEGER as total_properties,
        COUNT(CASE WHEN status = 'occupied' THEN 1 END)::INTEGER as occupied_properties,
        COUNT(CASE WHEN status = 'available' THEN 1 END)::INTEGER as vacant_properties,
        CASE 
            WHEN COUNT(*) > 0 THEN ROUND((COUNT(CASE WHEN status = 'occupied' THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2)
            ELSE 0
        END as occupancy_rate
    FROM public.properties
    WHERE owner_id = owner_user_id;
$function$;

-- 6. get_maintenance_metrics
CREATE OR REPLACE FUNCTION public.get_maintenance_metrics(owner_user_id uuid, start_date date, end_date date)
RETURNS TABLE(total_requests integer, total_cost numeric, avg_resolution_time numeric, completed_requests integer, pending_requests integer, in_progress_requests integer)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
    SELECT 
        COUNT(*)::INTEGER as total_requests,
        COALESCE(SUM(cost_estimate), 0) as total_cost,
        COALESCE(AVG(EXTRACT(days FROM (updated_at - created_at))), 0) as avg_resolution_time,
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::INTEGER as completed_requests,
        COUNT(CASE WHEN status = 'pending' THEN 1 END)::INTEGER as pending_requests,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END)::INTEGER as in_progress_requests
    FROM public.maintenance_requests
    WHERE owner_id = owner_user_id
        AND created_at >= start_date::TIMESTAMP
        AND created_at <= end_date::TIMESTAMP + INTERVAL '1 day';
$function$;

-- 7. get_tenant_payment_stats
CREATE OR REPLACE FUNCTION public.get_tenant_payment_stats(tenant_user_id uuid, start_date date, end_date date)
RETURNS TABLE(total_payments integer, total_amount numeric, paid_on_time integer, late_payments integer, pending_payments integer)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
    SELECT 
        COUNT(*)::INTEGER as total_payments,
        COALESCE(SUM(amount), 0) as total_amount,
        COUNT(CASE WHEN status = 'completed' AND payment_date <= due_date::TIMESTAMP THEN 1 END)::INTEGER as paid_on_time,
        COUNT(CASE WHEN status = 'completed' AND payment_date > due_date::TIMESTAMP THEN 1 END)::INTEGER as late_payments,
        COUNT(CASE WHEN status = 'pending' THEN 1 END)::INTEGER as pending_payments
    FROM public.payments p
    WHERE p.tenant_id = tenant_user_id
        AND p.payment_date >= start_date::TIMESTAMP
        AND p.payment_date <= end_date::TIMESTAMP + INTERVAL '1 day';
$function$;

-- 8. get_account_balance
CREATE OR REPLACE FUNCTION public.get_account_balance(account_user_id uuid, account_type_filter character varying DEFAULT NULL::character varying)
RETURNS TABLE(account_id uuid, account_type character varying, balance numeric, currency character varying)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
    SELECT 
        id as account_id,
        account_type,
        balance,
        currency
    FROM public.payment_accounts
    WHERE user_id = account_user_id
    AND is_active = TRUE
    AND (account_type_filter IS NULL OR account_type = account_type_filter);
$function$;

-- 9. get_user_transaction_stats
CREATE OR REPLACE FUNCTION public.get_user_transaction_stats(target_user_id uuid, start_date date DEFAULT NULL::date, end_date date DEFAULT NULL::date)
RETURNS TABLE(total_transactions integer, total_amount numeric, successful_amount numeric, failed_transactions integer, pending_transactions integer, avg_transaction_amount numeric)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
    SELECT 
        COUNT(*)::INTEGER as total_transactions,
        COALESCE(SUM(amount), 0) as total_amount,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as successful_amount,
        COUNT(CASE WHEN status = 'failed' THEN 1 END)::INTEGER as failed_transactions,
        COUNT(CASE WHEN status = 'pending' THEN 1 END)::INTEGER as pending_transactions,
        COALESCE(AVG(CASE WHEN status = 'completed' THEN amount END), 0) as avg_transaction_amount
    FROM public.transactions
    WHERE user_id = target_user_id
    AND (start_date IS NULL OR created_at >= start_date::TIMESTAMP)
    AND (end_date IS NULL OR created_at <= end_date::TIMESTAMP + INTERVAL '1 day');
$function$;

-- 10. get_overdue_recurring_payments
CREATE OR REPLACE FUNCTION public.get_overdue_recurring_payments()
RETURNS TABLE(payment_id uuid, user_id uuid, contract_id uuid, amount numeric, currency character varying, days_overdue integer, failed_attempts integer)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
    SELECT 
        id as payment_id,
        user_id,
        contract_id,
        amount,
        currency,
        (CURRENT_DATE - next_payment_date)::INTEGER as days_overdue,
        failed_attempts
    FROM public.recurring_payments
    WHERE status = 'active'
    AND next_payment_date < CURRENT_DATE
    AND failed_attempts < max_failed_attempts;
$function$;

-- 11. get_user_escrow_history
CREATE OR REPLACE FUNCTION public.get_user_escrow_history(target_user_id uuid, user_role character varying)
RETURNS TABLE(escrow_id uuid, escrow_type character varying, amount numeric, currency character varying, status character varying, other_party_id uuid, created_at timestamp with time zone, release_date date)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
    SELECT 
        id as escrow_id,
        escrow_type,
        amount,
        currency,
        status,
        CASE 
            WHEN user_role = 'tenant' THEN landlord_id
            ELSE tenant_id
        END as other_party_id,
        created_at,
        release_date
    FROM public.escrow_accounts
    WHERE (
        (user_role = 'tenant' AND tenant_id = target_user_id) OR
        (user_role = 'landlord' AND landlord_id = target_user_id)
    )
    ORDER BY created_at DESC;
$function$;

-- 12. calculate_pending_refunds
CREATE OR REPLACE FUNCTION public.calculate_pending_refunds()
RETURNS TABLE(refund_id uuid, user_id uuid, amount numeric, currency character varying, days_pending integer, priority_score integer)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
    SELECT 
        id as refund_id,
        user_id,
        approved_amount as amount,
        currency,
        (CURRENT_DATE - requested_at::DATE)::INTEGER as days_pending,
        (
            (CURRENT_DATE - requested_at::DATE)::INTEGER * 10 +
            CASE 
                WHEN approved_amount > 500000 THEN 50
                WHEN approved_amount > 100000 THEN 25
                ELSE 10
            END
        ) as priority_score
    FROM public.refund_requests
    WHERE status = 'approved'
    AND processed_at IS NULL
    ORDER BY priority_score DESC;
$function$;

-- 13. calculate_transaction_fees
CREATE OR REPLACE FUNCTION public.calculate_transaction_fees(transaction_amount numeric, payment_method_type character varying, transaction_type_param character varying)
RETURNS TABLE(platform_fee numeric, processing_fee numeric, total_fees numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    platform_rate DECIMAL := 0.025;
    processing_rate DECIMAL;
    min_processing_fee DECIMAL := 500;
    max_processing_fee DECIMAL := 5000;
BEGIN
    CASE payment_method_type
        WHEN 'orange_money' THEN processing_rate := 0.015;
        WHEN 'mtn_money' THEN processing_rate := 0.015;
        WHEN 'moov_money' THEN processing_rate := 0.015;
        WHEN 'card' THEN processing_rate := 0.035;
        WHEN 'bank_transfer' THEN processing_rate := 0.01;
        ELSE processing_rate := 0.02;
    END CASE;

    platform_fee := ROUND(transaction_amount * platform_rate, 0);
    processing_fee := GREATEST(
        min_processing_fee,
        LEAST(max_processing_fee, ROUND(transaction_amount * processing_rate, 0))
    );
    
    total_fees := platform_fee + processing_fee;

    RETURN QUERY SELECT platform_fee, processing_fee, total_fees;
END;
$function$;

-- 14. get_user_balance
CREATE OR REPLACE FUNCTION public.get_user_balance(user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    balance DECIMAL := 0;
BEGIN
    SELECT COALESCE(SUM(
        CASE 
            WHEN t.transaction_type IN ('rent_received', 'deposit_received', 'refund_received') 
            THEN t.amount
            ELSE -t.amount
        END
    ), 0) INTO balance
    FROM public.transactions t
    WHERE (t.user_id = $1 OR t.to_account_id IN (
        SELECT id FROM public.payment_accounts WHERE payment_accounts.user_id = $1
    ))
    AND t.status = 'completed';

    RETURN balance;
END;
$function$;

-- 15. get_financial_summary
CREATE OR REPLACE FUNCTION public.get_financial_summary(user_id uuid)
RETURNS TABLE(balance numeric, total_income numeric, total_expenses numeric, pending_transactions integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        public.get_user_balance($1) as balance,
        COALESCE(SUM(
            CASE 
                WHEN t.transaction_type IN ('rent_received', 'deposit_received', 'refund_received') 
                AND t.status = 'completed'
                THEN t.amount
                ELSE 0
            END
        ), 0) as total_income,
        COALESCE(SUM(
            CASE 
                WHEN t.transaction_type IN ('rent_payment', 'deposit_payment', 'fee_payment') 
                AND t.status = 'completed'
                THEN t.amount
                ELSE 0
            END
        ), 0) as total_expenses,
        COUNT(
            CASE 
                WHEN t.status IN ('pending', 'processing') 
                THEN 1
                ELSE NULL
            END
        )::INTEGER as pending_transactions
    FROM public.transactions t
    WHERE t.user_id = $1;
END;
$function$;

-- 16. create_payment_schedule
CREATE OR REPLACE FUNCTION public.create_payment_schedule(recurring_payment_id uuid, months_ahead integer DEFAULT 12)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    rec_payment record;
    schedule_date DATE;
    schedule_count INTEGER := 0;
BEGIN
    SELECT * INTO rec_payment
    FROM public.recurring_payments
    WHERE id = recurring_payment_id AND status = 'active';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Paiement récurrent non trouvé ou inactif';
    END IF;

    FOR i IN 0..months_ahead-1 LOOP
        schedule_date := rec_payment.next_payment_date + (i || ' months')::INTERVAL;
        
        IF NOT EXISTS (
            SELECT 1 FROM public.payment_schedules 
            WHERE payment_schedules.recurring_payment_id = rec_payment.id 
            AND due_date = schedule_date
        ) THEN
            INSERT INTO public.payment_schedules (
                recurring_payment_id,
                tenant_id,
                amount,
                currency,
                due_date,
                status
            ) VALUES (
                rec_payment.id,
                rec_payment.user_id,
                rec_payment.amount,
                rec_payment.currency,
                schedule_date,
                'pending'
            );
            
            schedule_count := schedule_count + 1;
        END IF;
    END LOOP;

    RETURN schedule_count;
END;
$function$;

-- 17. process_overdue_payments
CREATE OR REPLACE FUNCTION public.process_overdue_payments()
RETURNS TABLE(processed_count integer, late_fees_applied numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    total_processed INTEGER := 0;
    total_late_fees DECIMAL := 0;
    late_fee_rate DECIMAL := 0.05;
    min_late_fee DECIMAL := 1000;
BEGIN
    UPDATE public.payment_schedules
    SET 
        status = 'overdue',
        late_fee = GREATEST(min_late_fee, amount * late_fee_rate),
        updated_at = NOW()
    WHERE due_date < CURRENT_DATE
    AND status = 'pending';

    GET DIAGNOSTICS total_processed = ROW_COUNT;

    SELECT COALESCE(SUM(late_fee), 0) INTO total_late_fees
    FROM public.payment_schedules
    WHERE status = 'overdue'
    AND updated_at::DATE = CURRENT_DATE;

    RETURN QUERY SELECT total_processed, total_late_fees;
END;
$function$;

-- 18. update_user_profiles_updated_at (trigger function)
CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;
