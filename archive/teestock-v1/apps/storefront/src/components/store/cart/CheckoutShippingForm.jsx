import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone, MapPin, Truck, AlertCircle, Package, CreditCard, Zap, QrCode, Building2 } from 'lucide-react';
import { checkoutSchema } from '../../../schemas/checkoutSchema';
import { SHIPPING_ZONES } from '@bisnishub/shared/constants/pricing';
import { formatRupiah } from '@bisnishub/shared/utils/formatters';
import { PAYMENT_METHODS, PAYMENT_PROVIDERS } from '@bisnishub/shared/services/paymentAdapter';
import { getAvailableCouriers } from '@bisnishub/shared/services/shippingApi';

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
      className="p-5 sm:p-6 rounded-3xl bg-ts-surface border border-ts-border space-y-6 shadow-sm"
    >
      <div className="pb-3 border-b border-ts-border flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ts-krem flex items-center gap-2">
          <MapPin className="w-4 h-4 text-ts-terracotta" />
          Alamat Pengiriman &amp; Penerima
        </h3>
        <span className="text-[11px] text-ts-kremMuted">
          Wajib diisi lengkap untuk kurir
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nama Penerima */}
        <div className="space-y-1.5">
          <label htmlFor="checkout-customer-name" className="text-xs font-semibold text-ts-kremMuted flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-ts-muted" />
            Nama Penerima <span className="text-rose-500">*</span>
          </label>
          <input
            id="checkout-customer-name"
            {...register('customerName')}
            placeholder="Contoh: Rizky Pratama"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-ts-surfaceHover/50 border border-ts-border text-xs text-ts-krem placeholder:text-ts-muted focus:outline-none focus:border-ts-terracotta focus:bg-ts-surface transition-colors"
          />
          {errors.customerName && (
            <p className="text-[11px] text-rose-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.customerName.message}
            </p>
          )}
        </div>

        {/* WhatsApp */}
        <div className="space-y-1.5">
          <label htmlFor="checkout-phone" className="text-xs font-semibold text-ts-kremMuted flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-ts-muted" />
            Nomor WhatsApp <span className="text-rose-500">*</span>
          </label>
          <input
            id="checkout-phone"
            {...register('phone')}
            type="tel"
            placeholder="081234567890"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-ts-surfaceHover/50 border border-ts-border text-xs text-ts-krem placeholder:text-ts-muted focus:outline-none focus:border-ts-terracotta focus:bg-ts-surface transition-colors font-mono"
          />
          {errors.phone && (
            <p className="text-[11px] text-rose-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Kota / Kabupaten */}
        <div className="space-y-1.5">
          <label htmlFor="checkout-city" className="text-xs font-semibold text-ts-kremMuted">
            Kota / Kabupaten <span className="text-rose-500">*</span>
          </label>
          <input
            id="checkout-city"
            {...register('city')}
            placeholder="Contoh: Bandung"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-ts-surfaceHover/50 border border-ts-border text-xs text-ts-krem placeholder:text-ts-muted focus:outline-none focus:border-ts-terracotta focus:bg-ts-surface transition-colors"
          />
          {errors.city && (
            <p className="text-[11px] text-rose-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.city.message}
            </p>
          )}
        </div>

        {/* Kecamatan */}
        <div className="space-y-1.5">
          <label htmlFor="checkout-subdistrict" className="text-xs font-semibold text-ts-kremMuted">
            Kecamatan <span className="text-rose-500">*</span>
          </label>
          <input
            id="checkout-subdistrict"
            {...register('subdistrict')}
            placeholder="Contoh: Coblong"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-ts-surfaceHover/50 border border-ts-border text-xs text-ts-krem placeholder:text-ts-muted focus:outline-none focus:border-ts-terracotta focus:bg-ts-surface transition-colors"
          />
          {errors.subdistrict && (
            <p className="text-[11px] text-rose-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.subdistrict.message}
            </p>
          )}
        </div>
      </div>

      {/* Alamat Lengkap */}
      <div className="space-y-1.5">
        <label htmlFor="checkout-address" className="text-xs font-semibold text-ts-kremMuted">
          Alamat Jalan &amp; Nomor Rumah / Patokan <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="checkout-address"
          {...register('address')}
          rows={2}
          placeholder="Nama jalan, RT/RW, nomor rumah, nama gedung/blok, dan patokan..."
          className="w-full min-h-[56px] px-3.5 py-2.5 rounded-xl bg-ts-surfaceHover/50 border border-ts-border text-xs text-ts-krem placeholder:text-ts-muted focus:outline-none focus:border-ts-terracotta focus:bg-ts-surface transition-colors resize-none"
        />
        {errors.address && (
          <p className="text-[11px] text-rose-500 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {errors.address.message}
          </p>
        )}
      </div>

      {/* 🏭 Live Multi-Origin Fulfillment Hub Banner */}
      {fulfillmentOrigin && (
        <div className={`p-4 rounded-2xl border transition-all ${
          fulfillmentOrigin.isExpressHub
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 shadow-sm'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-300'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-ts-surface border border-ts-border flex items-center gap-1 text-ts-krem">
                  {fulfillmentOrigin.isExpressHub ? (
                    <>
                      <Zap className="w-3 h-3 text-emerald-500 shrink-0" />
                      EXPRESS SATELLITE HUB
                    </>
                  ) : (
                    <>
                      <Building2 className="w-3 h-3 text-amber-500 shrink-0" />
                      CENTRAL PRINT LAB &amp; WORKSHOP
                    </>
                  )}
                </span>
                <span className="text-xs font-bold text-ts-krem">
                  {fulfillmentOrigin.hub.name}
                </span>
              </div>
              <p className="text-[11px] text-ts-kremMuted leading-relaxed">
                {fulfillmentOrigin.reason}
              </p>
            </div>
            <div className="shrink-0 text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-ts-border">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-ts-surfaceHover/50 border border-ts-border text-xs">
          <div className="flex items-center gap-2 text-ts-kremMuted">
            <Package className="w-4 h-4 text-ts-mustard shrink-0" />
            <span>
              Total Berat Paket: <strong className="text-ts-krem font-mono">{weightInfo.actualWeightGrams} gram</strong> (termasuk polymailer)
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
          <label htmlFor="checkout-shipping-zone" className="text-xs font-semibold text-ts-kremMuted flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-ts-muted" />
            Zona Tarif Pengiriman
          </label>
          <select
            id="checkout-shipping-zone"
            {...register('shippingZone')}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-ts-surface border border-ts-border text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta transition-colors cursor-pointer shadow-sm"
          >
            {SHIPPING_ZONES.map((zone) => (
              <option key={zone.id} value={zone.id} className="bg-ts-surface text-ts-krem">
                {zone.name} ({formatRupiah(zone.rate)}/kg • {zone.eta})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="checkout-courier" className="text-xs font-semibold text-ts-kremMuted">
              Pilihan Kurir Ekspedisi
            </label>
            {fulfillmentOrigin?.isExpressHub && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Sameday Aktif
              </span>
            )}
          </div>
          <select
            id="checkout-courier"
            {...register('courier')}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-ts-surface border border-ts-border text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta transition-colors cursor-pointer shadow-sm"
          >
            {getAvailableCouriers(fulfillmentOrigin?.isExpressHub).map((c) => (
              <option key={c.id} value={c.name} className="bg-ts-surface text-ts-krem">
                {c.name} ({c.service} • {c.badge})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Payment Method Selector */}
      <div className="space-y-3 pt-3 border-t border-ts-border">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-ts-krem flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-ts-teal" />
            Metode Pembayaran
          </label>
          <span className="text-[11px] text-ts-kremMuted">Pilih sistem verifikasi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Pilihan Metode Pembayaran">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = selectedPaymentMethod === method.id;
            const isInstant = method.id === PAYMENT_PROVIDERS.MIDTRANS_SNAP;
            return (
              <button
                key={method.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`Metode ${method.name}: ${method.description}`}
                onClick={() => onPaymentMethodChange && onPaymentMethodChange(method.id)}
                className={`p-4 min-h-[48px] rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2.5 relative ${
                  isSelected
                    ? isInstant
                      ? 'bg-sky-500/10 border-sky-500 shadow-md ring-1 ring-sky-500/50'
                      : 'bg-ts-surfaceHover border-ts-terracotta shadow-glow-terracotta-sm ring-1 ring-ts-terracotta/80'
                    : 'bg-ts-surface border-ts-border hover:bg-ts-surfaceHover hover:border-ts-borderHover'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? isInstant ? 'border-sky-500 bg-sky-500 text-white' : 'border-ts-terracotta bg-ts-terracotta text-white'
                        : 'border-ts-border bg-transparent'
                    }`}>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="text-xs font-bold text-ts-krem flex items-center gap-1.5">
                      {isInstant ? (
                        <Zap className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      ) : (
                        <QrCode className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                      <span>{method.name}</span>
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded border whitespace-nowrap ${method.badgeColor}`}>
                    {method.badge}
                  </span>
                </div>
                <p className="text-[11px] text-ts-kremMuted leading-relaxed pl-6">
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
