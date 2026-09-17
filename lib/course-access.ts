/**
 * Password gate for the online course, mirroring the protected page of the
 * WordPress site. The password lives in ONLINE_COURSE_PASSWORD; while it is
 * unset the course stays locked for everyone.
 */
import 'server-only';

import { createHash, timingSafeEqual } from 'node:crypto';

export const COURSE_COOKIE = 'online_course_access';

/** How long one successful unlock is remembered: 180 days. */
export const COURSE_COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

function password(): string | null {
  return process.env.ONLINE_COURSE_PASSWORD?.trim() || null;
}

function digest(value: string): Buffer {
  return createHash('sha256').update(`online-course:${value}`).digest();
}

/**
 * The cookie holds a hash of the password rather than a flag, so changing the
 * password locks out everyone who unlocked with the old one.
 */
export function accessToken(): string | null {
  const pw = password();
  return pw ? digest(pw).toString('hex') : null;
}

export function passwordMatches(attempt: string): boolean {
  const pw = password();
  if (!pw || !attempt) return false;
  return timingSafeEqual(digest(attempt.trim()), digest(pw));
}

export function tokenValid(token: string | undefined): boolean {
  const expected = accessToken();
  if (!expected || !token || token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
