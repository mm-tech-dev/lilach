'use client';

import { useEffect, useState } from 'react';

/**
 * Rotates one announcement at a time.
 *
 * The original design stacked every item with staggered CSS animations, which
 * only lines up for exactly four entries; with the list coming from the CMS the
 * count changes, so the visible item is tracked in state instead. Only one node
 * is ever shown, so items can never overlap regardless of how many there are.
 */
export default function Ticker({ items }: { items: string[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (items.length < 2) return;
    // Someone who asked for less motion gets the first item, held still.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const HOLD = 4200;
    const FADE = 400;
    let fadeTimer: ReturnType<typeof setTimeout>;

    const cycle = setInterval(() => {
      setVisible(false);
      fadeTimer = setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setVisible(true);
      }, FADE);
    }, HOLD);

    return () => {
      clearInterval(cycle);
      clearTimeout(fadeTimer);
    };
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="topline">
      <div className="ticker" aria-label="מפגשים קרובים">
        <span className={visible ? 'tickerItem is-visible' : 'tickerItem'}>
          ✦ {items[index]}
        </span>
      </div>
    </div>
  );
}
