import Link from 'next/link';

import { contact } from '@/lib/site';

export default function NotFound() {
  return (
    <section className="wrap notFound">
      <p className="eyebrow">✦ העמוד לא נמצא</p>
      <h1>404</h1>
      <p>הדף שחיפשתם לא קיים או שכתובתו השתנתה. אפשר לחזור לדף הבית או לדבר איתנו.</p>
      <div className="heroActions" style={{ justifyContent: 'center' }}>
        <Link className="primary" href="/">
          חזרה לדף הבית{' '}
        </Link>
        <a className="outline" href={contact.phoneHref}>
          {contact.phoneDisplay}
        </a>
      </div>
    </section>
  );
}
