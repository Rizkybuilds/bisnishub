'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type {
  StorefrontProduct,
  StorefrontSize,
} from '../lib/storefront-product';
import { formatProductPrice, SIZE_ORDER } from '../lib/storefront-product';

type Sort = 'recent' | 'price-low' | 'price-high' | 'name';
const lowestPrice = (product: StorefrontProduct) =>
  Math.min(...product.variants.map((variant) => variant.priceIdr));

export function PublishedProductGrid({
  products,
  compact = false,
}: {
  products: StorefrontProduct[];
  compact?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState('');
  const [size, setSize] = useState<StorefrontSize | ''>('');
  const [sort, setSort] = useState<Sort>('recent');

  const collections = [
    ...new Set(products.map((product) => product.collectionName)),
  ].sort();
  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('id-ID');
    const filtered = products.filter(
      (product) =>
        (!needle ||
          [product.title, product.collectionName]
            .join(' ')
            .toLocaleLowerCase('id-ID')
            .includes(needle)) &&
        (!collection || product.collectionName === collection) &&
        (!size || product.variants.some((variant) => variant.size === size)),
    );
    if (sort === 'price-low')
      filtered.sort((a, b) => lowestPrice(a) - lowestPrice(b));
    if (sort === 'price-high')
      filtered.sort((a, b) => lowestPrice(b) - lowestPrice(a));
    if (sort === 'name')
      filtered.sort((a, b) => a.title.localeCompare(b.title, 'id'));
    return filtered;
  }, [products, query, collection, size, sort]);

  return (
    <>
      {!compact && (
        <div
          className="ts-public-catalog-toolbar"
          aria-label="Filter produk TeeStock"
        >
          <label>
            <span>Cari desain</span>
            <input
              type="search"
              value={query}
              placeholder="Cari nama atau koleksi"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label>
            <span>Koleksi</span>
            <select
              value={collection}
              onChange={(event) => setCollection(event.target.value)}
            >
              <option value="">Semua koleksi</option>
              {collections.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Ukuran</span>
            <select
              value={size}
              onChange={(event) =>
                setSize(event.target.value as StorefrontSize | '')
              }
            >
              <option value="">Semua ukuran</option>
              {SIZE_ORDER.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Urutkan</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
            >
              <option value="recent">Terbaru</option>
              <option value="price-low">Harga terendah</option>
              <option value="price-high">Harga tertinggi</option>
              <option value="name">Nama A–Z</option>
            </select>
          </label>
        </div>
      )}
      {!compact && (
        <div className="ts-public-results" role="status" aria-live="polite">
          {visible.length} produk ditemukan
        </div>
      )}
      {visible.length > 0 ? (
        <div className="ts-public-product-grid">
          {visible.map((product) => (
            <article className="ts-public-product" key={product.slug}>
              <Link
                href={'/shop/products/' + product.slug}
                aria-label={'Lihat detail ' + product.title}
              >
                <div className="ts-public-product-image">
                  <Image
                    src={product.mockupUrl}
                    alt={'Mockup produk ' + product.title}
                    width={700}
                    height={840}
                    unoptimized
                  />
                </div>
                <div className="ts-public-product-meta">
                  <span>{product.collectionName}</span>
                  <span>MADE TO ORDER</span>
                </div>
                <h3>{product.title}</h3>
                <p>Mulai {formatProductPrice(lowestPrice(product))}</p>
                <span className="ts-public-product-link">
                  Lihat detail produk →
                </span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="ts-public-empty">
          <strong>Tidak ada produk untuk pilihan ini.</strong>
          <p>Ubah pencarian atau filter untuk melihat koleksi lain.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCollection('');
              setSize('');
              setSort('recent');
            }}
          >
            Reset filter
          </button>
        </div>
      )}
    </>
  );
}
