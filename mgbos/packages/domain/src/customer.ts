/**
 * MultiGraph Business OS — Customer Domain Model (MGBOS-005)
 * Root customer entity across holding organizations, supporting individual persons and companies with multiple contacts.
 */

export const CUSTOMER_ACCOUNT_TYPES = ['PERSON', 'COMPANY'] as const;
export type CustomerAccountType = (typeof CUSTOMER_ACCOUNT_TYPES)[number];

export const CUSTOMER_ACCOUNT_STATUSES = [
  'ACTIVE',
  'INACTIVE',
  'ARCHIVED',
] as const;
export type CustomerAccountStatus = (typeof CUSTOMER_ACCOUNT_STATUSES)[number];

export const CUSTOMER_BRAND_STATUSES = [
  'PROSPECT',
  'ACTIVE',
  'DORMANT',
  'CHURNED',
] as const;
export type CustomerBrandStatus = (typeof CUSTOMER_BRAND_STATUSES)[number];

export const ADDRESS_TYPES = [
  'BILLING',
  'SHIPPING',
  'OFFICE',
  'WAREHOUSE',
  'OTHER',
] as const;
export type AddressType = (typeof ADDRESS_TYPES)[number];

export interface CustomerAccount {
  id: string;
  organizationId: string;
  accountType: CustomerAccountType;
  displayName: string;
  legalName?: string | null;
  primaryEmail?: string | null;
  primaryPhone?: string | null;
  taxId?: string | null;
  status: CustomerAccountStatus;
  customerSince: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface CustomerContact {
  id: string;
  customerAccountId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface CustomerBrandRelationship {
  id: string;
  customerAccountId: string;
  brandId: string;
  customerSegment: string;
  relationshipStatus: CustomerBrandStatus;
  firstInteractionAt: string;
  lastInteractionAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  district?: string | null;
  city: string;
  province: string;
  postalCode: string;
  countryCode: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface CustomerAddress {
  id: string;
  customerAccountId: string;
  addressId: string;
  addressType: AddressType;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerWithDetails extends CustomerAccount {
  contacts: CustomerContact[];
  brandRelationships: CustomerBrandRelationship[];
  addresses: Address[];
}

/**
 * Checks whether an account is a corporate/company entity.
 */
export function isCompanyAccount(account: {
  accountType: CustomerAccountType;
}): boolean {
  return account.accountType === 'COMPANY';
}

/**
 * Checks whether an account is an individual retail person.
 */
export function isPersonAccount(account: {
  accountType: CustomerAccountType;
}): boolean {
  return account.accountType === 'PERSON';
}

/**
 * Finds the primary contact person for a customer account.
 */
export function getPrimaryContact(
  contacts: CustomerContact[],
): CustomerContact | undefined {
  return contacts.find((c) => c.isPrimary) ?? contacts[0];
}

/**
 * Formats a physical address into a concise single-line representation.
 */
export function formatAddressSingleLine(address: Address): string {
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.district,
    address.city,
    address.province,
    address.postalCode,
  ].filter(Boolean);

  return parts.join(', ');
}
