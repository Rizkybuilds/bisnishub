import { supabase } from './supabase';
import { SEED_ORDERS } from '../constants/seedData';

const LOCAL_STORAGE_KEY = 'teestock_orders_list';

export async function getOrders() {
  try {
    const { data, error } = await supabase
      .from('ts_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      return cached ? JSON.parse(cached) : SEED_ORDERS;
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (err) {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    return cached ? JSON.parse(cached) : SEED_ORDERS;
  }
}

export async function saveOrder(order) {
  const current = await getOrders();
  const updated = [order, ...current];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

  try {
    await supabase.from('ts_orders').insert({
      order_number: order.id,
      customer_name: order.customer,
      customer_phone: order.phone,
      channel: order.channel,
      status: order.status || 'pending',
      total_amount: order.price,
      notes: `${order.productName} - ${order.garment} (${order.color} ${order.size}) x${order.qty}`
    });
  } catch (err) {
    console.warn("Could not sync order to Supabase:", err);
  }

  return updated;
}

export async function updateOrderStatus(orderId, newStatus) {
  const current = await getOrders();
  const updated = current.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

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
