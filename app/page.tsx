import Image from 'next/image';
import Link from 'next/link';

import LeadForm from '@/components/LeadForm';
import VideoSlider from '@/components/VideoSlider';
import { contact, homeVideos, site, vision } from '@/lib/site';
import { getFeaturedReviews } from '@/lib/vision-os/server';

export const revalidate = 60;

export default async function HomePage() {
  const reviews = await getFeaturedReviews(2);

  return (
    <>
      {/* ---------------------------------------------------------- hero --- */}
      <section id="top" className="hero">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="rays" />
        <div className="wrap heroGrid heroSplit">
          <div className="heroCopy">
            <p className="eyebrow">להיזכר • להתחבר • להאיר</p>
            <h1 className="heroStatement">
              <span className="line1">המרכז להפצת אור עוזר לאנשים</span>
              <span className="line2">להיזכר מי הם, להתחבר לעצמם</span>
              <em className="line3">ולחיות מתוך חיבור פנימי</em>
            </h1>
            <p className="heroSub">באמצעות תהליכים רגשיים, אנרגטיים ותודעתיים.</p>
          </div>

          <div className="heroVisual" aria-label={site.owner}>
            <div className="imageHalo" />
            <div className="heroPhoto">
              <Image
                src="/hero-group-meeting.webp"
                alt="מפגש של המרכז להפצת אור"
                width={1672}
                height={941}
                priority
                sizes="(max-width: 900px) 90vw, 50vw"
              />
              <span className="photoGlow">✦</span>
            </div>
            <div className="floatingCard">
              <span>✦</span>
              <p>
                החלטה אחת
                <br />
                <strong>יכולה לשנות חיים</strong>
              </p>
            </div>
          </div>
        </div>
        <Link className="scrollHint" href="#vision">
          גלו עוד <span>↓</span>
        </Link>
      </section>

      {/* -------------------------------------------------------- vision --- */}
      <section id="vision" className="visionSection section wrap">
        <h2 className="visionTitle">
          {vision.title} <span>{vision.accent}</span>
        </h2>

        <div className="visionGrid">
          <div className="visionLogo">
            <Image
              src="/logo.jpg"
              alt={`לוגו ${site.name}`}
              width={512}
              height={512}
              sizes="(max-width: 900px) 62vw, 430px"
            />
          </div>

          <div className="visionText">
            {vision.paragraphs.map((text, i) => (
              <p key={i} className={i === 0 ? 'lead' : undefined}>
                {text}
              </p>
            ))}
            <div className="visionActions">
              <Link className="primary" href="/services">
                לגלות מה מתאים לי{' '}
              </Link>
              <Link className="outline" href="/about">
                להכיר את המרכז
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- press + stories --- */}
      <section id="stories" className="stories section">
        <div className="wrap">
          <div className="stackedHead">
            <h2>
              מספרים <span>עלינו.</span>
            </h2>
            <p>
              כתבות, ראיונות ועדויות מהשטח — לצד מה שכותבים לנו בוגרי הקורסים אחרי שהתהליך נגמר.
            </p>
          </div>

          <div className="pressGrid">
            <div className="pressVideos">
              <VideoSlider slides={homeVideos.map((v) => ({ ...v }))} />
              <Link className="underLink" href="/media">
                לכל הכתבות והפודקאסטים{' '}
              </Link>
            </div>

            <div className="pressQuotes">
              {reviews.map((review) => (
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
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- contact --- */}
      <section id="contact" className="contact section">
        <div className="glow" />
        <div className="wrap contactGrid">
          <div>
            <h2>
              אולי זה הרגע
              <br />
              שלכם <span>להאיר.</span>
            </h2>
            <p>השאירו פרטים ונחזור אליכם לשיחה אישית, נעימה וללא התחייבות.</p>
            <a className="phone" href={contact.phoneHref}>
              {contact.phoneDisplay}
            </a>
          </div>
          <LeadForm sourcePage="/" />
        </div>
      </section>
    </>
  );
}
