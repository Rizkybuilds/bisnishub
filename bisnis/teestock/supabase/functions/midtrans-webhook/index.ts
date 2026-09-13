import { corsHeaders } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabaseClient.ts';

async function calculateSha512(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
      payment_type: paymentType,
      transaction_id: transactionId,
    } = body;

    if (!orderId || !statusCode || !grossAmount || !signatureKey) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Payload webhook tidak lengkap.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const serverKey = Deno.env.get('MIDTRANS_SERVER_KEY') || 'Mid-server-aS32AAjPc00_rz6QdJGyNPvV';
    
    // 1. Verifikasi Signature SHA-512
    const rawGross = typeof grossAmount === 'number' ? grossAmount.toFixed(2) : String(grossAmount);
    // Midtrans gross_amount in signature is sometimes with .00 or without depending on payload
    const signaturePayloadPrimary = `${orderId}${statusCode}${rawGross}${serverKey}`;
    const calculatedPrimary = await calculateSha512(signaturePayloadPrimary);

    let isValidSignature = calculatedPrimary.toLowerCase() === String(signatureKey).toLowerCase();

    // Fallback if gross_amount in signature was formatted without decimals
    if (!isValidSignature && String(grossAmount).includes('.')) {
      const intGross = String(grossAmount).split('.')[0];
      const signaturePayloadAlt = `${orderId}${statusCode}${intGross}${serverKey}`;
      const calculatedAlt = await calculateSha512(signaturePayloadAlt);
      isValidSignature = calculatedAlt.toLowerCase() === String(signatureKey).toLowerCase();
    }

    if (!isValidSignature) {
      console.warn('Invalid Midtrans Signature for order:', orderId);
      return new Response(
        JSON.stringify({ status: 'error', message: 'Signature Midtrans tidak valid.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Fetch Order from Supabase Database
    const supabase = getAdminClient();
    const { data: order, error: orderErr } = await supabase
      .from('ts_orders')
      .select('id, order_number, status, total_amount, customer_phone, customer_name')
      .eq('order_number', orderId)
      .maybeSingle();

    if (orderErr || !order) {
      console.warn(`Order ${orderId} tidak ditemukan di database ts_orders.`);
      // Return 200 to satisfy Midtrans retry policy, but log warning
      return new Response(
        JSON.stringify({ status: 'warning', message: 'Pesanan tidak ditemukan di database.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Idempotency Check: Jangan proses ulang order yang sudah lunas
    const isAlreadyPaid = ['processing', 'ready_to_press', 'dtf_printed', 'completed', 'shipped'].includes(order.status);
    if (isAlreadyPaid && (transactionStatus === 'settlement' || transactionStatus === 'capture')) {
      console.log(`Idempotent: Order ${orderId} sudah berstatus '${order.status}'. Webhook diabaikan.`);
      return new Response(
        JSON.stringify({ status: 'success', message: 'Order sudah diproses sebelumnya.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Update Status Order Authoritative
    let newStatus = order.status;

    if (
      (transactionStatus === 'capture' && fraudStatus === 'accept') ||
      transactionStatus === 'settlement'
    ) {
      // Pembayaran Sah & Diterima -> Siap Dipress di Studio Citayam!
      newStatus = 'processing';
    } else if (transactionStatus === 'pending') {
      newStatus = 'pending_payment';
    } else if (['deny', 'cancel', 'expire', 'refund'].includes(transactionStatus)) {
      newStatus = 'cancelled';
    }

    const { error: updateErr } = await supabase
      .from('ts_orders')
      .update({
        status: newStatus,
        payment_method: paymentType || 'midtrans',
        notes: `[Midtrans ${transactionStatus?.toUpperCase()}] TxID: ${transactionId || '-'}`,
      })
      .eq('id', order.id);

    if (updateErr) {
      throw new Error(`Gagal memperbarui status order ${orderId}: ${updateErr.message}`);
    }

    console.log(`Sukses memperbarui order ${orderId} dari '${order.status}' -> '${newStatus}'`);

    return new Response(
      JSON.stringify({
        status: 'success',
        message: `Status pesanan ${orderId} berhasil diubah menjadi ${newStatus}.`,
        data: { orderId, newStatus }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ status: 'error', message: err.message || 'Kesalahan memproses webhook.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
