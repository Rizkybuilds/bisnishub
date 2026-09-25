import { describe, expect, it } from 'vitest';
import {
  isCompanyAccount,
  isPersonAccount,
  getPrimaryContact,
  formatAddressSingleLine,
  type CustomerAccount,
  type CustomerContact,
  type Address,
} from './customer';

describe('Customer Domain Logic', () => {
  it('identifies company and person account types correctly', () => {
    const companyAccount: CustomerAccount = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      organizationId: '123e4567-e89b-12d3-a456-426614174001',
      accountType: 'COMPANY',
      displayName: 'PT ABC',
      status: 'ACTIVE',
      customerSince: '2026-01-01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const personAccount: CustomerAccount = {
      ...companyAccount,
      accountType: 'PERSON',
      displayName: 'Rendra Pratama',
    };

    expect(isCompanyAccount(companyAccount)).toBe(true);
    expect(isPersonAccount(companyAccount)).toBe(false);

    expect(isPersonAccount(personAccount)).toBe(true);
    expect(isCompanyAccount(personAccount)).toBe(false);
  });

  it('retrieves the primary contact from a list of contacts', () => {
    const contacts: CustomerContact[] = [
      {
        id: '1',
        customerAccountId: 'acc-1',
        name: 'Sari Dewi',
        position: 'Finance Specialist',
        isPrimary: false,
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '2',
        customerAccountId: 'acc-1',
        name: 'Budi Santoso',
        position: 'Purchasing Manager',
        isPrimary: true,
        createdAt: '',
        updatedAt: '',
      },
    ];

    const primary = getPrimaryContact(contacts);
    expect(primary?.name).toBe('Budi Santoso');
    expect(primary?.isPrimary).toBe(true);
  });

  it('falls back to the first contact when no primary is explicitly set', () => {
    const contacts: CustomerContact[] = [
      {
        id: '1',
        customerAccountId: 'acc-1',
        name: 'First Contact',
        isPrimary: false,
        createdAt: '',
        updatedAt: '',
      },
    ];

    expect(getPrimaryContact(contacts)?.name).toBe('First Contact');
    expect(getPrimaryContact([])).toBeUndefined();
  });

  it('formats physical address to a single line representation', () => {
    const address: Address = {
      id: 'addr-1',
      recipientName: 'Receiving Dock',
      phone: '08123456789',
      addressLine1: 'Jl. Sudirman Kav 45',
      addressLine2: 'Gedung Menara Sentosa Lt. 8',
      district: 'Kebayoran Baru',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12190',
      countryCode: 'ID',
      createdAt: '',
      updatedAt: '',
    };

    const formatted = formatAddressSingleLine(address);
    expect(formatted).toBe(
      'Jl. Sudirman Kav 45, Gedung Menara Sentosa Lt. 8, Kebayoran Baru, Jakarta Selatan, DKI Jakarta, 12190',
    );
  });
});
