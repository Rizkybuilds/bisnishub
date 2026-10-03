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

## Ringkasan Status Perlindungan (Enforcement Status)

Dokumen ini membedakan secara tegas antara **OBSERVED CURRENT STATE** (fakta GitHub yang terverifikasi), **NOT VERIFIED** (pengaturan yang belum terbukti atau belum dapat diverifikasi oleh endpoint yang tersedia), dan **DESIRED TARGET STATE** (kondisi target tata kelola).

### 1. OBSERVED CURRENT STATE (Terverifikasi per 2026-10-02)

Berdasarkan inspeksi endpoint GitHub API pada baseline:

- **`branch: main`**: `protected = true`, `protection.enabled = true`
- **`required_status_checks.enforcement_level`**: `everyone`
- **Required status checks (6 konteks wajib)**:
  1. `application`
  2. `database`
  3. `pr-gate`
  4. `agent-governance`
  5. `migration-immutability`
  6. `repository-integrity`

### 2. NOT VERIFIED (Belum Terverifikasi / Status Pembuktian Terbatas)

Pengaturan berikut **TIDAK** diklaim aktif atau terbukti secara penuh karena keterbatasan akses endpoint administrasi (HTTP 403) dan bukti operasional yang diobservasi:

- **Required PR review count / Review approval enforcement**: `NOT_VERIFIED`. Bukti faktual: PR #23 dan PR #24 berhasil digabungkan (_merged_) dengan 0 review GitHub. Dalam realitas operasional solo-founder saat ini, pembuat PR tidak dapat memberikan review persetujuan GitHub yang valid untuk dirinya sendiri. Verifikasi manusia saat ini tetap berlabel `SELF_REVIEW`, bukan `INDEPENDENT_REVIEW`.
- **Direct push rejection**: `NOT_VERIFIED` secara eksperimental. Tata kelola repositori melarang keras direct push ke `main`, namun penolakan server-side belum diuji secara destruktif.
- **Admin / bypass policy**: `NOT_VERIFIED`.
- **Required linear history**: `NOT_VERIFIED`.
- **Allow force pushes / Allow deletions**: `NOT_VERIFIED`.
- **Repository rulesets**: Endpoint mengembalikan `[]`.

### 3. DESIRED TARGET STATE (Target Tata Kelola Bertahap)

Kondisi target tata kelola jangka panjang ketika organisasi bertumbuh dan memiliki reviewer independen kedua:

- Enforce status checks untuk semua kontributor (`everyone`).
- Seluruh 6 konteks CI wajib hijau sebelum merge.
- Required review count diaktifkan ketika reviewer kedua yang memenuhi syarat telah tersedia.
- Larangan force push dan branch deletion terikat ketat di server.

---

## Instruksi Konfigurasi GitHub UI

Ikuti langkah-langkah berikut untuk mengonfigurasi atau menyinkronkan _branch protection_ pada _branch_ `main` melalui antarmuka web GitHub:

> [!important] Hak Akses
> Anda memerlukan hak akses **Repository Admin** untuk dapat melakukan konfigurasi ini.

1. Buka repositori di GitHub.
2. Klik tab **Settings**.
3. Di _sidebar_ sebelah kiri, di bawah bagian "Code and automation", klik **Branches**.
4. Klik **Add branch protection rule** (atau edit aturan yang sudah ada untuk `main`).
5. Pada bagian **Branch name pattern**, masukkan `main`.
6. Konfigurasikan pengaturan berikut:
   - **Require status checks to pass before merging**: Aktifkan opsi ini.
     - Aktifkan juga **Require branches to be up to date before merging**.
     - Tambahkan seluruh **6 status checks wajib**:
       - `application`
       - `database`
       - `pr-gate`
       - `agent-governance`
       - `migration-immutability`
       - `repository-integrity`
     - Pastikan evaluasi berlaku untuk semua kontributor (**Do not allow bypasses** / `everyone`).
   - **Require a pull request before merging**:
     - Untuk lingkungan solo-founder saat ini, review enforcement wajib disesuaikan agar tidak terjadi deadlock sampai ada reviewer kedua yang memenuhi syarat.
   - **Require linear history**: Disarankan aktif (squash atau rebase merge).
   - Pastikan opsi **Allow force pushes** TIDAK dicentang.
   - Pastikan opsi **Allow deletions** TIDAK dicentang.
7. Klik tombol **Save changes** / **Create** untuk menyimpan aturan.

---

## Konfigurasi menggunakan GitHub CLI (`gh`) / API

Untuk memperbarui konteks pemeriksaan wajib melalui GitHub CLI / API:

```bash
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/{owner}/{repo}/branches/main/protection/required_status_checks \
  -f strict=true \
  -f contexts[]=application \
  -f contexts[]=database \
  -f contexts[]=pr-gate \
  -f contexts[]=agent-governance \
  -f contexts[]=migration-immutability \
  -f contexts[]=repository-integrity
```

_Catatan: Pengubahan konfigurasi penuh membutuhkan token dengan hak akses admin repositori._

---

## Realitas Review Solo-Founder & Verifikasi

1. **Pemisahan Pemeriksaan Mesin vs Review Manusia**:
   - **Machine merge checks**: Enforce 6 required status checks secara otomatis pada setiap PR.
   - **Independent human review**: Belum dapat di-enforce via GitHub PR review gating karena batasan solo-founder (deadlock jika author harus di-review orang lain).
   - Assurance saat ini menggunakan **`SELF_REVIEW`** yang terdokumentasi dalam PR body dan kontrol rencana kerja, bukan klaim `INDEPENDENT_REVIEW`.

2. **Daftar Periksa Status (Status Checklist)**:
   - [x] `main` branch terlindungi (`protected = true`).
   - [x] 6 required status checks terdaftar dan dievaluasi di CI.
   - [ ] Enforcement penolakan direct push diuji secara empiris (`NOT_VERIFIED`).
   - [ ] Enforcement review approval GitHub aktif (`NOT_VERIFIED` / Solo-founder mode).
   - [ ] Larangan force push dan linear history diverifikasi via admin API (`NOT_VERIFIED`).
