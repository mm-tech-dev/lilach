import type { Metadata, Viewport } from 'next';
import { Assistant } from 'next/font/google';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Topline from '@/components/Topline';
import { site } from '@/lib/site';

import './globals.css';
import './additions.css';

const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-assistant',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    'המרכז להפצת אור',
    'לילך הרשקוביץ',
    'קורס תקשור',
    'תקשור פרקטי',
    'סדנאות רוחניות',
    'הכשרת מטפלים',
    'שיטת ח.מ.ל.ה',
    'טיפול בתת מודע',
  ],
  authors: [{ name: site.owner }],
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#634b78',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={assistant.variable}>
      <body>
        <a className="skipLink" href="#main">
          דלג לתוכן
        </a>
        <main dir="rtl">
          <Topline />
          <Header />
          <div id="main">{children}</div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
