// Hebrew strings for the accessibility widget (Hebrew-only site).
export type A11yStrings = {
  title: string;
  close: string;
  reset: string;
  statement: string;
  openMenu: string;
  sections: { content: string; color: string; navigation: string };
  features: Record<string, string>;
};

export const A11Y_T: A11yStrings = {
  title: "תפריט נגישות",
  close: "סגירה",
  reset: "איפוס הגדרות",
  statement: "הצהרת נגישות",
  openMenu: "פתיחת תפריט נגישות",
  sections: {
    content: "התאמות תוכן",
    color: "התאמות צבע",
    navigation: "כלי ניווט",
  },
  features: {
    fontSize: "גודל גופן",
    pageZoom: "הגדלת תצוגה",
    highlightTitles: "הדגשת כותרות",
    highlightLinks: "הדגשת קישורים",
    dyslexicFont: "גופן לדיסלקציה",
    letterSpacing: "ריווח אותיות",
    lineHeight: "גובה שורה",
    fontWeight: "הדגשת טקסט",
    alignLeft: "יישור לשמאל",
    readingMode: "מצב קריאה",
    imageAlt: "תיאור תמונות",
    dark: "ניגודיות כהה",
    light: "ניגודיות בהירה",
    highContrast: "ניגודיות גבוהה",
    highSaturation: "רוויה גבוהה",
    lowSaturation: "רוויה נמוכה",
    monochrome: "גווני אפור",
    sepia: "ספיה",
    yellowBlack: "צהוב על שחור",
    invert: "היפוך צבעים",
    readingGuide: "מדריך קריאה",
    stopAnimations: "עצירת אנימציות",
    bigCursor: "סמן גדול",
    keyboardNav: "ניווט מקלדת",
    blackCursor: "סמן שחור",
  },
};
