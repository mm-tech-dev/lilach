/**
 * Server-only mail sending.
 *
 * Primary path is the project's own SMTP, configured through the SMTP_* env
 * vars. If those are not set — or the send fails — it falls back to the Vision
 * OS project mailer so a form submission is never lost silently.
 */
import 'server-only';

import nodemailer, { type Transporter } from 'nodemailer';

import { sendProjectEmail } from './vision-os/server';

/** Strips quotes that survive when a value is quoted inside .env. */
function env(key: string): string {
  const raw = process.env[key];
  if (!raw) return '';
  return raw.trim().replace(/^["']|["']$/g, '');
}

export interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

/** Returns the configured SMTP settings, or null when sending is disabled. */
export function smtpSettings(): SmtpSettings | null {
  const host = env('SMTP_HOST');
  // An empty host intentionally disables direct sending (see .env.example).
  if (!host) return null;

  const port = Number(env('SMTP_PORT')) || 587;
  const user = env('SMTP_USER');
  const pass = env('SMTP_PASS');
  const rawSecure = env('SMTP_SECURE').toLowerCase();

  return {
    host,
    port,
    // Port 465 is implicit TLS; 587 upgrades via STARTTLS.
    secure: rawSecure ? rawSecure === 'true' || rawSecure === '1' : port === 465,
    user,
    pass,
    from: env('SMTP_FROM') || user,
  };
}

/**
 * Where lead notifications are delivered. Configured entirely through env so no
 * address is published in this repository; an empty result is treated as a
 * misconfiguration rather than falling back to a hard-coded inbox.
 */
export function notifyRecipients(): string[] {
  const list = [env('ADMIN_NOTIFY_EMAIL'), env('CONTACT_EMAIL')].filter(Boolean);
  return [...new Set(list)];
}

let cached: Transporter | null = null;
let cachedKey = '';

/** Transports are pooled and reused across requests. */
function transporter(settings: SmtpSettings): Transporter {
  const key = `${settings.host}:${settings.port}:${settings.secure}:${settings.user}`;
  if (cached && cachedKey === key) return cached;

  cached = nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: settings.user ? { user: settings.user, pass: settings.pass } : undefined,
    pool: true,
    maxConnections: 3,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
    // The host presents a shared certificate; STARTTLS is still negotiated.
    tls: { rejectUnauthorized: false },
  });
  cachedKey = key;
  return cached;
}

export interface Mail {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  /** Lets the recipient reply straight to the person who filled the form. */
  replyTo?: string;
}

export type MailChannel = 'smtp' | 'vision-os' | 'none';

export interface MailResult {
  sent: boolean;
  channel: MailChannel;
  error?: string;
}

/** Sends via SMTP, falling back to the Vision OS mailer on failure. */
export async function sendMail(mail: Mail): Promise<MailResult> {
  const recipients = Array.isArray(mail.to) ? mail.to : [mail.to];
  if (recipients.length === 0) {
    console.error('[mail] no recipient configured — set ADMIN_NOTIFY_EMAIL or CONTACT_EMAIL');
    return { sent: false, channel: 'none', error: 'no recipient configured' };
  }

  const settings = smtpSettings();

  if (settings) {
    try {
      const info = await transporter(settings).sendMail({
        from: settings.from,
        to: mail.to,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        replyTo: mail.replyTo,
      });
      console.info('[mail] sent via SMTP', { messageId: info.messageId });
      return { sent: true, channel: 'smtp' };
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      console.error('[mail] SMTP send failed, falling back to Vision OS', error);

      const viaCms = await sendProjectEmail(mail);
      return viaCms
        ? { sent: true, channel: 'vision-os' }
        : { sent: false, channel: 'none', error };
    }
  }

  // No SMTP configured — use the Vision OS project mailer.
  const viaCms = await sendProjectEmail(mail);
  return viaCms
    ? { sent: true, channel: 'vision-os' }
    : { sent: false, channel: 'none', error: 'no mail channel available' };
}
