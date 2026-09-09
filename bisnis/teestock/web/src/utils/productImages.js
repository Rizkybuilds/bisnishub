/**
 * TeeStock Product Image Resolvers
 * Strictly uses real product/garment photos and uploaded images.
 * NO stock photos of human models or people.
 */

/**
 * Returns list of available color names for a product
 */
export function getAvailableColors(product) {
  if (!product) return [];

  if (product.series === 'blank' && product.colors) {
    return product.colors
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);
  }

  if (product.variantImages && typeof product.variantImages === 'object') {
    const keys = Object.keys(product.variantImages);
    if (keys.length > 0) return keys;
  }

  if (product.colors) {
    return product.colors
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);
  }

  // Standard distro color defaults for graphic apparel
  return ["Hitam", "Putih", "Charcoal", "Navy", "Olive"];
}

const SUPABASE_STORAGE_URL = 'https://tovslowsopqtuxmrogeu.supabase.co/storage/v1/object/public';

/**
 * Normalisasi nama warna ke nama folder di Supabase Storage (Blank/7200/)
 */
export function colorToSlug(colorName) {
  if (!colorName) return 'black';
  const clean = String(colorName).trim().toLowerCase();
  if (clean === 'carolina blue' || clean === 'carolina-blue') {
    return 'caroline-blue'; // Folder di Supabase menggunakan caroline-blue
  }
  return clean.replace(/\s+/g, '-');
}

/**
 * Normalisasi nama warna ke file Supabase Storage NSA 3600 (Blank/3600/ghost-front/)
 * Carolina Blue di 3600 tersimpan dengan carolina-blue.png
 */
export function colorToSlug3600(colorName) {
  if (!colorName) return 'black';
  return String(colorName).trim().toLowerCase().replace(/\s+/g, '-');
}

/**
 * Mendapatkan URL Fabric Swatch tekstur kain asli dari Supabase Storage
 */
export function getFabricSwatchUrl(product, colorName) {
  if (!product || !colorName) return null;
  const isBlankNSA = product.sku === 'TS-BLK-7200' || product.sku === 'TS-BLK-3600' || product.name?.includes('7200') || product.name?.includes('3600');
  if (isBlankNSA) {
    const slug = colorToSlug(colorName);
    return `${SUPABASE_STORAGE_URL}/Blank/7200/${slug}/swatch.jpeg`;
  }
  return null;
}

/**
 * Resolves single image URL for ProductCard preview given active color
 */
export function getCardPreviewImage(product, colorName) {
  if (!product) return '';

  const isBlank = product.series === 'blank';
  const is3600 = product.sku === 'TS-BLK-3600' || product.name?.includes('3600');
  const is7200 = product.sku === 'TS-BLK-7200' || product.name?.includes('7200');

  // 1. Blanks NSA 3600 (Softstyle 30s) dengan ghost-front khusus Supabase
  if (is3600) {
    const effectiveColor = colorName || 'Black';
    const slug = colorToSlug3600(effectiveColor);
    return `${SUPABASE_STORAGE_URL}/Blank/3600/ghost-front/${slug}.png`;
  }

  // 2. Blanks NSA 7200 dengan aset resmi Supabase Storage
  if (is7200) {
    const effectiveColor = colorName || 'Black';
    const slug = colorToSlug(effectiveColor);
    const frontFile = slug === 'white' ? 'model-front.jpeg' : 'ghost-front.png';
    return `${SUPABASE_STORAGE_URL}/Blank/7200/${slug}/${frontFile}`;
  }

  // 3. Blanks NSA via Cititex jika ada ID
  if (isBlank && product.cititexCatId && colorName) {
    return `https://cititex.com/api/uploads/category/album/front_side/${product.cititexCatId}-${encodeURIComponent(colorName)}.jpg`;
  }

  // 4. Graphic apparel with variantImages dictionary
  if (product.variantImages && colorName && product.variantImages[colorName]) {
    const variantImgs = product.variantImages[colorName];
    if (Array.isArray(variantImgs) && variantImgs.length > 0) {
      return typeof variantImgs[0] === 'string' ? variantImgs[0] : variantImgs[0].url;
    }
    if (typeof variantImgs === 'string') return variantImgs;
  }

  // 5. Fallback to product.filePath or product.file_path
  return product.filePath || product.file_path || '';
}

