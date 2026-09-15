import Link from 'next/link';

import { contact } from '@/lib/site';

/** Closing call-to-action used at the bottom of interior pages. */
export default function CtaStrip({
  title = 'אולי זה הרגע שלכם להאיר.',
  body = 'מתקשרים אלינו ומדברים: שיחה אישית, נעימה וללא התחייבות.',
  cta,
  href,
}: {
  title?: string;
  body?: string;
  /** Overrides the default call action, e.g. to point at a listing page. */
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
          {/* Calling is the primary action; the site no longer routes people
              to a separate contact page. */}
          {href && cta ? (
            <Link className="primary" href={href}>
              {cta}{' '}
            </Link>
          ) : (
            <a className="primary" href={contact.phoneHref}>
              {contact.phoneDisplay}{' '}
            </a>
          )}
          <a
            className="outline"
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            וואטסאפ
          </a>
        </div>
      </div>
    </div>
  );
}
