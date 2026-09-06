import React, { useEffect } from 'react';

const SITE_URL = 'https://teestock.vercel.app';
const DEFAULT_TITLE = 'TeeStock Apparel | Curated Merch & Kaos NSA 24s Heavyweight Original';
const DEFAULT_DESCRIPTION = 'Brand apparel kurasi & studio sablon DTF cepat. Menggunakan garmen New States Apparel (NSA) Heavyweight 24s & Softstyle 30s original tanpa jahitan samping. Siap kirim ritel, dropship, dan custom satuan.';
const DEFAULT_IMAGE = `${SITE_URL}/logo-teestock.svg`;

/**
 * Lightweight dynamic SEO & OpenGraph Head manager for React SPA
 */
export function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  image = DEFAULT_IMAGE,
  canonicalPath = '',
  type = 'website',
  schema,
  noindex = false,
}) {
  useEffect(() => {
    // 1. Title
    const fullTitle = title ? `${title}` : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper: update or create <meta>
    const updateMeta = (key, value, isProperty = false) => {
      if (!value) return;
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    // 2. Standard Meta Tags
    updateMeta('description', description);
    if (keywords) {
      const kwString = Array.isArray(keywords) ? keywords.join(', ') : keywords;
      updateMeta('keywords', kwString);
    }

    // 3. Robots
    updateMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // 4. Canonical URL
    const fullCanonical = canonicalPath.startsWith('http')
      ? canonicalPath
      : `${SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonical);

    // 5. OpenGraph Tags (Facebook, WhatsApp, iMessage, LinkedIn)
    const fullImageUrl = image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', fullImageUrl, true);
    updateMeta('og:url', fullCanonical, true);
    updateMeta('og:type', type, true);
    updateMeta('og:site_name', 'TeeStock Apparel', true);
    updateMeta('og:locale', 'id_ID', true);

    // 6. Twitter Card Tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', fullImageUrl);

    // 7. Schema.org JSON-LD Structured Data
    let schemaScript = document.getElementById('teestock-structured-data');
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'teestock-structured-data';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [title, description, keywords, image, canonicalPath, type, schema, noindex]);

  return null; // Component only modifies document.head
}
