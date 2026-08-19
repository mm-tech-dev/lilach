import type { Metadata } from 'next';

import CtaStrip from '@/components/CtaStrip';
import PageHead from '@/components/PageHead';
import { getReviews } from '@/lib/vision-os/server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'מה מספרים בוגרי הקורס',
  description:
    'המלצות של בוגרי קורסי התקשור וההכשרות של לילך הרשקוביץ במרכז להפצת אור — בלשונם.',
  alternates: { canonical: '/testimonials' },
};

export default async function TestimonialsPage() {
  const reviews = await getReviews();

  return (
    <>
      <PageHead
        crumbs={[{ label: 'מה מספרים' }]}
        title="מה מספרים"
        accent="בוגרי הקורס?"
        lead="כל ההמלצות שהתקבלו מבוגרות ובוגרי הקורסים — במילים שלהם."
      />

      <section className="section wrap" style={{ paddingTop: 50 }}>
        {reviews.length === 0 ? (
          <p className="emptyState">ההמלצות יעלו לאתר בקרוב.</p>
        ) : (
          <div className="reviewColumns">
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
        )}
      </section>

      <CtaStrip
        title="רוצים להיות הסיפור הבא?"
        body="השאירו פרטים ונשמח לספר לכם על הקורס הקרוב ולבדוק יחד אם הוא מתאים לכם."
        cta="לפרטים על הקורסים"
        href="/courses"
      />
      <div style={{ height: 100 }} />
    </>
  );
}
