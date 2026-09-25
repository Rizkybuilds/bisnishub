/**
 * MultiGraph Business OS (MGBOS) — Core Domain Types
 * Based on MGBOS 0.2 Canonical Data Model & 0.3 Business State Machines
 */

// 1. Organization & Hierarchy
export interface Organization {
  id: string; // UUID
  name: string;
  legalEntityName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string; // 'teestock' | 'multigraph' | 'neopack' | 'packpoint' | 'squeegee'
  organizationId: string;
  name: string;
  codePrefix: string; // 'TS' | 'MG' | 'NP' | 'PP' | 'SQ'
  domain?: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessLine {
  id: string; // e.g. 'ts_custom_atelier' | 'ts_curated' | 'mg_commercial'
  brandId: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Channel {
  id: string; // 'website' | 'whatsapp' | 'instagram_dm' | 'direct_sales' | 'marketplace'
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
}

// 2. Global System Context (MGBOS-003)
export interface SystemContext {
  organizationId: string;
  brandId: string;
  businessLineId?: string;
  channelId?: string;
  actorType: 'USER' | 'SYSTEM' | 'AUTOMATION' | 'AI';
  actorId: string;
}

// 3. Document Numbering (MGBOS-004)
export type DocumentType = 
  | 'ORD' // Order
  | 'QUO' // Quotation
  | 'REQ' // Requirement
  | 'LED' // Lead
  | 'JOB' // Production Job
  | 'INV' // Invoice
  | 'PAY' // Payment Receipt
  | 'PO'  // Purchase Order
  | 'SHP' // Shipment
  | 'QCI'; // QC Inspection

export interface DocumentNumberComponents {
  brandPrefix: string;
  docType: DocumentType;
  year: number;
  sequence: number;
}

// 4. Financial Cost Trilogy Representation
export type MoneyAmount = bigint | number;

export interface CostTrilogy {
  estimatedCost: MoneyAmount; // Quote stage
  committedCost: MoneyAmount; // PO stage
  actualCost: MoneyAmount;    // Delivery & Settlement stage
}
