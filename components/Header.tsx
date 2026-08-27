import Link from 'next/link';
import Image from 'next/image';

import MobileNav from './MobileNav';
import { contact, nav, site } from '@/lib/site';

export default function Header() {
  return (
    <header className="nav wrap">
      <Link className="brand brandLogo" href="/" aria-label={`${site.name} - ראשי`}>
        <Image src="/logo.jpg" alt={`לוגו ${site.name}`} width={112} height={112} priority />
        <span>
          {site.nameLines[0]}
          <br />
          {site.nameLines[1]}
        </span>
      </Link>

      <nav aria-label="ניווט ראשי">
        {nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* `display: contents` on desktop, so these sit in the header row as
          before; below 900px the group pairs the call button with the menu. */}
      <div className="mobileActions">
        <a className="navCta" href={contact.phoneHref}>
          בואו נדבר{' '}
        </a>
        <MobileNav />
      </div>
    </header>
  );
}
