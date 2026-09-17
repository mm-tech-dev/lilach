/**
 * Static business facts. Everything here is verified against the live
 * spreadthelight.co.il site — no placeholder links.
 */

export const site = {
  name: 'המרכז להפצת אור',
  nameLines: ['המרכז', 'להפצת אור'],
  owner: 'לילך הרשקוביץ',
  tagline: 'אור שמחבר',
  description:
    'המרכז להפצת אור: תהליכים רגשיים, אנרגטיים ותודעתיים לחיבור פנימי. קורסי תקשור, סדנאות, הרצאות וטיפולים בהנחיית לילך הרשקוביץ.',
  url: 'https://spreadthelight.co.il',
  locale: 'he_IL',
} as const;

export const contact = {
  phoneDisplay: '054-5931208',
  phoneHref: 'tel:+972545931208',
  whatsapp: 'https://api.whatsapp.com/send/?phone=972545931208',
  hours: [
    { days: 'ראשון–חמישי', time: '08:30–20:00' },
    { days: 'שישי', time: '08:00–13:00' },
  ],
} as const;

/** Only links that actually resolve on the live site are listed. */
export const socials = [
  { key: 'facebook', label: 'פייסבוק', href: 'https://www.facebook.com/lilahher' },
  {
    key: 'youtube',
    label: 'יוטיוב',
    href: 'https://www.youtube.com/channel/UC5O6O_ODUWHx0WWus4CKJmA',
  },
  { key: 'whatsapp', label: 'וואטסאפ', href: 'https://api.whatsapp.com/send/?phone=972545931208' },
] as const;

/** The four pages the site is built around. */
export const nav = [
  { href: '/', label: 'ראשי' },
  { href: '/about', label: 'להכיר את צוות המרכז' },
  { href: '/services', label: 'שירותי המרכז' },
  { href: '/media', label: 'מן התקשורת' },
] as const;

export const footerNav = nav;

export const legalNav = [
  { href: '/privacy', label: 'מדיניות פרטיות' },
  { href: '/terms', label: 'תקנון האתר' },
  { href: '/accessibility', label: 'הצהרת נגישות' },
] as const;

export const interestOptions = [
  'קורסים',
  'סדנאות',
  'הרצאות',
  'טיפול אישי',
  'מוצרים',
  'אחר',
] as const;

/* ------------------------------------------------------------------ home --- */

export const vision = {
  title: 'החזון',
  accent: 'שלנו.',
  paragraphs: [
    'הכול התחיל לפני 15 שנה עם פתיחת הקליניקה לטיפולים הוליסטיים, ומתוך כוונה לייצר מרחב טיפולי שמאפשר למלווה לעבור תהליך אישי של התפתחות ולפגוש את עצמו בגובה העיניים, מתוך הקשבה, חמלה ואמונה ביכולת שלו ליצור שינוי.',
    'ככל שחלף הזמן, ולאחר מאות מטופלים ומטופלות שעברו בקליניקה, הניסיון שנצבר והכלים שהתווספו תורגמו לתהליך סדור ומובנה שקיבל בשלב מאוחר יותר את השם ח.מ.ל.ה (חיבור מעשי לאור הנשמה). תהליך שבעקבותיו הפכה הקליניקה למרכז.',
    'באמצעות תהליכים אישיים, טיפולים, סדנאות ולמידה, המרכז בא לחבר בין העולם הפנימי לבין החיים בפועל.',
    'אנחנו לא מבטיחים דרך אחת או פתרון שמתאים לכולם. אנחנו מאמינים שלכל אדם יש את הדרך הייחודית שלו, ושלעיתים כל מה שנדרש הוא מרחב נכון, הכוונה וכלים שיאפשרו לו לראות את הדברים קצת אחרת.',
  ],
} as const;

/** A lecture participant's testimony, shown in the video strip and on the lectures page. */
export const testimonialVideo = {
  key: 'testimonial',
  type: 'file',
  src: '/video-testimonial.mp4',
  title: 'עדות של משתתפת בהרצאה של לילך הרשקוביץ',
  caption: 'עדות אישית',
  // Filmed upright on a phone, so a 16:9 box crops away her face.
  portrait: true,
} as const;

