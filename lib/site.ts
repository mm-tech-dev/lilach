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
    'המרכז להפצת אור — תהליכים רגשיים, אנרגטיים ותודעתיים לחיבור פנימי. קורסי תקשור, סדנאות, הרצאות וטיפול אישי בהנחיית לילך הרשקוביץ.',
  url: 'https://spreadthelight.co.il',
  locale: 'he_IL',
} as const;

export const contact = {
  phoneDisplay: '054-5931208',
  phoneHref: 'tel:+972545931208',
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

export const podcast = {
  eyebrow: 'פרק מיוחד • טיפול אישי מצולם',
  title: ['“המטפלת שאין לה', 'מקום ביומן”'],
  body:
    'מפגש כן ואותנטי עם לילך: שיחה על שיטת הטיפול, ולאחריה טיפול אישי עמוק שתועד במלואו. פרק על בהירות, דיוק והיכולת לצאת לדרך בתחושה חדשה.',
  youtube: 'https://www.youtube.com/watch?v=6yXCIoVQCLE',
  spotify: 'https://open.spotify.com/episode/0ZKpGybJ9dzGUw4gchxq6g',
} as const;

export const nav = [
  { href: '/about', label: 'אודות' },
  { href: '/services', label: 'שירותי המרכז' },
  { href: '/courses', label: 'קורסים' },
  { href: '/products', label: 'מוצרים' },
  { href: '/testimonials', label: 'מה מספרים' },
] as const;

export const footerNav = [
  { href: '/about', label: 'אודות' },
  { href: '/services', label: 'שירותי המרכז' },
  { href: '/courses', label: 'קורסים וסדנאות' },
  { href: '/products', label: 'מוצרים' },
  { href: '/contact', label: 'צור קשר' },
] as const;

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
