import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone, MapPin, Truck, AlertCircle, Package, CreditCard, Zap, QrCode, Building2, Navigation } from 'lucide-react';
import { checkoutSchema } from '../../../schemas/checkoutSchema';
import { SHIPPING_ZONES } from '../../../constants/pricing';
import { formatRupiah } from '../../../utils/formatters';
import { PAYMENT_METHODS, PAYMENT_PROVIDERS } from '../../../services/paymentAdapter';
import { AVAILABLE_COURIERS, getAvailableCouriers } from '../../../services/shippingApi';

export function CheckoutShippingForm({
  profile,
  onSubmitOrder,
  onShippingZoneChange,
  onCourierChange,
  onCityChange,
  onSubdistrictChange,
  fulfillmentOrigin = null,
  selectedPaymentMethod = PAYMENT_PROVIDERS.MANUAL_QRIS,
  onPaymentMethodChange,
  weightInfo = null,
  isSubmitting,
  formRef
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: profile?.full_name || '',
      phone: profile?.phone || '',
      city: profile?.city || '',
      subdistrict: profile?.subdistrict || '',
      address: profile?.default_address || '',
      shippingZone: 'jawa_lainnya',
      courier: 'J&T Express',
      notes: ''
    }
  });

  // Watch shippingZone and courier to synchronize rate calculations in parent summary
  const currentZone = watch('shippingZone');
  const currentCourier = watch('courier');
  const currentCity = watch('city');
  const currentSubdistrict = watch('subdistrict');

  useEffect(() => {
    if (currentZone && onShippingZoneChange) {
      onShippingZoneChange(currentZone);
    }
  }, [currentZone, onShippingZoneChange]);

  useEffect(() => {
    if (currentCourier && onCourierChange) {
      onCourierChange(currentCourier);
    }
  }, [currentCourier, onCourierChange]);

  useEffect(() => {
    if (onCityChange) {
      onCityChange(currentCity || '');
    }
  }, [currentCity, onCityChange]);

  useEffect(() => {
    if (onSubdistrictChange) {
      onSubdistrictChange(currentSubdistrict || '');
    }
  }, [currentSubdistrict, onSubdistrictChange]);


  // Autofill from user profile if available
  useEffect(() => {
    if (profile) {
      if (profile.full_name) setValue('customerName', profile.full_name);
      if (profile.phone) setValue('phone', profile.phone);
      if (profile.city) setValue('city', profile.city);
      if (profile.subdistrict) setValue('subdistrict', profile.subdistrict);
      if (profile.default_address) setValue('address', profile.default_address);
    }
  }, [profile, setValue]);

  // 🛡️ CMO Engine: Auto-capture checkout lead to recover abandoned carts
  const watchedName = watch('customerName');
  const watchedPhone = watch('phone');
  useEffect(() => {
    if (watchedPhone && watchedPhone.replace(/\D/g, '').length >= 9) {
      try {
        localStorage.setItem('teestock_checkout_draft', JSON.stringify({
          customerName: watchedName || 'Calon Pembeli',
          phone: watchedPhone,
          updatedAt: new Date().toISOString()
        }));
      } catch (_) {}
    }
  }, [watchedName, watchedPhone]);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmitOrder)}
      className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-6"
    >
      <div className="pb-3 border-b border-white/[0.08] flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-ts-terracotta" />
          Alamat Pengiriman & Penerima
        </h3>
        <span className="text-[11px] text-ts-kremMuted">
          Wajib diisi lengkap untuk kurir
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nama Penerima */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ts-kremMuted flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-ts-muted" />
            Nama Penerima <span className="text-rose-400">*</span>
          </label>
          <input
            {...register('customerName')}
            placeholder="Contoh: Rizky Pratama"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-xs text-white placeholder:text-ts-muted focus:outline-none focus:border-ts-terracotta transition-colors"
          />
          {errors.customerName && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.customerName.message}
            </p>
          )}
        </div>

        {/* WhatsApp */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ts-kremMuted flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-ts-muted" />
            Nomor WhatsApp <span className="text-rose-400">*</span>
          </label>
          <input
            {...register('phone')}
            placeholder="081234567890"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-xs text-white placeholder:text-ts-muted focus:outline-none focus:border-ts-terracotta transition-colors font-mono"
          />
          {errors.phone && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Kota / Kabupaten */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ts-kremMuted">
            Kota / Kabupaten <span className="text-rose-400">*</span>
          </label>
          <input
            {...register('city')}
            placeholder="Contoh: Bandung"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-xs text-white placeholder:text-ts-muted focus:outline-none focus:border-ts-terracotta transition-colors"
          />
          {errors.city && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.city.message}
            </p>
          )}
        </div>

        {/* Kecamatan */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ts-kremMuted">
            Kecamatan <span className="text-rose-400">*</span>
          </label>
          <input
            {...register('subdistrict')}
            placeholder="Contoh: Coblong"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-xs text-white placeholder:text-ts-muted focus:outline-none focus:border-ts-terracotta transition-colors"
          />
          {errors.subdistrict && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.subdistrict.message}
            </p>
          )}
        </div>
      </div>

      {/* Alamat Lengkap */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ts-kremMuted">
          Alamat Jalan & Nomor Rumah / Patokan <span className="text-rose-400">*</span>
        </label>
        <textarea
          {...register('address')}
          rows={2}
          placeholder="Nama jalan, RT/RW, nomor rumah, nama gedung/blok, dan patokan..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-xs text-white placeholder:text-ts-muted focus:outline-none focus:border-ts-terracotta transition-colors resize-none"
        />
        {errors.address && (
          <p className="text-[11px] text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {errors.address.message}
          </p>
        )}
      </div>

      {/* 🏭 Live Multi-Origin Fulfillment Hub Banner */}
      {fulfillmentOrigin && (
        <div className={`p-4 rounded-2xl border transition-all ${
          fulfillmentOrigin.isExpressHub
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-sm'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-white/10 flex items-center gap-1">
                  {fulfillmentOrigin.isExpressHub ? (
                    <>
                      <Zap className="w-3 h-3 text-emerald-400 shrink-0" />
                      EXPRESS SATELLITE HUB
                    </>
                  ) : (
                    <>
                      <Building2 className="w-3 h-3 text-amber-400 shrink-0" />
                      CENTRAL PRINT LAB & WORKSHOP
                    </>
                  )}
                </span>
                <span className="text-xs font-bold text-white">
                  {fulfillmentOrigin.hub.name}
                </span>
              </div>
              <p className="text-[11px] text-ts-kremMuted leading-relaxed">
                {fulfillmentOrigin.reason}
              </p>
            </div>
            <div className="shrink-0 text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
              <span className="text-[10px] text-ts-muted block uppercase tracking-wider font-semibold">Origin Pengiriman:</span>
              <span className="text-xs font-mono font-bold text-ts-krem">
                {fulfillmentOrigin.hub.city}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Package Weight Live Indicator */}
      {weightInfo && weightInfo.actualWeightGrams > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs">
          <div className="flex items-center gap-2 text-ts-kremMuted">
            <Package className="w-4 h-4 text-ts-mustard shrink-0" />
            <span>
              Total Berat Paket: <strong className="text-white font-mono">{weightInfo.actualWeightGrams} gram</strong> (termasuk polymailer)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-ts-muted uppercase">Beban Ekspedisi:</span>
            <span className="px-2 py-0.5 rounded-lg bg-ts-mustard/20 border border-ts-mustard/40 text-ts-mustard font-bold text-xs font-mono">
              {weightInfo.billableWeightKg} kg
            </span>
          </div>
        </div>
      )}

      {/* Zona Ongkir & Pilihan Kurir */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ts-kremMuted flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-ts-muted" />
            Zona Tarif Pengiriman
          </label>
          <select
            {...register('shippingZone')}
            className="w-full px-3.5 py-2.5 rounded-xl bg-ts-surface border border-white/[0.12] text-xs text-white focus:outline-none focus:border-ts-terracotta transition-colors cursor-pointer"
          >
            {SHIPPING_ZONES.map((zone) => (
              <option key={zone.id} value={zone.id} className="bg-ts-surface text-white">
                {zone.name} ({formatRupiah(zone.rate)}/kg • {zone.eta})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-ts-kremMuted">
              Pilihan Kurir Ekspedisi
            </label>
            {fulfillmentOrigin?.isExpressHub && (
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Sameday Aktif
              </span>
            )}
          </div>
          <select
            {...register('courier')}
            className="w-full px-3.5 py-2.5 rounded-xl bg-ts-surface border border-white/[0.12] text-xs text-white focus:outline-none focus:border-ts-terracotta transition-colors cursor-pointer"
          >
            {getAvailableCouriers(fulfillmentOrigin?.isExpressHub).map((c) => (
              <option key={c.id} value={c.name} className="bg-ts-surface text-white">
                {c.name} ({c.service} • {c.badge})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Payment Method Selector */}
      <div className="space-y-3 pt-3 border-t border-white/[0.08]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-ts-teal" />
            Metode Pembayaran
          </label>
          <span className="text-[11px] text-ts-kremMuted">Pilih sistem verifikasi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = selectedPaymentMethod === method.id;
            const isInstant = method.id === PAYMENT_PROVIDERS.MIDTRANS_SNAP;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onPaymentMethodChange && onPaymentMethodChange(method.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'bg-ts-surface border-ts-terracotta shadow-glow-teal ring-1 ring-ts-terracotta/80'
                    : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    {isInstant ? (
                      <Zap className="w-4 h-4 text-sky-400 shrink-0" />
                    ) : (
                      <QrCode className="w-4 h-4 text-ts-green shrink-0" />
                    )}
                    <span>{method.name}</span>
                  </span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border whitespace-nowrap ${method.badgeColor}`}>
                    {method.badge}
                  </span>
                </div>
                <p className="text-[11px] text-ts-kremMuted leading-relaxed">
                  {method.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </form>
  );
}
