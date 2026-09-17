import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import ExpandableText from '@/components/ExpandableText';
import LeadForm from '@/components/LeadForm';
import PageHead from '@/components/PageHead';
import TreatmentGrid from '@/components/TreatmentGrid';
import { contact, onlineCourse } from '@/lib/site';
import { formatPrice } from '@/lib/format';
import {
  getCourses,
  getProducts,
  getService,
  getServices,
  getTreatments,
  resolveMedia,
  resolveMediaMap,
} from '@/lib/vision-os/server';

export const revalidate = 60;

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.filter((s) => !s.external_url).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: 'שירות לא נמצא' };
  return {
    title: service.title,
    description: service.description ?? undefined,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();
  // Hosted elsewhere, so there is no page of its own to show.
  if (service.external_url) redirect(service.external_url);

  const img = await resolveMedia(service.image, service.title);

  // Two cubes list other collections rather than standing on their own.
  const courses = slug === 'courses' || slug === 'workshops' ? await getCourses() : [];
  const products = slug === 'shop' ? await getProducts() : [];
  const treatments = slug === 'treatments' ? await getTreatments() : [];
  const listMedia = await resolveMediaMap([
    ...courses.map((c) => c.image),
    ...products.map((p) => p.image),
    ...treatments.map((t) => t.image),
  ]);

  // The courses cube shows courses; the workshops cube shows workshops/retreats.
  const shownCourses =
    slug === 'workshops'
      ? courses.filter((c) => c.event_type === 'סדנה' || c.event_type === 'ריטריט')
      : courses.filter((c) => c.event_type === 'קורס');

  // "במה נוכל לעזור?" lists what this page offers; other pages keep the general list.
  const pageOptions =
    slug === 'treatments'
      ? treatments.map((t) => t.title)
      : slug === 'shop'
        ? products.map((p) => p.title)
        : slug === 'lectures'
          ? lectureTitles(service.full_description)
          : shownCourses.map((c) => c.title);
  const formOptions = pageOptions.length > 0 ? [...pageOptions, 'אחר'] : undefined;

  return (
    <>
      <PageHead
        crumbs={[{ href: '/services', label: 'שירותי המרכז' }, { label: service.title }]}
        title={service.title}
        lead={service.description ?? undefined}
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

            {service.full_description ? (
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: service.full_description }}
              />
            ) : treatments.length === 0 ? (
              <div className="prose">
                <p>{service.description}</p>
              </div>
            ) : null}

            {treatments.length > 0 ? (
              <TreatmentGrid
                treatments={treatments.map((t) => ({
                  id: t.id,
                  title: t.title,
                  summary: t.summary,
                  details: t.details,
                  duration: t.duration,
                  price: t.price,
                  image: t.image ? (listMedia.get(t.image) ?? null) : null,
                }))}
              />
            ) : null}

            {shownCourses.length > 0 ? (
              <div className="courseCards" style={{ marginTop: 50 }}>
                {shownCourses.map((course) => {
                  const cImg = course.image ? listMedia.get(course.image) : null;
                  const price = formatPrice(course.price);
                  return (
                    <article key={course.id} className="courseCard">
                      {cImg ? (
                        <Link href={`/courses/${course.slug}`} className="courseCardMedia">
                          <Image
                            src={cImg.url}
                            alt={cImg.alt || course.title}
                            width={cImg.width ?? 1200}
                            height={cImg.height ?? 675}
                            sizes="(max-width: 700px) 100vw, 340px"
                          />
                        </Link>
                      ) : null}
                      <div className="courseCardBody">
                        <div className="courseBadges">
                          {course.date_label ? (
                            <span className="badge dateBadge">{course.date_label}</span>
                          ) : null}
                          {course.event_type ? (
                            <span className="badge">{course.event_type}</span>
                          ) : null}
                          {course.sessions ? <span className="badge">{course.sessions}</span> : null}
                        </div>
                        <h3>{course.title}</h3>
                        {course.summary ? <p>{course.summary}</p> : null}
                        <div className="courseCardFoot">
                          <span className="price">{price ?? 'לפרטים'}</span>
                          <Link className="go" href={`/courses/${course.slug}`}>
                            לפרטים והרשמה <span aria-hidden="true">←</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : null}

            {products.length > 0 ? (
              <div className="productGrid" style={{ marginTop: 50 }}>
                {products.map((product) => {
                  const pImg = product.image ? listMedia.get(product.image) : null;
                  const price = formatPrice(product.price);
                  return (
                    <article key={product.id} className="productCard">
                      {pImg ? (
                        <div className="productMedia">
                          <Image
                            src={pImg.url}
                            alt={pImg.alt || product.title}
                            width={pImg.width ?? 800}
                            height={pImg.height ?? 600}
                            sizes="(max-width: 700px) 100vw, 280px"
                          />
                        </div>
                      ) : (
                        <div className="mark" aria-hidden="true">
                          ✦
                        </div>
                      )}
                      <h3>{product.title}</h3>
                      {product.full_description ? (
                        <div className="productDetail prose">
                          <ExpandableText html={product.full_description} lines={4} />
                        </div>
                      ) : product.description ? (
                        <p>{product.description}</p>
                      ) : null}
                      <div className="foot">
                        <span className="price">{price ?? 'לפרטים'}</span>
                        {product.title.includes(onlineCourse.productMatch) ? (
                          <Link className="buyLink viewLink" href={onlineCourse.href}>
                            לצפייה
                          </Link>
                        ) : null}
                        <a
                          className="buyLink"
                          href={`${contact.whatsapp}&text=${encodeURIComponent(
                            `היי, אני מעוניין/ת ב${product.title}`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          לרכישה <span aria-hidden="true">←</span>
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : null}
          </div>

          <aside className="detailAside">
            <div className="detailCard">
              <h2>מתעניינים? נשמח לדבר</h2>
              <LeadForm
                sourcePage={`/services/${service.slug}`}
                defaultInterest={formOptions ? '' : interestFor(service.slug)}
                options={formOptions}
                category={interestFor(service.slug)}
                withMessage
                submitLabel="שליחת פנייה"
              />
            </div>
            <div className="detailCard">
              <h2>יצירת קשר ישירה</h2>
              <a className="primary" href={contact.phoneHref}>
                {contact.phoneDisplay}{' '}
              </a>
              <p style={{ margin: '14px 0 0', color: 'var(--muted)', fontSize: 14 }}>
                {contact.hours.map((h) => (
                  <span key={h.days}>
                    {h.days}: {h.time}
                    <br />
                  </span>
                ))}
              </p>
            </div>
            <Link className="underLink" href="/services">
              לכל שירותי המרכז{' '}
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}

/** The lecture names, read from the headings of the lectures page ("א. השפעה על המציאות"). */
function lectureTitles(html: string | null): string[] {
  if (!html) return [];
  return [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)]
    .map((m) => m[1]!.replace(/<[^>]+>/g, '').trim())
    .map((title) => title.replace(/^[א-ת0-9]{1,2}\s*\.\s*/, ''))
    .filter((title) => title && title !== 'עלות');
}

/** Pre-selects the closest matching subject in the lead form. */
function interestFor(slug: string): string {
  switch (slug) {
    case 'lectures':
      return 'הרצאות';
    case 'workshops':
      return 'סדנאות';
    case 'lecture-and-therapy':
    case 'treatments':
      return 'טיפול אישי';
    case 'courses':
      return 'קורסים';
    case 'shop':
      return 'מוצרים';
    default:
      return '';
  }
}
