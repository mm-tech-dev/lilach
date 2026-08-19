import Link from 'next/link';
import Image from 'next/image';

import SocialLinks from './SocialLinks';
import { contact, footerNav, legalNav, site } from '@/lib/site';

export default function Footer() {
  return (
    <footer>
      <div className="wrap footerGrid">
        <div className="brand footerBrand brandLogo">
          <Image src="/logo.jpg" alt={`לוגו ${site.name}`} width={160} height={160} />
          <span>
            {site.nameLines[0]}
            <br />
            {site.nameLines[1]}
          </span>
        </div>

        <div>
          <strong>ניווט</strong>
          {footerNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div>
          <strong>שעות פתיחה</strong>
          <p>
            {contact.hours.map((h) => (
              <span key={h.days}>
                {h.days}: {h.time}
                <br />
              </span>
            ))}
          </p>
          <a href={contact.phoneHref} className="footerPhone">
            {contact.phoneDisplay}
          </a>
        </div>

        <div>
          <strong>בואו נשמור על קשר</strong>
          <SocialLinks />
          <div className="footerLegal">
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap bottom">
        <span>© {site.name}</span>
        <span>פרטיותכם נשמרת בכל עת.</span>
      </div>
    </footer>
  );
}
