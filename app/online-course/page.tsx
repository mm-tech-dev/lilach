import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';

import CoursePasswordForm from '@/components/CoursePasswordForm';
import PageHead from '@/components/PageHead';
import VideoCard from '@/components/VideoCard';
import { COURSE_COOKIE, tokenValid } from '@/lib/course-access';
import { contact, onlineCourse } from '@/lib/site';

// Paid content behind a password: kept out of search results.
export const metadata: Metadata = {
  title: onlineCourse.title,
  robots: { index: false, follow: false },
  alternates: { canonical: onlineCourse.href },
};

export default async function OnlineCoursePage() {
  const unlocked = tokenValid((await cookies()).get(COURSE_COOKIE)?.value);

  return (
    <>
      <PageHead
        crumbs={[
          { href: '/services', label: 'שירותי המרכז' },
          { href: '/services/shop', label: 'חנות' },
          { label: onlineCourse.title },
        ]}
        title={onlineCourse.title}
        accent={`${onlineCourse.courseName}.`}
        lead={
          unlocked
            ? '15 שיעורים אינטרנטיים. צפייה נעימה.'
            : 'התוכן מוגן בסיסמה. הזינו את הסיסמה שקיבלתם עם רכישת הקורס.'
        }
      />

      <section className="section wrap" style={{ paddingTop: 56 }}>
        {unlocked ? (
          <div className="videoGrid">
            {onlineCourse.lessons.map((lesson) => (
              <VideoCard
                key={lesson.id}
                type="youtube"
                id={lesson.id}
                title={lesson.label}
                caption={onlineCourse.courseName}
              />
            ))}
          </div>
        ) : (
          <div className="detailCard courseLock">
            <h2>כניסה לקורס</h2>
            <CoursePasswordForm />
            <p className="courseLockHelp">
              עדיין לא רכשתם את הקורס, או שהסיסמה לא אצלכם?{' '}
              <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
              {' · '}
              <Link href="/services/shop">לחנות</Link>
            </p>
          </div>
        )}
      </section>
    </>
  );
}
