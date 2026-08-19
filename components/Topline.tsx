import { getTickerCourses } from '@/lib/vision-os/server';

/**
 * The rotating announcement bar. The original CSS hard-codes a 16s cycle for
 * four items; here the cycle and per-item delay are derived from the CMS count
 * so adding or removing a course keeps the rotation even.
 */
export default async function Topline() {
  const courses = await getTickerCourses();
  if (courses.length === 0) return null;

  const slot = 4; // seconds each item stays on screen
  const cycle = courses.length * slot;

  return (
    <div className="topline">
      <div className="ticker" aria-label="מפגשים קרובים">
        {courses.map((course, i) => (
          <span
            key={course.id}
            style={{ animationDuration: `${cycle}s`, animationDelay: `${i * slot}s` }}
          >
            ✦ {course.date_label ?? ''} {course.title}
          </span>
        ))}
      </div>
    </div>
  );
}
