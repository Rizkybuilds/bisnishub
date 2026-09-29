-- Migration: 20260924050000_atomic_leads_and_customers.sql
-- Description: Atomic Lead State Transitions, Lead Conversion, and Customer Creation Procedures
-- Specification: MGBOS 0.3 Business State Machines & Hardened Role & Transition Guards (P1 & P2 Remediation)

-- 1. Atomic Lead State Transition Procedure
create or replace function app.transition_lead_status(
    p_organization_id uuid,
    p_lead_id uuid,
    p_target_status text,
    p_qualification_result text default null,
    p_qualification_score integer default null,
    p_qualification_notes text default null,
    p_disqualification_reason text default null,
    p_lost_reason text default null,
    p_assigned_user_id uuid default null,
    p_actor_id uuid default null
) returns app.leads
language plpgsql
security definer
set search_path = app, public
as $$
declare
    v_lead app.leads%rowtype;
    v_target_status text := upper(trim(p_target_status));
    v_actor_role text;
begin
    -- 0. Actor authority check if actor is provided
    if p_actor_id is not null then
        select r.code into v_actor_role
        from app.organization_members om
        join app.roles r on om.role_id = r.id
        where om.user_id = p_actor_id and om.organization_id = p_organization_id and om.status = 'ACTIVE';

        if v_actor_role is null then
            raise exception 'Actor % does not have active membership in organization %', p_actor_id, p_organization_id;
        end if;

        if v_actor_role not in ('OWNER', 'ADMIN', 'SALES') then
            raise exception 'Unauthorized: role % cannot transition lead status', v_actor_role;
        end if;
    end if;

    -- 1. Lock lead row FOR UPDATE to serialize concurrent mutations
    select * into v_lead
    from app.leads
    where id = p_lead_id and organization_id = p_organization_id
    for update;

    if not found then
        raise exception 'Lead not found or access denied';
    end if;

    -- Idempotency: if already in target status, return existing record
    if v_lead.status = v_target_status then
        return v_lead;
    end if;

    -- Terminal state check: CONVERTED leads cannot transition
    if v_lead.status = 'CONVERTED' then
        raise exception 'Cannot transition lead: lead is already CONVERTED (terminal state)';
    end if;

    -- Direct transition to CONVERTED via transition_lead_status is strictly prohibited!
    -- CONVERTED state must ONLY be established by app.convert_lead_to_customer which atomically
    -- provisions customer accounts, contacts, and brand relationships.
    if v_target_status = 'CONVERTED' then
        raise exception 'Cannot transition lead directly to CONVERTED; conversion must be performed through app.convert_lead_to_customer';
    end if;

    -- State machine guards per MGBOS 0.3 Business State Machines:
    -- NEW -> CONTACTED, QUALIFYING, QUALIFIED, DISQUALIFIED, LOST
    -- CONTACTED -> QUALIFYING, QUALIFIED, DISQUALIFIED, LOST
    -- QUALIFYING -> QUALIFIED, DISQUALIFIED, LOST
    -- QUALIFIED -> QUALIFYING (re-eval), LOST
    -- DISQUALIFIED -> QUALIFYING (re-evaluation)
    -- LOST -> QUALIFYING (revival)
    if v_lead.status = 'NEW' and v_target_status not in ('CONTACTED', 'QUALIFYING', 'QUALIFIED', 'DISQUALIFIED', 'LOST') then
        raise exception 'Invalid transition from NEW to %', v_target_status;
    elsif v_lead.status = 'CONTACTED' and v_target_status not in ('QUALIFYING', 'QUALIFIED', 'DISQUALIFIED', 'LOST') then
        raise exception 'Invalid transition from CONTACTED to %', v_target_status;
    elsif v_lead.status = 'QUALIFYING' and v_target_status not in ('QUALIFIED', 'DISQUALIFIED', 'LOST') then
        raise exception 'Invalid transition from QUALIFYING to %', v_target_status;
    elsif v_lead.status = 'QUALIFIED' and v_target_status not in ('QUALIFYING', 'LOST') then
        raise exception 'Invalid transition from QUALIFIED to %; use convert_lead_to_customer to convert', v_target_status;
    elsif v_lead.status in ('DISQUALIFIED', 'LOST') and v_target_status not in ('QUALIFYING', 'QUALIFIED') then
        raise exception 'Cannot transition % lead directly to %; must re-qualify first', v_lead.status, v_target_status;
    end if;

    -- Completeness guard for QUALIFIED status (Qualification Rule v1)
    if v_target_status = 'QUALIFIED' then
        if coalesce(trim(v_lead.phone), '') = '' and coalesce(trim(v_lead.email), '') = '' then
            raise exception 'Cannot qualify lead: valid contact method (phone or email) is required';
        end if;
        if coalesce(trim(v_lead.raw_inquiry), '') = '' and coalesce(trim(v_lead.title), '') = '' then
            raise exception 'Cannot qualify lead: inquiry or requirement summary cannot be empty';
        end if;
        if v_lead.estimated_quantity is not null and v_lead.estimated_quantity <= 0 then
            raise exception 'Cannot qualify lead: estimated quantity must be greater than zero';
        end if;
    end if;

    -- Disqualification reason guard
    if v_target_status = 'DISQUALIFIED' and (p_disqualification_reason is null or trim(p_disqualification_reason) = '') then
        raise exception 'Cannot disqualify lead: structured disqualification reason is required';
    end if;

    -- Update lead atomically
    update app.leads
    set
        status = v_target_status,
        qualification_result = case 
            when v_target_status = 'QUALIFIED' then 'QUALIFIED'
            when v_target_status = 'DISQUALIFIED' then 'DISQUALIFIED'
            else qualification_result
        end,
        qualification_score = coalesce(p_qualification_score, qualification_score),
        qualification_notes = coalesce(p_qualification_notes, qualification_notes),
        disqualification_reason = case 
            when v_target_status = 'DISQUALIFIED' then p_disqualification_reason
            else disqualification_reason
        end,
        contacted_at = case when v_target_status = 'CONTACTED' and contacted_at is null then now() else contacted_at end,
        qualified_at = case when v_target_status = 'QUALIFIED' then now() else qualified_at end,
        disqualified_at = case when v_target_status = 'DISQUALIFIED' then now() else disqualified_at end,
        lost_at = case when v_target_status = 'LOST' then now() else lost_at end,
        lost_reason = case when v_target_status = 'LOST' then p_lost_reason else lost_reason end,
        assigned_user_id = coalesce(p_assigned_user_id, assigned_user_id),
        updated_at = now()
    where id = p_lead_id
    returning * into v_lead;

    return v_lead;
