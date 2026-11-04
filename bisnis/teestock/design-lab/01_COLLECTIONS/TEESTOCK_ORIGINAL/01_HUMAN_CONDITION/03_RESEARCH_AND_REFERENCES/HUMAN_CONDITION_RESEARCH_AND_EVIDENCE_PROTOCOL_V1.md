# HUMAN CONDITION — RESEARCH & EVIDENCE PROTOCOL (V1)

> [!NOTE]
> **CANONICAL LAYER 03 RESEARCH & EVIDENCE PROTOCOL**
> Dokumen ini adalah standar kanonikal Layer 03 (Research & Evidence Intelligence) pada Human Condition Editorial Intelligence System V2, mengatur hirarki sumber Tier 1–4, verifikasi adversarial, dan Claim-Level Evidence Ledger.
## Layer 03 Operating Standard: Epistemic Rigor, Source Appraisal, Claim-Level Evidence Ledger & Fact-Checking

**Document ID:** `TSO-HC-REP-001`
**Version:** 1.0 — Stage 03 Master Standard
**Status:** Approved Working Standard
**System:** Human Condition Editorial Intelligence System (Layer 03)
**Parent Architecture:** [`HUMAN_CONDITION_EDITORIAL_INTELLIGENCE_SYSTEM_V2.md`](../00_COLLECTION_CHARTER/HUMAN_CONDITION_EDITORIAL_INTELLIGENCE_SYSTEM_V2.md)
**Effective Date:** 2026-11-04

---

## 1. PURPOSE & GOVERNING PRINCIPLE

Research & Evidence Protocol menetapkan standar bagaimana Human Condition menemukan, mengevaluasi, mencatat, menginterpretasikan, dan memverifikasi informasi.

> [!IMPORTANT]
> **Guiding Principle:**
> *"Evidence must determine the strength of a claim, not the strength of our desire to believe it."*
> *(Bukti ilmiah yang menentukan bobot klaim, bukan hasrat emosional kita untuk mempercayainya).*

Tujuannya adalah mencegah: klaim tanpa bukti, generalisasi berlebihan, pelintiran statistik, sesat pikir kausalitas (*causal fallacy*), dan atribusi kutipan palsu.

---

## 2. SEVEN CORE RESEARCH ACTIVITIES

$$\text{1. Scoping} \to \text{2. Discovery} \to \text{3. Appraisal} \to \text{4. Claim Extraction} \to \text{5. Synthesis} \to \text{6. Verification} \to \text{7. Approval}$$

Output akhir riset bukan sekadar daftar pustaka di akhir halaman, melainkan **Claim-Level Evidence Ledger** yang dapat diaudit per kalimat.

---

## 3. DOMAIN-SPECIFIC SOURCE APPRAISAL

Metode penilaian bukti disesuaikan dengan disiplin ilmu:
* **Empirical (Sains Kognitif & Psikologi):** Desain eksperimen, validitas instrumen pengukuran, representativitas sampel, replikasi independen, dan transparansi batas statistik.
* **Philosophical:** Ketepatan representasi teks asli filsuf, koherensi logika premis-kesimpulan, dan keterbukaan terhadap argumen tandingan.
* **Historical:** Pelacakan dokumen primer, arsip resmi, dan analisis konteks zaman.
* **Cultural & Social:** Observasi lapangan terstruktur, wawancara mendalam, dan data sosiologis kontekstual.

---

## 4. SISTEM KLASIFIKASI 11 TIPE KLAIM (CLAIM CLASSIFICATION)

| Tipe Klaim | Definisi | Standar Pembuktian |
| :--- | :--- | :--- |
| **FACTUAL** | Fakta kejadian terverifikasi | Data arsip / catatan publik |
| **QUANTITATIVE** | Angka / metrik statistik | Laporan survei / dataset resmi |
| **EMPIRICAL** | Temuan eksperimen teramati | Jurnal riset peer-reviewed |
| **CAUSAL** | Faktor A memicu timbulnya B | Eksperimen kontrol acak (RCT) |
| **COMPARATIVE** | Membandingkan dua kelompok | Analisis statistik selisih rata-rata |
| **HISTORICAL** | Kronologi peristiwa masa lampau | Dokumen sejarah primer |
| **INTERPRETIVE** | Penafsiran atas data empiris | Kerangka teori yang diakui |
| **PHILOSOPHICAL**| Argumen logika etika/eksistensi| Validitas silogisme nalar |
| **NORMATIVE** | Penilaian benar-salah secara moral| Disajikan sebagai pandangan etis |
| **SPECULATIVE** | Hipotesis eksploratif belum pasti | Wajib dilabeli dugaan terbuka |
| **QUOTATION** | Kutipan kata demi kata | Verifikasi teks asli & konteksnya |

