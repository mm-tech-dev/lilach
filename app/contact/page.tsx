import type { Metadata } from 'next';

import LeadForm from '@/components/LeadForm';
import PageHead from '@/components/PageHead';
import SocialLinks from '@/components/SocialLinks';
import { contact, site, socials } from '@/lib/site';

export const metadata: Metadata = {
  title: 'צור קשר',
  description:
    'נשמח לעמוד לרשותכם בכל שאלה, בקשה או התייעצות. השאירו פרטים או התקשרו 054-5931208.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: '+972-54-593-1208',
    founder: { '@type': 'Person', name: site.owner },
    sameAs: socials.map((s) => s.href),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '08:30',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '08:00',
        closes: '13:00',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHead
        crumbs={[{ label: 'צור קשר' }]}
        title="אולי זה הרגע שלכם"
        accent="להאיר."
        lead="נשמח לעמוד לרשותכם בכל שאלה, בקשה או התייעצות. אנחנו כאן כדי לספק לכם מענה אישי, מקצועי ומהיר."
      />

      <section className="contact section" style={{ paddingTop: 56 }}>
        <div className="glow" />
        <div className="wrap contactGrid">
          <div>
            <a className="phone" href={contact.phoneHref}>
              {contact.phoneDisplay}
            </a>

            <div className="contactInfo">
              <div>
                <strong>שעות פעילות</strong>
                <p>
                  {contact.hours.map((h) => (
                    <span key={h.days}>
                      {h.days}: {h.time}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
              <div>
                <strong>בואו נשמור על קשר</strong>
                <SocialLinks className="contactSocials socialRow" />
              </div>
            </div>
          </div>

          <LeadForm sourcePage="/contact" withMessage submitLabel="שליחת הפרטים" />
        </div>
      </section>
    </>
  );
}
