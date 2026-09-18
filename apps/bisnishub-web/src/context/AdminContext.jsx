import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProducts, saveProduct as apiSaveProduct, deleteProduct as apiDeleteProduct, clearAllProducts as apiClearAllProducts } from '../services/productsApi';
import { 
  getOrders, 
  saveOrder as apiSaveOrder, 
  updateOrderStatus as apiUpdateOrderStatus,
  updateOrderTracking as apiUpdateOrderTracking,
  cancelOrder as apiCancelOrder
} from '../services/ordersApi';
import { 
  getInventoryMatrix, 
  saveInventoryMatrix, 
  deductStock, 
  deductDtfFilm, 
  deductSupplyItem,
  restockDtfFilm, 
  restockDtfBatch,
  restockBlankGarment,
  restockGarmentBatch,
  restockSupplyItem,
  getBlankGarmentSku,
  getSupplySku,
  updateDatabaseInventoryItem,
  adjustStockOpname
} from '../services/inventoryApi';
import { 
  getCashTransactions, 
  addCashTransaction as apiAddCashTransaction,
  recordCashTransaction as apiRecordCashTransaction,
  recordInterUnitTransfer as apiRecordInterUnitTransfer,
  calculateLedgerSummary,
  calculateMultiUnitBalances,
  calculateUnitPnl,
  calculateRunwayAndBurnRate,
  calculateBusinessValuation,
  WALLETS,
  TRANSACTION_CATEGORIES
} from '../services/ledgerApi';
import { getFixedAssets, saveFixedAsset as apiSaveFixedAsset, deleteFixedAsset as apiDeleteFixedAsset, getTotalFixedAssetsValue } from '../services/assetsApi';
import { getProcurements, saveProcurement as apiSaveProcurement, deleteProcurement as apiDeleteProcurement } from '../services/procurementsApi';
import { GARMENT_TYPES } from '../constants/garments';
import { testSupabaseConnection } from '../services/supabase';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [catalog, setCatalog] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState({});
  const [procurements, setProcurements] = useState([]);
  const [cashTransactions, setCashTransactions] = useState([]);
  const [fixedAssets, setFixedAssets] = useState([]);
  const [supabaseStatus, setSupabaseStatus] = useState({ connected: false, message: 'Checking...' });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    async function init() {
      try {
        const [prods, ords, inv, procs, txs, assets, sbStatus] = await Promise.all([
          getProducts(),
          getOrders(),
          getInventoryMatrix(),
          getProcurements(),
          getCashTransactions(),
          getFixedAssets(),
          testSupabaseConnection()
        ]);
        setCatalog(prods);
        setOrders(ords);
        setInventory(inv);
        setProcurements(procs);
        setCashTransactions(txs);
        setFixedAssets(assets);
        setSupabaseStatus(sbStatus);
      } catch (err) {
        console.error("Admin context init error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Move status of an order (Kanban)
  const advanceOrderStatus = async (orderId, dir) => {
    const statuses = ["pending", "dtf", "press", "pack", "shipped"];
    const target = orders.find(o => o.id === orderId);
    if (!target) return;

    // Normalisasi index: 'pending_payment' diposisikan di index 0 ("pending")
    const normalizedStatus = (target.status === 'pending_payment') ? 'pending' : target.status;
    const currIdx = statuses.indexOf(normalizedStatus);
    const nextIdx = currIdx + dir;
    if (nextIdx < 0 || nextIdx >= statuses.length) return;

    const oldStatus = target.status;
    const nextStatus = statuses[nextIdx];

    // Deduct stock and sync cash if order advances from pending/pending_payment -> production (dtf or press)
    const isAdvancingFromPending = (oldStatus === "pending" || oldStatus === "pending_payment");
    if (isAdvancingFromPending && (nextStatus === "dtf" || nextStatus === "press")) {
      // 1. Deduct inventory (with idempotency check to prevent double deduction)
      if (!target.inventoryDeducted) {
        let updatedInv = { ...inventory };
        let totalDeductedGarmen = 0;

        if (target.items && target.items.length > 0) {
          target.items.forEach(it => {
            let gKey = "nsa_softstyle_30s";
            if (it.garment?.includes("24s")) gKey = "nsa_heavyweight_24s";
            else if (it.garment?.includes("Long")) gKey = "nsa_longsleeve";
            else if (it.garment?.includes("Hoodie")) gKey = "nsa_hoodie";
            else if (it.garment?.includes("Polo")) gKey = "nsa_polo";

            const col = it.color || "Hitam";
            const sz = it.size || "L";
            const qty = Number(it.qty) || 1;
            totalDeductedGarmen += qty;

            updatedInv = deductStock(updatedInv, gKey, col, sz, qty);

            const isBlank = it.sku?.startsWith("TS-BLK") || it.garment === "blank";
            if (!isBlank && it.sku) {
              updatedInv = deductDtfFilm(updatedInv, it.sku, qty);
            }
          });
        } else {
          let gKey = "nsa_softstyle_30s";
          if (target.garment?.includes("24s")) gKey = "nsa_heavyweight_24s";
          else if (target.garment?.includes("Long")) gKey = "nsa_longsleeve";
          else if (target.garment?.includes("Hoodie")) gKey = "nsa_hoodie";
          else if (target.garment?.includes("Polo")) gKey = "nsa_polo";

          const col = target.color || "Hitam";
          const sz = target.size || "L";
          const qty = Number(target.qty) || 1;
          totalDeductedGarmen += qty;

          updatedInv = deductStock(updatedInv, gKey, col, sz, qty);

          const isBlank = target.sku?.startsWith("TS-BLK") || target.garment === "blank";
          if (!isBlank && target.sku) {
            updatedInv = deductDtfFilm(updatedInv, target.sku, qty);
          }
        }

        // Deduct packaging supplies
        const packQty = totalDeductedGarmen || Number(target.qty) || 1;
        updatedInv = deductSupplyItem(updatedInv, 'polymailer', packQty);
        updatedInv = deductSupplyItem(updatedInv, 'sticker', packQty);
        updatedInv = deductSupplyItem(updatedInv, 'care_card', packQty);
        updatedInv = deductSupplyItem(updatedInv, 'hangtag', packQty);

        setInventory(updatedInv);
        target.inventoryDeducted = true;
        showToast(`📦 Stok bahan (${totalDeductedGarmen} kaos + film DTF + unboxing pack) otomatis dipotong!`, 'info');
      }

      // 2. Sync Cash Inflow to Cash Ledger (if not already recorded)
      const isAlreadyRecorded = cashTransactions.some(tx => tx.relatedId === target.id);
      if (!isAlreadyRecorded) {
        const orderAmt = Number(target.price || target.total_amount || 0);
        if (orderAmt > 0) {
          const newTx = {
            transactionNo: `TX-ORD-${target.id.slice(-6)}`,
            date: new Date().toISOString().slice(0, 10),
            businessUnit: 'teestock',
            type: 'CASH_IN',
            category: 'sales_retail',
            amount: orderAmt,
            sourceWallet: 'wallet_teestock',
            destinationWallet: 'wallet_teestock',
            relatedId: target.id,
            proofReceiptRef: `ORDER-${target.id}`,
            description: `Penjualan Ritel [${(target.channel || 'web').toUpperCase()}]: ${target.customer} - ${target.productName || target.sku} (${target.qty || 1} pcs)`,
            settlementStatus: 'cleared'
          };
          const updatedTxs = await apiRecordCashTransaction(newTx);
          setCashTransactions(updatedTxs);
          showToast(`💰 Kas Masuk Rp ${orderAmt.toLocaleString('id-ID')} dicatat ke Rekening TeeStock!`, 'success');
        }
      }
    }

    const updatedOrders = await apiUpdateOrderStatus(orderId, nextStatus);
    setOrders(updatedOrders);
    showToast(`🔄 Status pesanan ${orderId} dipindahkan ke [${nextStatus.toUpperCase()}]`);
  };

  const updateOrderTracking = async (orderId, trackingNo, courier) => {
    const updated = await apiUpdateOrderTracking(orderId, trackingNo, courier);
    setOrders(updated);
    showToast(`🚚 Resi untuk order ${orderId} berhasil disimpan: ${trackingNo}`);
  };

  const cancelOrder = async (orderId, reason) => {
    const updated = await apiCancelOrder(orderId, reason);
    setOrders(updated);
    showToast(`❌ Pesanan ${orderId} telah dibatalkan`);
  };

  // Record QC Defect / Reject deduction (Strict Zero-Leakage: only valid way to deduct scrap)
  const recordDefectDeduction = (defectData) => {
    let nextInv = { ...inventory };
    const qty = Number(defectData.qty) || 1;
    const details = [];

    // 1. Potong Garmen Polos (jika ada data garmen)
    if (defectData.garmentKey && defectData.garmentColor && defectData.garmentSize) {
      nextInv = deductStock(nextInv, defectData.garmentKey, defectData.garmentColor, defectData.garmentSize, qty);
      details.push(`Kaos ${defectData.garmentColor} (${defectData.garmentSize}) -${qty} pcs`);
    } else if (defectData.itemType === 'blank_tshirt' && defectData.garmentKey && defectData.color && defectData.size) {
      nextInv = deductStock(nextInv, defectData.garmentKey, defectData.color, defectData.size, qty);
      details.push(`Kaos ${defectData.color} (${defectData.size}) -${qty} pcs`);
    } else if (defectData.sku?.startsWith('NSA-')) {
      const parts = defectData.sku.split('-');
      if (parts.length >= 4) {
        const gKey = parts[1] === '30S' ? 'nsa_softstyle_30s' : parts[1] === '24S' ? 'nsa_heavyweight_24s' : 'nsa_softstyle_30s';
        const col = parts[2];
        const sz = parts[parts.length - 1];
        nextInv = deductStock(nextInv, gKey, col, sz, qty);
        details.push(`Kaos ${col} (${sz}) -${qty} pcs`);
      }
    }

    // 2. Potong Film DTF (jika ada data film DTF atau jika defectType === heat_press_failed / dtf_print)
    const targetFilmSku = defectData.dtfSku || (defectData.itemType === 'dtf_film' ? defectData.sku : null) || (defectData.defectType === 'heat_press_failed' && defectData.sku && !defectData.sku.startsWith('NSA-') ? defectData.sku : null);
    if (targetFilmSku) {
      nextInv = deductDtfFilm(nextInv, targetFilmSku, qty);
      details.push(`Film DTF [${targetFilmSku}] -${qty} lbr`);
    }

    // 3. Potong Bahan Kemasan (jika reject kemasan)
    if (defectData.itemType === 'supplies' && defectData.supplyId) {
      nextInv = deductSupplyItem(nextInv, defectData.supplyId, qty);
      details.push(`Kemasan ${defectData.supplyId} -${qty} pcs`);
    }

    setInventory(nextInv);
    const detailMsg = details.length > 0 ? details.join(' & ') : `Item [${defectData.sku}] -${qty} pcs`;
    showToast(`🛡️ Reject QC sah: Stok ${detailMsg} otomatis dipotong dari gudang fisik.`);
    return nextInv;
  };

  // Add new order
  const addOrder = async (newOrder) => {
    const updated = await apiSaveOrder(newOrder);
    setOrders(updated);
    showToast(`✅ Pesanan baru ${newOrder.id} berhasil dicatat!`);
  };

  // Save / update design in catalog
  const saveProduct = async (product) => {
    const updated = await apiSaveProduct(product);
    setCatalog(updated);
    showToast(`✅ Desain [${product.sku}] berhasil disimpan ke Master PIM!`);
    return updated;
  };

  // Delete design from catalog
  const deleteProduct = async (sku) => {
    const updated = await apiDeleteProduct(sku);
    setCatalog(updated);
    showToast(`🗑️ Desain [${sku}] berhasil dihapus dari Master PIM!`);
    return updated;
  };

  // Clear all catalog products
  const clearAllCatalogProducts = async () => {
    const updated = await apiClearAllProducts();
    setCatalog(updated);
    showToast(`🧹 Seluruh data desain di Master PIM berhasil dibersihkan!`);
    return updated;
  };

  // Restock blank inventory
  const restockInventory = (gKey, col, sz, qty) => {
    const next = JSON.parse(JSON.stringify(inventory));
    if (!next[gKey]) next[gKey] = {};
    if (!next[gKey][col]) next[gKey][col] = {};
    const curr = next[gKey][col][sz] || 0;
    next[gKey][col][sz] = curr + Number(qty);
    saveInventoryMatrix(next);
    setInventory(next);
    showToast(`✅ Restok +${qty} pcs ${col} (${sz}) berhasil disimpan!`);
  };

  // Update specific stock cell in place
  const updateStockCell = (gKey, col, sz, val) => {
    const next = JSON.parse(JSON.stringify(inventory));
    const newQty = Math.max(0, parseInt(val, 10) || 0);

    if (gKey === 'supplies') {
      if (!next.supplies) next.supplies = {};
      next.supplies[col] = newQty;
      saveInventoryMatrix(next);
      setInventory(next);
      const supplySku = getSupplySku(col);
      updateDatabaseInventoryItem(supplySku, newQty);
      showToast(`Stok kemasan/material diperbarui: ${col} = ${newQty}`);
      return;
    }

    if (!next[gKey]) next[gKey] = {};
    if (!next[gKey][col]) next[gKey][col] = {};
    next[gKey][col][sz] = newQty;
    saveInventoryMatrix(next);
    setInventory(next);

    const garmentSku = getBlankGarmentSku(gKey, col, sz);
    updateDatabaseInventoryItem(garmentSku, newQty);
    showToast(`Stok diperbarui: ${col} (${sz}) = ${newQty} pcs`);
  };

  // Restock batch of DTF film sheets (from Gang Sheet Builder)
  const restockDtfBatchAction = (items = []) => {
    const updated = restockDtfBatch(inventory, items);
    setInventory(updated);
    const totalSheets = items.reduce((sum, it) => sum + (Number(it.qty) || 1), 0);
    showToast(`🎉 Sukses mencatat +${totalSheets} lembar film DTF ke stok studio!`);
  };

  // Update single DTF film stock in place
  const updateDtfFilmStock = (sku, val) => {
    const next = JSON.parse(JSON.stringify(inventory));
    if (!next.dtf_films) next.dtf_films = {};
    if (next.dtf_films[sku]) {
      const newQty = Math.max(0, parseInt(val, 10) || 0);
      next.dtf_films[sku].ready = newQty;
      saveInventoryMatrix(next);
      setInventory(next);
      updateDatabaseInventoryItem(sku, newQty);
      showToast(`Stok Film DTF [${sku}] diperbarui: ${newQty} lembar`);
    }
  };

  // Record official authorized stock opname adjustment (Zero-Leakage with audit log)
  const recordStockOpname = (payload) => {
    const { updatedMatrix, opnameLog } = adjustStockOpname(inventory, payload);
    setInventory(updatedMatrix);
    const diffSign = opnameLog.diffQty >= 0 ? `+${opnameLog.diffQty}` : `${opnameLog.diffQty}`;
    showToast(`✅ Stock Opname berhasil dicatat: ${opnameLog.sku} (${diffSign} ${opnameLog.diffQty >= 0 ? 'ditemukan' : 'selisih minus'})`);
    return { updatedMatrix, opnameLog };
  };

  // Helper to check DTF film readiness for a given SKU
  const getDtfFilmStatus = (sku) => {
    if (!sku || sku.startsWith("TS-BLK")) return null;
    const film = inventory?.dtf_films?.[sku];
    if (!film) return { ready: 0, min: 2, isReady: false, isLow: true, unitCost: 12000, name: sku };
    return {
      name: film.name || sku,
      ready: film.ready || 0,
      min: film.min || 2,
      isReady: (film.ready || 0) > 0,
      isLow: (film.ready || 0) <= (film.min || 2),
      unitCost: film.unitCost || 12000
    };
  };

  // 1. Procurements actions & Real-Time Inventory Stock Synchronization
  const addProcurement = async (procData) => {
    const updated = await apiSaveProcurement(procData);
    setProcurements(updated);
    const updatedTxs = await getCashTransactions();
    setCashTransactions(updatedTxs);

    // 📦 SINKRONISASI OTOMATIS KE INVENTORI STOK FISIK
    let nextInv = { ...inventory };
    let syncDetail = '';

    // A. Wholesale Garment Batch (Multi-warna & Multi-ukuran)
    if (procData.itemType === 'blank_tshirt' && procData.itemsBreakdown && procData.itemsBreakdown.length > 0) {
      nextInv = restockGarmentBatch(nextInv, procData.garmentKey, procData.itemsBreakdown);
      setInventory(nextInv);
      syncDetail = ` (${procData.qty} pcs mix warna & ukuran masuk stok)`;
    } 
    // B. Wholesale Garment Single Item (Fallback)
    else if (procData.itemType === 'blank_tshirt' && procData.garmentKey && procData.color && procData.size) {
      nextInv = restockBlankGarment(nextInv, procData.garmentKey, procData.color, procData.size, procData.qty);
      setInventory(nextInv);
      syncDetail = ` (Stok ${procData.color} ${procData.size} +${procData.qty} pcs)`;
    } 
    // C. Outsourced Sticker (Vendor Luar A3+ Lembaran ke Pcs Jadi)
    else if (procData.itemType === 'sticker_vendor' || (procData.itemType === 'packaging' && procData.supplyId === 'sticker')) {
      const stickerQty = Number(procData.qty) || 0;
      nextInv = restockSupplyItem(nextInv, 'sticker', stickerQty);
      setInventory(nextInv);
      syncDetail = ` (+${stickerQty} pcs stiker unboxing masuk stok)`;
    }
    // D. Polymailer & Packaging Supplies (Multi-Satuan Lusin/Pack/Pcs)
    else if ((procData.itemType === 'packaging' || procData.itemType === 'supplies') && procData.supplyId) {
      const supplyQty = Number(procData.qty) || 0;
      nextInv = restockSupplyItem(nextInv, procData.supplyId, supplyQty);
      setInventory(nextInv);
      syncDetail = ` (Stok ${procData.supplyId} +${supplyQty} pcs)`;
    } 
    // E. Roll Film DTF Meteran & Alokasi Lembar Desain Fisik
    else if (procData.itemType === 'dtf_film') {
      if (procData.itemsBreakdown && procData.itemsBreakdown.length > 0) {
        // Multi-Design Gang Sheet: Restok lembar film siap press per SKU desain
        nextInv = restockDtfBatch(nextInv, procData.itemsBreakdown);
        setInventory(nextInv);
        const totalSheets = procData.itemsBreakdown.reduce((sum, b) => sum + (Number(b.qty) || 0), 0);
        syncDetail = ` (+${totalSheets} lembar film DTF masuk stok untuk ${procData.itemsBreakdown.length} desain)`;
      } else if (procData.dtfSku) {
        const landedMeterCost = procData.realUnitCost || procData.unitCost || 30000;
        nextInv = restockDtfFilm(nextInv, procData.dtfSku, procData.qty, landedMeterCost, procData.itemName);
        setInventory(nextInv);
        syncDetail = ` (Stok Film DTF +${procData.qty} meter)`;
      }
    }

    showToast(`✅ Pengadaan ${procData.itemName} berhasil dicatat & stok otomatis terupdate!${syncDetail}`);
  };

  const removeProcurement = async (id) => {
    const updated = await apiDeleteProcurement(id);
    setProcurements(updated);
    showToast(`🗑️ Data pengadaan berhasil dihapus`);
  };

  // 2. Cash Ledger actions
  const recordCashTransaction = async (txData) => {
    const updated = await apiRecordCashTransaction(txData);
    setCashTransactions(updated);
    const label = txData.type === 'CASH_IN' ? 'Masuk' : txData.type === 'CASH_OUT' ? 'Keluar' : txData.type;
    showToast(`✅ Transaksi kas ${label} Rp ${Number(txData.amount).toLocaleString('id-ID')} dicatat!`);
  };

  const recordInterUnitTransferAction = async (transferData) => {
    const updated = await apiRecordInterUnitTransfer(transferData);
    setCashTransactions(updated);
    showToast(`⇄ Transfer internal ${transferData.fromUnit?.toUpperCase()} ke ${transferData.toUnit?.toUpperCase()} Rp ${Number(transferData.amount).toLocaleString('id-ID')} berhasil dibukukan!`);
  };

  // 3. Fixed Assets actions
  const addFixedAsset = async (assetData) => {
    const updated = await apiSaveFixedAsset(assetData);
    setFixedAssets(updated);

    // Jika user memilih memotong kas langsung (Realisasi CAPEX)
    if (assetData.recordCashTx && assetData.paymentSource) {
      const sourceUnit = assetData.paymentSource === 'wallet_holding' 
        ? 'holding' 
        : assetData.paymentSource === 'wallet_multigraph' 
        ? 'multigraph' 
        : assetData.paymentSource === 'wallet_founder'
        ? 'founder'
        : 'teestock';
        
      const txCategory = assetData.paymentSource === 'wallet_founder' 
        ? 'capital_injection' 
        : 'capex_purchase';
        
      const txType = assetData.paymentSource === 'wallet_founder'
        ? 'CAPITAL_INJECTION'
        : 'CASH_OUT';
        
      const updatedTxs = await apiRecordCashTransaction({
        transactionNo: `TX-CAPEX-${Date.now().toString().slice(-6)}`,
        date: assetData.acquisitionDate || new Date().toISOString().slice(0, 10),
        businessUnit: assetData.businessUnit || (sourceUnit === 'founder' ? 'holding' : sourceUnit),
        type: txType,
        category: txCategory,
        amount: Number(assetData.purchaseCost),
        sourceWallet: assetData.paymentSource,
        destinationWallet: assetData.paymentSource,
        relatedId: assetData.id || `asset-${Date.now()}`,
        proofReceiptRef: `CAPEX-PO-${Date.now().toString().slice(-4)}`,
        description: `Realisasi Pembelian Aset Tetap: ${assetData.assetName} (${(assetData.businessUnit || sourceUnit).toUpperCase()})`,
        settlementStatus: 'cleared'
      });
      setCashTransactions(updatedTxs);
      const walletLabel = WALLETS[sourceUnit]?.name || assetData.paymentSource;
      showToast(`✅ Aset ${assetData.assetName} disimpan & Kas ${walletLabel} terpotong Rp ${Number(assetData.purchaseCost).toLocaleString('id-ID')}!`);
      return;
    }

    showToast(`✅ Aset ${assetData.assetName} berhasil disimpan!`);
  };

  const removeFixedAsset = async (id) => {
    const updated = await apiDeleteFixedAsset(id);
    setFixedAssets(updated);
    showToast(`🗑️ Aset berhasil dihapus`);
  };

  // 4. Live Mode: Purge all lingering demo & fictitious cache
  const purgeAllDemoData = () => {
    if (typeof localStorage !== 'undefined') {
      const keys = [
        'teestock_procurements',
        'bisnishub_multiunit_ledger_v2',
        'teestock_fixed_assets',
        'ts_defects_cache',
        'teestock_orders_list',
        'teestock_my_orders',
        'bh_orders',
        'teestock_inventory_matrix',
        'teestock_catalog_products',
        'teestock_deleted_products'
      ];
      keys.forEach(k => localStorage.removeItem(k));
    }
    setCatalog([]);
    setProcurements([]);
    setCashTransactions([]);
    setFixedAssets([]);
    setOrders([]);
    setInventory({
      nsa_softstyle_30s: {},
      nsa_heavyweight_24s: {},
      supplies: {
        polymailer: 0,
        sticker: 0,
        care_card: 0,
        hangtag: 0,
        teflon_sheet: 0,
        lakban: 0
      },
      dtf_films: {}
    });
    showToast("🧹 Seluruh data fiktif (termasuk katalog PIM) berhasil dibersihkan! BisnisHub OS kini 100% bersih siap diuji coba secara live.");
  };

  // 4. Multi-Unit Isolated Ledgers, CFO P&L, & Runway Engine
  const multiUnitBalances = calculateMultiUnitBalances(cashTransactions);
  const teestockPnl = calculateUnitPnl(cashTransactions, 'teestock');
  const multigraphPnl = calculateUnitPnl(cashTransactions, 'multigraph');
  const holdingPnl = calculateUnitPnl(cashTransactions, 'holding');
  const runwayData = calculateRunwayAndBurnRate(cashTransactions, multiUnitBalances.totalConsolidatedLiquidity);

  // 5. Dynamic Founder Wealth & Real-Time Balance Sheet Calculations
  const ledgerSummary = calculateLedgerSummary(cashTransactions);
  const totalAssetsValue = getTotalFixedAssetsValue(fixedAssets);

  let totalStockUnits = 0;
  let blankStockValue = 0;
  Object.entries(inventory).forEach(([gKey, colData]) => {
    if (gKey === 'supplies' || gKey === 'dtf_films') return;
    const isHeavy = gKey.includes('24s') || gKey.includes('heavyweight');
    const unitHpp = GARMENT_TYPES[gKey]?.baseCost || (isHeavy ? 42000 : 37000);
    Object.entries(colData || {}).forEach(([_, szData]) => {
      Object.values(szData || {}).forEach(cnt => {
        const count = Number(cnt) || 0;
        totalStockUnits += count;
        blankStockValue += count * unitHpp;
      });
    });
  });

  let dtfStockValue = 0;
  if (inventory.dtf_films) {
    Object.values(inventory.dtf_films).forEach(f => {
      dtfStockValue += (Number(f.ready) || 0) * (Number(f.unitCost) || 12000);
    });
  }

  let packagingStockValue = 0;
  if (inventory.supplies) {
    Object.entries(inventory.supplies).forEach(([key, s]) => {
      const count = typeof s === 'object' && s !== null 
        ? (Number(s.ready ?? s.qty) || 0) 
        : (Number(s) || 0);
      const defaultRate = key === 'polymailer' ? 800 : key === 'sticker' ? 600 : key === 'hangtag' ? 500 : 800;
      const unitCost = typeof s === 'object' && s?.unitCost ? Number(s.unitCost) : defaultRate;
      packagingStockValue += count * unitCost;
    });
  }

  const totalInventoryValue = blankStockValue + dtfStockValue + packagingStockValue;
  const effectiveCashLiquidity = multiUnitBalances.totalConsolidatedLiquidity !== undefined
    ? multiUnitBalances.totalConsolidatedLiquidity
    : ledgerSummary.netCashLiquidity;
  const totalBusinessWealth = effectiveCashLiquidity + totalInventoryValue + totalAssetsValue;
  const netWealthGrowth = totalBusinessWealth - ledgerSummary.netFounderEquityInjected;
  const growthPercentage = ledgerSummary.netFounderEquityInjected > 0 
    ? ((netWealthGrowth / ledgerSummary.netFounderEquityInjected) * 100).toFixed(1) 
    : '0.0';

  const founderWealth = {
    totalInjected: ledgerSummary.totalInjected,
    totalPrive: ledgerSummary.totalPrive,
    netFounderEquity: ledgerSummary.netFounderEquityInjected,
    netCashLiquidity: effectiveCashLiquidity,
    bankBalance: effectiveCashLiquidity,
    qrisBalance: ledgerSummary.qrisBalance,
    blankStockValue,
    dtfStockValue,
    packagingStockValue,
    totalInventoryValue,
    totalStockUnits,
    fixedAssetsValue: totalAssetsValue,
    totalBusinessWealth,
    netWealthGrowth,
    growthPercentage
  };

  // 6. Holding Business Valuation & Enterprise Growth Engine
  const businessValuation = calculateBusinessValuation({
    founderWealth,
    multiUnitBalances,
    teestockPnl,
    multigraphPnl,
    orders,
    cashTransactions
  });

  return (
    <AdminContext.Provider
      value={{
        catalog,
        orders,
        inventory,
        procurements,
        cashTransactions,
        fixedAssets,
        ledgerSummary,
        multiUnitBalances,
        teestockPnl,
        multigraphPnl,
        holdingPnl,
        runwayData,
        businessValuation,
        walletsConfig: WALLETS,
        transactionCategories: TRANSACTION_CATEGORIES,
        totalAssetsValue,
        founderWealth,
        supabaseStatus,
        loading,
        showToast,
        toast,
        advanceOrderStatus,
        addOrder,
        saveProduct,
        deleteProduct,
        clearAllCatalogProducts,
        restockInventory,
        updateStockCell,
        restockDtfBatchAction,
        updateDtfFilmStock,
        getDtfFilmStatus,
        addProcurement,
        removeProcurement,
        recordCashTransaction,
        recordInterUnitTransfer: recordInterUnitTransferAction,
        addFixedAsset,
        removeFixedAsset,
        purgeAllDemoData,
        recordDefectDeduction,
        updateOrderTracking,
        cancelOrder,
        recordStockOpname
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
