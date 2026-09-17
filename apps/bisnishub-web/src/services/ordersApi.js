import { supabase } from './supabase';
import { generateOrderNumber } from '../utils/orderNumber';

const LOCAL_STORAGE_ADMIN_KEY = 'teestock_orders_list';
const LOCAL_STORAGE_MY_ORDERS_KEY = 'teestock_my_orders';

/**
 * Standardize Supabase DB record and local mock representation
 */
function normalizeOrderRecord(o) {
  if (!o) return null;

  // Process relational child items if available
  const rawItems = (o.ts_order_items && Array.isArray(o.ts_order_items) && o.ts_order_items.length > 0)
    ? o.ts_order_items
    : (o.items && Array.isArray(o.items) && o.items.length > 0)
      ? o.items
      : [];

  const items = rawItems.map(it => ({
    id: it.id || undefined,
    sku: it.product_sku || it.sku || 'ITEM',
    product_sku: it.product_sku || it.sku || 'ITEM',
    name: it.product_name || it.name || 'Kaos TeeStock',
    product_name: it.product_name || it.name || 'Kaos TeeStock',
    garment: it.garment || 'NSA Heavyweight 24s',
    size: it.size || 'L',
    color: it.color || 'Hitam',
    qty: Number(it.qty) || 1,
    price: Number(it.unit_price || it.price) || 0,
    unit_price: Number(it.unit_price || it.price) || 0,
    subtotal: Number(it.subtotal) || ((Number(it.unit_price || it.price) || 0) * (Number(it.qty) || 1))
  }));

  // Fallback single-item synthesis if items array was completely empty
  const primaryItem = items.length > 0 ? items[0] : null;
  const totalQty = items.length > 0 
    ? items.reduce((sum, it) => sum + (it.qty || 1), 0)
    : Number(o.qty || 1);

  const productName = primaryItem
    ? (items.length > 1 ? `${primaryItem.name} +${items.length - 1} item` : primaryItem.name)
    : (o.productName || (o.notes ? o.notes.split(' - ')[0] : 'Kaos TeeStock'));

  const garment = primaryItem ? primaryItem.garment : (o.garment || 'NSA Heavyweight 24s');
  const color = primaryItem ? primaryItem.color : (o.color || 'Hitam');
  const size = primaryItem ? primaryItem.size : (o.size || 'L');

  return {
    id: o.order_number || o.id,
    order_number: o.order_number || o.id,
    parentOrderId: o.parentOrderId || o.order_number || o.id,
    customer: o.customer_name || o.customer || 'Pelanggan',
    customer_name: o.customer_name || o.customer || 'Pelanggan',
    phone: o.customer_phone || o.phone || '',
    customer_phone: o.customer_phone || o.phone || '',
    city: o.customer_city || o.city || '',
    address: o.customer_address || o.address || '',
    channel: o.channel || 'web',
    tier: o.tier || 'retail',
    status: o.status || 'pending',
    price: Number(o.total_amount || o.price || 0),
    total_amount: Number(o.total_amount || o.price || 0),
    subtotal: Number(o.subtotal || 0),
    discount: Number(o.discount_amount || o.discount || 0),
    discount_amount: Number(o.discount_amount || o.discount || 0),
    shipping_fee: Number(o.shipping_fee || 0),
    shipping_zone: o.shipping_zone || '',
    voucher_code: o.voucher_code || null,
    uniqueCode: Number(o.unique_code ?? o.uniqueCode ?? 0),
    unique_code: Number(o.unique_code ?? o.uniqueCode ?? 0),
    snapToken: o.snapToken || null,
    redirectUrl: o.redirectUrl || null,
    trackingNo: o.tracking_number || o.trackingNo || null,
    tracking_number: o.tracking_number || o.trackingNo || null,
    user_id: o.user_id || null,
    notes: o.notes || '',
    productName,
    garment,
    color,
    size,
    qty: totalQty,
    items: items.length > 0 ? items : [{
      sku: o.sku || 'ITEM',
      product_sku: o.sku || 'ITEM',
      name: productName,
      product_name: productName,
      garment,
      color,
      size,
      qty: totalQty,
      price: Number(o.total_amount || o.price || 0),
      unit_price: Number(o.total_amount || o.price || 0),
      subtotal: Number(o.total_amount || o.price || 0)
    }],
    created_at: o.created_at || o.date || new Date().toISOString(),
    date: o.date || o.created_at || new Date().toISOString()
  };
}

