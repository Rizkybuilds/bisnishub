/**
 * TeeStock Procurements API (Pengadaan Bahan & BOM)
 * Mengelola belanja bahan baku Kaos NSA (satuan vs lusinan), Roll DTF meteran,
 * dan kemasan (polymailer, stiker, label thermal).
 */
import { supabase } from './supabase';

const STORAGE_KEY = 'teestock_procurements';

// Live Mode: Data fiktif telah dibersihkan
const STARTER_PROCUREMENTS = [];

export async function getProcurements() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('ts_procurements')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Filter out any legacy dummy records from DB if present
        const liveRows = data.filter(d => !d.id?.startsWith('proc-00') && !d.procurement_no?.startsWith('PO-2609-00'));
        return liveRows.map(mapFromSupabase);
      }
    } catch (err) {
      console.warn('Supabase getProcurements fallback:', err.message);
    }
  }

  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      // Filter out any legacy dummy records
      const clean = parsed.filter(p => !p.id?.startsWith('proc-00') && !p.procurementNo?.startsWith('PO-2609-00'));
      return clean;
    } catch (e) {
      console.error("Failed to parse local procurements", e);
    }
  }

  return [];
}

export async function saveProcurement(procData) {
  const qty = Number(procData.qty) || 1;
  const unitCost = Number(procData.unitCost) || 0;
  const shippingCost = Number(procData.shippingCost) || 0;
  
  // Dukung kalkulasi landed cost fleksibel (bisa dioper langsung dari matrix wholesale)
  const totalCost = procData.totalCost !== undefined 
    ? Number(procData.totalCost) 
    : (qty * unitCost) + shippingCost;
  const realUnitCost = procData.realUnitCost !== undefined 
    ? Number(procData.realUnitCost) 
    : (qty > 0 ? Math.round(totalCost / qty) : unitCost);

  const generateUuid = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const newProc = {
    id: procData.id || generateUuid(),
    procurementNo: procData.procurementNo || `PO-${Date.now().toString().slice(-6)}`,
    itemType: procData.itemType || 'blank_tshirt',
    inventoryItems: procData.inventoryItems || [],
    itemSku: procData.itemSku || '',
    itemName: procData.itemName,
    supplierName: procData.supplierName || 'Distributor NSA',
    purchaseType: procData.purchaseType || 'lusinan',
    qty,
    unitMeasure: procData.unitMeasure || 'pcs',
    unitCost,
    shippingCost,
    totalCost,
    realUnitCost,
    paymentSource: procData.paymentSource || 'business_bank',
    receiptUrl: procData.receiptUrl || '',
    notes: procData.notes || '',
    itemsBreakdown: procData.itemsBreakdown || null,
    yieldCalculation: procData.yieldCalculation || null,
    vendorType: procData.vendorType || 'external_vendor',
    createdAt: procData.createdAt || new Date().toISOString()
  };

  // 1. Simpan ke Supabase jika aktif
  if (supabase) {
    try {
      const { error } = await supabase.from('ts_procurements').insert([mapToSupabase(newProc)]);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase saveProcurement warning:', err.message);
      throw err;
    }
  }

  // 2. Simpan ke LocalStorage
  const current = await getProcurements();
  const updated = current.some(proc => proc.id === newProc.id) ? current : [newProc, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // The database procurement trigger owns cash posting.
  return updated;
}

export async function deleteProcurement() {
  throw new Error('Pengadaan sudah tercatat pada stok dan kas. Penghapusan dinonaktifkan sampai proses koreksi tersedia.');
}

function mapFromSupabase(row) {
  return {
    id: row.id,
    procurementNo: row.procurement_no,
    itemType: row.item_type,
    inventoryItems: row.inventory_items || [],
    itemSku: row.item_sku,
    itemName: row.item_name,
    supplierName: row.supplier_name,
    purchaseType: row.purchase_type,
    qty: Number(row.qty),
    unitMeasure: row.unit_measure,
    unitCost: Number(row.unit_cost),
    shippingCost: Number(row.shipping_cost || 0),
    totalCost: Number(row.total_cost),
    realUnitCost: Number(row.qty) > 0 ? Math.round(Number(row.total_cost) / Number(row.qty)) : Number(row.unit_cost),
    paymentSource: row.payment_source,
    receiptUrl: row.receipt_url,
    notes: row.notes,
    createdAt: row.created_at
  };
}

function mapToSupabase(item) {
  const isUuid = item.id && item.id.includes('-') && item.id.length === 36;
  return {
    id: isUuid ? item.id : undefined,
    procurement_no: item.procurementNo,
    item_type: item.itemType,
    inventory_items: item.inventoryItems,
    item_sku: item.itemSku,
    item_name: item.itemName,
    supplier_name: item.supplierName,
    purchase_type: item.purchaseType,
    qty: item.qty,
    unit_measure: item.unitMeasure,
    unit_cost: item.unitCost,
    shipping_cost: item.shippingCost,
    total_cost: item.totalCost,
    payment_source: item.paymentSource,
    receipt_url: item.receiptUrl,
    notes: item.notes,
    created_at: item.createdAt
  };
}
