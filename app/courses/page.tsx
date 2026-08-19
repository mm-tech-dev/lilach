import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import CtaStrip from '@/components/CtaStrip';
import PageHead from '@/components/PageHead';
import { formatPrice } from '@/lib/format';
import { getCourses, resolveMediaMap } from '@/lib/vision-os/server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'קורסים וסדנאות',
  description:
    'קורסי תקשור למתחילים ולמתקדמים, הכשרת מטפלים בשיטת ח.מ.ל.ה, סדנאות וריטריטים — כל המפגשים הקרובים של המרכז להפצת אור.',
  alternates: { canonical: '/courses' },
};

export default async function CoursesPage() {
  const courses = await getCourses();
  const media = await resolveMediaMap(courses.map((c) => c.image));

  return (
    <>
      <PageHead
        crumbs={[{ label: 'קורסים וסדנאות' }]}
        title="קורסים, סדנאות ורגעים של"
        accent="פליאה."
        lead="מפגשים שמחברים בין גוף, נפש ורוח — עם ידע, תרגול וחוויה שאפשר לקחת אל החיים עצמם."
      />

      <section className="section wrap" style={{ paddingTop: 60 }}>
        {courses.length === 0 ? (
          <p className="emptyState">
            כרגע אין מפגשים פתוחים להרשמה. השאירו פרטים ונעדכן אתכם ראשונים על המחזור הבא.
          </p>
        ) : (
          <div className="courseCards">
            {courses.map((course) => {
              const img = course.image ? media.get(course.image) : null;
              const price = formatPrice(course.price);
              return (
                <article key={course.id} className="courseCard">
                  {img ? (
                    <Link href={`/courses/${course.slug}`} className="courseCardMedia">
                      <Image
                        src={img.url}
                        alt={img.alt || course.title}
                        width={img.width ?? 1200}
                        height={img.height ?? 675}
                        sizes="(max-width: 700px) 100vw, 380px"
                      />
                    </Link>
                  ) : null}

                  <div className="courseCardBody">
                    <div className="courseBadges">
                      {course.date_label ? (
                        <span className="badge dateBadge">{course.date_label}</span>
                      ) : null}
                      {course.event_type ? <span className="badge">{course.event_type}</span> : null}
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
        )}
      </section>

      <CtaStrip
        title="לא בטוחים איזה מסלול מתאים לכם?"
        body="נשמח לשיחה קצרה שתעזור לכם לבחור נכון — ללא התחייבות."
        cta="דברו איתנו"
      />
      <div style={{ height: 100 }} />
    </>
  );
}
