import type { Metadata } from 'next';
import Image from 'next/image';

import CtaStrip from '@/components/CtaStrip';
import PageHead from '@/components/PageHead';
import VideoCard from '@/components/VideoCard';
import { carmiaLecture, homeVideos, podcast, podcastChaya, pressClippings } from '@/lib/site';

export const metadata: Metadata = {
  title: 'מן התקשורת',
  description:
    'כתבות, ראיונות, סרטונים ופודקאסטים על המרכז להפצת אור ועל שיטת ח.מ.ל.ה של לילך הרשקוביץ.',
  alternates: { canonical: '/media' },
};

export default function MediaPage() {
  return (
    <>
      <PageHead
        crumbs={[{ label: 'מן התקשורת' }]}
        title="מן"
        accent="התקשורת."
        lead="כתבות, ראיונות, סרטונים ופודקאסטים — מה שנכתב ונאמר על המרכז, על השיטה ועל התהליכים שעוברים כאן."
      />

      {/* ------------------------------------------------ ראיונות וכתבות --- */}
      <section className="section wrap" style={{ paddingTop: 56 }}>
        <div className="sectionHead">
          <h2>
            ראיונות <span>וסרטונים.</span>
          </h2>
          <p>שיחות מצולמות, כתבות ועדויות אישיות של מי שעברו את התהליך.</p>
        </div>

        <div className="videoGrid">
          {homeVideos.map((v) => (
            <VideoCard
              key={v.key}
              type={v.type}
              id={'id' in v ? v.id : undefined}
              src={'src' in v ? v.src : undefined}
              title={v.title}
              caption={v.caption}
            />
          ))}
        </div>
      </section>

      {/* --------------------------------------------- הרצאה וטיפול כרמיה --- */}
      <section className="section wrap" style={{ paddingTop: 0 }}>
        <div className="sectionHead">
          <h2>
            הרצאה <span>וטיפול.</span>
          </h2>
          <p>
            ערב נשות כרמיה, {carmiaLecture.date} — הרצאה חווייתית שנפתחה בהבנה והמשיכה לטיפול חי מול
            הקהל.
          </p>
        </div>

        <div className="lectureGrid">
          <VideoCard type="file" src={carmiaLecture.src} title={carmiaLecture.title} caption="הרצאה" />

          <div className="quoteWall">
            <h3>מה כתבו אחרי הערב</h3>
            <ul>
              {carmiaLecture.quotes.map((q, i) => (
                <li key={i}>
                  <span aria-hidden="true">״</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- פודקאסט --- */}
      <section className="podcast wrap section">
        <div className="podcastVisual">
          <Image
            src="/podcast-superlife.jpg"
            alt="לילך הרשקוביץ בפרק הפודקאסט SUPERLIFE"
            width={1024}
            height={568}
            sizes="(max-width: 900px) 100vw, 560px"
          />
          <a
            className="play"
            href={podcast.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="צפייה בפרק ביוטיוב"
          >
            ▶
          </a>
        </div>
        <div className="podcastCopy">
          <p className="mini">{podcast.eyebrow}</p>
          <h2>
            “{podcast.title}”
            <br />
            <small className="podcastBy">{podcast.attribution}</small>
          </h2>
          <p>{podcast.body}</p>
          <div className="podBtns">
            <a className="primary" href={podcast.youtube} target="_blank" rel="noopener noreferrer">
              לצפייה ביוטיוב{' '}
            </a>
            <a className="outline" href={podcast.spotify} target="_blank" rel="noopener noreferrer">
              להאזנה בספוטיפיי
            </a>
          </div>
        </div>
      </section>

      {/* -------------------------------------------- פודקאסט נוסף + עיתונות --- */}
      <section className="section wrap" style={{ paddingTop: 0 }}>
        <div className="mediaExtras">
          <article className="extraCard">
            <span className="badge">פודקאסט</span>
            <h3>{podcastChaya.title}</h3>
            <p>{podcastChaya.body}</p>
            <a
              className="underLink"
              href={podcastChaya.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              לצפייה בערוץ{' '}
            </a>
          </article>

          {pressClippings.map((clip) => (
            <article key={clip.src} className="extraCard clipCard">
              <span className="badge">כתבה</span>
              <h3>{clip.title}</h3>
              <p>{clip.caption}</p>
              <div className="clipImage">
                <Image
                  src={clip.src}
                  alt={clip.caption}
                  width={900}
                  height={1200}
                  sizes="(max-width: 700px) 90vw, 360px"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaStrip
        title="רוצים לשמוע עוד?"
        body="השאירו פרטים ונחזור אליכם לשיחה אישית על מה שמתאים לכם."
      />
      <div style={{ height: 100 }} />
    </>
  );
}
