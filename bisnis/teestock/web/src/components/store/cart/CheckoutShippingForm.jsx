import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone, MapPin, Truck, AlertCircle } from 'lucide-react';
import { checkoutSchema } from '../../../schemas/checkoutSchema';
import { SHIPPING_ZONES } from '../../../constants/pricing';
import { formatRupiah } from '../../../utils/formatters';

export function CheckoutShippingForm({
  profile,
  onSubmitOrder,
  onShippingZoneChange,
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

  // Watch shippingZone to synchronize rate calculations in parent summary
  const currentZone = watch('shippingZone');
  useEffect(() => {
    if (currentZone && onShippingZoneChange) {
      onShippingZoneChange(currentZone);
    }
  }, [currentZone, onShippingZoneChange]);

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

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmitOrder)}
      className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-5"
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
                {zone.name} ({formatRupiah(zone.rate)} • {zone.eta})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ts-kremMuted">
            Pilihan Kurir Ekspedisi
          </label>
          <select
            {...register('courier')}
            className="w-full px-3.5 py-2.5 rounded-xl bg-ts-surface border border-white/[0.12] text-xs text-white focus:outline-none focus:border-ts-terracotta transition-colors cursor-pointer"
          >
            <option value="J&T Express" className="bg-ts-surface text-white">J&T Express (Rekomendasi Cepat)</option>
            <option value="SiCepat Reguler" className="bg-ts-surface text-white">SiCepat Reguler</option>
            <option value="JNE Reguler" className="bg-ts-surface text-white">JNE Reguler</option>
            <option value="AnterAja" className="bg-ts-surface text-white">AnterAja</option>
          </select>
        </div>
      </div>
    </form>
  );
}
