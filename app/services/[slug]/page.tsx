import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import LeadForm from '@/components/LeadForm';
import PageHead from '@/components/PageHead';
import { contact } from '@/lib/site';
import { getService, getServices, resolveMedia } from '@/lib/vision-os/server';

export const revalidate = 60;

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
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

  const img = await resolveMedia(service.image, service.title);

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
            ) : (
              <div className="prose">
                <p>{service.description}</p>
              </div>
            )}
          </div>

          <aside className="detailAside">
            <div className="detailCard">
              <h2>מתעניינים? נשמח לדבר</h2>
              <LeadForm
                sourcePage={`/services/${service.slug}`}
                defaultInterest={interestFor(service.slug)}
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

/** Pre-selects the closest matching subject in the lead form. */
function interestFor(slug: string): string {
  switch (slug) {
    case 'lectures':
      return 'הרצאות';
    case 'workshops':
      return 'סדנאות';
    case 'lecture-and-therapy':
      return 'טיפול אישי';
    case 'courses':
      return 'קורסים';
    default:
      return '';
  }
}
