/**
 * MGBOS System Context & Identity (MGBOS-003)
 * Manages active brand context, actor identity, and global scoping across MGBOS.
 */

import { SystemContext } from '../types';

export const DEFAULT_HOLDING_ORG_ID = '00000000-0000-0000-0000-000000000001';

export const BRAND_DEFINITIONS: Record<string, { name: string; prefix: string; defaultLine: string }> = {
  teestock: {
    name: 'TeeStock Apparel',
    prefix: 'TS',
    defaultLine: 'ts_custom_atelier',
  },
  multigraph: {
    name: 'MultiGraph Printing',
    prefix: 'MG',
    defaultLine: 'mg_commercial',
  },
  neopack: {
    name: 'NeoPack',
    prefix: 'NP',
    defaultLine: 'np_retail_boxes',
  },
  packpoint: {
    name: 'Pack Point',
    prefix: 'PP',
    defaultLine: 'pp_corrugated',
  },
  squeegee: {
    name: 'Squeegee Studios',
    prefix: 'SQ',
    defaultLine: 'sq_screenprint',
  },
};

/**
 * Creates a default system context for TeeStock Custom Atelier pilot
 */
export function createDefaultContext(overrides?: Partial<SystemContext>): SystemContext {
  const brandId = overrides?.brandId || 'teestock';
  const brandInfo = BRAND_DEFINITIONS[brandId] || BRAND_DEFINITIONS.teestock;

  return {
    organizationId: overrides?.organizationId || DEFAULT_HOLDING_ORG_ID,
    brandId,
    businessLineId: overrides?.businessLineId || brandInfo.defaultLine,
    channelId: overrides?.channelId || 'whatsapp',
    actorType: overrides?.actorType || 'USER',
    actorId: overrides?.actorId || 'founder_sole_owner',
  };
}

/**
 * Validates that a system context has the mandatory operational tags
 */
export function validateSystemContext(context: SystemContext): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!context.organizationId) {
    errors.push('organizationId is required');
  }
  if (!context.brandId) {
    errors.push('brandId is required');
  }
  if (!context.actorType) {
    errors.push('actorType is required');
  }
  if (!context.actorId) {
    errors.push('actorId is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
