# Asisten Python

Tool CLI existing, terpisah dari runtime JARVIS yang masih berupa spesifikasi.
Jalankan `python tools/assistant/main.py` dari root repositori, atau `python main.py`
dari direktori ini. Dependency dimiliki `requirements.txt` di direktori ini;
gunakan virtual environment terpisah.

Persona dibaca dari `prompts/`, data sesi dari `memory/`, dan konfigurasi lokal
dari `.env` di root repositori. Ekspor tetap menuju `catatan/sesi/` di root.
Nilai konfigurasi, histori dan profil tidak disalin ke JARVIS secara otomatis.

Uji perpindahan tanpa API atau data nyata:
`python -m unittest discover -s tools/assistant -p 'test_*.py'`.
Pengujian ini memverifikasi path/persistence/import, bukan ketersediaan model
atau layanan Anthropic. Pemilihan model lama belum diperbarui pada cleanup ini.
