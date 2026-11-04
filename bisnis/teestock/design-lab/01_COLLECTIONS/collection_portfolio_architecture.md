# TeeStock Original — Collection Portfolio Architecture V1

**Dokumen ID:** TS-PORTFOLIO-ARCH-01  
**Status:** Canonical Strategic Baseline  
**Konteks Bisnis:** Portofolio IP Koleksi TeeStock Original (TeeStock Apparel / MultiGraph Holding)  
**Tujuan:** Mengunci 8 wilayah kreatif (*Creative Territories*), batasan tema, dan prioritas pengembangan agar portofolio produk memiliki diversifikasi pasar yang sehat tanpa kanibalisasi internal.

---

## 1. Filosofi Portofolio: Text-First & Idea-Driven

> *"Desain apparel yang hebat berakar pada gagasan yang tajam dan emosi yang resonan, bukan sekadar gambar acak yang dipaksakan ke kaos. Sebelum kuota AI dan waktu render terbuang, puluhan konsep harus diuji kelayakan narasinya di atas kertas."*

### Menghindari Tiga Jebakan Distro AI:
1. **The Quote Trap:** Kaos quote sarkastik/motivasi generik tanpa identitas visual dan tanpa metafor.
2. **The Style Monotony:** Terjebak dalam satu gaya visual (e.g. semua koleksi bertema vintage engraving), yang membuat brand cepat basi.
3. **The AI Slop Roulette:** Men-generate ratusan gambar acak lalu berharap salah satunya laku tanpa perencanaan audiens.

---

## 2. Peta 8 Wilayah Kreatif (Creative Territories)

```
┌────────────────────────────────────────────────────────────────────────┐
│                   TEESTOCK ORIGINAL CREATIVE TERRITORIES               │
├───────┬──────────────────────┬─────────────────────────┬───────────────┤
│ Tier  │ Collection Code      │ Territory Name          │ Positioning   │
├───────┼──────────────────────┼─────────────────────────┼───────────────┤
│ **A** │ **TSC-THM-001**      │ **HUMAN CONDITION**     │ Social Satire │
│ **A** │ **TSC-THM-005**      │ **ODDLY ORDINARY**      │ Daily Humor   │
│ **A** │ **TSC-THM-003**      │ **QUIET REBELLION**     │ Attitude/Mind │
├───────┼──────────────────────┼─────────────────────────┼───────────────┤
│ **B** │ **TSC-THM-002**      │ **MODERN DISORDER**     │ Tech/Burnout  │
│ **B** │ **TSC-THM-004**      │ **INNER ATLAS**         │ Mind/Solitude │
├───────┼──────────────────────┼─────────────────────────┼───────────────┤
│ **C** │ **TSC-THM-006**      │ **WILD ARCHIVE**        │ Nature/Instinct│
│ **C** │ **TSC-THM-007**      │ **ARCHIVE OF TOMORROW** │ Retro-SciFi   │
│ **C** │ **TSC-THM-008**      │ **LOCAL FREQUENCIES**   │ Urban Culture │
└───────┴──────────────────────┴─────────────────────────┴───────────────┘
```

---

## 3. Profil 8 Wilayah Kreatif

### 01. HUMAN CONDITION (`TSC-THM-001`) — Priority A (Flagship)
- **Positioning:** *Wearable Social Commentary*.
- **Pesan Inti:** Mengamati kontradiksi, kepalsuan, arogansi intelektual, dan kebodohan manusia dari sudut pandang reflektif.
- **Bahasa Rupa:** Editorial archive, dark satirical engraving, 18th-century taxonomy plate, chiaroscuro linework.
- **Tone:** Intellectual, cynical, provocative, restrained.

### 02. ODDLY ORDINARY (`TSC-THM-005`) — Priority A (Commercial Reach)
- **Positioning:** *The Humor Hidden in Everyday Life*.
- **Pesan Inti:** Ironi kecil yang sangat relatable: kebiasaan aneh, kecanggungan sosial, *overthinking*, dan kelelahan mental harian yang dihadapi dengan tawa kering.
- **Bahasa Rupa:** Hand-drawn quirky illustration, retro comic strip, bold expressive typography, warm palette.
- **Tone:** Witty, lighthearted, self-deprecating, observant, relatable.