/**
 * Resolves full multi-photo gallery array for ProductDetailPage given active color.
 * Returns: Array<{ url: string, label: string, type: 'front' | 'back' | 'left' | 'right' | 'folded' | 'model' | 'swatch' }>
 */
export function getProductGallery(product, activeColor) {
  if (!product) return [];

  const isBlank = product.series === 'blank';
  const is3600 = product.sku === 'TS-BLK-3600' || product.name?.includes('3600');
  const is7200 = product.sku === 'TS-BLK-7200' || product.name?.includes('7200');
  const gallery = [];

  // ==========================================
  // A1. BLANK APPAREL (NSA 3600 — SOFTSTYLE 30S)
  // ghost-front dari Blank/3600/ghost-front/, sudut lain dari Blank/7200/
  // ==========================================
  if (is3600) {
    const effectiveColor = activeColor || 'White';
    const slug3600 = colorToSlug3600(effectiveColor);
    const slug7200 = colorToSlug(effectiveColor);
    const base7200 = `${SUPABASE_STORAGE_URL}/Blank/7200/${slug7200}`;

    // 1. Ghost Mannequin Depan 3600
    gallery.push({
      url: `${SUPABASE_STORAGE_URL}/Blank/3600/ghost-front/${slug3600}.png`,
      label: `Tampak Depan Softstyle (${effectiveColor})`,
      type: 'front'
    });

    // 2. Ghost Mannequin Belakang
    gallery.push({
      url: `${base7200}/ghost-back.png`,
      label: `Tampak Belakang (${effectiveColor})`,
      type: 'back'
    });

    // 3. Ghost Mannequin Samping Kiri
    gallery.push({
      url: `${base7200}/ghost-left.png`,
      label: `Samping Kiri (${effectiveColor})`,
      type: 'left'
    });

    // 4. Ghost Mannequin Samping Kanan
    gallery.push({
      url: `${base7200}/ghost-right.png`,
      label: `Samping Kanan (${effectiveColor})`,
      type: 'right'
    });

    // 5. Kaos Dilipat (Folded)
    gallery.push({
      url: `${base7200}/folded.png`,
      label: `Kaos Dilipat (${effectiveColor})`,
      type: 'folded'
    });

    // 6. On-Model Depan
    gallery.push({
      url: `${base7200}/model-front.jpeg`,
      label: `Fitting On-Model Depan (${effectiveColor})`,
      type: 'model'
    });

    // 7. On-Model Belakang
    gallery.push({
      url: `${base7200}/model-back.jpeg`,
      label: `Fitting On-Model Belakang (${effectiveColor})`,
      type: 'model'
    });

    // 8. On-Model Samping
    gallery.push({
      url: `${base7200}/model-side.jpeg`,
      label: `Fitting On-Model Samping (${effectiveColor})`,
      type: 'model'
    });

    // 9. Detail Serat Kain (Swatch)
    gallery.push({
      url: `${base7200}/swatch.jpeg`,
      label: `Tekstur Kain Swatch (${effectiveColor})`,
      type: 'swatch'
    });

    return gallery;
  }

  // ==========================================
  // A2. BLANK APPAREL (NSA 7200 — 9 ASET LENGKAP SUPABASE STORAGE)
  // ==========================================
  if (is7200) {
    const effectiveColor = activeColor || 'Black';
    const slug = colorToSlug(effectiveColor);
    const base = `${SUPABASE_STORAGE_URL}/Blank/7200/${slug}`;
    const frontFile = slug === 'white' ? 'model-front.jpeg' : 'ghost-front.png';

    // 1. Ghost Mannequin Depan
    gallery.push({
      url: `${base}/${frontFile}`,
      label: `Tampak Depan (${effectiveColor})`,
      type: 'front'
    });

    // 2. Ghost Mannequin Belakang
    gallery.push({
      url: `${base}/ghost-back.png`,
      label: `Tampak Belakang (${effectiveColor})`,
      type: 'back'
    });

    // 3. Ghost Mannequin Samping Kiri
    gallery.push({
      url: `${base}/ghost-left.png`,
      label: `Samping Kiri (${effectiveColor})`,
      type: 'left'
    });

    // 4. Ghost Mannequin Samping Kanan
    gallery.push({
      url: `${base}/ghost-right.png`,
      label: `Samping Kanan (${effectiveColor})`,
      type: 'right'
    });

    // 5. Kaos Dilipat (Folded)
    gallery.push({
      url: `${base}/folded.png`,
      label: `Kaos Dilipat (${effectiveColor})`,
      type: 'folded'
    });

    // 6. On-Model Depan
    gallery.push({
      url: `${base}/model-front.jpeg`,
      label: `Fitting On-Model Depan (${effectiveColor})`,
      type: 'model'
    });

    // 7. On-Model Belakang
    gallery.push({
      url: `${base}/model-back.jpeg`,
      label: `Fitting On-Model Belakang (${effectiveColor})`,
      type: 'model'
    });

    // 8. On-Model Samping
    gallery.push({
      url: `${base}/model-side.jpeg`,
      label: `Fitting On-Model Samping (${effectiveColor})`,
      type: 'model'
    });

    // 9. Detail Serat Kain (Swatch)
    gallery.push({
      url: `${base}/swatch.jpeg`,
      label: `Tekstur Kain Swatch (${effectiveColor})`,
      type: 'swatch'
    });

    return gallery;
  }

  // Blank apparel umum lainnya
  if (isBlank) {
    const effectiveColor = activeColor || 'White';

    if (product.cititexCatId) {
      gallery.push({
        url: `https://cititex.com/api/uploads/category/album/front_side/${product.cititexCatId}-${encodeURIComponent(effectiveColor)}.jpg`,
        label: `Tampak Depan (${effectiveColor})`,
        type: 'front'
      });
    } else if (product.filePath || product.file_path) {
      gallery.push({
        url: product.filePath || product.file_path,
        label: `Tampak Depan (${effectiveColor})`,
        type: 'front'
      });
    }

    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach((img, idx) => {
        const url = typeof img === 'string' ? img : img.url;
        gallery.push({
          url,
          label: (typeof img === 'object' && img.label) ? img.label : `Foto Detail ${idx + 1}`,
          type: 'detail'
        });
      });
    }

    return gallery;
  }

  // ==========================================
  // B. GRAPHIC APPAREL
  // ==========================================

  // 1. Cek apakah ada foto khusus varian warna yang dipilih
  if (product.variantImages && activeColor && product.variantImages[activeColor]) {
    const variantImgs = product.variantImages[activeColor];
    if (Array.isArray(variantImgs) && variantImgs.length > 0) {
      variantImgs.forEach((img, idx) => {
        const url = typeof img === 'string' ? img : img.url;
        const label = typeof img === 'object' && img.label 
          ? img.label 
          : (idx === 0 ? `Mockup (${activeColor})` : `Detail (${activeColor})`);
        gallery.push({
          url,
          label,
          type: idx === 0 ? 'front' : 'detail'
        });
      });
    } else if (typeof variantImgs === 'string' && variantImgs.trim()) {
      gallery.push({
        url: variantImgs.trim(),
        label: `Mockup (${activeColor})`,
        type: 'front'
      });
    }
  }

  // 2. Jika tidak ada foto khusus varian, gunakan foto utama produk
  if (gallery.length === 0) {
    const defaultUrl = product.filePath || product.file_path;
    if (defaultUrl) {
      gallery.push({
        url: defaultUrl,
        label: `Mockup Desain (${activeColor || 'Original'})`,
        type: 'front'
      });
    }
  }

  // 3. Tambahkan foto umum produk yang di-upload user (hanya jika ada di data produk)
  if (Array.isArray(product.images) && product.images.length > 0) {
    product.images.forEach((img, idx) => {
      const url = typeof img === 'string' ? img : img.url;
      // Jangan masukkan jika duplikat
      if (!gallery.some(g => g.url === url)) {
        gallery.push({
          url,
          label: (typeof img === 'object' && img.label) ? img.label : `Detail ${idx + 1}`,
          type: 'detail'
        });
      }
    });
  }

  return gallery;
}
