'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  COURSE_COOKIE,
  COURSE_COOKIE_MAX_AGE,
  accessToken,
  passwordMatches,
} from '@/lib/course-access';
import { onlineCourse } from '@/lib/site';

export interface UnlockState {
  error: string | null;
}

export async function unlockCourse(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const attempt = String(formData.get('password') ?? '');
  const token = accessToken();
  if (!token || !passwordMatches(attempt)) {
    return { error: 'הסיסמה שגויה. נסו שוב, או פנו אלינו לקבלת הסיסמה.' };
  }

  (await cookies()).set(COURSE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: onlineCourse.href,
    maxAge: COURSE_COOKIE_MAX_AGE,
  });
  redirect(onlineCourse.href);
}
