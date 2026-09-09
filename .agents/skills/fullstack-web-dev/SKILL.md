---
name: fullstack-web-dev
description: >-
  Pengembangan frontend & fullstack web apps modern menggunakan React 18/19, Vite,
  Next.js (App Router), TypeScript, Tailwind CSS, dan integrasi client.
  Gunakan untuk implementasi komponen UI interaktif, custom hooks,
  form handling dengan React Hook Form + Zod, caching TanStack Query, optimistic UI,
  dan integrasi backend/Supabase.
argument-hint: "[component, hook, form, ui, or fullstack-feature]"
---

# Fullstack Web Developer — React, Vite & Next.js Specialist

Skill spesialis untuk implementasi kode frontend dan fullstack web yang bersih (*clean code*), *type-safe*, berperforma tinggi, dan mudah dirawat.

---

## 1. Standar Stack & Konvensi Kode (TypeScript Strict)

Setiap implementasi kode wajib mematuhi standar berikut:
1. **TypeScript Strict Mode**: Hindari penggunaan `any`. Selalu deklarasikan type/interface untuk Props, API Response, dan State.
2. **Komposisi Komponen UI**:
   - Manfaatkan `clsx` dan `tailwind-merge` (atau helper `cn(...)`) untuk styling modular.
   - Pisahkan logika berat dari JSX ke dalam *Custom Hooks* (e.g. `useCart`, `useProductCatalog`).
3. **Standar Styling Tailwind CSS**:
   - Desain Mobile-First (`w-full md:w-1/2 lg:w-1/3`).
   - Gunakan semantic tokens / variable warna daripada hardcoded hex code.

---

## 2. Pola Penanganan Form & Validasi (React Hook Form + Zod)

Hindari mengelola state form kompleks menggunakan banyak `useState`. Selalu gunakan pasangan emas: **React Hook Form** + **Zod Schema**:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Skema Validasi
export const orderFormSchema = z.object({
  customerName: z.string().min(3, 'Nama minimal 3 karakter'),
  whatsappNumber: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, 'Nomor WhatsApp tidak valid'),
  shippingAddress: z.string().min(10, 'Alamat pengiriman harus lengkap'),
  postalCode: z.string().length(5, 'Kode pos harus 5 digit'),
  notes: z.string().optional()
});

export type OrderFormData = z.infer<typeof orderFormSchema>;

// 2. Implementasi Komponen
export function OrderForm({ onSubmitOrder }: { onSubmitOrder: (data: OrderFormData) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmitOrder)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Nama Penerima</label>
        <input
          {...register('customerName')}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          placeholder="e.g. Rizky Pratama"
        />
        {errors.customerName && (
          <p className="mt-1 text-xs text-rose-500">{errors.customerName.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
      >
        {isSubmitting ? 'Memproses Pesanan...' : 'Lanjut ke Pembayaran'}
      </button>
    </form>
  );
}
```

---

## 3. Pola Data Fetching & Cache Management (TanStack Query / Supabase)

Untuk mencegah overfetching dan *flash of unstyled content*, gunakan hook tersentralisasi:

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabaseClient';

// Query Hook: Fetch Produk Aktif
export function useActiveProducts(category?: string) {
  return useQuery({
    queryKey: ['products', { category }],
    queryFn: async () => {
      let query = supabase
        .from('ts_products')
        .select('*, ts_unit_economics(cost_blank)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data;
    },
    staleTime: 5 * 60 * 1000 // Cache valid selama 5 menit
  });
}
```

---

## 4. Pola Optimistic UI Updates (Respon Instan)

Saat pengguna mengubah kuantitas atau menghapus item dari keranjang, lakukan pembaruan UI secara instan sebelum server selesai merespons:

```tsx
export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      // API call ke backend / Supabase
    },
    onMutate: async ({ itemId, quantity }) => {
      // 1. Batalkan refetch berjalan agar tidak menimpa state optimistik
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      // 2. Snapshot data lama untuk rollback jika terjadi error
      const previousCart = queryClient.getQueryData(['cart']);
      // 3. Update cache lokal secara instan
      queryClient.setQueryData(['cart'], (old: any) => ({
        ...old,
        items: old.items.map((item: any) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      }));
      return { previousCart };
    },
    onError: (err, newTodo, context) => {
      // Rollback jika request gagal
      queryClient.setQueryData(['cart'], context?.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}
```

---

## 5. Checklist Kesiapan Produksi Komponen UI
- [ ] Komponen memiliki props interface yang jelas dan terdokumentasi.
- [ ] Skenario loading state menggunakan Skeleton Loader (bukan blank screen).
- [ ] Aksesibilitas keyboard (fokus visual `:focus-visible` dan elemen interaktif menggunakan tag `<button>` / `<a>`).
- [ ] Penanganan error tidak menyebabkan crash pada seluruh aplikasi (gunakan `ErrorBoundary`).