/**
 * 🔒 ADMIN ONLY: Ambil seluruh daftar pesanan toko (HANYA dipanggil dari AdminContext di rute /admin)
 * Memuat relasi ts_orders dengan ts_order_items
 */
export async function getOrders() {
  try {
    const { data, error } = await supabase
      .from('ts_orders')
      .select('*, ts_order_items(*)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const cached = localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY);
      return cached ? JSON.parse(cached) : [];
    }

    const normalized = data.map(normalizeOrderRecord);
    localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(normalized));
    return normalized;
  } catch (err) {
    const cached = localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY);
    return cached ? JSON.parse(cached) : [];
  }
}

/**
 * 🛡️ PUBLIC CHECKOUT: Buat pesanan baru relasional (1 header ts_orders + N rincian ts_order_items)
 * Tanpa mengunduh data pelanggan lain ke browser
 */
export async function createPublicOrder(order, items = []) {
  // Standardize item array
  const orderItems = (items && Array.isArray(items) && items.length > 0)
    ? items
    : (order.items && Array.isArray(order.items) && order.items.length > 0)
      ? order.items
      : [{
          sku: order.sku || 'ITEM',
          product_sku: order.sku || 'ITEM',
          name: order.productName || 'Kaos TeeStock',
          product_name: order.productName || 'Kaos TeeStock',
          garment: order.garment || 'NSA Heavyweight 24s',
          size: order.size || 'L',
          color: order.color || 'Hitam',
          qty: Number(order.qty) || 1,
          price: Number(order.price || order.total_amount) || 0,
          unit_price: Number(order.price || order.total_amount) || 0,
          subtotal: (Number(order.price || order.total_amount) || 0) * (Number(order.qty) || 1)
        }];

  const summaryNotes = order.notes || orderItems.map(
    i => `${i.name || i.product_name} - ${i.garment || ''} (${i.color || ''} ${i.size || ''}) x${i.qty || 1}`
  ).join('; ');

  // 1. Coba panggil Supabase Edge Function create-checkout secara server-side
  let backendResult = null;
  try {
    if (supabase && supabase.functions && typeof supabase.functions.invoke === 'function') {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: orderItems.map(i => ({
            sku: i.sku || i.product_sku || 'ITEM',
            name: i.name || i.product_name || 'Kaos TeeStock',
            garment: i.garment || 'NSA Heavyweight 24s',
            size: i.size || 'L',
            color: i.color || 'Hitam',
            qty: Number(i.qty) || 1,
            price: Number(i.price || i.unit_price) || 0
          })),
          customer: {
            name: order.customer || order.customer_name || 'Pelanggan',
            phone: order.phone || order.customer_phone || '',
            city: order.city || order.customer_city || '',
            address: order.address || order.customer_address || '',
            subdistrict: order.subdistrict || ''
          },
          shipping: {
            fee: order.shipping_fee || 0,
            zone: order.shipping_zone || '',
            courier: order.courier || ''
          },
          paymentMethod: order.payment_method || 'manual_qris',
          voucherCode: order.voucher_code || null,
          userId: order.user_id || null,
          notes: summaryNotes
        }
      });

      if (!error && data?.status === 'success' && data.data) {
        backendResult = data.data;
      } else if (data?.status === 'error' && data.message) {
        throw new Error(data.message);
      } else if (error) {
        throw new Error(error.message || 'Gagal memanggil layanan checkout.');
      }
    }
  } catch (fnErr) {
    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
      console.warn('Edge Function create-checkout unavailable, utilizing offline dev mode:', fnErr);
    } else {
      console.error('Server checkout invocation failed in production:', fnErr);
      throw fnErr;
    }
  }

  // Jika di Production dan tidak ada backend result, tolak pembuatan order palsu lokal
  if (!backendResult && !(typeof import.meta !== 'undefined' && import.meta.env?.DEV)) {
    throw new Error('Pesanan tidak dapat diproses oleh server. Silakan segarkan halaman dan coba lagi.');
  }

  // Gunakan hasil dari backend jika tersedia, atau fallback lokal standar untuk dev
  const orderNumber = backendResult?.orderNumber || order.order_number || order.id || generateOrderNumber();
  const orderUuid = backendResult?.orderUuid || ((typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0'));

  const normalized = normalizeOrderRecord({
    ...order,
    id: orderNumber,
    order_number: orderNumber,
    notes: summaryNotes,
    items: (backendResult?.items && Array.isArray(backendResult.items) && backendResult.items.length > 0)
      ? backendResult.items.map(it => ({
          sku: it.product_sku || it.sku,
          product_sku: it.product_sku || it.sku,
          name: it.product_name || it.name,
          product_name: it.product_name || it.name,
          garment: it.garment,
          size: it.size,
          color: it.color,
          qty: it.qty,
          price: it.unit_price || it.price,
          unit_price: it.unit_price || it.price,
          subtotal: it.subtotal
        }))
      : orderItems,
    price: backendResult?.grandTotal ?? order.total_amount ?? order.price,
    total_amount: backendResult?.grandTotal ?? order.total_amount ?? order.price,
    subtotal: backendResult?.subtotal ?? order.subtotal ?? 0,
    discount: backendResult?.discountAmount ?? order.discount ?? order.discount_amount ?? 0,
    discount_amount: backendResult?.discountAmount ?? order.discount ?? order.discount_amount ?? 0,
    shipping_fee: backendResult?.shippingFee ?? order.shipping_fee ?? 0,
    shipping_zone: backendResult?.shippingZone ?? order.shipping_zone ?? '',
    unique_code: backendResult?.uniqueCode ?? order.unique_code ?? 0,
    uniqueCode: backendResult?.uniqueCode ?? order.unique_code ?? 0,
    status: 'pending_payment', // Status awal pesanan SELALU pending sebelum diverifikasi
    snapToken: backendResult?.snapToken || null,
    redirectUrl: backendResult?.redirectUrl || null
  });

  // Simpan ke riwayat pesanan milik pengguna lokal sendiri
  try {
    const myOrders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MY_ORDERS_KEY) || '[]');
    const filtered = Array.isArray(myOrders) ? myOrders.filter(o => o.id !== normalized.id) : [];
    filtered.unshift(normalized);
    localStorage.setItem(LOCAL_STORAGE_MY_ORDERS_KEY, JSON.stringify(filtered.slice(0, 30)));
  } catch (e) {
    // Ignore storage issues
  }

  // Update juga antrean admin lokal jika ada sesi tersimpan
  try {
    const adminOrders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY) || '[]');
    const updatedAdmin = Array.isArray(adminOrders) ? [normalized, ...adminOrders.filter(o => o.id !== normalized.id)] : [normalized];
    localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(updatedAdmin));
  } catch (e) {
    // Ignore
  }

  // Fallback direct insert hanya boleh aktif di development lokal
  if (!backendResult && typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    try {
      const { error: orderErr } = await supabase.from('ts_orders').insert({
        id: orderUuid,
        order_number: normalized.id,
        user_id: normalized.user_id,
        customer_name: normalized.customer,
        customer_phone: normalized.phone,
        customer_city: order.city || null,
        customer_address: order.address || null,
        channel: normalized.channel || 'web',
        tier: order.tier || 'retail',
        status: 'pending_payment',
        total_amount: normalized.price,
        discount_amount: normalized.discount,
        voucher_code: normalized.voucher_code,
        notes: normalized.notes
      });

      if (!orderErr && orderItems.length > 0) {
        const itemsPayload = orderItems.map(i => ({
          order_id: orderUuid,
          order_number: normalized.id,
          product_sku: i.sku || i.product_sku || null,
          product_name: i.name || i.product_name || 'Kaos TeeStock',
          garment: i.garment || 'NSA Heavyweight 24s',
          size: i.size || 'L',
          color: i.color || 'Hitam',
          qty: Number(i.qty) || 1,
          unit_price: Number(i.price || i.unit_price) || 0,
          subtotal: (Number(i.price || i.unit_price) || 0) * (Number(i.qty) || 1)
        }));

        await supabase.from('ts_order_items').insert(itemsPayload);
      }
    } catch (err) {
      console.warn("Could not sync public order to Supabase in dev mode:", err);
    }
  }

  return {
    ...normalized,
    snapToken: backendResult?.snapToken || null,
    redirectUrl: backendResult?.redirectUrl || null
  };
}

