import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import CtaStrip from '@/components/CtaStrip';
import PageHead from '@/components/PageHead';
import { getServices, resolveMediaMap } from '@/lib/vision-os/server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'שירותי המרכז',
  description:
    'הרצאות, סדנאות, הרצאה וטיפול משולבים וקורסים — בחרו את המרחב שמתאים לכם עכשיו במרכז להפצת אור.',
  alternates: { canonical: '/services' },
};

export default async function ServicesPage() {
  const services = await getServices();
  const media = await resolveMediaMap(services.map((s) => s.image));

  return (
    <>
      <PageHead
        crumbs={[{ label: 'שירותי המרכז' }]}
        title="כל דרך מתחילה בנקודת"
        accent="אור."
        lead="בחרו את המרחב שמתאים לכם עכשיו. בכל אחד מהם מחכה דרך מעשית, אנושית ומחוברת לפגוש את עצמכם מחדש."
      />

      <section className="section wrap" style={{ paddingTop: 60 }}>
        {services.length === 0 ? (
          <p className="emptyState">השירותים יעלו לאתר בקרוב. בינתיים נשמח שתתקשרו אלינו.</p>
        ) : (
          <div className="courseCards">
            {services.map((service) => {
              const img = service.image ? media.get(service.image) : null;
              return (
                <article key={service.id} className="courseCard">
                  {img ? (
                    <Link href={`/services/${service.slug}`} className="courseCardMedia">
                      <Image
                        src={img.url}
                        alt={img.alt || service.title}
                        width={img.width ?? 1200}
                        height={img.height ?? 750}
                        sizes="(max-width: 700px) 100vw, 380px"
                      />
                    </Link>
                  ) : null}
                  <div className="courseCardBody">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <div className="courseCardFoot">
                      <span />
                      <Link className="go" href={`/services/${service.slug}`}>
                        לפרטים נוספים
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <CtaStrip />
      <div style={{ height: 100 }} />
    </>
  );
}
