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

/**
 * Resolves single image URL for ProductCard preview given active color
 */
export function getCardPreviewImage(product, colorName) {
  if (!product) return '';

  const isBlank = product.series === 'blank';

  // 1. Blanks NSA flatlay photo (clean flatlay t-shirt without people)
  if (isBlank && product.cititexCatId && colorName) {
    return `https://cititex.com/api/uploads/category/album/front_side/${product.cititexCatId}-${encodeURIComponent(colorName)}.jpg`;
  }

  // 2. Graphic apparel with variantImages dictionary
  if (product.variantImages && colorName && product.variantImages[colorName]) {
    const variantImgs = product.variantImages[colorName];
    if (Array.isArray(variantImgs) && variantImgs.length > 0) {
      return typeof variantImgs[0] === 'string' ? variantImgs[0] : variantImgs[0].url;
    }
    if (typeof variantImgs === 'string') return variantImgs;
  }

  // 3. Fallback to product.filePath or product.file_path (only actual product image)
  return product.filePath || product.file_path || '';
}

/**
 * Resolves full multi-photo gallery array for ProductDetailPage given active color.
 * Only returns actual product images uploaded or available. NEVER injects random photos of people.
 * Returns: Array<{ url: string, label: string, type: 'front' | 'back' | 'detail' }>
 */
export function getProductGallery(product, activeColor) {
  if (!product) return [];

  const isBlank = product.series === 'blank';
  const gallery = [];

  // ==========================================
  // A. BLANK APPAREL (NSA)
  // ==========================================
  if (isBlank) {
    const effectiveColor = activeColor || 'White';

    // 1. Tampak Depan Warna Terpilih (Flatlay kaos tanpa orang)
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

    // 2. Foto tambahan yang di-upload user untuk blanks jika ada
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
