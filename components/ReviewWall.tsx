'use client';

import { useState } from 'react';

import type { ReviewRow } from '@/lib/vision-os/types';

interface Props {
  reviews: ReviewRow[];
  /** Anchor target; the about page is linked as /about#testimonials. */
  id?: string;
  /** Extra class on the section, e.g. to show it on one screen size only. */
  className?: string;
  /**
   * Shows this many reviews behind a "show more" button. Used where the wall
   * sits between two cards on a phone and would otherwise bury what follows.
   */
  initialCount?: number;
  /**
   * Turns the control into a link to the full wall elsewhere on the page,
   * instead of expanding in place.
   */
  moreHref?: string;
  /** Overrides the two-line heading, so a preview does not repeat the wall's. */
  headingLines?: readonly [string, string];
}

/** The "מה אומרים עלינו?" wall, shown on the about page and on course pages. */
export default function ReviewWall({
  reviews,
  id,
  className,
  initialCount,
  moreHref,
  headingLines = ['מה אומרים', 'עלינו?'],
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = initialCount !== undefined && reviews.length > initialCount;
  const shown = collapsible && !expanded ? reviews.slice(0, initialCount) : reviews;

  return (
    <section id={id} className={`stories section${className ? ` ${className}` : ''}`}>
      <div className="wrap">
        <div className="storyTitle">
          <h2>
            {headingLines[0]}
            <br />
            <span>{headingLines[1]}</span>
          </h2>
          <div className="quoteMark">״</div>
        </div>

        {reviews.length === 0 ? (
          <p className="emptyState">ההמלצות יעלו לאתר בקרוב.</p>
        ) : (
          <>
            <div className="reviewColumns">
              {shown.map((review) => (
                <article key={review.id}>
                  <div className="stars" aria-label={`דירוג ${review.rating ?? 5} מתוך 5`}>
                    ✦ ✦ ✦ ✦ ✦
                  </div>
                  <blockquote dangerouslySetInnerHTML={{ __html: review.body ?? '' }} />
                  <div className="person">
                    <span>{review.initial ?? review.author_name.charAt(0)}</span>
                    <strong>{review.author_name}</strong>
                  </div>
                </article>
              ))}
            </div>

            {collapsible && moreHref ? (
              <a className="reviewToggle" href={moreHref}>
                קרא עוד
                <span aria-hidden="true">↓</span>
              </a>
            ) : collapsible ? (
              <button
                type="button"
                className="reviewToggle"
                aria-expanded={expanded}
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? 'הצג פחות' : `לכל ההמלצות (${reviews.length})`}
                <span aria-hidden="true">{expanded ? '↑' : '↓'}</span>
              </button>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
