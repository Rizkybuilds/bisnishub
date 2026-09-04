import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProducts, saveProduct as apiSaveProduct } from '../services/productsApi';
import { getOrders, saveOrder as apiSaveOrder, updateOrderStatus as apiUpdateOrderStatus } from '../services/ordersApi';
import { getInventoryMatrix, saveInventoryMatrix, deductStock } from '../services/inventoryApi';
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

    // Deduct stock if order advances from pending -> dtf (start of production)
    if (oldStatus === "pending" && nextStatus === "dtf") {
      let gKey = "nsa_softstyle_30s";
      if (target.garment?.includes("24s")) gKey = "nsa_heavyweight_24s";
      else if (target.garment?.includes("Long")) gKey = "nsa_longsleeve";
      else if (target.garment?.includes("Hoodie")) gKey = "nsa_hoodie";
      else if (target.garment?.includes("Polo")) gKey = "nsa_polo";

      const col = target.color || "Hitam";
      const sz = target.size || "L";
      const qty = target.qty || 1;

      const updatedInv = deductStock(inventory, gKey, col, sz, qty);
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
        updateStockCell
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
