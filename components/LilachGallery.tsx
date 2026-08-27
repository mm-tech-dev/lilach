'use client';

import Image from 'next/image';
import { useState } from 'react';

export interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * Lilach's photographs: one large frame plus a strip of thumbnails that
 * selects which photograph fills it.
 */
export default function LilachGallery({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  if (!current) return null;

  return (
    <div className="bioMedia">
      <div className="bioMainPhoto">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          width={900}
          height={900}
          priority
          sizes="(max-width: 900px) 90vw, 420px"
        />
      </div>

      <div className="bioThumbs" role="group" aria-label="תמונות של לילך הרשקוביץ">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            className={i === index ? 'bioThumb is-active' : 'bioThumb'}
            aria-label={img.alt}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
          >
            <Image
              src={img.src}
              alt=""
              width={300}
              height={300}
              sizes="90px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
