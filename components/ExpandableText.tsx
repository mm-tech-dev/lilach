'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  paragraphs: readonly string[];
  /** Lines shown before the text is cut off. */
  lines?: number;
}

/**
 * Collapses a bio to a few lines with a "read more" toggle.
 *
 * The toggle only appears when the text actually overflows, so the short bios
 * are not given a control that would do nothing. Overflow is measured after
 * mount and again on resize, since it depends on the rendered column width.
 */
export default function ExpandableText({ paragraphs, lines = 5 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const measure = () => {
      // Only meaningful while collapsed; expanded height is always the full text.
      if (el.dataset.expanded === 'true') return;
      setOverflows(el.scrollHeight > el.clientHeight + 4);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [paragraphs]);

  return (
    <div className="expandable">
      <div
        ref={bodyRef}
        data-expanded={expanded ? 'true' : 'false'}
        className={expanded ? 'expandableBody is-open' : 'expandableBody'}
        style={{ '--clamp-lines': lines } as React.CSSProperties}
      >
        {paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>

      {overflows ? (
        <button
          type="button"
          className="expandToggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'הצג פחות' : 'קרא עוד'}
          <span aria-hidden="true">{expanded ? '↑' : '↓'}</span>
        </button>
      ) : null}
    </div>
  );
}
