import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import LeadForm from '@/components/LeadForm';
import PageHead from '@/components/PageHead';
import { contact, site } from '@/lib/site';
import { formatCount, formatPrice } from '@/lib/format';
import { getCourse, getCourses, resolveMedia } from '@/lib/vision-os/server';

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
  const price = formatPrice(course.price);
  const deposit = formatPrice(course.deposit);
  const max = formatCount(course.max_participants);

  const meta: { label: string; value: string }[] = [
    course.date_label ? { label: 'תאריך פתיחה', value: course.date_label } : null,
    course.event_type ? { label: 'סוג המפגש', value: course.event_type } : null,
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
        crumbs={[{ href: '/courses', label: 'קורסים וסדנאות' }, { label: course.title }]}
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

            {course.description ? (
              <div className="prose" dangerouslySetInnerHTML={{ __html: course.description }} />
            ) : null}
          </div>

          <aside className="detailAside">
            <div className="detailCard">
              <h2>פרטי המפגש</h2>
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
              <a className="outline" href={contact.phoneHref}>
                {contact.phoneDisplay}
              </a>
            </div>

            <div className="detailCard">
              <h2>הרשמה ופרטים</h2>
              <LeadForm
                sourcePage={`/courses/${course.slug}`}
                defaultInterest={course.event_type === 'סדנה' ? 'סדנאות' : 'קורסים'}
                withMessage
                submitLabel="שליחת בקשת הרשמה"
                note="נחזור אליכם לשיחה מקדימה לבחינת התאמה."
              />
            </div>

            <Link className="underLink" href="/courses">
              לכל הקורסים והסדנאות{' '}
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
