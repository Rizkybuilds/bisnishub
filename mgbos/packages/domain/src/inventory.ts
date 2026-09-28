export type InventoryCategory =
  'BLANK_GARMENT' | 'PRINT_MATERIAL' | 'PACKAGING' | 'FINISHED_GOOD' | 'OTHER';

export type InventoryMutationType =
  | 'INBOUND_PURCHASE'
  | 'RESERVATION'
  | 'RELEASE_RESERVATION'
  | 'CONSUMED_PRODUCTION'
  | 'SCRAP_DEFECT'
  | 'OUTBOUND_SHIPMENT'
  | 'STOCK_OPNAME';

export type ReservationStatus = 'ACTIVE' | 'CONSUMED' | 'RELEASED';

export interface InventoryItemAttributes {
  color?: string;
  size?: string;
  brand?: string;
  material?: string;
  gsm?: number;
  width_cm?: number;
  length_m?: number;
  [key: string]: unknown;
}

export interface InventoryItem {
  id: string;
  organizationId: string;
  brandId?: string | null;
  sku: string;
  name: string;
  category: InventoryCategory;
  unit: string;
  attributes: InventoryItemAttributes;
  costPrice: bigint;
  minStockAlert: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLevel {
  id: string;
  organizationId: string;
  inventoryItemId: string;
  locationCode: string;
  binLocation?: string | null;
  quantityOnHand: number;
  quantityReserved: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMutation {
  id: string;
  organizationId: string;
  inventoryItemId: string;
  locationCode: string;
  mutationType: InventoryMutationType;
  quantityChange: number;
  quantityOnHandAfter: number;
  quantityReservedAfter: number;
  referenceType?: string | null;
  referenceId?: string | null;
  notes?: string | null;
  actorId: string;
  createdAt: string;
}

export interface InventoryReservation {
  id: string;
  organizationId: string;
  inventoryItemId: string;
  orderId: string;
  orderItemId?: string | null;
  locationCode: string;
  quantity: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Calculates stock currently available for new orders:
 * Available = max(0, quantityOnHand - quantityReserved)
 */
export function calculateAvailableStock(
  quantityOnHand: number,
  quantityReserved: number,
): number {
  return Math.max(0, quantityOnHand - Math.max(0, quantityReserved));
}

/**
 * Determines if available stock has breached the minimum alert threshold.
 */
export function isStockAlertTriggered(
  quantityOnHand: number,
  quantityReserved: number,
  minStockAlert: number,
): boolean {
  const available = calculateAvailableStock(quantityOnHand, quantityReserved);
  return available <= minStockAlert;
}

/**
 * Computes total inventory valuation in Integer Rupiah (Zero-Float).
 */
export function calculateInventoryValuation(
  quantityOnHand: number,
  costPrice: bigint | number,
): bigint {
  const qty = BigInt(Math.max(0, Math.floor(quantityOnHand)));
  const cost =
    typeof costPrice === 'bigint'
      ? costPrice
      : BigInt(Math.max(0, Math.round(costPrice)));
  return qty * cost;
}

/**
 * Indonesian label for Inventory Category.
 */
export function formatInventoryCategoryLabel(
  category: InventoryCategory,
): string {
  switch (category) {
    case 'BLANK_GARMENT':
      return 'Kaos Polos (Blanks)';
    case 'PRINT_MATERIAL':
      return 'Bahan Cetak (DTF/Tinta)';
    case 'PACKAGING':
      return 'Kemasan & Packaging';
    case 'FINISHED_GOOD':
      return 'Barang Jadi (Ready)';
    case 'OTHER':
    default:
      return 'Lainnya';
  }
}

/**
 * Indonesian label for Inventory Mutation Type.
 */
export function formatMutationTypeLabel(type: InventoryMutationType): string {
  switch (type) {
    case 'INBOUND_PURCHASE':
      return 'Penerimaan Pembelian (PO)';
    case 'RESERVATION':
      return 'Reservasi Pesanan';
    case 'RELEASE_RESERVATION':
      return 'Pelepasan Reservasi';
    case 'CONSUMED_PRODUCTION':
      return 'Pemakaian Produksi';
    case 'SCRAP_DEFECT':
      return 'Afkir / Rusak (Scrap)';
    case 'OUTBOUND_SHIPMENT':
      return 'Pengiriman Keluar';
    case 'STOCK_OPNAME':
      return 'Stock Opname / Penyesuaian';
    default:
      return type;
  }
}
