---
title: Panduan Konfigurasi Branch Protection
date: 2026-09-27
bisnis: umum
kategori: operasional
status: draft
tags:
  - github
  - devops
  - ci-cd
  - mgbos
---

# Panduan Konfigurasi Branch Protection MGBOS

## Ringkasan Eksekutif (Executive Summary)

Penerapan _branch protection_ pada repositori MGBOS adalah langkah kritis untuk memastikan stabilitas dan kualitas kode (code quality) pada _branch_ `main`. Dengan mengaktifkan perlindungan ini, kita mencegah perubahan kode yang tidak disengaja, memastikan bahwa semua perubahan telah melalui proses _code review_, dan memvalidasi bahwa CI/CD _pipeline_ (khususnya _workflow_ `.github/workflows/mgbos-foundation.yml`) telah berhasil berjalan sebelum kode digabungkan (_merged_). Hal ini meminimalkan risiko _downtime_ dan _bugs_ di lingkungan produksi.

## Instruksi Konfigurasi GitHub UI

Ikuti langkah-langkah berikut untuk mengonfigurasi _branch protection_ pada _branch_ `main` melalui antarmuka web GitHub:

> [!important] Hak Akses
> Anda memerlukan hak akses **Repository Admin** untuk dapat melakukan konfigurasi ini.

1. Buka repositori MGBOS di GitHub.
2. Klik tab **Settings**.
3. Di _sidebar_ sebelah kiri, di bawah bagian "Code and automation", klik **Branches**.
4. Klik tombol **Add branch protection rule**.
5. Pada bagian **Branch name pattern**, masukkan `main`.
6. Konfigurasikan pengaturan berikut (centang kotak yang sesuai):
   - **Require a pull request before merging**: Aktifkan opsi ini.
     - Pastikan **Require approvals** diaktifkan dan set _Required number of approvals before merging_ ke **1**.
   - **Require status checks to pass before merging**: Aktifkan opsi ini.
     - Aktifkan juga **Require branches to be up to date before merging**.
     - Di kolom pencarian _status checks_, cari dan tambahkan _jobs_ dari CI _workflow_ `.github/workflows/mgbos-foundation.yml`:
       - `application`
       - `database`
       - `pr-gate` (Pengecekan PR konvensional yang baru ditambahkan)
   - **Require linear history**: Aktifkan opsi ini untuk mencegah _merge commits_ dan mengharuskan _squash merge_ atau _rebase merge_.
   - Pastikan opsi **Allow force pushes** TIDAK dicentang.
   - Pastikan opsi **Allow deletions** TIDAK dicentang.
7. Klik tombol **Create** di bagian paling bawah untuk menyimpan aturan ini.

## Alternatif menggunakan GitHub CLI (`gh`)

Jika Anda lebih memilih menggunakan _command line_, Anda dapat mengonfigurasi aturan perlindungan menggunakan GitHub CLI dan GitHub API.

> [!tip] Otomatisasi
> Menggunakan CLI sangat direkomendasikan jika Anda ingin mengotomatiskan setup repositori di masa mendatang.

Gunakan perintah berikut di terminal:

```bash
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/{owner}/{repo}/branches/main/protection \
  -f required_status_checks[strict]=true \
  -f required_status_checks[contexts][]=application \
  -f required_status_checks[contexts][]=database \
  -f required_status_checks[contexts][]=pr-gate \
  -f enforce_admins=true \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f required_pull_request_reviews[dismiss_stale_reviews]=true \
  -f required_pull_request_reviews[require_code_owner_reviews]=false \
  -f restrictions=null \
  -f required_linear_history=true \
  -f allow_force_pushes=false \
  -f allow_deletions=false
```

_Catatan: Ganti `{owner}/{repo}` dengan nama organisasi dan repositori yang sesuai._

## Daftar Periksa Verifikasi (Verification Checklist)

Setelah konfigurasi selesai, gunakan daftar periksa berikut untuk memastikan perlindungan berjalan dengan benar:

- [ ] Cobalah melakukan `git push origin main` secara langsung. Perintah ini **harus** gagal ditolak oleh server.
- [ ] Buat sebuah _Pull Request_ baru.
- [ ] Pastikan PR tidak bisa di-_merge_ sebelum mendapatkan minimal 1 persetujuan (_approval_).
- [ ] Pastikan tombol _Merge_ dinonaktifkan (berwarna abu-abu) sampai _status checks_ (`application`, `database`, `pr-gate`) berstatus _passed_.
- [ ] Pastikan hanya opsi _Squash and merge_ atau _Rebase and merge_ yang tersedia (tergantung pengaturan repositori), mengonfirmasi berlakunya aturan _linear history_.
- [ ] Cobalah menghapus _branch_ `main` dari web UI atau CLI. Tindakan ini **harus** gagal.

> [!warning] Perhatian
> Administrator repositori dapat mengabaikan aturan ini (bypass rules). Pastikan opsi "Do not allow bypasses the above settings" diaktifkan jika Anda ingin aturan ini mengikat ketat semua pengguna termasuk Admin.
