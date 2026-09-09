import { z } from 'zod';

/**
 * Regex nomor telepon Indonesia:
 * Mendukung format: 08..., 628..., +628... dengan panjang 9-14 digit
 */
export const indonesianPhoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;

export const checkoutSchema = z.object({
  customerName: z
    .string({ required_error: 'Nama penerima wajib diisi.' })
    .trim()
    .min(3, 'Nama penerima minimal 3 karakter.'),
  phone: z
    .string({ required_error: 'Nomor WhatsApp wajib diisi.' })
    .trim()
    .refine(
      val => indonesianPhoneRegex.test(val.replace(/[\s-]/g, '')),
      'Nomor WhatsApp tidak valid (format: 08xxxxxxxxxx atau 628xxxxxxxxxx).'
    ),
  city: z
    .string({ required_error: 'Kota / Kabupaten pengiriman wajib diisi.' })
    .trim()
    .min(2, 'Kota / Kabupaten wajib diisi.'),
  subdistrict: z
    .string({ required_error: 'Kecamatan pengiriman wajib diisi.' })
    .trim()
    .min(2, 'Kecamatan wajib diisi.'),
  address: z
    .string({ required_error: 'Alamat lengkap wajib diisi.' })
    .trim()
    .min(8, 'Detail alamat rumah & jalan minimal 8 karakter.'),
  shippingZone: z.string().default('jawa_lainnya'),
  courier: z.string().default('J&T Express'),
  notes: z.string().optional().default('')
});

export const customOrderSchema = z.object({
  name: z
    .string({ required_error: 'Nama lengkap wajib diisi.' })
    .trim()
    .min(3, 'Nama lengkap minimal 3 karakter.'),
  phone: z
    .string({ required_error: 'Nomor WhatsApp wajib diisi.' })
    .trim()
    .refine(
      val => indonesianPhoneRegex.test(val.replace(/[\s-]/g, '')),
      'Nomor WhatsApp tidak valid (format: 08xxxxxxxxxx).'
    ),
  city: z
    .string({ required_error: 'Kota asal pemesan wajib diisi.' })
    .trim()
    .min(2, 'Kota wajib diisi.'),
  qty: z
    .number({ required_error: 'Jumlah pesanan minimal 1 pcs.' })
    .min(1, 'Jumlah pesanan minimal 1 pcs.')
    .default(1),
  notes: z.string().optional().default('')
});
