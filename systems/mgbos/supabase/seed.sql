-- ==============================================================================
-- MGBOS-002 & MGBOS-003 SEED DATA
-- Description: MultiGraph Group Holding, Brands, Business Lines, Channels, Roles,
--              and Founder User with Owner Membership
-- ==============================================================================

do $$
declare
    v_org_id uuid;
    v_teestock_id uuid;
    v_multigraph_id uuid;
    v_neopack_id uuid;
    v_packpoint_id uuid;
    v_squeegee_id uuid;
    v_founder_user_id uuid;
    v_owner_role_id uuid;
    v_customer_abc_id uuid;
    v_customer_rendra_id uuid;
    v_addr_abc_id uuid;
    v_channel_wa_id uuid;
    v_channel_web_id uuid;
    v_channel_ig_id uuid;
    v_bl_atelier_id uuid;
    v_bl_commercial_id uuid;
begin
    -- 1. Organization: MultiGraph Group Holding
    insert into app.organizations (
        code,
        legal_name,
        display_name,
        timezone,
        base_currency,
        status,
        billing_settings
    ) values (
        'multigraph-group',
        'PT MultiGraph Ekosistem Kreatif',
        'MultiGraph Group',
        'Asia/Jakarta',
        'IDR',
        'ACTIVE',
        jsonb_build_object(
            'bank_name', 'Bank Central Asia (BCA)',
            'account_number', '7770123899',
            'account_name', 'PT MultiGraph Ekosistem Kreatif',
            'branch', 'KCU Bandung Asia Afrika',
            'qris_enabled', true,
            'is_verified', true
        )
    )
    on conflict (code) do update set
        legal_name = excluded.legal_name,
        display_name = excluded.display_name,
        timezone = excluded.timezone,
        base_currency = excluded.base_currency,
        status = excluded.status,
        billing_settings = excluded.billing_settings
    returning id into v_org_id;

    if v_org_id is null then
        select id into v_org_id from app.organizations where code = 'multigraph-group';
    end if;

    -- 2. Brands: 5 Core Holding Brands
    -- 2.1 TeeStock (TS)
    insert into app.brands (
        organization_id,
        code,
        name,
        slug,
        domain,
        description,
        status
    ) values (
        v_org_id,
        'TS',
        'TeeStock',
        'teestock',
        'teestockapparel.com',
        'Everyday Curated Graphic Apparel & Merch House',
        'ACTIVE'
    )
    on conflict (organization_id, code) do update set
        name = excluded.name,
        slug = excluded.slug,
        domain = excluded.domain,
        description = excluded.description,
        status = excluded.status
    returning id into v_teestock_id;

    if v_teestock_id is null then
        select id into v_teestock_id from app.brands where organization_id = v_org_id and code = 'TS';
    end if;

    -- 2.2 MultiGraph (MG)
    insert into app.brands (
        organization_id,
        code,
        name,
        slug,
        domain,
        description,
        status
    ) values (
        v_org_id,
        'MG',
        'MultiGraph',
        'multigraph',
        'multigraph.id',
        'General & Commercial Printing Partner',
        'ACTIVE'
    )
    on conflict (organization_id, code) do update set
        name = excluded.name,
        slug = excluded.slug,
        domain = excluded.domain,
        description = excluded.description,
        status = excluded.status
    returning id into v_multigraph_id;

    if v_multigraph_id is null then
        select id into v_multigraph_id from app.brands where organization_id = v_org_id and code = 'MG';
    end if;

    -- 2.3 NeoPack (NP)
    insert into app.brands (
        organization_id,
        code,
        name,
        slug,
        domain,
        description,
        status
    ) values (
        v_org_id,
        'NP',
        'NeoPack',
        'neopack',
        'neopack.id',
        'Retail & Food Packaging Solution',
        'ACTIVE'
    )
    on conflict (organization_id, code) do update set
        name = excluded.name,
        slug = excluded.slug,
        domain = excluded.domain,
        description = excluded.description,
        status = excluded.status
    returning id into v_neopack_id;

    if v_neopack_id is null then
        select id into v_neopack_id from app.brands where organization_id = v_org_id and code = 'NP';
    end if;

    -- 2.4 Pack Point (PP)
    insert into app.brands (
        organization_id,
        code,
        name,
        slug,
        domain,
        description,
        status
    ) values (
        v_org_id,
        'PP',
        'Pack Point',
        'packpoint',
        'packpoint.id',
        'Corrugated Box & Industrial Packaging',
        'ACTIVE'
    )
    on conflict (organization_id, code) do update set
        name = excluded.name,
        slug = excluded.slug,
        domain = excluded.domain,
        description = excluded.description,
        status = excluded.status
    returning id into v_packpoint_id;

    if v_packpoint_id is null then
        select id into v_packpoint_id from app.brands where organization_id = v_org_id and code = 'PP';
    end if;

    -- 2.5 Squeegee Studios (SQ)
    insert into app.brands (
        organization_id,
        code,
        name,
        slug,
        domain,
        description,
        status
    ) values (
        v_org_id,
        'SQ',
        'Squeegee Studios',
        'squeegee',
        'squeegeestudios.com',
        'High-volume Screen Printing Studio',
        'ACTIVE'
    )
    on conflict (organization_id, code) do update set
        name = excluded.name,
        slug = excluded.slug,
        domain = excluded.domain,
        description = excluded.description,
        status = excluded.status
    returning id into v_squeegee_id;

    if v_squeegee_id is null then
        select id into v_squeegee_id from app.brands where organization_id = v_org_id and code = 'SQ';
    end if;

    -- 3. Business Lines
    -- 3.1 TeeStock Business Lines
    insert into app.business_lines (brand_id, code, name, description, status)
    values
        (v_teestock_id, 'CUSTOM_ATELIER', 'Custom Atelier', 'Custom apparel, B2B uniforms, and tailored production', 'ACTIVE'),
        (v_teestock_id, 'CURATED_DROPS', 'Curated Drops', 'Limited graphic streetwear drops and in-house catalog', 'ACTIVE'),
        (v_teestock_id, 'BLANK_APPAREL', 'Blank Apparel', 'Raw NSA blank garments and basic inventory distribution', 'ACTIVE'),
        (v_teestock_id, 'CREATOR_COLLAB', 'Creator Collab', 'Creator revenue-share capsule collections', 'ACTIVE'),
        (v_teestock_id, 'RESELLER_DROPSHIP', 'Reseller / Dropship', 'B2B partner and reseller tier fulfillment', 'ACTIVE')
    on conflict (brand_id, code) do update set
        name = excluded.name,
        description = excluded.description,
        status = excluded.status;

    -- 3.2 MultiGraph Business Lines
    insert into app.business_lines (brand_id, code, name, description, status)
    values
        (v_multigraph_id, 'COMMERCIAL_PRINTING', 'Commercial Printing', 'Brochures, catalogs, marketing collaterals', 'ACTIVE')
    on conflict (brand_id, code) do update set
        name = excluded.name,
        description = excluded.description,
        status = excluded.status;

    -- 3.3 NeoPack Business Lines
    insert into app.business_lines (brand_id, code, name, description, status)
    values
        (v_neopack_id, 'RETAIL_BOXES', 'Retail Packaging', 'Custom folding box and food-grade packaging', 'ACTIVE')
    on conflict (brand_id, code) do update set
        name = excluded.name,
        description = excluded.description,
        status = excluded.status;

    -- 3.4 Pack Point Business Lines
    insert into app.business_lines (brand_id, code, name, description, status)
    values
        (v_packpoint_id, 'CORRUGATED_BOXES', 'Corrugated Cartons', 'Master shipping boxes and e-commerce packaging', 'ACTIVE')
    on conflict (brand_id, code) do update set
        name = excluded.name,
        description = excluded.description,
        status = excluded.status;

    -- 3.5 Squeegee Studios Business Lines
    insert into app.business_lines (brand_id, code, name, description, status)
    values
        (v_squeegee_id, 'SCREEN_PRINT', 'Manual Screen Print', 'Partai besar plastisol, discharge, and high-density printing', 'ACTIVE')
    on conflict (brand_id, code) do update set
        name = excluded.name,
        description = excluded.description,
        status = excluded.status;

    -- 4. Channels (Group-wide Transaction Channels)
    insert into app.channels (organization_id, code, name, channel_type, status)
    values
        (v_org_id, 'WHATSAPP', 'WhatsApp Official', 'MESSAGING', 'ACTIVE'),
        (v_org_id, 'WEBSITE', 'Official Website Storefront', 'WEB', 'ACTIVE'),
        (v_org_id, 'INSTAGRAM_DM', 'Instagram Direct Message', 'SOCIAL', 'ACTIVE'),
        (v_org_id, 'DIRECT_SALES', 'Direct Sales & Offline', 'DIRECT', 'ACTIVE'),
        (v_org_id, 'MARKETPLACE', 'Online Marketplace', 'MARKETPLACE', 'ACTIVE')
    on conflict (organization_id, code) do update set
        name = excluded.name,
        channel_type = excluded.channel_type,
        status = excluded.status;

    -- 5. Roles (Organizational Authority Roles)
    insert into app.roles (organization_id, code, name, description)
    values
        (v_org_id, 'OWNER', 'Owner', 'Founder & Executive Sole Decision Maker with full system control'),
        (v_org_id, 'ADMIN', 'Administrator', 'General Operations & System Configuration Administrator'),
        (v_org_id, 'SALES', 'Sales Representative', 'Leads ingestion, qualification, and quoter negotiation'),
        (v_org_id, 'OPERATIONS', 'Operations Specialist', 'Production routing, vendor assignments, and fulfillment'),
        (v_org_id, 'FINANCE', 'Finance Specialist', 'Invoicing, payment recording, and analytical margin ledger'),
        (v_org_id, 'QC', 'QC Inspector', 'Quality control checklist and defect audit inspection')
    on conflict (organization_id, code) do update set
        name = excluded.name,
        description = excluded.description;

    -- 6. Founder User & Owner Membership
    -- 6.1 Provision in auth.users if not exists
    insert into auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    ) values (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000099',
        'authenticated',
        'authenticated',
        'founder@multigraph.id',
        extensions.crypt('mgbos-founder-2026', extensions.gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"name":"Rizky","role":"OWNER"}'::jsonb,
        now(),
        now()
    )
    on conflict (id) do update set
        encrypted_password = excluded.encrypted_password,
        email_confirmed_at = excluded.email_confirmed_at;

    -- 6.2 Provision in auth.identities
    insert into auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    ) values (
        '00000000-0000-0000-0000-000000000099',
        '00000000-0000-0000-0000-000000000099',
        format('{"sub":"%s","email":"%s"}', '00000000-0000-0000-0000-000000000099', 'founder@multigraph.id')::jsonb,
        'email',
        'founder@multigraph.id',
        now(),
        now(),
        now()
    )
    on conflict (provider, provider_id) do nothing;

    -- 6.3 Link to app.users
    insert into app.users (
        auth_user_id,
        name,
        email,
        phone,
        status
    ) values (
        '00000000-0000-0000-0000-000000000099',
        'Rizky',
        'founder@multigraph.id',
        '+628123456789',
        'ACTIVE'
    )
    on conflict (email) do update set
        auth_user_id = excluded.auth_user_id,
        name = excluded.name,
        status = excluded.status
    returning id into v_founder_user_id;

    if v_founder_user_id is null then
        select id into v_founder_user_id from app.users where email = 'founder@multigraph.id';
    end if;

    -- 6.4 Owner Membership in app.organization_members
    select id into v_owner_role_id from app.roles where organization_id = v_org_id and code = 'OWNER';

    insert into app.organization_members (
        organization_id,
        user_id,
        role_id,
        status,
        joined_at
    ) values (
        v_org_id,
        v_founder_user_id,
        v_owner_role_id,
        'ACTIVE',
        now()
    )
    on conflict (organization_id, user_id) do update set
        role_id = excluded.role_id,
        status = excluded.status;

    -- 7. Seed Initial Customers (MGBOS-005 Acceptance Criteria)
    -- 7.1 Company: PT ABC Kreatif Nusantara (Multi-contact, Multi-brand)
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
        v_org_id,
        'COMPANY',
        'PT ABC',
        'PT ABC Kreatif Nusantara',
        'procurement@abckreatif.co.id',
        '+62215551234',
        '01.234.567.8-012.000',
        'ACTIVE',
        '2026-01-15'
    )
    returning id into v_customer_abc_id;

    -- 7.2 Contacts for PT ABC (Budi - Purchasing, Sari - Finance)
    insert into app.customer_contacts (
        customer_account_id,
        name,
        email,
        phone,
        position,
        is_primary
    ) values
    (v_customer_abc_id, 'Budi Santoso', 'budi@abckreatif.co.id', '+62811223344', 'Purchasing Manager', true),
    (v_customer_abc_id, 'Sari Dewi', 'sari@abckreatif.co.id', '+62811556677', 'Finance Specialist', false);

    -- 7.3 Multi-brand Relationships for PT ABC (TeeStock + MultiGraph)
    insert into app.customer_brand_relationships (
        customer_account_id,
        brand_id,
        customer_segment,
        relationship_status
    ) values
    (v_customer_abc_id, v_teestock_id, 'B2B_CUSTOM', 'ACTIVE'),
    (v_customer_abc_id, v_multigraph_id, 'COMMERCIAL', 'ACTIVE');

    -- 7.4 Office Address for PT ABC
    insert into app.addresses (
        recipient_name,
        phone,
        address_line_1,
        address_line_2,
        district,
        city,
        province,
        postal_code,
        country_code
    ) values (
        'PT ABC Kreatif Nusantara (Receiving Dock)',
        '+62215551234',
        'Jl. Sudirman Kav 45, Gedung Menara Sentosa Lt. 8',
        'Kebayoran Baru',
        'Kebayoran Baru',
        'Jakarta Selatan',
        'DKI Jakarta',
        '12190',
        'ID'
    ) returning id into v_addr_abc_id;

    insert into app.customer_addresses (
        customer_account_id,
        address_id,
        address_type,
        is_default
    ) values (
        v_customer_abc_id,
        v_addr_abc_id,
        'OFFICE',
        true
    );

    -- 7.5 Person: Rendra Pratama (Retail buyer TeeStock)
    insert into app.customer_accounts (
        organization_id,
        account_type,
        display_name,
        primary_email,
        primary_phone,
        status,
        customer_since
    ) values (
        v_org_id,
        'PERSON',
        'Rendra Pratama',
        'rendra.pratama@gmail.com',
        '+6281234567890',
        'ACTIVE',
        '2026-02-01'
    ) returning id into v_customer_rendra_id;

    insert into app.customer_brand_relationships (
        customer_account_id,
        brand_id,
        customer_segment,
        relationship_status
    ) values
    (v_customer_rendra_id, v_teestock_id, 'RETAIL', 'ACTIVE');

    -- 8. Inbound Leads & Qualification Pipeline (MGBOS-006)
    select id into v_channel_wa_id from app.channels where organization_id = v_org_id and code = 'WHATSAPP';
    select id into v_channel_web_id from app.channels where organization_id = v_org_id and code = 'WEBSITE';
    select id into v_channel_ig_id from app.channels where organization_id = v_org_id and code = 'INSTAGRAM_DM';
    select id into v_bl_atelier_id from app.business_lines where brand_id = v_teestock_id and code = 'CUSTOM_ATELIER';
    select id into v_bl_commercial_id from app.business_lines where brand_id = v_multigraph_id and code = 'COMMERCIAL_PRINTING';

    -- 8.1 Lead 1: Inbound via WhatsApp (TeeStock - NEW)
    insert into app.leads (
        organization_id,
        brand_id,
        business_line_id,
        channel_id,
        title,
        contact_name,
        company_name,
        phone,
        email,
        raw_inquiry,
        estimated_quantity,
        estimated_budget,
        status,
        created_at
    ) values (
        v_org_id,
        v_teestock_id,
        v_bl_atelier_id,
        v_channel_wa_id,
        'Kaos Komunitas Motor 75 Pcs',
        'Denny Siregar',
        'Riders Club Jakarta',
        '+6281399887766',
        'denny.riders@gmail.com',
        'Halo min, mau tanya harga bikin kaos 75 pcs bahan NSA 7200 Premium Cotton sablon DTF full color di dada sama punggung. Berapa estimasi biayanya?',
        75,
        6000000,
        'NEW',
        now() - interval '2 hours'
    );

    -- 8.2 Lead 2: Inbound via Website (TeeStock - QUALIFIED)
    insert into app.leads (
        organization_id,
        brand_id,
        business_line_id,
        channel_id,
        customer_account_id,
        title,
        contact_name,
        company_name,
        phone,
        email,
        raw_inquiry,
        estimated_quantity,
        estimated_budget,
        status,
        qualification_result,
        qualification_score,
        qualification_notes,
        created_at,
        qualified_at
    ) values (
        v_org_id,
        v_teestock_id,
        v_bl_atelier_id,
        v_channel_web_id,
        v_customer_abc_id,
        'Polo Shirt Seragam PT ABC 120 Pcs',
        'Budi Santoso',
        'PT ABC Media Nusantara',
        '+6281122334455',
        'budi.santoso@abcmedia.co.id',
        'Pemesanan seragam polo bordir dada kiri 120 pcs bahan lacoste cvc untuk acara tahunan perusahaan.',
        120,
        14400000,
        'QUALIFIED',
        'QUALIFIED',
        90,
        'Kebutuhan spesifikasi jelas, kuantiti 120 pcs memenuhi skala atelier B2B, timeline acara 3 minggu.',
        now() - interval '3 hours',
        now() - interval '1 hour'
    );

    -- 8.3 Lead 3: Inbound via Instagram DM (MultiGraph - DISQUALIFIED / SPAM)
    insert into app.leads (
        organization_id,
        brand_id,
        business_line_id,
        channel_id,
        title,
        contact_name,
        raw_inquiry,
        status,
        qualification_result,
        disqualification_reason,
        qualification_notes,
        created_at,
        disqualified_at
    ) values (
        v_org_id,
        v_multigraph_id,
        v_bl_commercial_id,
        v_channel_ig_id,
        'Tawaran Kerjasama Promosi',
        'Unknown User',
        'Halo kak kami menyediakan jasa tambah followers aktif dan buzzer sosmed garansi drop.',
        'DISQUALIFIED',
        'DISQUALIFIED',
        'SPAM',
        'Pesan promosi bot/spam, tidak berkaitan dengan kebutuhan cetak commercial printing.',
        now() - interval '5 hours',
        now() - interval '4 hours'
    );
end $$;

-- Seeded auth users need non-null token strings for GoTrue password login.
update auth.users
set confirmation_token = coalesce(confirmation_token, ''),
    recovery_token = coalesce(recovery_token, ''),
    email_change_token_new = coalesce(email_change_token_new, ''),
    email_change_token_current = coalesce(email_change_token_current, ''),
    email_change = coalesce(email_change, ''),
    reauthentication_token = coalesce(reauthentication_token, '')
where id = '00000000-0000-0000-0000-000000000099'
  and email = 'founder@multigraph.id';
