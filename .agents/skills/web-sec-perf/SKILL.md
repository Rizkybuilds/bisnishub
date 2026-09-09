---
name: web-sec-perf
description: >-
  Audit keamanan aplikasi web sesuai standar OWASP (sanitasi input, proteksi XSS,
  CSRF, CSP, pengelolaan environment variables aman) serta optimasi performa Core Web Vitals
  (LCP, CLS, INP), code-splitting, bundle analysis, optimasi aset gambar, dan technical SEO.
argument-hint: "[security, performance, lcp, seo, owasp, or audit]"
---

# Web Security & Performance Engineer — SecOps & Core Web Vitals

Skill spesialis untuk mengamankan aplikasi web dari celah kerentanan berbahaya (standar OWASP) dan mengoptimalkan performa rendering hingga mencapai skor hijau di Google PageSpeed Insights / Core Web Vitals.

---

## 1. Protokol Keamanan Web (OWASP Hardening)

### A. Proteksi Kebocoran Kunci Rahasia (*Zero Secret Leakage*)
> [!CAUTION]
> Jangan pernah mengekspos `SUPABASE_SERVICE_ROLE_KEY`, `MIDTRANS_SERVER_KEY`, atau API key dengan hak administrator ke dalam variabel client yang diawali `VITE_` atau `NEXT_PUBLIC_`! Kunci tersebut dapat dibaca siapa saja lewat DevTools Network / Source Code.

Gunakan aturan ketat berikut:
* **Client Env (Aman terekspos):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (dilindungi oleh Row Level Security PostgreSQL).
* **Server-Only Env (Rahasia mutlak):** `MIDTRANS_SERVER_KEY`, `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (hanya boleh diakses di backend Node.js atau Edge Functions).

### B. Header Keamanan HTTP (Security Headers)
Terapkan header ini pada konfigurasi hosting (`vercel.json`, `netlify.toml`, atau Web Server):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://app.midtrans.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
        }
      ]
    }
  ]
}
```

---

## 2. Optimasi Core Web Vitals (Mengejar Skor 90+ di Mobile)

### A. Largest Contentful Paint (LCP < 2.5s)
Elemen terbesar di atas lipatan layar (*above-the-fold*), seperti Hero Banner:
1. **Preload Gambar Hero**:
   ```html
   <link rel="preload" as="image" href="/assets/hero-banner.webp" type="image/webp" />
   ```
2. **Format Gambar Modern**: Konversi semua aset PNG/JPG ke WebP atau AVIF dengan kompresi kualitas 80–85% (menghemat 60–80% bobot transfer).
3. **Hindari Lazy Loading pada Hero Banner**: Atribut `loading="lazy"` hanya untuk gambar di bawah layar lipatan (*below-the-fold*).

### B. Cumulative Layout Shift (CLS < 0.1)
Mencegah tampilan melompat atau bergeser saat elemen baru selesai dimuat:
1. Selalu sertakan `width` dan `height` atau class rasio aspek pada tag gambar:
   ```html
   <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
     <img src="..." alt="..." className="h-full w-full object-cover" />
   </div>
   ```
2. Sediakan skeleton loader dengan dimensi tinggi yang persis sama dengan kartu produk asli.

### C. Interaction to Next Paint (INP < 200ms)
1. Gunakan teknik *debounce* pada input pencarian (300–400ms) agar thread utama JavaScript tidak terkunci saat pengguna mengetik cepat.
2. Gunakan `React.startTransition` untuk pembaruan state yang bukan prioritas kritis.

---

## 3. Optimasi Ukuran Bundle (Code-Splitting)

Gunakan *Dynamic Import* untuk halaman yang jarang dibuka (misal: Halaman Checkout, Syarat & Ketentuan, atau Dashboard Admin):

```tsx
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const CatalogPage = lazy(() => import('@/features/catalog/CatalogPage'));
const CheckoutPage = lazy(() => import('@/features/checkout/CheckoutPage'));
const AdminDashboard = lazy(() => import('@/features/admin/DashboardPage'));

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Memuat...</div>}>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
}
```

---

## 4. Checklist Technical SEO & Social Sharing
- [ ] Tag `<title>` dan `<meta name="description">` dinamis per halaman produk.
- [ ] OpenGraph metadata (`og:image`, `og:title`, `og:description`, `og:url`) agar preview kartu di WhatsApp dan Twitter tampil memikat saat link dibagikan.
- [ ] File `robots.txt` dan `sitemap.xml` terindeks dengan benar di root domain.