/** Homepage video strip. Local files live in /public. */
export const homeVideos = [
  {
    key: 'interview',
    type: 'youtube',
    id: 'xYE23kheCsc',
    title: 'מתקשרות מדברות: שיחה עם המתקשרת לילך הרשקוביץ',
    caption: 'ראיון',
  },
  {
    key: 'press',
    type: 'file',
    src: '/press-feature.mp4',
    title: "קטע מתוך ראיון של צוות הפודקאסט 'מתים עליהם'",
    caption: 'פודקאסט',
  },
  testimonialVideo,
] as const;

/* --------------------------------------------------------- online course --- */

/**
 * The lessons of the digital course "האמת הפשוטה", carried over from the
 * password-protected "קורס אינטרנטי" page of the WordPress site. The shop card
 * of the matching product gets a "לצפייה" button that leads here.
 */
export const onlineCourse = {
  href: '/online-course',
  title: 'קורס אינטרנטי',
  courseName: 'האמת הפשוטה',
  /** Matched against the CMS product title to decide which card gets the button. */
  productMatch: 'האמת הפשוטה',
  lessons: [
    { id: 'l2ndDah7QU0', label: 'שיעור 1, 2' },
    { id: 'PkENxvOBDpM', label: 'שיעור 3' },
    { id: 'G19EnJuA_F4', label: 'שיעור 4' },
    { id: 'PUJrv2O9xWA', label: 'שיעור 5, 6' },
    { id: 'el6XcmMThRY', label: 'שיעור 7' },
    { id: 'bcz87U7D92g', label: 'שיעור 8' },
    { id: 'VgIBAmvvnbI', label: 'שיעור 9' },
    { id: 'FGqpGGdgL7c', label: 'שיעור 10: חניכה' },
    { id: 'QauntcHFS64', label: 'שיעור 11' },
    { id: 'St3uoAMbFOM', label: 'שיעור 12, 13' },
    { id: 'mgNrLcFfonA', label: 'שיעור 14' },
    { id: 'f4foRWGnndA', label: 'שיעור 15' },
  ],
} as const;

/* ----------------------------------------------------------------- media --- */

export const podcast = {
  eyebrow: 'פרק מיוחד • טיפול אישי מצולם',
  title: 'המטפלת שאין לה מקום ביומן',
  attribution: 'לילך הרשקוביץ',
  body:
    'מפגש כן ואותנטי עם לילך: שיחה על שיטת הטיפול, ולאחריה טיפול אישי עמוק שתועד במלואו. פרק על בהירות, דיוק והיכולת לצאת לדרך בתחושה חדשה.',
  youtube: 'https://www.youtube.com/watch?v=6yXCIoVQCLE',
  spotify: 'https://open.spotify.com/episode/0ZKpGybJ9dzGUw4gchxq6g',
} as const;

/** Second podcast appearance, linked from the press page. */
export const podcastChaya = {
  title: 'פודקאסט חיה אמאקשב',
  body: 'שיחה נוספת עם לילך על תקשור, תת־מודע והדרך שבה אנשים פוגשים את עצמם מחדש.',
  youtubeId: 'e2XQxRV0jFo',
  href: 'https://www.youtube.com/watch?v=e2XQxRV0jFo',
} as const;

/** Feedback collected after the Carmia evening, 6.1.25. */
export const carmiaLecture = {
  title: 'הרצאה וטיפול: ערב נשות כרמיה',
  date: '6.1.25',
  src: '/lecture-and-therapy.mp4',
  quotes: [
    'תודה על ערב מטורף אתמול, היה פשוט מדהים',
    'היה ערב מדהים, מחזק, וכמה אנרגיות טובות יש לנו נשות כרמיה, תודה!',
    'אמאל׳ה, זה בדיוק מה שהייתי צריכה בקטע משוגע.',
    'ברגע שיניתי תפיסה בראש על מלא דברים.',
    'המון תודה על ערב מוצלח ביותר ♥️',
    'אני רוצה עוד ממנה!',
    'פגשתי את אלוהים מאז ההרצאה, התחילו לי כל מיני התגלויות ומסרים, הכרתי עולם חדש.',
  ],
} as const;

/** Print coverage held in /public. */
export const pressClippings = [
  {
    src: '/press-magie-de-la-guerison.webp',
    title: 'La Magie de la Guérison',
    caption: 'כתבה בצרפתית על שיטת הטיפול של לילך הרשקוביץ',
  },
] as const;
