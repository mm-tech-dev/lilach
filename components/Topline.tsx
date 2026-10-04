import Ticker from './Ticker';
import { getTickerCourses } from '@/lib/vision-os/server';

/** The announcement bar under the main menu, fed by the CMS course list. */
export default async function Topline() {
  const courses = await getTickerCourses();
  if (courses.length === 0) return null;

  // A real date leads, as on the printed schedule ("14.10.26 קורס תקשור").
  // A standing note instead of a date reads the other way round, so the name
  // comes first: "ריטריט פליאה: תאריכים יעודכנו בהמשך".
  const items = courses.map((c) => {
    if (!c.date_label) return c.title;
    return /\d/.test(c.date_label)
      ? `${c.date_label} ${c.title}`
      : `${c.title}: ${c.date_label}`;
  });

  return <Ticker items={items} />;
}
