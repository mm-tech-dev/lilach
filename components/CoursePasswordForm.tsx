'use client';

import { useActionState } from 'react';

import { unlockCourse, type UnlockState } from '@/app/online-course/actions';

const initial: UnlockState = { error: null };

/** The password prompt shown in front of the online course lessons. */
export default function CoursePasswordForm() {
  const [state, action, pending] = useActionState(unlockCourse, initial);

  return (
    <form className="leadForm" action={action}>
      <label htmlFor="course-password">
        סיסמה
        <input
          id="course-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
        />
      </label>

      <button type="submit" disabled={pending}>
        {pending ? 'בודק…' : 'כניסה לקורס'}
      </button>

      {state.error ? (
        <p className="formError" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
