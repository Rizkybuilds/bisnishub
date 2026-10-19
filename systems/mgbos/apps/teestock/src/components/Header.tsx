'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/shop', label: 'The Edit' },
  { href: '/custom', label: 'Custom' },
  { href: '/business', label: 'For Business' },
  { href: '/support/contact', label: 'Bantuan' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

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
        TEESTOCK SELECTS <span aria-hidden="true">✳</span> THE NEXT CHAPTER IS
        TAKING SHAPE
      </div>
      <div className="retail-wrap">
        <div className="header-inner retail-header-inner">
          <Link
            href="/"
            className="brand-logo retail-brand"
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
                  (pathname === href ? ' nav-link-active' : '')
                }
                aria-current={pathname === href ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="retail-header-actions">
            <Link className="retail-header-cta" href="/shop">
              Explore <span aria-hidden="true">↗</span>
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
              <span aria-hidden="true">{open ? '✕' : '☰'}</span>
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
                (pathname === href ? ' nav-link-active' : '')
              }
              aria-current={pathname === href ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {label} <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