end;
$$;

-- 2. Atomic Lead to Customer Conversion Procedure
create or replace function app.convert_lead_to_customer(
    p_organization_id uuid,
    p_lead_id uuid,
    p_create_new_account boolean default true,
    p_customer_account_id uuid default null,
    p_actor_id uuid default null
) returns jsonb
language plpgsql
security definer
set search_path = app, public
as $$
declare
    v_lead app.leads%rowtype;
    v_account_id uuid;
    v_contact_id uuid;
    v_is_company boolean;
    v_display_name text;
    v_actor_role text;
begin
    -- 0. Actor authority check if actor is provided
    if p_actor_id is not null then
        select r.code into v_actor_role
        from app.organization_members om
        join app.roles r on om.role_id = r.id
        where om.user_id = p_actor_id and om.organization_id = p_organization_id and om.status = 'ACTIVE';

        if v_actor_role is null then
            raise exception 'Actor % does not have active membership in organization %', p_actor_id, p_organization_id;
        end if;

        if v_actor_role not in ('OWNER', 'ADMIN', 'SALES') then
            raise exception 'Unauthorized: role % cannot convert leads', v_actor_role;
        end if;
    end if;

    -- 1. Lock the lead record FOR UPDATE
    select * into v_lead
    from app.leads
    where id = p_lead_id and organization_id = p_organization_id
    for update;

    if not found then
        raise exception 'Lead not found or access denied';
    end if;

    -- Idempotency check: if already converted, return existing customer account
    if v_lead.status = 'CONVERTED' and v_lead.customer_account_id is not null then
        return jsonb_build_object(
            'success', true,
            'lead_id', v_lead.id,
            'customer_account_id', v_lead.customer_account_id,
            'customer_contact_id', v_lead.customer_contact_id,
            'already_converted', true
        );
    end if;

    -- Strict state machine guard: Only leads in QUALIFIED status can be converted to customers!
    -- Converting un-qualified leads (NEW, CONTACTED, QUALIFYING, DISQUALIFIED, LOST) is strictly forbidden.
    if v_lead.status != 'QUALIFIED' then
        raise exception 'Cannot convert lead: lead status must be QUALIFIED (current status is %)', v_lead.status;
    end if;

    -- Completeness guards for lead conversion:
    -- 1. Valid contact method (phone or email) is mandatory
    if coalesce(trim(v_lead.phone), '') = '' and coalesce(trim(v_lead.email), '') = '' then
        raise exception 'Cannot convert lead: valid contact method (phone or email) is required';
    end if;

    -- 2. Contact or company name is mandatory when creating new customer account
    if coalesce(trim(v_lead.contact_name), '') = '' and coalesce(trim(v_lead.company_name), '') = '' and p_customer_account_id is null then
        raise exception 'Cannot convert lead: contact name or company name is required to create customer account';
    end if;

    -- 3. Inquiry or title cannot be empty
    if coalesce(trim(v_lead.raw_inquiry), '') = '' and coalesce(trim(v_lead.title), '') = '' then
        raise exception 'Cannot convert lead: inquiry or requirement summary cannot be empty';
    end if;

    -- 4. Estimated quantity if specified must be positive
    if v_lead.estimated_quantity is not null and v_lead.estimated_quantity <= 0 then
        raise exception 'Cannot convert lead: estimated quantity must be greater than zero';
    end if;

    -- Case A: Linking to an existing customer account
    if p_customer_account_id is not null then
        select id into v_account_id
        from app.customer_accounts
        where id = p_customer_account_id and organization_id = p_organization_id;

        if v_account_id is null then
            raise exception 'Referenced customer account not found';
        end if;

        -- Ensure customer brand relationship exists
        insert into app.customer_brand_relationships (
            customer_account_id,
            brand_id,
            customer_segment,
            relationship_status
        ) values (
            v_account_id,
            v_lead.brand_id,
            'STANDARD',
            'ACTIVE'
        ) on conflict (customer_account_id, brand_id) do nothing;

    -- Case B: Create new customer account atomically
    elsif p_create_new_account then
        v_is_company := (v_lead.company_name is not null and trim(v_lead.company_name) <> '');
        v_display_name := case 
            when v_is_company then trim(v_lead.company_name)
            when v_lead.contact_name is not null and trim(v_lead.contact_name) <> '' then trim(v_lead.contact_name)
            else trim(v_lead.title)
        end;

        -- Insert customer account
        insert into app.customer_accounts (
            organization_id,
            account_type,
            display_name,
            legal_name,
            primary_email,
            primary_phone,
            status,
            customer_since
        ) values (
            p_organization_id,
            case when v_is_company then 'COMPANY' else 'PERSON' end,
            v_display_name,
            v_lead.company_name,
            v_lead.email,
            v_lead.phone,
            'ACTIVE',
            current_date
        ) returning id into v_account_id;

        -- Insert customer contact
        insert into app.customer_contacts (
            customer_account_id,
            name,
            email,
            phone,
            position,
            is_primary
        ) values (
            v_account_id,
            coalesce(trim(v_lead.contact_name), v_display_name),
            v_lead.email,
            v_lead.phone,
            case when v_is_company then 'PIC / Contact Person' else null end,
            true
        ) returning id into v_contact_id;

        -- Insert customer brand relationship
        insert into app.customer_brand_relationships (
            customer_account_id,
            brand_id,
            customer_segment,
            relationship_status
        ) values (
            v_account_id,
            v_lead.brand_id,
            case when v_is_company then 'CORPORATE' else 'RETAIL' end,
            'ACTIVE'
        ) on conflict (customer_account_id, brand_id) do nothing;

    else
        raise exception 'Either p_customer_account_id must be provided or p_create_new_account must be true';
    end if;

    -- 3. Update lead to CONVERTED status atomically
    update app.leads
    set
        status = 'CONVERTED',
        customer_account_id = v_account_id,
        customer_contact_id = coalesce(v_contact_id, customer_contact_id),
        converted_at = now(),
        updated_at = now()
    where id = p_lead_id;

    return jsonb_build_object(
        'success', true,
        'lead_id', p_lead_id,
        'customer_account_id', v_account_id,
        'customer_contact_id', v_contact_id,
        'already_converted', false
    );
