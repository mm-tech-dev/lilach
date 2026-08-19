'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { contact, footerNav, socials } from '@/lib/site';

/**
 * The source design hides the nav below 900px because it was a single page.
 * As a multi-page site it needs a real mobile menu, so this drawer takes over
 * at the same breakpoint (see `.mobileNavToggle` in globals.css).
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation so the drawer never covers the new page.
  useEffect(() => setOpen(false), [pathname]);

  // Lock background scrolling while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="mobileNavToggle"
        aria-label={open ? 'סגירת התפריט' : 'פתיחת התפריט'}
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={open ? 'bars open' : 'bars'} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>

      <div
        id="mobile-drawer"
        className={open ? 'mobileDrawer open' : 'mobileDrawer'}
        hidden={!open}
      >
        <nav aria-label="ניווט למובייל">
          <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
            ראשי
          </Link>
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/testimonials" aria-current={pathname === '/testimonials' ? 'page' : undefined}>
            מה מספרים
          </Link>
        </nav>

        <a className="drawerPhone" href={contact.phoneHref}>
          {contact.phoneDisplay}
        </a>

        <div className="drawerSocials">
          {socials.map((s) => (
            <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {open ? (
        <button
          type="button"
          className="mobileScrim"
          aria-label="סגירת התפריט"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