> **Aturan Kausalitas:** Dilarang menggunakan kata "menyebabkan" jika data hanya membuktikan asosiasi. Gunakan frasa: *"berkaitan dengan"*, *"teramati bersamaan"*, atau *"berkontribusi terhadap"*.

---

## 5. CLAIM-LEVEL EVIDENCE LEDGER (FORMAT AUDIT)

Setiap klaim penting dalam naskah wajib memiliki kartu rekam jejak:

```text
Claim ID: HC-E01-C001
Proposed Claim: Keyakinan dan akurasi berhubungan positif namun lemah.
Claim Type: Empirical Finding.
Supporting Source: Jin et al. (2022), Psychol Bull Rev.
Methodology: Meta-analisis 213 dataset, 9.132 partisipan, 3,9 juta percobaan.
Main Finding: Rata-rata korelasi r = 0.22.
Limitation: Hubungan bervariasi antar-tugas; bukan ukuran universal setiap individu.
Permitted Usage: Digunakan untuk membantah anggapan bahwa rasa yakin pasti benar.
Review Status: VERIFIED WITH QUALIFICATIONS.
```

---

## 6. PROTOKOL KHUSUS PSIKOLOGI & PERILAKU MANUSIA

1. **Anti-Labeling Kepribadian:** Dilarang mencap orang narsis, sosiopat, atau bodoh hanya dari pengamatan perilaku biasa.
2. **Anti-Pernyataan Universal:** Menghindari kata *"Semua manusia selalu..."*. Gunakan batasan: *"Dalam konteks tertentu, banyak orang cenderung..."*.
3. **Pemisahan Konstruk:**
   - *Confidence* $\neq$ *Competence*.
   - *Calibration* $\neq$ *Metacognitive Sensitivity*.
   - *Conformity* $\neq$ *Obedience*.
   - *Self-deception* $\neq$ *Deliberate lying*.
4. **Pemeriksaan Motif Alternatif:** Mengakui bahwa satu perilaku bisa lahir dari beragam motif psikologis yang berbeda.

---

## 7. KEBIJAKAN PENGGUNAAN KECERDASAN BUATAN (AI RESEARCH POLICY)

* **Penggunaan yang Diizinkan:** Pemetaan literatur, formulasi kata kunci pencarian, ekstraksi draf poin argumen, dan uji sanggahan logika.
* **Verifikasi Wajib Manusia:** Peneliti manusia wajib membuka paper asli, mencocokkan kutipan, dan memeriksa metodologi.
* **Larangan Mutlak:**
  - Mengutip jurnal atau DOI yang dihalusinasi oleh AI.
  - Menjadikan ringkasan AI sebagai bukti tunggal tanpa membuka dokumen sumber aslinya.

---

## 8. STRUKTUR DIREKTORI PROYEK RISET EDITORIAL

```
EDITORIAL_PROJECT/
├── 00_PROJECT_BRIEF/
├── 01_RESEARCH_SCOPE/
├── 02_SOURCE_REGISTER/
├── 03_SOURCE_APPRAISALS/
├── 04_CLAIM_EVIDENCE_LEDGER/
├── 05_RESEARCH_NOTES/
├── 06_EVIDENCE_SYNTHESIS/
├── 07_CONFLICT_LOG/
├── 08_FACT_CHECK/
└── 09_RESEARCH_APPROVAL/
```

---

## 9. GERBANG KEPUTUSAN RISET (RESEARCH DECISION GATE)

* **PASS:** Bukti ilmiah kokoh; siap maju ke tahap analisis kritis (*The Contradiction Test*).
* **PASS WITH QUALIFICATIONS:** Boleh maju dengan syarat naskah wajib mencantumkan batasan konteks secara transparan.
* **MORE RESEARCH REQUIRED:** Klaim utama masih membutuhkan bukti pendukung tambahan.
* **REFRAME:** Bukti lapangan tidak mendukung hipotesis awal; pertanyaan riset harus diubah.
* **STOP:** Bukti menunjukkan hipotesis salah atau tidak ada data yang dapat dipertanggungjawabkan. **Keputusan STOP adalah bukti keberanian dan integritas riset yang sehat.**
