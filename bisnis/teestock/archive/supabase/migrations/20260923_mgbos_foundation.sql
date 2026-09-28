-- ==============================================================================
-- MGBOS SPRINT 1: FOUNDATION SCHEMA
-- Migration: 20260923_mgbos_foundation.sql
-- Description: Core Organization, Brand, Business Line, and Channel tables
-- Specification: MGBOS 0.2.1 Logical Data Model & MGBOS 0.5.4 (MGBOS-002)
-- Author: Founding C-Suite Cabinet
-- ==============================================================================

-- 1. Organizations (Holding Level)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    legal_entity_name VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Brands (Operating Brands under Holding)
CREATE TABLE IF NOT EXISTS public.brands (
    id VARCHAR(32) PRIMARY KEY, -- Slug: 'teestock', 'multigraph', 'neopack', 'packpoint', 'squeegee'
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    code_prefix VARCHAR(8) NOT NULL UNIQUE, -- 'TS', 'MG', 'NP', 'PP', 'SQ'
    domain VARCHAR(120),
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Business Lines (Service/Model Tiers per Brand)
CREATE TABLE IF NOT EXISTS public.business_lines (
    id VARCHAR(48) PRIMARY KEY, -- Slug: 'ts_custom_atelier', 'ts_curated', 'mg_commercial', etc.
    brand_id VARCHAR(32) NOT NULL REFERENCES public.brands(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Channels (Transaction Origination Channels - Group-wide)
CREATE TABLE IF NOT EXISTS public.channels (
    id VARCHAR(32) PRIMARY KEY, -- Slug: 'website', 'whatsapp', 'instagram_dm', 'direct_sales', 'marketplace'
    name VARCHAR(64) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for high-performance lookup
CREATE INDEX IF NOT EXISTS idx_brands_org ON public.brands(organization_id);
CREATE INDEX IF NOT EXISTS idx_business_lines_brand ON public.business_lines(brand_id);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated users and public catalog lookup
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read organizations to public') THEN
        CREATE POLICY "Allow read organizations to public" ON public.organizations FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read brands to public') THEN
        CREATE POLICY "Allow read brands to public" ON public.brands FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read business_lines to public') THEN
        CREATE POLICY "Allow read business_lines to public" ON public.business_lines FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read channels to public') THEN
        CREATE POLICY "Allow read channels to public" ON public.channels FOR SELECT USING (true);
    END IF;
END $$;

-- ==============================================================================
-- SEED DATA: MULTIGRAPH GROUP CORE ENTITIES
-- ==============================================================================

DO $$
DECLARE
    holding_org_id UUID;
BEGIN
    -- 1. Insert Holding Organization
    INSERT INTO public.organizations (name, legal_entity_name)
    VALUES ('MultiGraph Group Holding', 'PT MultiGraph Ekosistem Kreatif')
    ON CONFLICT DO NOTHING;

    SELECT id INTO holding_org_id FROM public.organizations WHERE name = 'MultiGraph Group Holding' LIMIT 1;

    -- 2. Insert Core Brands
    INSERT INTO public.brands (id, organization_id, name, code_prefix, domain, description)
    VALUES 
        ('teestock', holding_org_id, 'TeeStock Apparel', 'TS', 'teestockapparel.com', 'Everyday Curated Graphic Apparel & Merch House'),
        ('multigraph', holding_org_id, 'MultiGraph Printing', 'MG', 'multigraph.id', 'General & Commercial Printing Partner'),
        ('neopack', holding_org_id, 'NeoPack', 'NP', 'neopack.id', 'Retail & Food Packaging Solution'),
        ('packpoint', holding_org_id, 'Pack Point', 'PP', 'packpoint.id', 'Corrugated Box & Industrial Packaging'),
        ('squeegee', holding_org_id, 'Squeegee Studios', 'SQ', 'squeegeestudios.com', 'High-volume Screen Printing Studio')
    ON CONFLICT (id) DO UPDATE SET
        organization_id = EXCLUDED.organization_id,
        name = EXCLUDED.name,
        code_prefix = EXCLUDED.code_prefix,
        domain = EXCLUDED.domain,
        description = EXCLUDED.description;

    -- 3. Insert Business Lines
    INSERT INTO public.business_lines (id, brand_id, name, description)
    VALUES
        ('ts_custom_atelier', 'teestock', 'Custom Atelier', 'Custom apparel, B2B uniforms, and tailored production'),
        ('ts_curated', 'teestock', 'Curated Drops', 'Limited graphic streetwear drops and in-house catalog'),
        ('ts_blank_apparel', 'teestock', 'Blank Apparel', 'Raw NSA blank garments and basic inventory distribution'),
        ('ts_creator_collab', 'teestock', 'Creator Collab', 'Creator revenue-share capsule collections'),
        ('ts_reseller', 'teestock', 'Reseller / Dropship', 'B2B partner and reseller tier fulfillment'),
        ('mg_commercial', 'multigraph', 'Commercial Printing', 'Brochures, catalogs, marketing collaterals'),
        ('np_retail_boxes', 'neopack', 'Retail Packaging', 'Custom folding box and food-grade packaging'),
        ('pp_corrugated', 'packpoint', 'Corrugated Cartons', 'Master shipping boxes and e-commerce packaging'),
        ('sq_screenprint', 'squeegee', 'Manual Screen Print', 'Partai besar plastisol, discharge, and high-density printing')
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description;

    -- 4. Insert Global Channels
    INSERT INTO public.channels (id, name, description)
    VALUES
        ('whatsapp', 'WhatsApp Official', 'WhatsApp direct messaging and sales closing'),
        ('website', 'Official Website', 'Public storefront and web portal'),
        ('instagram_dm', 'Instagram DM', 'Social media inbound inquiry'),
        ('direct_sales', 'Direct Sales / Offline', 'Direct founder/sales outreach and offline order'),
        ('marketplace', 'Online Marketplace', 'Shopee, Tokopedia, TikTok Shop')
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description;
END $$;
