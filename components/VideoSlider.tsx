'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import VideoCard from './VideoCard';

interface Slide {
  key: string;
  type: 'youtube' | 'file';
  id?: string;
  src?: string;
  title: string;
  caption?: string;
}

/**
 * Horizontal slider for the video strip. One slide is visible at a time, so a
 * growing list of clips costs no extra page height. Scroll-snap does the
 * moving; the buttons and dots just drive the scroll position, which keeps
 * trackpad swiping and keyboard scrolling working normally.
 */
export default function VideoSlider({ slides }: { slides: Slide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: clamped * track.clientWidth * (isRtl(track) ? -1 : 1), behavior: 'smooth' });
    setIndex(clamped);
  }, [slides.length]);

  // Keep the dots in step when the user swipes instead of using the buttons.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = track.clientWidth || 1;
        setIndex(Math.round(Math.abs(track.scrollLeft) / width));
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="videoSlider">
      <div className="videoTrack" ref={trackRef}>
        {slides.map((s) => (
          <div className="videoSlide" key={s.key}>
            <VideoCard type={s.type} id={s.id} src={s.src} title={s.title} caption={s.caption} />
          </div>
        ))}
      </div>

      <div className="sliderControls">
        <button
          type="button"
          aria-label="הסרטון הקודם"
          onClick={() => scrollTo(index - 1)}
          disabled={index === 0}
        >
          →
        </button>

        <div className="sliderDots" role="tablist" aria-label="בחירת סרטון">
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={s.title}
              className={i === index ? 'is-active' : ''}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="הסרטון הבא"
          onClick={() => scrollTo(index + 1)}
          disabled={index === slides.length - 1}
        >
          ←
        </button>
      </div>
    </div>
  );
}

function isRtl(el: HTMLElement): boolean {
  return getComputedStyle(el).direction === 'rtl';
}