### 03. QUIET REBELLION (`TSC-THM-003`) — Priority A (Statement Apparel)
- **Positioning:** *Independent Mind. Uncompromising Spirit.*
- **Pesan Inti:** Kedaulatan berpikir (*sovereign mind*), menolak konformitas tanpa harus berteriak agresif, keberanian berbeda prinsip di tengah tekanan sosial.
- **Bahasa Rupa:** Punk editorial, underground Swiss typography, distressed print, brutalist monochromatic layouts.
- **Tone:** Unapologetic, firm, stoic, defiant, principled.

### 04. MODERN DISORDER (`TSC-THM-002`) — Priority B (Contemporary Culture)
- **Positioning:** *The Absurdity of Modern Life*.
- **Pesan Inti:** Jebakan produktivitas palsu, tirani algoritma, kelelahan media sosial, dan dunia yang bergerak terlalu cepat tanpa arah.
- **Bahasa Rupa:** Retro-futurism, editorial analog collage, bold stark typography, blueprint/glitch graphics.
- **Tone:** Sardonic, contemporary, restless, sharp.

### 05. INNER ATLAS (`TSC-THM-004`) — Priority B (Emotional & Personal)
- **Positioning:** *An Exploration of the Inner World*.
- **Pesan Inti:** Ruang batin manusia: kesendirian yang menenangkan, kecemasan eksistensial, proses bertumbuh, dan pemetaan emosi diri.
- **Bahasa Rupa:** Philosophical surrealism, fine-art fine linework, symbolic minimalism, generous negative space.
- **Tone:** Meditative, intimate, poetic, quiet.

### 06. WILD ARCHIVE (`TSC-THM-006`) — Priority C (Aesthetic Exploration)
- **Positioning:** *Nature, Instinct & Untamed Life*.
- **Pesan Inti:** Alam liar tidak memiliki algoritma. Hubungan instingtual manusia dengan hewan, botani, dan alam yang tak terkendali.
- **Bahasa Rupa:** Natural history engraving, vintage field guide, botanical scientific etching, earth-tone accents.
- **Tone:** Primal, organic, timeless, grounding.

### 07. ARCHIVE OF TOMORROW (`TSC-THM-007`) — Priority C (Nostalgia Futurism)
- **Positioning:** *Nostalgia for a Future That Never Happened*.
- **Pesan Inti:** Imajinasi era antariksa (Space-Age), visi masa depan versi tahun 1960–70an, sains analog, dan relik teknologi masa lalu.
- **Bahasa Rupa:** Retro-futurism, vintage sci-fi poster, technical space telemetry diagrams, bold geometric sans.
- **Tone:** Curious, retro-speculative, cinematic, visionary.

### 08. LOCAL FREQUENCIES (`TSC-THM-008`) — Priority C (Regional Heritage)
- **Positioning:** *Stories, Symbols & Cultural Identity*.
- **Pesan Inti:** Dekonstruksi estetika kehidupan urban Indonesia & Asia Tenggara: memori kota, bahasa tongkrongan, arsitektur jalanan, tanpa menjadi souvenir wisata murahan.
- **Bahasa Rupa:** Contemporary documentary graphics, modernized local signages, brutalist indonesian typography.
- **Tone:** Grounded, authentic, culturally literate, nostalgic-contemporary.

---

## 4. Standar Seleksi Ide (The 5-Gate Idea Filter)

Sebelum sebuah konsep teks diizinkan masuk ke tahap *Shortlist* (dan berhak menerima alokasi pembuatan gambar):

```
[ 1. Is it interesting?   ] ── Apakah premisnya memancing orang berhenti dan berpikir?
           │
[ 2. Is it original?      ] ── Apakah sudut pandangnya segar dan bukan klise meme internet?
           │
[ 3. Is it wearable?      ] ── Apakah orang bangga memakainya di badan nyata (bukan sekadar poster dinding)?
           │
[ 4. Is it identifiable?  ] ── Apakah karakternya mencerminkan DNA TeeStock Original?
           │
[ 5. Is it producible?    ] ── Apakah realistis dan berkualitas tinggi jika dicetak dengan DTF?
```

---

## 5. Roadmap Eksekusi Ide Bank
1. **Master Design Idea Bank V1:** Menyusun 80 konsep teks (10 ide per wilayah kreatif).
2. **Shortlist Selection:** Menyaring 80 ide menjadi **Top 24 Ide Terpilih** (3 ide terbaik per wilayah).
3. **Deep Dive Priority A:** Mengembangkan Creative Brief dan eksplorasi visual untuk 3 koleksi utama (`HUMAN CONDITION`, `ODDLY ORDINARY`, `QUIET REBELLION`).