/**
 * Legacy alias for AdminContext compatibility
 */
export async function saveOrder(order) {
  const normalized = await createPublicOrder(order, order.items || []);
  try {
    const current = await getOrders();
    const updated = [normalized, ...current.filter(o => o.id !== normalized.id)];
    localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [normalized];
  }
}

/**
 * 🔒 ADMIN ONLY: Perbarui status Kanban pesanan
 */
export async function updateOrderStatus(orderId, newStatus) {
  const current = await getOrders();
  const updated = current.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
  localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(updated));

  try {
    await supabase
      .from('ts_orders')
      .update({ status: newStatus })
      .eq('order_number', orderId);
  } catch (err) {
    console.warn("Could not update order status in Supabase:", err);
  }

  return updated;
}

/**
 * 🔍 PUBLIC SECURE TRACKING: Lacak SATU pesanan spesifik dengan Supabase RPC + Data Masking
 * Memungkinkan pelacakan pesanan tamu (guest) tanpa membuka kebocoran data pelanggan (PII)
 */
export async function trackSingleOrder(term, phoneLast4 = null) {
  if (!term || !term.trim()) return [];
  const cleanTerm = term.trim();
  const cleanTermLower = cleanTerm.toLowerCase();

  // 1. Coba panggil Edge Function track-order (aman dengan rate-limiting & verifikasi 4-digit HP)
  const cleanLast4 = phoneLast4 ? String(phoneLast4).replace(/\D/g, '') : '';
  try {
    if (supabase && supabase.functions && typeof supabase.functions.invoke === 'function') {
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('track-order', {
        body: {
          orderNumber: cleanTerm.toUpperCase(),
          phoneLast4: cleanLast4
        }
      });

      if (!edgeError && edgeData?.status === 'success' && edgeData.data) {
        const row = edgeData.data;
        return [{
          id: row.order_number,
          order_number: row.order_number,
          status: row.status,
          trackingNo: row.tracking_number,
          tracking_number: row.tracking_number,
          created_at: row.created_at,
          customer: row.customer_masked || 'Pelanggan TeeStock',
          items: row.items || [],
          date: row.created_at
        }];
      } else if (edgeData?.message) {
        throw new Error(edgeData.message);
      }
    }
  } catch (edgeErr) {
    if (edgeErr.message && !edgeErr.message.includes('unavailable') && !edgeErr.message.includes('FunctionsFetchError')) {
      throw edgeErr;
    }
    console.warn("Edge Function track-order notice:", edgeErr);
  }

  // 2. Jika user login (member/admin), query ts_orders langsung
  try {
    const { data, error } = await supabase
      .from('ts_orders')
      .select('*, ts_order_items(*)')
      .or(`order_number.ilike.%${cleanTermLower}%,tracking_number.ilike.%${cleanTermLower}%,customer_phone.ilike.%${cleanTermLower}%`)
      .limit(5);

    if (!error && data && data.length > 0) {
      return data.map(normalizeOrderRecord);
    }
  } catch (err) {
    console.warn("Supabase tracking lookup fallback:", err);
  }

  // 3. Fallback ke riwayat lokal pesanan pribadi pembeli
  try {
    const myOrders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MY_ORDERS_KEY) || '[]');
    const digitsOnly = cleanTerm.replace(/\D/g, '');
    const matched = myOrders.filter(o => {
      const oDigits = (o.phone || '').replace(/\D/g, '');
      return (
        o.id.toLowerCase().includes(cleanTermLower) ||
        (o.parentOrderId && o.parentOrderId.toLowerCase().includes(cleanTermLower)) ||
        (o.trackingNo && o.trackingNo.toLowerCase().includes(cleanTermLower)) ||
        (o.phone && o.phone.toLowerCase().includes(cleanTermLower)) ||
        (digitsOnly.length >= 6 && oDigits.includes(digitsOnly))
      );
    });
    if (matched.length > 0) return matched;
  } catch (e) {}

  // 4. Jika tidak ditemukan di mana pun
  return [];
}

/**
 * 👤 MEMBER SECURE ORDERS: Ambil hanya pesanan milik user yang sedang login
 */
export async function getUserOrders(userId, phone = null) {
  if (!userId && !phone) return [];

  try {
    let query = supabase
      .from('ts_orders')
      .select('*, ts_order_items(*)')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      query = query.ilike('customer_phone', `%${cleanPhone}%`);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map(normalizeOrderRecord);
    }
  } catch (err) {
    console.warn("Supabase user orders query fallback:", err);
  }

  // Fallback ke penyimpanan lokal pribadi
  try {
    const myOrders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MY_ORDERS_KEY) || '[]');
    return myOrders.filter(o => {
      if (userId && o.user_id === userId) return true;
      if (phone && o.phone && o.phone.includes(phone.replace(/\D/g, ''))) return true;
      return false;
    });
  } catch (e) {
    return [];
  }
}
