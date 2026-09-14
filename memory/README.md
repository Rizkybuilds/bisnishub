---
title: "Memory System Documentation"
date: "2026-09-14"
bisnis: umum
kategori: operasional
status: active
tags:
  - system
  - memory
  - persistence
  - ai-csuite
---

# 🧠 Memory System & Persistence Architecture

> [!abstract] **Fungsi Direktori**
> Direktori memory/ berfungsi sebagai lapisan penyimpanan data persisten (*persistent memory layer*) untuk agen AI (Virtual C-Suite) dan sinkronisasi status bisnis solopreneur.

---

## 📁 Struktur Berkas

| Berkas | Format | Deskripsi & Tanggung Jawab |
|---|---|---|
| usiness_profile.json | JSON | **Master Profile**: Status portofolio 3 bisnis (TeeStock, MultiGraph, Titik Buta), unit economics, HPP, strategi inventori, dan rincian peluncuran. |
| growth_log.json | JSON Array | **Self-Improvement Log**: Catatan reflektif agen tentang cara kerja, preferensi founder, dan optimasi alur kerja. |
| history.json | JSON Array | **Session Context Cache**: Riwayat obrolan sesi CLI (main.py) aktif untuk mempertahankan memori jangka pendek saat berganti peran. |

---

## 🔄 Alur Sinkronisasi dengan Obsidian

`mermaid
flowchart LR
    A[Interactive CLI main.py / Antigravity] -->|Baca Konteks| B[(memory/business_profile.json)]
    A -->|Simpan Dialog| C[(memory/history.json)]
    A -->|Export Markdown| D[catatan/sesi/YYYY-MM-DD - Sesi Role.md]
    D -->|Terhubung ke| E[🏠 BisnisHub Command Center.md]
`

1. **Pembacaan**: Setiap kali sesi C-Suite dimulai, usiness_profile.json diinjeksi ke system prompt agar AI selalu tahu HPP, status pabrik, dan batas diskon.
2. **Penyimpanan**: Perintah /save atau /exit di CLI akan mengekspor percakapan ke format Markdown ramah Obsidian di catatan/sesi/.
3. **Pembaruan Profil**: Jika ada perubahan harga atau status bisnis, usiness_profile.json diperbarui secara terprogram oleh agen.

---
*Navigasi: [[🏠 BisnisHub Command Center|Kembali ke Command Center]]*