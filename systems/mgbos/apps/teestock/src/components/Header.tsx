'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemoCart } from '../features/demo-commerce';
import { useLiveCart } from './LiveCartProvider';

const links = [
  { href: '/shop', label: 'The Edit' },
  { href: '/shop#studio-studies', label: 'Studio Archive' },
  { href: '/#retail-story', label: 'Our Point of View' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { summary } = useDemoCart();
  const { count: liveCartCount } = useLiveCart();

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const [previousPath, setPreviousPath] = useState(pathname);
  if (previousPath !== pathname) {
    setPreviousPath(pathname);
    setOpen(false);
  }

  return (
    <header className="site-header retail-site-header">
      <div className="retail-announcement">
        AN INDEPENDENT GRAPHIC APPAREL STUDIO <span aria-hidden="true">·</span> OUR FIRST RELEASE IS TAKING SHAPE
      </div>
      <div className="retail-wrap">
        <div className="header-inner retail-header-inner">
          <Link
            href="/"
            className="brand-logo retail-brand ts-r1-wordmark"
            aria-label="TeeStock Beranda"
          >
            <span>
              Tee<span className="retail-brand-tight">Stock</span>
              <span className="retail-brand-star" aria-hidden="true">
                ✳
              </span>
            </span>
          </Link>
          <nav className="nav-desktop retail-nav" aria-label="Navigasi Utama">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={
                  'nav-link retail-nav-link' +
                  (pathname === href ? ' nav-link-active' : '') +
                  (href === '/shop' ? ' retail-nav-link-primary' : '')
                }
                aria-current={pathname === href ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="retail-header-actions">
            <Link
              href="/cart"
              className="retail-real-cart-badge"
              aria-label={'Keranjang produk nyata: ' + liveCartCount + ' kaos'}
            >
              BAG <span aria-hidden="true">({liveCartCount})</span>
            </Link>
            <Link
              href="/demo/cart"
              className="retail-demo-cart-badge"
              aria-label={`Keranjang simulasi demo: ${summary.totalQuantity} item`}
            >
              <span className="retail-demo-cart-label">Simulasi</span>
              <span className="retail-demo-cart-count" aria-hidden="true">
                ({summary.totalQuantity})
              </span>
            </Link>
            <Link className="retail-header-cta" href="/shop">
              Discover <span aria-hidden="true">↗</span>
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="mobile-toggle retail-mobile-toggle"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'}
              onClick={() => setOpen(!open)}
            >
              <span aria-hidden="true">{open ? 'CLOSE ×' : 'MENU +'}</span>
            </button>
          </div>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-menu retail-mobile-menu"
          aria-label="Navigasi Mobile"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                'mobile-nav-link' +
                (pathname === href ? ' nav-link-active' : '') +
                (href === '/shop' ? ' mobile-nav-link-primary' : '')
              }
              aria-current={pathname === href ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {label} <span aria-hidden="true">↗</span>
            </Link>
          ))}
          <Link
            href="/cart"
            className="mobile-nav-link"
            onClick={() => setOpen(false)}
          >
            Bag / Keranjang ({liveCartCount}) <span aria-hidden="true">↗</span>
          </Link>
          <Link
            href="/demo/cart"
            className={
              'mobile-nav-link retail-mobile-cart-link' +
              (pathname === '/demo/cart' ? ' nav-link-active' : '')
            }
            aria-current={pathname === '/demo/cart' ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            Keranjang Simulasi ({summary.totalQuantity}){' '}
            <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      )}
    </header>
  );
}
