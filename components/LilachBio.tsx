'use client';

import { useState } from 'react';

interface Props {
  he: string[];
  en: string[];
}

/** Lilach's story, switchable between Hebrew and English. */
export default function LilachBio({ he, en }: Props) {
  const [lang, setLang] = useState<'he' | 'en'>('he');
  const paragraphs = lang === 'he' ? he : en;

  return (
    <div className="bioBlock">
      <div className="langSwitch" role="group" aria-label="שפת הטקסט">
        <button
          type="button"
          className={lang === 'he' ? 'is-active' : ''}
          aria-pressed={lang === 'he'}
          onClick={() => setLang('he')}
        >
          עברית
        </button>
        <button
          type="button"
          className={lang === 'en' ? 'is-active' : ''}
          aria-pressed={lang === 'en'}
          onClick={() => setLang('en')}
        >
          English
        </button>
      </div>

      <div className="prose" dir={lang === 'he' ? 'rtl' : 'ltr'} lang={lang}>
        {paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </div>
  );
}
