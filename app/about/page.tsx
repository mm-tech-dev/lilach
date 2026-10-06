import type { Metadata } from 'next';
import Image from 'next/image';

import CtaStrip from '@/components/CtaStrip';
import ExpandableText from '@/components/ExpandableText';
import LilachBio from '@/components/LilachBio';
import LilachGallery from '@/components/LilachGallery';
import PageHead from '@/components/PageHead';
import ReviewWall from '@/components/ReviewWall';
import { site } from '@/lib/site';
import { getReviews } from '@/lib/vision-os/server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'להכיר את צוות המרכז',
  description:
    'לילך הרשקוביץ, אסף הרשקוביץ, אורית ידעי, גילי כץ ושני הבדלה: הצוות של המרכז להפצת אור, ומה מספרים בוגרי הקורסים.',
  alternates: { canonical: '/about' },
};

const LILACH_HE = [
  'לילך הרשקוביץ, נשואה לאסף ואמא למיכאלה ואופיר. עומדת בראש מרכז מ.ל.א (המרכז להפצת אור), מייסדת שיטת ח.מ.ל.ה (חיבור מעשי לאור הנשמה), מורה לתקשור ומטפלת ברובד תת המודע.',
  'כבר מגיל צעיר הרגשתי שיש הרבה מעבר ליכולת לחוות את החיים במלואם רק דרך חמשת החושים, אבל רק מאוחר יותר התחלתי להעמיק בעולם הרוח. למדתי רייקי, הילינג וטארוט, והרחבתי את הידע התיאורטי והמעשי במקביל לעבודתי בתחום הרכש והקניינות. הייתי מנהלת יבוא בחברות גדולות מאוד.',
  'אהבתי מאוד את העיסוק שלי, אבל בפנים הרגשתי חוסר שקט. משהו חסר לי מאוד ולא הצלחתי להבין מה. לא ידעתי להגיד למה אני מרגישה שאני לא מגשימה את עצמי. השאלות האלה הלכו והתעצמו, וידעתי שאני צריכה לעשות משהו אחר, למרות שעוד לא הייתה לי תשובה ברורה.',
  'אחרי הלידה של הבן השני שלי הבעבוע הפנימי הלך וגדל, ולמרות שמאוד אהבתי את העיסוק שלי הקריאה הפנימית הלכה והתגברה עד שהבנתי שאני צריכה לעשות משהו אחר. התשובה לשאלה הגיעה לאחר צפייה בתוכנית אירוח שבה התארחה נירית שפירא, מנטורית בכירה לריפוי ומטפלת בשיטה שנקראת ״איזון חיים״. כשראיתי אותה מדגימה עבודה עם שריר הגוף דרך היד (קינסיולוגיה) הבנתי שמצאתי את מה שהיה חסר לי: הפן הפרקטי שמקשר את התחושות למשהו פיזי ומוחשי שניתן להרגיש.',
  'ביקשתי לחוות את הטיפול באופן אישי ונדהמתי מהדיוק הגבוה של אותה שיטה, לגלות דרך היד את אותם מקומות ואותן נקודות שדרשו אצלי ריפוי. היכולת לגלות דרך הזיכרון של הגוף את הפתרון המתבקש (ולא כזה שסופק על ידי המטפלת אלא על ידי) גרמה לי להבין שישנה דרך שמחברת בין גוף לנשמה, בין חומר לרוח, ודרכה ניתן לפרש גם את התוכנית הנשמתית שאיתה ירדנו לכאן.',
  'בעקבות הטיפול קיבלתי שתי החלטות חשובות: הלכתי ללמוד את השיטה והתפטרתי מהעבודה. למרות אי־ודאות כלכלית באותה תקופה הייתי נחושה לצאת לדרך חדשה של טיפול וייעוץ, ואני עוסקת בכך למעלה מ־12 שנים, כשמאחורי אלפי שעות טיפול ומאות מטופלים.',
  'בשנים האחרונות אני מרגישה רצון עז להעביר את הידע שרכשתי דרך שיטה שפיתחתי לעבודה עם תת המודע, המאפשרת דרך תשאול להגיע לשורש או למקור הבעיה ולטפל בה. היתרון של השיטה הוא ביכולת להגיע תוך זמן קצר יחסית למה שמעכב אותנו, ולעבוד על כך באופן ממוקד ומדויק, במקום טיפול שנמשך שנים.',
  'אני מגשימה את עצמי דרך הטיפולים, הסדנאות והקורסים, ועוזרת לאנשים להתחבר למי שהם ולהגשים את עצמם. זה שווה הכול מבחינתי, ואני בהוקרת תודה ענקית על כך ועל השליחות שלקחתי על עצמי בחיים האלה.',
];

