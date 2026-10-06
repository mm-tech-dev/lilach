import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import LeadForm from '@/components/LeadForm';
import PageHead from '@/components/PageHead';
import ReviewWall from '@/components/ReviewWall';
import { contact, site } from '@/lib/site';
import { formatCount, formatPrice } from '@/lib/format';
import {
  getCourse,
  getCourses,
  getReviews,
  resolveMedia,
  resolveMediaMap,
} from '@/lib/vision-os/server';

/** Course pages that close with the full testimonial wall. */
const COURSES_WITH_REVIEWS = ['tikshur-mathilim'];

/** The CMS stores gallery values as a JSON array, sometimes still encoded. */
function galleryIds(value: string[] | string | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export const revalidate = 60;

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: 'קורס לא נמצא' };
  return {
    title: course.title,
    description: course.summary ?? undefined,
    alternates: { canonical: `/courses/${course.slug}` },
  };
}

export default async function CoursePage({ params }: Params) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const img = await resolveMedia(course.image, course.title);
  // Extra photos, minus the one already shown as the lead image.
  const extraIds = galleryIds(course.gallery).filter((id) => id !== course.image);
  const extras = await resolveMediaMap(extraIds);
  const price = formatPrice(course.price);
  const deposit = formatPrice(course.deposit);
  const max = formatCount(course.max_participants);

  // Workshops and retreats are listed under their own cube, not the courses one.
  const isCourse = !course.event_type || course.event_type === 'קורס';
  const kind =
    course.event_type === 'ריטריט' ? 'הריטריט' : course.event_type === 'סדנה' ? 'הסדנה' : 'הקורס';
  const listHref = isCourse ? '/services/courses' : '/services/workshops';
  // The form offers this course's siblings: courses, or workshops and retreats.
  const siblings = (await getCourses()).filter((c) =>
    isCourse ? !c.event_type || c.event_type === 'קורס' : c.event_type && c.event_type !== 'קורס',
  );
  const formOptions = [...siblings.map((c) => c.title), 'אחר'];
  const reviews = COURSES_WITH_REVIEWS.includes(slug) ? await getReviews() : [];
  const dateLabel = isCourse
    ? 'תאריך פתיחה'
    : course.date_label?.includes('-')
      ? 'תאריכים'
      : 'תאריך';

  const meta: { label: string; value: string }[] = [
    course.date_label ? { label: dateLabel, value: course.date_label } : null,
    course.event_type ? { label: 'סוג', value: course.event_type } : null,
    course.sessions ? { label: 'מבנה', value: course.sessions } : null,
    course.hours ? { label: 'שעות', value: course.hours } : null,
    course.location ? { label: 'מיקום', value: course.location } : null,
    max ? { label: 'גודל הקבוצה', value: `עד ${max} משתתפים` } : null,
    course.prerequisites ? { label: 'דרישות קדם', value: course.prerequisites } : null,
    deposit ? { label: 'דמי מקדמה', value: deposit } : null,
  ].filter((x): x is { label: string; value: string } => x !== null);

  // Course structured data helps the listing surface in search results.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.summary ?? undefined,
    provider: { '@type': 'Organization', name: site.name, url: site.url },
    ...(price
      ? {
          offers: {
            '@type': 'Offer',
            price: String(course.price ?? ''),
            priceCurrency: 'ILS',
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHead
        crumbs={[
          { href: '/services', label: 'שירותי המרכז' },
          { href: listHref, label: isCourse ? 'קורסים' : 'סדנאות' },
          { label: course.title },
        ]}
        title={course.title}
        lead={course.summary ?? undefined}
      />

      <section className="section wrap" style={{ paddingTop: 56 }}>
        <div className="detailGrid">
          <div>
            {img ? (
              <div className="detailMedia">
                <Image
                  src={img.url}
                  alt={img.alt}
                  width={img.width ?? 1400}
                  height={img.height ?? 875}
                  priority
                  sizes="(max-width: 900px) 100vw, 720px"
                />
              </div>
            ) : null}

            {extraIds.length > 0 ? (
              <div className="courseGallery">
                {extraIds.map((id) => {
                  const g = extras.get(id);
                  if (!g) return null;
                  return (
                    <div key={id}>
                      <Image
                        src={g.url}
                        alt={g.alt || course.title}
                        width={g.width ?? 900}
                        height={g.height ?? 675}
                        sizes="(max-width: 700px) 100vw, 340px"
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}

            {course.description ? (
              <div className="prose" dangerouslySetInnerHTML={{ __html: course.description }} />
            ) : null}

            {/* A taste of the wall right after the course text, on a wide
                screen; "קרא עוד" jumps to the full set at the foot. */}
            {reviews.length > 0 ? (
              <ReviewWall
                reviews={reviews}
                className="previewReviews"
                initialCount={3}
                moreHref="#all-reviews"
                headingLines={['מה מספרים', 'הבוגרים.']}
              />
            ) : null}
          </div>

          <aside className="detailAside">
            <div className="detailCard">
              <h2>פרטי {kind}</h2>
              <dl className="metaList">
                {meta.map((m) => (
                  <div key={m.label}>
                    <dt>{m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
                {price ? (
                  <div>
                    <dt>עלות</dt>
                    <dd className="metaPrice">{price}</dd>
                  </div>
                ) : null}
              </dl>
              {course.landing_url ? (
                <a
                  className="primary"
                  href={course.landing_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  לפרטים והרשמה בדף הנחיתה
                </a>
              ) : null}
              <a className="outline" href={contact.phoneHref}>
                {contact.phoneDisplay}
              </a>
            </div>

            {/* On a phone the wall sits between the two cards; on a wide screen
                it keeps its full-width place at the foot of the page. */}
            {reviews.length > 0 ? (
              <ReviewWall reviews={reviews} className="asideReviews" initialCount={3} />
            ) : null}

            <div className="detailCard">
              <h2>הרשמה ופרטים</h2>
              <LeadForm
                sourcePage={`/courses/${course.slug}`}
                defaultInterest={course.title}
                options={formOptions}
                category={isCourse ? 'קורסים' : 'סדנאות'}
                withMessage
                submitLabel="שליחת בקשת הרשמה"
                note="נחזור אליכם לשיחה מקדימה לבחינת התאמה."
              />
            </div>

            <Link className="underLink" href={listHref}>
              {isCourse ? 'לכל הקורסים' : 'לכל הסדנאות והריטריטים'}{' '}
            </Link>
          </aside>
        </div>
      </section>

      {reviews.length > 0 ? (
        <ReviewWall reviews={reviews} className="footReviews" id="all-reviews" />
      ) : null}
    </>
  );
}
