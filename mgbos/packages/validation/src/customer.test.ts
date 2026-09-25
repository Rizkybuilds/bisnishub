import { describe, expect, it } from 'vitest';
import {
  createCustomerAccountSchema,
  createCustomerContactSchema,
  createCustomerBrandRelationshipSchema,
  createAddressSchema,
} from './customer';

describe('Customer Validation Schemas', () => {
  it('validates a valid corporate customer account', () => {
    const valid = {
      organizationId: '123e4567-e89b-12d3-a456-426614174000',
      accountType: 'COMPANY',
      displayName: 'PT ABC',
      legalName: 'PT ABC Kreatif Nusantara',
      primaryEmail: 'procurement@abckreatif.co.id',
      primaryPhone: '+62215551234',
      taxId: '01.234.567.8-012.000',
      status: 'ACTIVE',
    };
    const result = createCustomerAccountSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('validates a valid person customer account with minimal fields', () => {
    const valid = {
      organizationId: '123e4567-e89b-12d3-a456-426614174000',
      accountType: 'PERSON',
      displayName: 'Rendra Pratama',
    };
    const result = createCustomerAccountSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects customer account with invalid email or account type', () => {
    const invalidType = {
      organizationId: '123e4567-e89b-12d3-a456-426614174000',
      accountType: 'INVALID_TYPE',
      displayName: 'Test',
    };
    expect(createCustomerAccountSchema.safeParse(invalidType).success).toBe(
      false,
    );

    const invalidEmail = {
      organizationId: '123e4567-e89b-12d3-a456-426614174000',
      accountType: 'COMPANY',
      displayName: 'Test',
      primaryEmail: 'not-an-email',
    };
    expect(createCustomerAccountSchema.safeParse(invalidEmail).success).toBe(
      false,
    );
  });

  it('validates customer contacts with position and primary flag', () => {
    const valid = {
      name: 'Budi Santoso',
      email: 'budi@abckreatif.co.id',
      phone: '+62811223344',
      position: 'Purchasing Manager',
      isPrimary: true,
    };
    const result = createCustomerContactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('validates customer brand relationships', () => {
    const valid = {
      customerAccountId: '123e4567-e89b-12d3-a456-426614174000',
      brandId: '123e4567-e89b-12d3-a456-426614174001',
      customerSegment: 'B2B_CUSTOM',
      relationshipStatus: 'ACTIVE',
    };
    const result = createCustomerBrandRelationshipSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('validates address data with Indonesian postal code and lines', () => {
    const valid = {
      recipientName: 'Receiving Dock',
      phone: '+62215551234',
      addressLine1: 'Jl. Sudirman Kav 45',
      addressLine2: 'Gedung Menara Sentosa Lt. 8',
      district: 'Kebayoran Baru',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12190',
      countryCode: 'ID',
    };
    const result = createAddressSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});
