import Image from 'next/image';
import Link from 'next/link';

import LeadForm from '@/components/LeadForm';
import ServiceIcon from '@/components/ServiceIcon';
import VideoCard from '@/components/VideoCard';
import { contact, homeVideos, site, vision } from '@/lib/site';
import { getFeaturedReviews, getServices } from '@/lib/vision-os/server';

export const revalidate = 60;

export default async function HomePage() {
  const [services, reviews] = await Promise.all([getServices(), getFeaturedReviews(2)]);

  return (
    <>
      {/* ---------------------------------------------------------- hero --- */}
      <section id="top" className="hero">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="rays" />
        <div className="wrap heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">להיזכר • להתחבר • להאיר</p>
            <h1 className="heroStatement">
              המרכז להפצת אור עוזר לאנשים להיזכר מי הם, להתחבר לעצמם
              <br />
              <em>ולחיות מתוך חיבור פנימי</em>, באמצעות תהליכים רגשיים, אנרגטיים ותודעתיים.
            </h1>
            <div className="heroActions">
              <Link className="primary" href="/services/courses">
                לגלות את הקורסים{' '}
              </Link>
            </div>
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
                sizes="(max-width: 900px) 90vw, 550px"
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
      <section id="vision" className="about section wrap">
        <div className="aboutGrid">
          <div className="aboutIntro">
            <h2>
              {vision.title}
              <br />
              <span>{vision.accent}</span>
            </h2>
            <div className="aboutPhoto visionLogo">
              <Image
                src="/logo.jpg"
                alt={`לוגו ${site.name}`}
                width={512}
                height={512}
                sizes="(max-width: 900px) 60vw, 340px"
              />
            </div>
          </div>

          <div className="aboutText">
            {vision.paragraphs.map((text, i) => (
              <p key={i} className={i === 0 ? 'large' : undefined}>
                {text}
              </p>
            ))}
            <div className="heroActions visionActions">
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
          <div className="sectionHead">
            <h2>
              מספרים עלינו,
              <br />
              ומספרים <span>עלינו.</span>
            </h2>
            <p>
              כתבות, ראיונות ועדויות מהשטח — לצד מה שכותבים לנו בוגרי הקורסים אחרי שהתהליך נגמר.
            </p>
          </div>

          <div className="pressGrid">
            <div className="pressVideos">
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

      {/* ------------------------------------------------------ services --- */}
      <section id="services" className="services section">
        <div className="wrap">
          <div className="sectionHead">
            <h2>
              כל דרך מתחילה
              <br />
              בנקודת <span>אור.</span>
            </h2>
            <p>
              בחרו את המרחב שמתאים לכם עכשיו. בכל אחד מהם מחכה דרך מעשית, אנושית ומחוברת לפגוש את
              עצמכם מחדש.
            </p>
          </div>

          <div className="serviceGrid">
            {services.map((service) => (
              <article key={service.id}>
                <ServiceIcon icon={service.icon_key} />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link href={`/services/${service.slug}`} aria-label={`פרטים על ${service.title}`}>
                  לפרטים{' '}
                </Link>
              </article>
            ))}
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
