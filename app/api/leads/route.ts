import { NextResponse } from 'next/server';

import { createLead, escapeHtml } from '@/lib/vision-os/server';
import { notifyRecipients, sendMail } from '@/lib/mailer';
import { contact, interestOptions, site } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Simple in-memory throttle: 5 submissions per IP per 10 minutes. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // crude bound on memory growth
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function clamp(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(req: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'בקשה לא תקינה.' }, { status: 400 });
  }

  // Honeypot filled => silently accept so bots do not learn they were blocked.
  if (clamp(payload.company, 100)) {
    return NextResponse.json({ ok: true });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: 'נשלחו יותר מדי פניות. אנא נסו שוב בעוד מספר דקות או התקשרו אלינו.' },
      { status: 429 },
    );
  }

  const fullName = clamp(payload.fullName, 120);
  const phone = clamp(payload.phone, 40);
  const email = clamp(payload.email, 160);
  const rawInterest = clamp(payload.interest, 120);
  const category = clamp(payload.category, 60);
  const message = clamp(payload.message, 4000);
  const sourcePage = clamp(payload.sourcePage, 200) || '/';

  if (fullName.length < 2) {
    return NextResponse.json({ error: 'אנא הזינו שם מלא.' }, { status: 400 });
  }
  if (!phone && !email) {
    return NextResponse.json(
      { error: 'אנא השאירו טלפון או אימייל כדי שנוכל לחזור אליכם.' },
      { status: 400 },
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'כתובת האימייל אינה תקינה.' }, { status: 400 });
  }

  // `interest` in the CMS is an enumeration of categories. Pages offer their own
  // options (a treatment, a course, a lecture), so a specific choice is kept
  // beside it and the category comes from the page it was sent from.
  const categories = interestOptions as readonly string[];
  const interest = categories.includes(rawInterest)
    ? rawInterest
    : categories.includes(category)
      ? category
      : '';
  const interestDetail = rawInterest && rawInterest !== interest ? rawInterest : '';

  const lead = await createLead({
    fullName,
    phone,
    email,
    interest,
    interestDetail,
    message,
    sourcePage,
  });

  if (!lead) {
    // Nothing was stored, so tell the visitor to call rather than pretend success.
    return NextResponse.json(
      {
        error: `שמירת הפנייה נכשלה. אנא התקשרו אלינו: ${contact.phoneDisplay}`,
      },
      { status: 502 },
    );
  }

  const mail = await sendMail({
    to: notifyRecipients(),
    subject: `פנייה חדשה מהאתר: ${fullName}`,
    html: notificationHtml({ fullName, phone, email, interest, interestDetail, message, sourcePage }),
    text: notificationText({ fullName, phone, email, interest, interestDetail, message, sourcePage }),
    // Replying to the notification answers the visitor directly.
    replyTo: email || undefined,
  });

  if (!mail.sent) {
    // The lead is safe in the CMS; log for follow-up but do not fail the visitor.
    console.error('[leads] saved to CMS but email notification failed', {
      leadId: lead.id,
      error: mail.error,
    });
  }

  return NextResponse.json({ ok: true, saved: true, emailed: mail.sent, via: mail.channel });
}

interface Notification {
  fullName: string;
  phone: string;
  email: string;
  interest: string;
  interestDetail: string;
  message: string;
  sourcePage: string;
}

function notificationHtml(n: Notification): string {
  const row = (label: string, value: string) =>
    value
      ? `<tr>
           <td style="padding:8px 14px;background:#fff9f0;font-weight:600;white-space:nowrap">${escapeHtml(label)}</td>
           <td style="padding:8px 14px">${escapeHtml(value).replace(/\n/g, '<br>')}</td>
         </tr>`
      : '';

  return `<div dir="rtl" style="font-family:Assistant,Arial,sans-serif;color:#634b78;max-width:640px">
  <h2 style="margin:0 0 6px">פנייה חדשה מאתר ${escapeHtml(site.name)}</h2>
  <p style="margin:0 0 18px;color:#655b58">הפנייה נשמרה גם ב-Vision OS תחת האוסף «leads».</p>
  <table style="border-collapse:collapse;width:100%;border:1px solid #dccef4">
    ${row('שם מלא', n.fullName)}
    ${row('טלפון', n.phone)}
    ${row('אימייל', n.email)}
    ${row('תחום', n.interest)}
    ${row('נושא', n.interestDetail)}
    ${row('הודעה', n.message)}
    ${row('עמוד מקור', n.sourcePage)}
    ${row('התקבל בתאריך', new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }))}
  </table>
  ${
    n.phone
      ? `<p style="margin:18px 0 0"><a href="tel:${escapeHtml(n.phone.replace(/[^\d+]/g, ''))}" style="color:#634b78">חיוג ל${escapeHtml(n.phone)}</a></p>`
      : ''
  }
</div>`;
}

function notificationText(n: Notification): string {
  return [
    `פנייה חדשה מאתר ${site.name}`,
    `שם מלא: ${n.fullName}`,
    n.phone ? `טלפון: ${n.phone}` : '',
    n.email ? `אימייל: ${n.email}` : '',
    n.interest ? `תחום: ${n.interest}` : '',
    n.interestDetail ? `נושא: ${n.interestDetail}` : '',
    n.message ? `הודעה: ${n.message}` : '',
    `עמוד מקור: ${n.sourcePage}`,
    `התקבל: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join('\n');
}