const LILACH_EN = [
  'Lilah Hershkovitz is married to Asaf and mother of Michaela and Ofir. She heads the Spread the Light centre, founded the H.M.L.A method (a practical connection to the light of the soul), teaches channelling and works as a subconscious therapist.',
  'Since I was young, I knew that there is something far greater than the way we perceive the world through our five senses. Eighteen years ago I began my spiritual journey, taking courses in tarot reading and Reiki, and using what I learned to advise and treat people alongside a career that had nothing to do with the spiritual world: I worked as an import manager for a large Israeli company.',
  'Although I had a stable job, I felt an inner calling growing stronger to change direction.',
  "One day I came across a treatment method called 'Life Alignment' on a TV show, and I immediately knew this was the method I wanted to learn in order to help and heal others. It allowed me to connect the spiritual aspect with the practical, physical side.",
  "I went for a treatment to experience the method myself, and I was amazed at the simplicity and precision with which the physical body can provide so much accurate information about suppressed events, traumas, emotional states and energetic blockages. It was remarkable how the soul's journey could be decoded within the body.",
  'Following that treatment I began studying the method, and decided to leave my job despite the risk involved. But when the steps you take are right and aligned, the universe supports the process.',
  'One case that stands out, and that opened the way for me, was a friend suffering from a serious illness who was not working, which had led her into debt and financial crisis. I began questioning her body about the blockages preventing her from experiencing abundance, and then worked to open her channels of prosperity. Her medical condition improved, she returned to work, became financially independent, and her relationships improved significantly.',
  'That case made me realise I had found the right method. Since then I have been practising therapy and teaching courses, guiding those who come to me and are ready to receive tools to heal themselves and others, and to take responsibility for their own lives.',
  'I am not the solution; I help people remember their power to solve every problem on their own. Today I reach a wider audience out of a sense of mission and a desire to share this knowledge as widely as I can.',
];

const LILACH_GALLERY = [
  { src: '/lilach-portrait-outdoor.webp', alt: 'לילך הרשקוביץ יושבת בטבע' },
  { src: '/press-magie-de-la-guerison.webp', alt: 'כתבה בצרפתית על לילך הרשקוביץ' },
  { src: '/lilach-headshot.webp', alt: 'פורטרט של לילך הרשקוביץ' },
  { src: '/lilach-crater.webp', alt: 'לילך הרשקוביץ פורשת ידיים על רקע מכתש במדבר' },
];

