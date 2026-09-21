/**
 * TeeStock Procurements API (Pengadaan Bahan & BOM)
 * Mengelola belanja bahan baku Kaos NSA (satuan vs lusinan), Roll DTF meteran,
 * dan kemasan (polymailer, stiker, label thermal).
 */
import { supabase } from './supabase';
import { addCashTransaction } from './ledgerApi';

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

      if (!error && data && data.length > 0) {
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
      await supabase.from('ts_procurements').insert([mapToSupabase(newProc)]);
    } catch (err) {
      console.warn('Supabase saveProcurement warning:', err.message);
    }
  }

  // 2. Simpan ke LocalStorage
  const current = await getProcurements();
  const updated = [newProc, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // 3. Otomatis catat ke Buku Kas (CASH_OUT) jika recordCashTx aktif (default true)
  if (procData.recordCashTx !== false) {
    let txDesc = `Belanja: ${newProc.itemName} (${qty} ${newProc.unitMeasure} @ Rp ${unitCost.toLocaleString('id-ID')})`;
    if (newProc.itemsBreakdown && newProc.itemsBreakdown.length > 0) {
      txDesc = `Belanja Grosir: ${newProc.itemName} (${qty} pcs mix ukuran/warna + Ongkir Rp ${shippingCost.toLocaleString('id-ID')})`;
    } else if (newProc.itemType === 'design_license') {
      txDesc = `Beli Lisensi Desain: ${newProc.itemName} via ${newProc.supplierName}`;
    } else if (newProc.itemType === 'sticker_vendor' || newProc.yieldCalculation) {
      const sheets = newProc.yieldCalculation?.sheetQty || 1;
      txDesc = `Cetak Stiker Luar: ${newProc.itemName} (${sheets} lbr A3+ jadi ${qty} pcs + Ongkir Rp ${shippingCost.toLocaleString('id-ID')})`;
    }

    // Map COGS Category for CFO P&L Accounting
    let txCategory = 'blank_garment';
    if (newProc.itemType === 'dtf_film') {
      txCategory = 'dtf_printing';
    } else if (newProc.itemType === 'design_license') {
      txCategory = 'design_license';
    } else if (newProc.itemType === 'sticker_vendor' || newProc.itemType === 'packaging' || newProc.itemType === 'supplies') {
      txCategory = 'unboxing_packaging';
    }

    // Map Isolated Source Wallet & Business Unit
    let sourceWallet = 'wallet_teestock';
    let businessUnit = 'teestock';
    if (newProc.paymentSource === 'multigraph_bank') {
      sourceWallet = 'wallet_multigraph';
      businessUnit = 'multigraph';
    } else if (newProc.paymentSource === 'holding_treasury') {
      sourceWallet = 'wallet_holding';
      businessUnit = 'holding';
    } else if (newProc.paymentSource === 'personal_pocket') {
      sourceWallet = 'wallet_founder';
      businessUnit = 'founder';
    }

    await addCashTransaction({
      transactionNo: `TX-PO-${newProc.procurementNo.slice(-6)}`,
      date: new Date().toISOString().slice(0, 10),
      businessUnit,
      type: 'CASH_OUT',
      category: txCategory,
      amount: totalCost,
      sourceWallet,
      destinationWallet: newProc.supplierName,
      sourceAccount: newProc.paymentSource,
      destinationAccount: newProc.supplierName,
      relatedId: newProc.procurementNo,
      proofReceiptRef: newProc.procurementNo,
      description: txDesc,
      isPersonalWallet: newProc.paymentSource === 'personal_pocket'
    });
  }

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
  const isUuid = item.id && item.id.includes('-') && item.id.length === 36;
  return {
    id: isUuid ? item.id : undefined,
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
