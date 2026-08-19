import Link from 'next/link';

import { contact } from '@/lib/site';

/** Closing call-to-action used at the bottom of interior pages. */
export default function CtaStrip({
  title = 'אולי זה הרגע שלכם להאיר.',
  body = 'השאירו פרטים ונחזור אליכם לשיחה אישית, נעימה וללא התחייבות.',
  cta = 'להשארת פרטים',
  href = '/contact',
}: {
  title?: string;
  body?: string;
  cta?: string;
  href?: string;
}) {
  return (
    <div className="wrap">
      <div className="ctaStrip">
        <div>
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
        <div className="podBtns">
          <Link className="primary" href={href}>
            {cta}{' '}
          </Link>
          <a className="outline" href={contact.phoneHref}>
            {contact.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
