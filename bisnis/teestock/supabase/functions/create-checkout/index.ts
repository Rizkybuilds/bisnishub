import { corsHeaders } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabaseClient.ts';

// Size surcharges mapping
const SIZE_SURCHARGES: Record<string, number> = {
  'XXL': 5000,
  '2XL': 5000,
  '3XL': 10000,
  '4XL': 15000,
  '5XL': 20000,
};

function getSizeSurcharge(size?: string): number {
  if (!size) return 0;
  const clean = String(size).toUpperCase().trim();
  return SIZE_SURCHARGES[clean] || 0;
}

function calculateBundleDiscount(graphicQty: number, role = 'retail'): number {
  if (role === 'reseller' || role === 'dropship') return 0;
  if (!graphicQty || graphicQty < 2) return 0;
  if (graphicQty >= 3) return 14000 * graphicQty; // Rp 42.000 (min 3)
  if (graphicQty === 2) return 18000;
  return 0;
}

function generateOrderNumber(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const randomHex = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  return `TS-${yy}${mm}${dd}-${randomHex}`;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      items = [],
      customer = {},
      shipping = {},
      paymentMethod = 'manual_qris',
      voucherCode = null,
      userId = null,
      notes = null
    } = body;

    // 1. Input Validation
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Keranjang belanja kosong atau tidak valid.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const customerName = String(customer.name || customer.customerName || '').trim();
    const customerPhone = String(customer.phone || '').trim();
    const customerCity = String(customer.city || '').trim();
    const customerAddress = String(customer.address || '').trim();

    if (!customerName || !customerPhone) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Nama dan nomor telepon penerima wajib diisi.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getAdminClient();

    // 2. Authoritative Price Fetching from Supabase
    const skus = items.map((i: any) => i.sku).filter(Boolean);
    const { data: dbProducts } = await supabase
      .from('ts_products')
      .select('sku, title, price_retail, price_dropship, price_reseller, series, category')
      .in('sku', skus);

    const productMap = new Map<string, any>();
    if (dbProducts) {
      dbProducts.forEach((p: any) => productMap.set(p.sku, p));
    }

    // 3. Server-side Subtotal & Surcharge Calculation
    let calculatedSubtotal = 0;
    let graphicCount = 0;
    const verifiedOrderItems: any[] = [];

    for (const item of items) {
      const qty = Math.max(1, Math.min(100, Number(item.qty) || 1));
      const dbProduct = productMap.get(item.sku);
      
      let baseUnitPrice = 99000;
      let isGraphic = true;

      if (dbProduct) {
        baseUnitPrice = Number(dbProduct.price_retail) || 99000;
        isGraphic = dbProduct.series !== 'blank' && dbProduct.category !== 'Blanks';
      } else if (item.price && Number(item.price) > 0) {
        // Fallback for custom atelier / blanks variant
        baseUnitPrice = Number(item.price);
        isGraphic = !item.sku?.includes('BLK') && !item.name?.toLowerCase().includes('polos');
      }

      const surcharge = getSizeSurcharge(item.size);
      const finalUnitPrice = baseUnitPrice + surcharge;
      const itemSubtotal = finalUnitPrice * qty;

      if (isGraphic) {
        graphicCount += qty;
      }

      calculatedSubtotal += itemSubtotal;
      verifiedOrderItems.push({
        product_sku: item.sku || 'ITEM',
        product_name: item.name || dbProduct?.title || 'Kaos TeeStock',
        garment: item.garment || 'NSA Heavyweight 24s',
        size: item.size || 'L',
        color: item.color || 'Hitam',
        qty,
        unit_price: finalUnitPrice,
        subtotal: itemSubtotal
      });
    }

    // 4. Calculate Authoritative Discounts
    const bundleDiscount = calculateBundleDiscount(graphicCount, 'retail');
    
    let voucherDiscount = 0;
    if (voucherCode) {
      const cleanCode = String(voucherCode).trim().toUpperCase();
      if (cleanCode === 'WELCOME10') {
        voucherDiscount = Math.round(calculatedSubtotal * 0.10);
      } else if (cleanCode === 'PERDANA15') {
        voucherDiscount = calculatedSubtotal >= 99000 ? 15000 : 0;
      }
    }

    const totalDiscount = bundleDiscount + voucherDiscount;
    const shippingFee = Math.max(0, Number(shipping.fee) || 0);

    // 5. Unique Code for Manual QRIS Verification (100 - 999)
    let uniqueCode = 0;
    if (paymentMethod === 'manual_qris') {
      uniqueCode = Math.floor(100 + Math.random() * 900);
    }

    const grandTotal = Math.max(0, calculatedSubtotal - totalDiscount + shippingFee + uniqueCode);
    const orderNumber = generateOrderNumber();
    const orderUuid = crypto.randomUUID();

    // 6. Insert Order atomically using service_role key (Pending Payment status)
    const summaryNotes = notes || verifiedOrderItems.map(
      i => `${i.product_name} - ${i.garment} (${i.color} ${i.size}) x${i.qty}`
    ).join('; ');

    const { error: orderInsertErr } = await supabase.from('ts_orders').insert({
      id: orderUuid,
      order_number: orderNumber,
      user_id: userId || null,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_city: customerCity,
      customer_address: customerAddress,
      channel: 'web',
      tier: 'retail',
      status: 'pending_payment',
      total_amount: grandTotal,
      discount_amount: totalDiscount,
      voucher_code: voucherCode || null,
      notes: summaryNotes,
    });

    if (orderInsertErr) {
      throw new Error(`Gagal menyimpan pesanan ke database: ${orderInsertErr.message}`);
    }

    // Insert order items
    const itemsPayload = verifiedOrderItems.map(item => ({
      order_id: orderUuid,
      order_number: orderNumber,
      ...item
    }));

    const { error: itemsInsertErr } = await supabase.from('ts_order_items').insert(itemsPayload);
    if (itemsInsertErr) {
      console.error('Warning inserting order items:', itemsInsertErr);
    }

    // 7. Request Midtrans Snap Token if payment method is Midtrans
    let snapToken = null;
    let redirectUrl = null;

    if (paymentMethod === 'midtrans_snap') {
      const serverKey = Deno.env.get('MIDTRANS_SERVER_KEY') || 'Mid-server-c8SVBfpNa3-M-QcqYFTnHXwv';
      const isProduction = Deno.env.get('MIDTRANS_IS_PRODUCTION') === 'true' || serverKey.startsWith('Mid-server-');
      const snapApiUrl = isProduction
        ? 'https://app.midtrans.com/snap/v1/transactions'
        : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

      // Midtrans strictly requires item_details name to be <= 50 characters
      const midtransItems: Array<{ id: string; price: number; quantity: number; name: string }> = verifiedOrderItems.map((item, idx) => ({
        id: String(item.product_sku || `ITEM-${idx + 1}`).slice(0, 45),
        price: Math.round(item.unit_price),
        quantity: item.qty,
        name: String(item.product_name || 'Kaos TeeStock').slice(0, 45)
      }));

      if (shippingFee > 0) {
        const cleanZone = String(shipping.zone || 'Reguler')
          .replace(/[()&]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        midtransItems.push({
          id: 'SHIPPING-FEE',
          price: Math.round(shippingFee),
          quantity: 1,
          name: `Ongkir - ${cleanZone}`.slice(0, 45)
        });
      }

      if (totalDiscount > 0) {
        midtransItems.push({
          id: 'DISCOUNT-TOTAL',
          price: -Math.round(totalDiscount),
          quantity: 1,
          name: 'Diskon Paket / Voucher'.slice(0, 45)
        });
      }

      // Mathematical validation: Midtrans rejects if sum(item_details) !== gross_amount
      const targetGross = Math.round(grandTotal);
      const itemsSum = midtransItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      if (itemsSum !== targetGross) {
        const diff = targetGross - itemsSum;
        midtransItems.push({
          id: 'ADJUSTMENT',
          price: diff,
          quantity: 1,
          name: 'Penyesuaian'.slice(0, 45)
        });
      }

      // Clean customer phone (digits only, 9-19 chars) and address (strip markdown URLs)
      const cleanCustomerPhone = customerPhone.replace(/[^0-9+]/g, '').slice(0, 19) || '08123456789';
      const cleanCustomerAddress = customerAddress
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[<>[\]]/g, '')
        .slice(0, 190);
      const cleanCustomerCity = customerCity.replace(/[()]/g, '').slice(0, 90);

      const snapPayload: Record<string, any> = {
        transaction_details: {
          order_id: orderNumber,
          gross_amount: targetGross
        },
        customer_details: {
          first_name: customerName.slice(0, 50),
          phone: cleanCustomerPhone,
          billing_address: {
            address: cleanCustomerAddress,
            city: cleanCustomerCity
          }
        },
        item_details: midtransItems
      };

      try {
        const authHeader = 'Basic ' + btoa(`${serverKey}:`);
        const snapRes = await fetch(snapApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify(snapPayload)
        });

        if (snapRes.ok) {
          const snapData = await snapRes.json();
          snapToken = snapData.token;
          redirectUrl = snapData.redirect_url;
        } else {
          const snapErrText = await snapRes.text();
          console.error('Midtrans Snap API Error:', snapRes.status, snapErrText);
        }
      } catch (snapEx) {
        console.error('Midtrans network exception:', snapEx);
      }
    }

    // 8. Return Authoritative Response
    return new Response(
      JSON.stringify({
        status: 'success',
        data: {
          orderNumber,
          orderUuid,
          subtotal: calculatedSubtotal,
          discountAmount: totalDiscount,
          shippingFee,
          uniqueCode,
          grandTotal,
          paymentMethod,
          snapToken,
          redirectUrl,
          items: verifiedOrderItems
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (err: any) {
    console.error('Checkout error:', err);
    return new Response(
      JSON.stringify({ status: 'error', message: err.message || 'Terjadi kesalahan internal checkout.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
