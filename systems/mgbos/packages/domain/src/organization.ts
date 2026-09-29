export type OrganizationStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Organization {
  id: string;
  code: string;
  legalName: string;
  displayName: string;
  timezone: string;
  baseCurrency: string;
  status: OrganizationStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export type BrandStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Brand {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  slug: string;
  domain?: string | null;
  description?: string | null;
  status: BrandStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export type BusinessLineStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface BusinessLine {
  id: string;
  brandId: string;
  code: string;
  name: string;
  description?: string | null;
  status: BusinessLineStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export type ChannelType =
  'MESSAGING' | 'WEB' | 'SOCIAL' | 'DIRECT' | 'MARKETPLACE' | 'API';

export type ChannelStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Channel {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  channelType: ChannelType;
  status: ChannelStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export type CoreRoleCode =
  'OWNER' | 'ADMIN' | 'SALES' | 'OPERATIONS' | 'FINANCE' | 'QC';

export interface Role {
  id: string;
  organizationId: string;
  code: CoreRoleCode | string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const HOLDING_ORGANIZATION_CODE = 'multigraph-group' as const;

export const CORE_BRAND_CODES = ['TS', 'MG', 'NP', 'PP', 'SQ'] as const;
export type CoreBrandCode = (typeof CORE_BRAND_CODES)[number];

export const CORE_ROLE_CODES = [
  'OWNER',
  'ADMIN',
  'SALES',
  'OPERATIONS',
  'FINANCE',
  'QC',
] as const;
