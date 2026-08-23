import Ticker from './Ticker';
import { getTickerCourses } from '@/lib/vision-os/server';

/** The announcement bar under the main menu, fed by the CMS course list. */
export default async function Topline() {
  const courses = await getTickerCourses();
  if (courses.length === 0) return null;

  const items = courses.map((c) => [c.date_label, c.title].filter(Boolean).join(' '));

  return <Ticker items={items} />;
}
