'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import { contact } from '@/lib/site';
import type { ResolvedImage } from '@/lib/vision-os/types';

export interface TreatmentCard {
  id: string;
  title: string;
  summary: string | null;
  details: string | null;
  duration: string | null;
  price: string | null;
  image: ResolvedImage | null;
}

/**
 * The treatments as a grid of cards: a photograph, a title and one line each.
 * "לפרטים נוספים" opens the full description in a dialog, so the page stays a
 * short, even grid instead of one long column of text.
 */
export default function TreatmentGrid({ treatments }: { treatments: TreatmentCard[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<TreatmentCard | null>(null);

  function open(treatment: TreatmentCard) {
    setCurrent(treatment);
    // Wait a frame so the dialog holds the new content before it is shown.
    requestAnimationFrame(() => dialogRef.current?.showModal());
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <div className="treatmentGrid">
        {treatments.map((t) => (
          <article key={t.id} className="treatmentCard">
            <button
              type="button"
              className="treatmentMedia"
              onClick={() => open(t)}
              aria-label={`פרטים נוספים על ${t.title}`}
            >
              {t.image ? (
                <Image
                  src={t.image.url}
                  alt=""
                  width={t.image.width ?? 900}
                  height={t.image.height ?? 600}
                  sizes="(max-width: 600px) 92vw, 360px"
                />
              ) : null}
            </button>
            <div className="treatmentBody">
              <h3>{t.title}</h3>
              {t.summary ? <p>{t.summary}</p> : null}
              <div className="treatmentFoot">
                {t.price ? <span className="price">{t.price}</span> : <span />}
                <button type="button" className="go" onClick={() => open(t)}>
                  לפרטים נוספים
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* A native modal dialog: focus is trapped and Escape closes it. A click on
          the backdrop lands on the dialog element itself, so it closes too. */}
      <dialog
        ref={dialogRef}
        className="treatmentDialog"
        aria-labelledby="treatment-dialog-title"
        onClose={() => setCurrent(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {current ? (
          <div className="treatmentDialogInner">
            <button type="button" className="dialogClose" onClick={close} aria-label="סגירה">
              ×
            </button>

            {current.image ? (
              <div className="treatmentDialogMedia">
                <Image
                  src={current.image.url}
                  alt={current.image.alt || current.title}
                  width={current.image.width ?? 1200}
                  height={current.image.height ?? 700}
                  sizes="(max-width: 760px) 100vw, 720px"
                />
              </div>
            ) : null}

            <h2 id="treatment-dialog-title">{current.title}</h2>

            {/* Duration and price are part of the details text, as written in the
                centre's own document, so they are not repeated here. */}
            {current.duration ? (
              <dl className="treatmentMeta">
                <div>
                  <dt>משך:</dt>
                  <dd>{current.duration}</dd>
                </div>
              </dl>
            ) : null}

            {current.details ? (
              <div className="prose" dangerouslySetInnerHTML={{ __html: current.details }} />
            ) : null}

            <div className="treatmentActions">
              <a className="primary" href={contact.phoneHref}>
                לתיאום: {contact.phoneDisplay}
              </a>
              <a
                className="outline"
                href={`${contact.whatsapp}&text=${encodeURIComponent(
                  `היי, אשמח לפרטים על ${current.title}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                וואטסאפ
              </a>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
