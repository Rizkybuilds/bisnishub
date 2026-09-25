export type { Database, Json, Tables } from '../generated/database.types';

import type { Database } from '../generated/database.types';

export type AppTables = Database['app']['Tables'];

export type OrganizationRow = AppTables['organizations']['Row'];
export type OrganizationInsert = AppTables['organizations']['Insert'];
export type OrganizationUpdate = AppTables['organizations']['Update'];

export type BrandRow = AppTables['brands']['Row'];
export type BrandInsert = AppTables['brands']['Insert'];
export type BrandUpdate = AppTables['brands']['Update'];

export type BusinessLineRow = AppTables['business_lines']['Row'];
export type BusinessLineInsert = AppTables['business_lines']['Insert'];
export type BusinessLineUpdate = AppTables['business_lines']['Update'];

export type ChannelRow = AppTables['channels']['Row'];
export type ChannelInsert = AppTables['channels']['Insert'];
export type ChannelUpdate = AppTables['channels']['Update'];

export type RoleRow = AppTables['roles']['Row'];
export type RoleInsert = AppTables['roles']['Insert'];
export type RoleUpdate = AppTables['roles']['Update'];

export type UserRow = AppTables['users']['Row'];
export type UserInsert = AppTables['users']['Insert'];
export type UserUpdate = AppTables['users']['Update'];

export type OrganizationMemberRow = AppTables['organization_members']['Row'];
export type OrganizationMemberInsert =
  AppTables['organization_members']['Insert'];
export type OrganizationMemberUpdate =
  AppTables['organization_members']['Update'];

export type DocumentSequenceRow = AppTables['document_sequences']['Row'];
export type DocumentSequenceInsert = AppTables['document_sequences']['Insert'];
export type DocumentSequenceUpdate = AppTables['document_sequences']['Update'];

export type CustomerAccountRow = AppTables['customer_accounts']['Row'];
export type CustomerAccountInsert = AppTables['customer_accounts']['Insert'];
export type CustomerAccountUpdate = AppTables['customer_accounts']['Update'];

export type CustomerContactRow = AppTables['customer_contacts']['Row'];
export type CustomerContactInsert = AppTables['customer_contacts']['Insert'];
export type CustomerContactUpdate = AppTables['customer_contacts']['Update'];

export type CustomerBrandRelationshipRow =
  AppTables['customer_brand_relationships']['Row'];
export type CustomerBrandRelationshipInsert =
  AppTables['customer_brand_relationships']['Insert'];
export type CustomerBrandRelationshipUpdate =
  AppTables['customer_brand_relationships']['Update'];

export type AddressRow = AppTables['addresses']['Row'];
export type AddressInsert = AppTables['addresses']['Insert'];
export type AddressUpdate = AppTables['addresses']['Update'];

export type CustomerAddressRow = AppTables['customer_addresses']['Row'];
export type CustomerAddressInsert = AppTables['customer_addresses']['Insert'];
export type CustomerAddressUpdate = AppTables['customer_addresses']['Update'];

export type LeadRow = AppTables['leads']['Row'];
export type LeadInsert = AppTables['leads']['Insert'];
export type LeadUpdate = AppTables['leads']['Update'];

export type AppFunctions = Database['app']['Functions'];

export * from './sequences';
