import Image from 'next/image';
import Link from 'next/link';

import LeadForm from '@/components/LeadForm';
import ServiceIcon from '@/components/ServiceIcon';
import { contact, podcast, site } from '@/lib/site';
import { getCourses, getFeaturedReviews, getServices } from '@/lib/vision-os/server';

export const revalidate = 60;

export default async function HomePage() {
  const [services, courses, reviews] = await Promise.all([
    getServices(),
    getCourses(),
    getFeaturedReviews(3),
  ]);

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
            <h1>
              האור שאתם
              <br />
              מחפשים <em>כבר בכם.</em>
            </h1>
            <p className="lead">
              המרכז להפצת אור עוזר לאנשים להיזכר מי הם, להתחבר לעצמם ולחיות מתוך חיבור פנימי —
              באמצעות תהליכים רגשיים, אנרגטיים ותודעתיים.
            </p>
            <div className="heroActions">
              <Link className="primary" href="/courses">
                לגלות את הקורסים{' '}
              </Link>
              <Link className="textLink" href="/services">
                לשירותי המרכז <span>←</span>
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
        <Link className="scrollHint" href="#about">
          גלו עוד <span>↓</span>
        </Link>
      </section>

      {/* --------------------------------------------------------- about --- */}
      <section id="about" className="about section wrap">
        <div className="aboutGrid">
          <div className="aboutIntro">
            <h2>
              שלום,
              <br />
              אני <span>לילך.</span>
            </h2>
            <div className="aboutPhoto lilachPortrait">
              <Image
                src="/lilach-portrait.webp"
                alt={site.owner}
                width={1600}
                height={1200}
                sizes="(max-width: 900px) 90vw, 520px"
              />
              <span className="portraitLabel">
                {site.owner}
                <br />
                <small>מייסדת המרכז להפצת אור</small>
              </span>
            </div>
          </div>
          <div className="aboutText">
            <p className="large">אני לילך הרשקוביץ, נשואה לאסף ואמא למיכאלה ולאופיר.</p>
            <p>
              לפני כמעט 18 שנים התחלתי ללמוד רייקי, הילינג, תקשור, טארוט וקורסים רוחניים נוספים — כי
              תמיד ידעתי שמה שאנחנו חווים בחמשת החושים אינו כל חוויית החיים.
            </p>
            <p>
              ידעתי שיש מעבר, ושבטוח לא הכול כל כך מסובך כמו שנדמה לנו. מאז אני מלווה אנשים בדרך
              חזרה פנימה, אל המקום שבו מתחילים הדיוק, השקט והאור.
            </p>
            <Link className="underLink" href="/about">
              בואו נכיר לעומק{' '}
            </Link>
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

          <div className="serviceMoment">
            <Image
              src="/lilach-lecture.jpg"
              alt="לילך בהרצאה מול קהל"
              width={1569}
              height={1004}
              sizes="100vw"
            />
            <div>
              <span>מפגשים אמיתיים, חוויה מחברת</span>
              <strong>ללמוד, להרגיש, להתחבר.</strong>
            </div>
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

      {/* ------------------------------------------------------- courses --- */}
      <section id="courses" className="courses section wrap">
        <div className="sectionHead dark">
          <h2>
            קורסים, סדנאות
            <br />
            ורגעים של <span>פליאה.</span>
          </h2>
          <p>
            מפגשים שמחברים בין גוף, נפש ורוח — עם ידע, תרגול וחוויה שאפשר לקחת אל החיים עצמם.
          </p>
        </div>

        <div className="eventList">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <span className="date">{course.date_label}</span>
              <strong>{course.title}</strong>
              <span className="eventType">{course.event_type}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- stories --- */}
      <section id="stories" className="stories section">
        <div className="wrap">
          <div className="storyTitle">
            <h2>
              מה מספרים
              <br />
              <span>בוגרי הקורס?</span>
            </h2>
            <div className="quoteMark">״</div>
          </div>

          <div className="testimonialGrid">
            {reviews.map((review, i) => (
              <article key={review.id} className={i === 1 ? 'lift' : ''}>
                <div className="stars" aria-label={`דירוג ${review.rating ?? 5} מתוך 5`}>
                  ✦ ✦ ✦ ✦ ✦
                </div>
                <blockquote
                  className="clampQuote"
                  dangerouslySetInnerHTML={{ __html: review.body ?? '' }}
                />
                <div className="person">
                  <span>{review.initial ?? review.author_name.charAt(0)}</span>
                  <strong>{review.author_name}</strong>
                </div>
              </article>
            ))}
          </div>

          <div className="storiesMore">
            <Link className="underLink" href="/testimonials">
              לקרוא את כל ההמלצות{' '}
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- podcast --- */}
      <section className="podcast wrap section">
        <div className="podcastVisual">
          <Image
            src="/podcast-superlife.jpg"
            alt="טיפול אישי מצולם עם לילך"
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
            {podcast.title[0]}
            <br />
            {podcast.title[1]}
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
