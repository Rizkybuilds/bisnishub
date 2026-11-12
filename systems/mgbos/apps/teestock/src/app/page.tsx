import Link from 'next/link';
import { ConceptGallery, HeroGarments } from '../components/RetailShowcase';
import { PublishedCatalog } from '../components/PublishedCatalog';
import { listPublishedProducts } from '../lib/published-catalog.server';
import './catalog.css';

export default async function Home() {
  const publishedProducts = await listPublishedProducts();

  return (
    <div className="retail-home ts-r1-page ts-r1-home">
      <section className="ts-r1-hero retail-wrap" aria-labelledby="retail-hero-heading">
        <div className="ts-r1-hero-copy">
          <div className="ts-r1-hero-topline">
            <span className="ts-r1-kicker">TEESTOCK / INDEPENDENT APPAREL STUDIO</span>
            <span className="ts-r1-hero-issue">ISSUE 001 — INDONESIA</span>
          </div>
          <div className="ts-r1-hero-main">
            <p className="ts-r1-eyebrow">A DIFFERENT WAY TO WEAR AN IDEA.</p>
            <h1 id="retail-hero-heading">
              Wear your
              <br />
              <span>point of view.</span>
            </h1>
            <p className="ts-r1-hero-lede">
              Bukan sekadar gambar di atas kaos. TeeStock mempertemukan
              gagasan yang layak dibicarakan dengan pakaian yang ingin kamu
              kenakan lagi dan lagi.
            </p>
            <div className="ts-r1-hero-actions">
              <Link className="ts-r1-button ts-r1-button-dark" href="/shop">
                Jelajahi koleksi <span aria-hidden="true">↗</span>
              </Link>
              <Link className="ts-r1-link" href="#retail-story">
                Cerita di balik TeeStock <span aria-hidden="true">↘</span>
              </Link>
            </div>
          </div>
          <div className="ts-r1-hero-bottom">
            <span>CURATED THOUGHTS / EVERYDAY UNIFORM</span>
            <span>SCROLL TO DISCOVER ↓</span>
          </div>
        </div>

        <div className="ts-r1-hero-editorial" aria-label="Ilustrasi konsep apparel TeeStock, belum merupakan produk untuk dibeli">
          <div className="ts-r1-editorial-head">
            <span>01 / IN THE STUDIO</span>
            <span>VISUAL STUDY</span>
          </div>
          <div className="ts-r1-editorial-art">
            <span className="ts-r1-editorial-watermark" aria-hidden="true">TS.</span>
            <HeroGarments />
          </div>
          <div className="ts-r1-editorial-foot">
            <div>
              <strong>Considered essentials.</strong>
              <span>An exploration of form, graphics &amp; everyday wear.</span>
            </div>
            <span className="ts-r1-editorial-status">NOT FOR SALE / CONCEPT ONLY</span>
          </div>
        </div>
      </section>

      <div className="ts-r1-facts" aria-label="Arah kreatif TeeStock">
        <div className="retail-wrap">
          <span>DESIGN-LED APPAREL</span>
          <span aria-hidden="true" className="ts-r1-facts-dot">•</span>
          <span>ORIGINAL &amp; CURATED</span>
          <span aria-hidden="true" className="ts-r1-facts-dot">•</span>
          <span>MADE WITH INTENTION</span>
        </div>
      </div>

      {publishedProducts.length > 0 ? (
        <section className="ts-r1-live-section retail-wrap" id="releases" aria-label="Produk TeeStock terverifikasi">
          <PublishedCatalog featured products={publishedProducts.slice(0, 3)} />
        </section>
      ) : (
        <section className="ts-r1-release-note retail-wrap" id="releases" aria-labelledby="r1-release-heading">
          <div>
            <span className="ts-r1-kicker">01 / THE RELEASE</span>
            <h2 id="r1-release-heading">Good pieces take time.</h2>
          </div>
          <div className="ts-r1-release-description">
            <p>
              Koleksi komersial sedang melalui kurasi, pemeriksaan hak desain,
              dan pengujian sampel. Kami tidak menampilkan produk sebagai
              siap jual sebelum informasinya terverifikasi.
            </p>
            <span className="ts-r1-status-line">
              <span aria-hidden="true" /> Pratinjau Kurasi Desain — belum dibuka
            </span>
          </div>
        </section>
      )}

      <section className="ts-r1-studio retail-wrap" id="studio-studies" aria-labelledby="r1-studio-heading">
        <div className="ts-r1-section-top">
          <span className="ts-r1-kicker">02 / WORK IN PROGRESS</span>
          <span>THE STUDIO ARCHIVE — 001 TO 006</span>
        </div>
        <div className="ts-r1-section-heading">
          <div>
            <h2 id="r1-studio-heading">The thinking<br />behind the tee.</h2>
          </div>
          <div className="ts-r1-section-aside">
            <p>
              Sebelum menjadi produk, setiap ide punya ruang untuk diuji.
              Ini enam studi visual awal, bukan barang yang tersedia untuk dibeli.
            </p>
            <Link className="ts-r1-inline-link" href="/shop#studio-studies">
              Masuk ke studio archive <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <ConceptGallery compact />
      </section>

      <section className="ts-r1-philosophy" id="retail-story" aria-labelledby="r1-philosophy-title">
        <div className="retail-wrap ts-r1-philosophy-grid">
          <div className="ts-r1-philosophy-label">
            <span className="ts-r1-kicker">03 / WHAT WE BELIEVE</span>
            <span className="ts-r1-philosophy-index">TEESTOCK® / NOTES ON GETTING DRESSED</span>
          </div>
          <div className="ts-r1-philosophy-content">
            <h2 id="r1-philosophy-title">A T-shirt is ordinary.<br /><em>What you put on it isn't.</em></h2>
            <p>
              Pakaian sehari-hari nggak harus kehilangan karakter.
              Kami tertarik pada ide yang punya makna, humor, atau sudut pandang
              berbeda — lalu mencari cara paling sederhana untuk membawanya ke
              dalam keseharian.
            </p>
            <div className="ts-r1-principles">
              <div><span>01</span><strong>Concept first.</strong><p>Sebuah desain harus punya alasan untuk ada.</p></div>
              <div><span>02</span><strong>Wearability matters.</strong><p>Pesan kuat tetap harus nyaman dipakai sehari-hari.</p></div>
              <div><span>03</span><strong>Quality is earned.</strong><p>Bahan, print, dan ukuran diverifikasi sebelum rilis.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="ts-r1-outro retail-wrap" aria-labelledby="r1-outro-heading">
        <div>
          <span className="ts-r1-kicker">NO NOISE. JUST A POINT OF VIEW.</span>
          <h2 id="r1-outro-heading">The next piece<br />starts with an idea.</h2>
        </div>
        <div className="ts-r1-outro-action">
          <p>
            Lihat koleksi, temukan studi desain, atau ikuti perkembangan
            TeeStock sebelum koleksi pertama dirilis.
          </p>
          <Link className="ts-r1-button ts-r1-button-light" href="/shop">
            Explore The Edit <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
