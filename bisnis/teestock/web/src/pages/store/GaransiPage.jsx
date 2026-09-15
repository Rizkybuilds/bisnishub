import React from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  Ruler, 
  Flame, 
  CheckCircle2, 
  AlertTriangle,
  MessageSquare,
  Package
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SEOHead } from '../../components/common/SEOHead';
import { useStore } from '../../context/StoreContext';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';

export function GaransiPage() {
  const { storeSettings } = useStore();
  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      <SEOHead
        title="Garansi Produk, Panduan Ukuran & Perawatan Kaos | TeeStock"
        description="Jaminan 100% garmen NSA original, garansi ganti baru retur sablon cacat, tabel size chart ukuran, dan SOP perawatan sablon DTF tahan cuci."
        canonicalPath="/care"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ts-terracotta/15 border border-ts-terracotta/30 text-xs font-mono font-bold text-ts-terracotta">
          <ShieldCheck className="w-3.5 h-3.5 text-ts-terracotta" />
          <span>TEESTOCK QUALITY COMMITMENT</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-ts-krem tracking-tight uppercase">
          Garansi, Ukuran &amp; Panduan Perawatan
        </h1>
        <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed max-w-2xl mx-auto">
          Komitmen penuh studio kami untuk memastikan setiap potong apparel yang tiba di tangan Anda memiliki standar garmen dan sablon terbaik tanpa rasa khawatir.
        </p>
      </div>

      {/* 1. THREE PILLARS OF GUARANTEE */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-ts-border">
          <ShieldCheck className="w-5 h-5 text-ts-green" />
          <h2 className="text-xl sm:text-2xl font-black text-ts-krem uppercase tracking-tight">
            1. Jaminan Kualitas &amp; Kebijakan Retur
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-ts-surface border border-ts-border space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-ts-green/15 text-ts-green flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-ts-krem">100% Garmen NSA Original Cititex</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Kami hanya menggunakan garmen New States Apparel resmi tanpa jahitan samping (*tubular built-up*). Jika terbukti kain bukan NSA original, kami kembalikan dana 100%.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-ts-surface border border-ts-border space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-ts-mustard/15 text-ts-mustard flex items-center justify-center font-bold">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-ts-krem">Garansi Ganti Baru Cacat Sablon</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Jika sablon mengelupas, retak parah, atau cacat cetak saat unboxing atau setelah pencucian pertama, kami ganti kaos baru tanpa biaya tambahan.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-ts-surface border border-ts-border space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-ts-terracotta/15 text-ts-terracotta flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-ts-krem">Salah Ukuran / Salah Kirim</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Jika item yang diterima tidak sesuai dengan pesanan di faktur (salah warna, salah desain, atau salah ukuran), ongkos kirim bolak-balik kami tanggung penuh.
            </p>
          </div>
        </div>

        {/* Syarat Klaim Retur */}
        <div className="p-5 rounded-2xl bg-ts-surfaceHover/50 border border-ts-border text-xs text-ts-kremMuted space-y-2">
          <div className="font-bold text-ts-krem flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-ts-mustard" />
            <span>Syarat Mudah Klaim Garansi &amp; Pengembalian (Maksimal 3 Hari Sejak Paket Diterima):</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>Sertakan video unboxing singkat saat membuka polymailer doff tanpa jeda/edit.</li>
            <li>Kaos belum dicuci pakai deterjen keras dan tag label garmen masih utuh.</li>
            <li>Kirim nomor pesanan (cth: WEB-123456) ke WhatsApp Customer Support kami.</li>
          </ul>
        </div>
      </section>

      {/* 2. SIZE CHART & FIT GUIDE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-ts-border">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-ts-terracotta" />
            <h2 className="text-xl sm:text-2xl font-black text-ts-krem uppercase tracking-tight">
              2. Panduan Ukuran (Size Chart Guide)
            </h2>
          </div>
          <span className="text-xs font-mono text-ts-kremMuted hidden sm:inline">Regular Asian Fit</span>
        </div>

        <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
          Garmen New States Apparel menggunakan standar potongan Asia (*Asian Fit*). Ukur lebar dada kaos favorit Anda dari ketiak kiri ke ketiak kanan dalam posisi mendatar untuk menemukan ukuran paling pas:
        </p>

        {/* Size Table */}
        <div className="overflow-x-auto rounded-2xl border border-ts-border bg-ts-surface shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-ts-surfaceHover text-ts-krem font-mono uppercase tracking-wider border-b border-ts-border">
              <tr>
                <th className="py-3 px-4 font-bold">Size</th>
                <th className="py-3 px-4 font-bold">Lebar Dada</th>
                <th className="py-3 px-4 font-bold">Panjang Badan</th>
                <th className="py-3 px-4 font-bold">Lengan</th>
                <th className="py-3 px-4 font-bold">Estimasi Tinggi</th>
                <th className="py-3 px-4 font-bold">Estimasi Berat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ts-border text-ts-kremMuted font-mono">
              <tr className="hover:bg-ts-surfaceHover/50 transition-colors">
                <td className="py-3 px-4 font-bold text-ts-krem">S</td>
                <td className="py-3 px-4">47 cm</td>
                <td className="py-3 px-4">67 cm</td>
                <td className="py-3 px-4">19 cm</td>
                <td className="py-3 px-4">155 – 165 cm</td>
                <td className="py-3 px-4">45 – 55 kg</td>
              </tr>
              <tr className="hover:bg-ts-surfaceHover/50 transition-colors">
                <td className="py-3 px-4 font-bold text-ts-krem">M</td>
                <td className="py-3 px-4">50 cm</td>
                <td className="py-3 px-4">70 cm</td>
                <td className="py-3 px-4">19.5 cm</td>
                <td className="py-3 px-4">160 – 170 cm</td>
                <td className="py-3 px-4">55 – 65 kg</td>
              </tr>
              <tr className="hover:bg-ts-surfaceHover/50 transition-colors bg-ts-terracotta/5">
                <td className="py-3 px-4 font-bold text-ts-terracotta">L (Best Seller)</td>
                <td className="py-3 px-4 font-bold text-ts-krem">53 cm</td>
                <td className="py-3 px-4 font-bold text-ts-krem">73 cm</td>
                <td className="py-3 px-4 font-bold text-ts-krem">20 cm</td>
                <td className="py-3 px-4">165 – 178 cm</td>
                <td className="py-3 px-4">65 – 75 kg</td>
              </tr>
              <tr className="hover:bg-ts-surfaceHover/50 transition-colors">
                <td className="py-3 px-4 font-bold text-ts-krem">XL</td>
                <td className="py-3 px-4">56 cm</td>
                <td className="py-3 px-4">75 cm</td>
                <td className="py-3 px-4">20.5 cm</td>
                <td className="py-3 px-4">170 – 185 cm</td>
                <td className="py-3 px-4">75 – 88 kg</td>
              </tr>
              <tr className="hover:bg-ts-surfaceHover/50 transition-colors">
                <td className="py-3 px-4 font-bold text-ts-krem">2XL</td>
                <td className="py-3 px-4">59 cm</td>
                <td className="py-3 px-4">77 cm</td>
                <td className="py-3 px-4">21 cm</td>
                <td className="py-3 px-4">175 – 190 cm</td>
                <td className="py-3 px-4">88 – 100 kg</td>
              </tr>
              <tr className="hover:bg-ts-surfaceHover/50 transition-colors">
                <td className="py-3 px-4 font-bold text-ts-krem">3XL</td>
                <td className="py-3 px-4">62 cm</td>
                <td className="py-3 px-4">80 cm</td>
                <td className="py-3 px-4">21.5 cm</td>
                <td className="py-3 px-4">180 – 195 cm</td>
                <td className="py-3 px-4">100 – 112 kg</td>
              </tr>
              <tr className="hover:bg-ts-surfaceHover/50 transition-colors">
                <td className="py-3 px-4 font-bold text-ts-krem">4XL</td>
                <td className="py-3 px-4">65 cm</td>
                <td className="py-3 px-4">83 cm</td>
                <td className="py-3 px-4">22 cm</td>
                <td className="py-3 px-4">&gt; 185 cm</td>
                <td className="py-3 px-4">112 – 125 kg</td>
              </tr>
              <tr className="hover:bg-ts-surfaceHover/50 transition-colors">
                <td className="py-3 px-4 font-bold text-ts-krem">5XL</td>
                <td className="py-3 px-4">68 cm</td>
                <td className="py-3 px-4">86 cm</td>
                <td className="py-3 px-4">22.5 cm</td>
                <td className="py-3 px-4">&gt; 185 cm</td>
                <td className="py-3 px-4">&gt; 125 kg</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-ts-kremMuted">
          <div className="p-4 rounded-xl bg-ts-surface border border-ts-border space-y-1 shadow-sm">
            <span className="font-bold text-ts-krem block">💡 Tips Fit Streetwear / Oversize:</span>
            <p>Jika Anda menyukai tampilan santai yang longgar (*loose/baggy look*), disarankan naik 1 ukuran (*up-size*) dari ukuran reguler Anda.</p>
          </div>
          <div className="p-4 rounded-xl bg-ts-surface border border-ts-border space-y-1 shadow-sm">
            <span className="font-bold text-ts-krem block">📐 Toleransi Jahitan Pabrik:</span>
            <p>Toleransi ukuran alami pada kain katun berkisar 1 – 2 cm karena proses pemotongan dan penjahitan manual garmen.</p>
          </div>
        </div>
      </section>

      {/* 3. DTF WASH & CARE GUIDE */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-ts-border">
          <Flame className="w-5 h-5 text-ts-mustard" />
          <h2 className="text-xl sm:text-2xl font-black text-ts-krem uppercase tracking-tight">
            3. Panduan Perawatan Sablon DTF &amp; Garmen Katun
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
          Sablon DTF (*Direct-to-Film*) TeeStock dipress ganda dengan suhu 155°C sehingga sangat elastis dan tahan cuci. Ikuti 4 aturan perawatan ini agar warna sablon tetap tajam bertahun-tahun:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-ts-surface border border-ts-border space-y-2 shadow-sm">
            <div className="text-ts-terracotta font-mono font-bold text-xs">ATURAN // 01</div>
            <h4 className="font-bold text-sm text-ts-krem">Balik Kaos Saat Dicuci (Inside-Out)</h4>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Selalu balik posisi kaos sehingga permukaan sablon berada di bagian dalam sebelum dimasukkan ke mesin cuci atau direndam. Ini melindungi permukaan sablon dari gesekan pakaian lain.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-ts-surface border border-ts-border space-y-2 shadow-sm">
            <div className="text-ts-teal font-mono font-bold text-xs">ATURAN // 02</div>
            <h4 className="font-bold text-sm text-ts-krem">Hindari Pemutih &amp; Air Sangat Panas</h4>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Gunakan deterjen biasa dengan air suhu normal atau suam-kuku. Jangan gunakan cairan pemutih klorin keras karena dapat merusak pigmen warna dan serat katun.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-ts-surface border border-ts-border space-y-2 shadow-sm">
            <div className="text-ts-mustard font-mono font-bold text-xs">ATURAN // 03</div>
            <h4 className="font-bold text-sm text-ts-krem">PANTANG Setrika Langsung Permukaan Sablon</h4>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Panas langsung dari tapak setrika logam dapat melunakkan kembali lem sablon. Selalu setrika dari bagian dalam kaos, atau gunakan kain pelapis/kertas teflon di atas sablon.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-ts-surface border border-ts-border space-y-2 shadow-sm">
            <div className="text-ts-green font-mono font-bold text-xs">ATURAN // 04</div>
            <h4 className="font-bold text-sm text-ts-krem">Jemur di Tempat Teduh</h4>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Jemur kaos dengan posisi tetap terbalik dan hindari terik matahari langsung yang berlebihan agar warna pekat kain katun hitam/charcoal tidak cepat pudar.
            </p>
          </div>
        </div>
      </section>

      {/* Direct Contact Support Callout */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-ts-terracotta/15 via-ts-surface to-ts-surface border border-ts-border flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-sm">
        <div className="space-y-1.5 max-w-xl">
          <h3 className="text-lg sm:text-xl font-black text-ts-krem uppercase tracking-tight">
            Ada Pertanyaan Seputar Pesanan atau Butuh Bantuan Ukuran?
          </h3>
          <p className="text-xs text-ts-kremMuted leading-relaxed">
            Tim studio kami siap membantu konsultasi ukuran, kendala paket, atau garansi tukar baru via WhatsApp setiap hari (08.00 – 21.00 WIB).
          </p>
        </div>

        <a
          href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Halo Admin TeeStock, saya ingin konsultasi ukuran / garansi produk.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <Button size="lg" variant="whatsapp" icon={MessageSquare} className="font-bold text-xs sm:text-sm px-6 py-3.5 shadow-sm">
            Chat WhatsApp Studio
          </Button>
        </a>
      </div>
    </div>
  );
}
