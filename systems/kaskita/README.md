# KasKita runtime

Kode KasKita dipisahkan dari [dokumentasi bisnis](../../bisnis/kaskita/README.md). KasKita tetap sistem independen dari MGBOS dan TeeStock.

- `apps/mobile/`: React Native / Expo, manifest dan lockfile npm sendiri.
- `supabase/`: konfigurasi dan SQL KasKita; jangan memakai root junction `supabase` atau database MGBOS.

```powershell
cd systems/kaskita/apps/mobile
npm ci
npx --no-install tsc --noEmit
npm start
```

Export Android tanpa menjalankan aplikasi atau mengirim transaksi:

```powershell
$env:EXPO_NO_TELEMETRY='1'
$env:EXPO_OFFLINE='1'
npx --no-install expo export --platform android --output-dir .expo/export-android
```

Konfigurasi, entrypoint, nama package dan versi dependency tidak diubah oleh migrasi lokasi. Environment/metadata lokal tetap lokal. File SQL yang dipindahkan tidak diterapkan ulang. Build/export bukan bukti fungsi pada perangkat atau database produksi.

Rollback lokasi harus mengembalikan kedua folder beserta navigasi/CI yang terkait pada branch terpisah. Pertahankan file lokal dan periksa proses sebelum memindahkan kembali; jangan reset database untuk rollback direktori.
