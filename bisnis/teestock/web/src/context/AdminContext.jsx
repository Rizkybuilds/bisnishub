import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProducts, saveProduct as apiSaveProduct } from '../services/productsApi';
import { getOrders, saveOrder as apiSaveOrder, updateOrderStatus as apiUpdateOrderStatus } from '../services/ordersApi';
import { 
  getInventoryMatrix, 
  saveInventoryMatrix, 
  deductStock, 
  deductDtfFilm, 
  restockDtfFilm, 
  restockDtfBatch 
} from '../services/inventoryApi';
import { testSupabaseConnection } from '../services/supabase';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [catalog, setCatalog] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState({});
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
        const [prods, ords, inv, sbStatus] = await Promise.all([
          getProducts(),
          getOrders(),
          getInventoryMatrix(),
          testSupabaseConnection()
        ]);
        setCatalog(prods);
        setOrders(ords);
        setInventory(inv);
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

    const currIdx = statuses.indexOf(target.status);
    const nextIdx = currIdx + dir;
    if (nextIdx < 0 || nextIdx >= statuses.length) return;

    const oldStatus = target.status;
    const nextStatus = statuses[nextIdx];

    // Deduct stock if order advances from pending -> production (dtf or press)
    if (oldStatus === "pending" && (nextStatus === "dtf" || nextStatus === "press")) {
      let gKey = "nsa_softstyle_30s";
      if (target.garment?.includes("24s")) gKey = "nsa_heavyweight_24s";
      else if (target.garment?.includes("Long")) gKey = "nsa_longsleeve";
      else if (target.garment?.includes("Hoodie")) gKey = "nsa_hoodie";
      else if (target.garment?.includes("Polo")) gKey = "nsa_polo";

      const col = target.color || "Hitam";
      const sz = target.size || "L";
      const qty = target.qty || 1;

      // 1. Deduct blank garment
      let updatedInv = deductStock(inventory, gKey, col, sz, qty);

      // 2. Deduct DTF film if it's a graphic product (not a blank apparel)
      const isBlank = target.sku?.startsWith("TS-BLK") || target.garment === "blank";
      if (!isBlank && target.sku) {
        updatedInv = deductDtfFilm(updatedInv, target.sku, qty);
        showToast(`⚡ 1 lembar film DTF [${target.sku}] otomatis dipotong dari stok studio!`, 'info');
      }

      setInventory(updatedInv);
      showToast(`📦 Kaos polos ${target.garment} (${col} ${sz}) -${qty} pcs otomatis dipotong dari stok!`, 'info');
    }

    const updatedOrders = await apiUpdateOrderStatus(orderId, nextStatus);
    setOrders(updatedOrders);
    showToast(`🔄 Status pesanan ${orderId} dipindahkan ke [${nextStatus.toUpperCase()}]`);
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
    showToast(`✅ Desain [${product.sku}] berhasil disimpan ke Master Katalog!`);
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
    if (!next[gKey]) next[gKey] = {};
    if (!next[gKey][col]) next[gKey][col] = {};
    next[gKey][col][sz] = Math.max(0, parseInt(val, 10) || 0);
    saveInventoryMatrix(next);
    setInventory(next);
    showToast(`Stok diperbarui: ${col} (${sz}) = ${next[gKey][col][sz]} pcs`);
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
      next.dtf_films[sku].ready = Math.max(0, parseInt(val, 10) || 0);
      saveInventoryMatrix(next);
      setInventory(next);
      showToast(`Stok Film DTF [${sku}] diperbarui: ${next.dtf_films[sku].ready} lembar`);
    }
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

  return (
    <AdminContext.Provider
      value={{
        catalog,
        orders,
        inventory,
        supabaseStatus,
        loading,
        showToast,
        toast,
        advanceOrderStatus,
        addOrder,
        saveProduct,
        restockInventory,
        updateStockCell,
        restockDtfBatchAction,
        updateDtfFilmStock,
        getDtfFilmStatus
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