const TEAM = [
  {
    name: 'אסף הרשקוביץ',
    role: 'רייקי מאסטר ומטפל',
    photo: { src: '/asaf-treating.webp', alt: 'אסף הרשקוביץ בטיפול' },
    paragraphs: [
      'ההיכרות הראשונית שלי עם עולם הרוח החלה בגיל מוקדם יחסית, כשהתחלתי לחוות חוויות שונות באופן אינטואיטיבי: ידעתי להגיד במדויק אילו מספרים יצאו בהטלת קובייה מספר פעמים ברציפות, מתי אגיע ליעד מסוים בדיוק של שניות, ואפילו חלמתי חלומות שאפשר להגדיר כחלומות נבואיים.',
      'הקפיצה המשמעותית הבאה שעשיתי קרתה כשהלכתי ללמוד קורס רייקי. די מהר התחברתי לעולם המדהים של אנרגיות ותדרים. הוקסמתי מהיכולת להרגיש אנרגיה בתוכי ולתעל אותה דרכי לאחרים, וברוב המקרים ניתן היה לראות שיפור פיזי מהיר ומשמעותי.',
      'בהמשך למדתי קורסים נוספים וכיום אני רייקי מאסטר. לאורך השנים למדתי שיטות נוספות וכלים המשמשים אותי במהלך הטיפולים, ביניהם שימוש בקלפים לעבודת עומק פנימית המאפשרת קבלת תובנות ומסרים.',
      'כיום אני משתמש בכל הידע, הכלים והניסיון שצברתי על מנת לעזור לאנשים לגלות את הכוחות והעוצמה שקיימת בתוכם, ולעזור להם לגדול ולהתפתח.',
    ],
  },
  {
    name: 'אורית ידעי',
    role: 'מטפלת בשיטת ח.מ.ל.ה מטעם המרכז',
    photo: { src: '/orit-yadai.jpg', alt: 'אורית ידעי, מטפלת במרכז להפצת אור' },
    paragraphs: [
      'אמא לקסם, בוגרת קורס תקשור וקורס הכשרת מטפלים, וכיום מטפלת מטעם המרכז בשיטת ח.מ.ל.ה.',
      '״למדתי תקשור אצל לילך, עברתי טרנספורמציה בחיים והחזרתי לעצמי את המושכות. הבנתי שאני הסמכות הבלעדית בחיי ואני יכולה לחלום ולהגשים. אני בן אדם של אנשים ומאמינה שכולנו נולדנו כדי להגשים את ייעודנו, כאשר הדרך מתבהרת להולכים בה.״',
    ],
  },
  {
    name: 'גילי כץ',
    role: 'מטפלת זוגית ומשפחתית ומטפלת בשיטת ח.מ.ל.ה',
    photo: { src: '/gili-katz.webp', alt: 'גילי כץ, מטפלת במרכז להפצת אור' },
    paragraphs: [
      'בעלת M.A בעבודה סוציאלית, מטפלת זוגית ומשפחתית מזה 25 שנה ומטפלת בשיטת ח.מ.ל.ה.',
      'אני מאמינה שהשינוי מתחיל ברגע שבו אנחנו מסכימות להסיר את הספק, לשחרר את הגבולות שיצרנו לעצמנו ולאפשר למה שנראה בלתי אפשרי להפוך לאפשרי.',
      'כשמסירים את הספק, האפשרויות נפתחות. ושם מתחיל הקסם.',
    ],
  },
  {
    name: 'שני הבדלה',
    role: 'מטפלת בשיטת ח.מ.ל.ה, ריפוי תודעתי ונומרולוגיה טיפולית',
    photo: { src: '/shani.webp', alt: 'שני הבדלה, מטפלת במרכז להפצת אור' },
    paragraphs: [
      '״כל עוד לא נהפוך את הלא מודע למודע, הוא ינחה את חיינו ואנחנו נקרא לו גורל״ (יונג)',
      'אם משהו בחיים שלך מבקש להשתנות, אני מזמינה אותך לעצור לרגע, להפנות את המבט פנימה.',
      'הרבה מהתשובות שאנחנו מחפשים כבר נמצאות בתוכנו מתחת להרגלים, לסיפורים ולפרשנויות שפיתחנו לאורך הדרך. לפעמים אנחנו פשוט צריכים דרך אחרת להקשיב להן.',
      'התפקיד שלי ליצור מרחב שמאפשר להתבונן אחרת במה שקורה, לזהות חיבורים חדשים, וליצור אפשרות לשינוי.',
      'אני מלווה אנשים בתהליכי שינוי, התפתחות וחיבור עמוק יותר לעצמם, באמצעות כלים מעולמות התת־מודע, התודעה והרוח.',
      'אני משלבת את שיטת ח.מ.ל.ה, ריפוי תודעתי, נומרולוגיה טיפולית, דימיון מודרך, מדיטציה ומיינדפולנס. אני מתאימה את הדרך לאדם ולמה שהוא מביא איתו למפגש.',
    ],
  },
];

export default async function AboutPage() {
  const reviews = await getReviews();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.owner,
    jobTitle: 'מטפלת ברובד תת המודע, מתקשרת ומורה לתקשור פרקטי',
    worksFor: { '@type': 'Organization', name: site.name, url: site.url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHead
        crumbs={[{ label: 'להכיר את צוות המרכז' }]}
        title="להכיר את"
        accent="צוות המרכז."
        lead="מאחורי כל תהליך עומדים אנשים. אלה האנשים שמלווים אתכם במרכז להפצת אור."
      />

      {/* ---------------------------------------------------------- לילך --- */}
      <section className="section wrap" style={{ paddingTop: 56 }}>
        <div className="bioGrid">
          <LilachGallery images={LILACH_GALLERY} />

          <div>
            <h2 className="bioName">
              לילך <span>הרשקוביץ.</span>
            </h2>
            <p className="bioRole">
              עומדת בראש מרכז מ.ל.א • מייסדת שיטת ח.מ.ל.ה • מורה לתקשור ומטפלת ברובד תת המודע
            </p>
            <LilachBio he={LILACH_HE} en={LILACH_EN} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- צוות --- */}
      <section className="section wrap" style={{ paddingTop: 0 }}>
        <div className="sectionHead">
          <h2>
            הצוות <span>שלנו.</span>
          </h2>
          <p>מטפלים שהוכשרו בשיטות המרכז ומלווים אתכם לאורך הדרך.</p>
        </div>

        <div className="teamGrid">
          {TEAM.map((member) => (
            <article key={member.name} className="teamCard">
              <div className="teamPhoto">
                <Image
                  src={member.photo.src}
                  alt={member.photo.alt}
                  width={800}
                  height={800}
                  sizes="(max-width: 700px) 90vw, 380px"
                />
              </div>
              <h3>{member.name}</h3>
              <p className="role">{member.role}</p>
              <ExpandableText paragraphs={member.paragraphs} lines={5} />
            </article>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------- מה אומרים --- */}
      <ReviewWall reviews={reviews} id="testimonials" />

      <CtaStrip
        title="רוצים להכיר לעומק?"
        body="השאירו פרטים ונחזור אליכם לשיחה אישית, נעימה וללא התחייבות."
      />
      <div style={{ height: 100 }} />
    </>
  );
}