end;
$$;

-- 3. Atomic Customer Creation with Contact and Brand Relationship Procedure
create or replace function app.create_customer_with_contact(
    p_organization_id uuid,
    p_brand_id uuid,
    p_account_type text,
    p_display_name text,
    p_legal_name text default null,
    p_primary_email text default null,
    p_primary_phone text default null,
    p_tax_id text default null,
    p_contact_name text default null,
    p_contact_position text default null,
    p_contact_email text default null,
    p_contact_phone text default null,
    p_customer_segment text default 'STANDARD',
    p_actor_id uuid default null
) returns jsonb
language plpgsql
security definer
set search_path = app, public
as $$
declare
    v_account_id uuid;
    v_contact_id uuid;
    v_clean_name text := trim(p_display_name);
    v_actor_role text;
begin
    -- 0. Actor authority check if actor is provided
    if p_actor_id is not null then
        select r.code into v_actor_role
        from app.organization_members om
        join app.roles r on om.role_id = r.id
        where om.user_id = p_actor_id and om.organization_id = p_organization_id and om.status = 'ACTIVE';

        if v_actor_role is null then
            raise exception 'Actor % does not have active membership in organization %', p_actor_id, p_organization_id;
        end if;

        if v_actor_role not in ('OWNER', 'ADMIN', 'SALES') then
            raise exception 'Unauthorized: role % cannot create customer accounts', v_actor_role;
        end if;
    end if;

    if length(v_clean_name) = 0 then
        raise exception 'Display name cannot be empty';
    end if;

    -- 1. Insert customer account
    insert into app.customer_accounts (
        organization_id,
        account_type,
        display_name,
        legal_name,
        primary_email,
        primary_phone,
        tax_id,
        status,
        customer_since
    ) values (
        p_organization_id,
        upper(trim(p_account_type)),
        v_clean_name,
        trim(p_legal_name),
        trim(p_primary_email),
        trim(p_primary_phone),
        trim(p_tax_id),
        'ACTIVE',
        current_date
    ) returning id into v_account_id;

    -- 2. Insert primary contact if provided
    if p_contact_name is not null and trim(p_contact_name) <> '' then
        insert into app.customer_contacts (
            customer_account_id,
            name,
            email,
            phone,
            position,
            is_primary
        ) values (
            v_account_id,
            trim(p_contact_name),
            coalesce(trim(p_contact_email), trim(p_primary_email)),
            coalesce(trim(p_contact_phone), trim(p_primary_phone)),
            trim(p_contact_position),
            true
        ) returning id into v_contact_id;
    end if;

    -- 3. Insert customer brand relationship
    if p_brand_id is not null then
        insert into app.customer_brand_relationships (
            customer_account_id,
            brand_id,
            customer_segment,
            relationship_status
        ) values (
            v_account_id,
            p_brand_id,
            coalesce(trim(p_customer_segment), 'STANDARD'),
            'ACTIVE'
        ) on conflict (customer_account_id, brand_id) do nothing;
    end if;

    return jsonb_build_object(
        'success', true,
        'customer_account_id', v_account_id,
        'customer_contact_id', v_contact_id
    );
end;
$$;

-- Grant execute permissions to service_role
grant execute on function app.transition_lead_status to service_role;
grant execute on function app.convert_lead_to_customer to service_role;
grant execute on function app.create_customer_with_contact to service_role;
