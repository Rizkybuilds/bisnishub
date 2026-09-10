/**
 * TeeStock Procurements API (Pengadaan Bahan & BOM)
 * Mengelola belanja bahan baku Kaos NSA (satuan vs lusinan), Roll DTF meteran,
 * dan kemasan (polymailer, stiker, label thermal).
 */
import { supabase } from './supabase';
import { addCashTransaction } from './ledgerApi';

const STORAGE_KEY = 'teestock_procurements';

const STARTER_PROCUREMENTS = [
  {
    id: 'proc-001',
    procurementNo: 'PO-2609-001',
    itemType: 'blank_tshirt',
    itemSku: 'NSA-30S-BLK-L',
    itemName: 'NSA Softstyle 30s Black L (1 Lusin)',
    supplierName: 'Distributor Resmi NSA',
    purchaseType: 'lusinan',
    qty: 12,
    unitMeasure: 'pcs',
    unitCost: 35000,
    shippingCost: 15000,
    totalCost: 435000,
    realUnitCost: 36250, // (435.000 / 12)
    paymentSource: 'business_bank',
    receiptUrl: '',
    notes: 'Stok buffer warna favorit distro NSA 30s',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'proc-002',
    procurementNo: 'PO-2609-002',
    itemType: 'dtf_film',
    itemSku: 'DTF-ROLL-58CM',
    itemName: 'Roll Film DTF 58 cm x 100 m',
    supplierName: 'Vendor DTF Partner',
    purchaseType: 'roll_meter',
    qty: 25,
    unitMeasure: 'meter',
    unitCost: 30000,
    shippingCost: 0,
    totalCost: 750000,
    realUnitCost: 30000,
    paymentSource: 'business_bank',
    receiptUrl: '',
    notes: 'Roll cetak film DTF Batch 1',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'proc-003',
    procurementNo: 'PO-2609-003',
    itemType: 'packaging',
    itemSku: 'MAT-POLY-30X40',
    itemName: 'Polymailer Doff Hitam 30x40 cm (100 pcs)',
    supplierName: 'MultiGraph Packaging',
    purchaseType: 'partai',
    qty: 100,
    unitMeasure: 'pcs',
    unitCost: 800,
    shippingCost: 0,
    totalCost: 80000,
    realUnitCost: 800, // Rp 80.000 / 100 pcs
    paymentSource: 'business_bank',
    receiptUrl: '',
    notes: 'Kemasan standar distro waterproof',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'proc-004',
    procurementNo: 'PO-2609-004',
    itemType: 'packaging',
    itemSku: 'MAT-STICKER-VP',
    itemName: 'Stiker Vinyl Die-Cut 7 cm (100 pcs)',
    supplierName: 'MultiGraph Printing',
    purchaseType: 'partai',
    qty: 100,
    unitMeasure: 'pcs',
    unitCost: 600,
    shippingCost: 0,
    totalCost: 60000,
    realUnitCost: 600, // Rp 60.000 / 100 pcs
    paymentSource: 'business_bank',
    receiptUrl: '',
    notes: 'Bonus stiker packing unboxing experience',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export async function getProcurements() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('ts_procurements')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapFromSupabase);
      }
    } catch (err) {
      console.warn('Supabase getProcurements fallback:', err.message);
    }
  }

  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Failed to parse local procurements", e);
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_PROCUREMENTS));
  return STARTER_PROCUREMENTS;
}

export async function saveProcurement(procData) {
  const qty = Number(procData.qty) || 1;
  const unitCost = Number(procData.unitCost) || 0;
  const shippingCost = Number(procData.shippingCost) || 0;
  const totalCost = (qty * unitCost) + shippingCost;
  const realUnitCost = Math.round(totalCost / qty);

  const newProc = {
    id: procData.id || `proc-${Date.now()}`,
    procurementNo: procData.procurementNo || `PO-${Date.now().toString().slice(-6)}`,
    itemType: procData.itemType || 'blank_tshirt',
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
    createdAt: procData.createdAt || new Date().toISOString()
  };

  // 1. Simpan ke Supabase jika aktif
  if (supabase) {
    try {
      await supabase.from('ts_procurements').insert([mapToSupabase(newProc)]);
    } catch (err) {
      console.warn('Supabase saveProcurement warning:', err.message);
    }
  }

  // 2. Simpan ke LocalStorage
  const current = await getProcurements();
  const updated = [newProc, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // 3. Otomatis catat ke Buku Kas (CASH_OUT)
  await addCashTransaction({
    transactionNo: `TX-PO-${newProc.procurementNo.slice(-6)}`,
    date: new Date().toISOString().slice(0, 10),
    type: 'CASH_OUT',
    category: 'procurement',
    amount: totalCost,
    sourceAccount: newProc.paymentSource,
    destinationAccount: newProc.supplierName,
    relatedId: newProc.procurementNo,
    description: `Belanja: ${newProc.itemName} (${qty} ${newProc.unitMeasure} @ Rp ${unitCost.toLocaleString('id-ID')})`,
    isPersonalWallet: newProc.paymentSource === 'personal_pocket'
  });

  return updated;
}

export async function deleteProcurement(id) {
  if (supabase) {
    try {
      await supabase.from('ts_procurements').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteProcurement warning:', err.message);
    }
  }

  const current = await getProcurements();
  const updated = current.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

function mapFromSupabase(row) {
  return {
    id: row.id,
    procurementNo: row.procurement_no,
    itemType: row.item_type,
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
  return {
    id: item.id.includes('-') && item.id.length === 36 ? item.id : undefined,
    procurement_no: item.procurementNo,
    item_type: item.itemType,
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
