---
name: git-deploy-ops
description: >-
  SOP dan panduan deployment Vercel untuk TeeStock web, Git commit branching,
  dan migrasi Supabase CLI. Gunakan saat merilis fitur baru, deploy ke produksi,
  atau menjalankan migrasi database.
argument-hint: "[deploy, migrate, or release]"
---

# Git & Deployment Ops Runbook — BisnisHub

Panduan standar untuk version control, deployment web (Vercel), dan migrasi database (Supabase) untuk solopreneur.

---

## 1. Pre-Deployment Checklist (TeeStock Web)

Sebelum melakukan push atau deployment ke produksi:

1. **Lint & Build Test**:
   ```powershell
   cd c:\Users\Rizky\bisnishub\bisnis\teestock\web
   npm run build
   ```
   *Pastikan tidak ada error kompilasi TypeScript atau Vite bundler.*

2. **E2E Checkout Test (Playwright)**:
   ```powershell
   npx playwright test tests/checkout.spec.js
   ```

3. **Verifikasi Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_MIDTRANS_CLIENT_KEY`

---

## 2. Git Workflow Standar

Gunakan konvensi commit ringkas:
- `feat(web): <fitur baru>`
- `fix(web): <perbaikan bug>`
- `feat(db): <migrasi tabel/rls baru>`
- `docs(obsidian): <catatan riset/sop>`

```powershell
git status
git add .
git commit -m "feat(web): add quick order drawer mobile"
git push origin main
```

---

## 3. Vercel Deployment Flow

Monorepo ini mendukung 2 target project terpisah di Vercel:

### A. TeeStock Storefront (`teestockapparel.vercel.app`)
- **Root Directory**: `.` (Root repo, mengacu ke root `vercel.json`) atau `bisnis/teestock/web`
- **Trigger**: Push ke `main` otomatis deploy storefront ke produksi.

### B. BisnisHub OS (`bisnishub-os.vercel.app` / `apps/bisnishub-web`)
- **Root Directory**: `apps/bisnishub-web`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_APP_ENV=production`
  - `VITE_FOUNDER_PIN`
  - `VITE_ADMIN_EMAILS`

Jika deploy via Vercel CLI secara manual dari terminal:
```powershell
# Deploy BisnisHub OS (dari folder apps/bisnishub-web)
cd apps/bisnishub-web
npx vercel --prod
```


---

## 4. Supabase Database & Edge Functions Workflow

Direktori: `c:\Users\Rizky\bisnishub\bisnis\teestock\supabase`

### A. Migrasi Skema SQL
- Selalu simpan file DDL di `bisnis/teestock/database/migrations/` dengan penamaan bertanggal: `YYYYMMDD_nama_migrasi.sql`.
- Gunakan transaksi SQL (`BEGIN; ... COMMIT;`) agar jika gagal tidak merusak status database.

### B. Deploy Supabase Edge Functions
```powershell
# Deploy fungsi webhook payment
supabase functions deploy midtrans-webhook --project-ref <PROJECT_ID>

# Deploy fungsi notifikasi whatsapp
supabase functions deploy wa-notify --project-ref <PROJECT_ID>
```

---

## 5. Rollback Strategy (Emergency)

1. **Web App Rollback (Vercel)**:
   Buka Vercel Dashboard -> Deployments -> Pilih deployment sebelumnya yang stabil -> Klik **Promote to Production** (instan < 5 detik).
2. **Database Rollback**:
   Siapkan script undo untuk setiap migrasi (misal: `DROP TABLE IF EXISTS ...`, `DROP POLICY ...`).
