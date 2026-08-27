'use client';

import { useId, useState } from 'react';

import SelectField from './SelectField';
import { interestOptions } from '@/lib/site';

type Status = 'idle' | 'sending' | 'sent' | 'error';

interface Props {
  /** Which page the lead came from, stored on the CMS record. */
  sourcePage: string;
  /** Pre-selects the subject, e.g. when embedded on a course page. */
  defaultInterest?: string;
  /** Adds a free-text message field. */
  withMessage?: boolean;
  submitLabel?: string;
  note?: string;
}

export default function LeadForm({
  sourcePage,
  defaultInterest = '',
  withMessage = false,
  submitLabel = 'שליחת הפרטים',
  note = 'הפרטים נשמרים בדיסקרטיות מלאה.',
}: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');
  const formId = useId();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const fullName = String(data.get('fullName') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();

    if (fullName.length < 2) {
      setStatus('error');
      setError('אנא הזינו שם מלא.');
      return;
    }
    if (!phone && !email) {
      setStatus('error');
      setError('אנא השאירו טלפון או אימייל כדי שנוכל לחזור אליכם.');
      return;
    }

    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          interest: String(data.get('interest') ?? ''),
          message: String(data.get('message') ?? ''),
          sourcePage,
          // Honeypot: bots fill hidden fields, humans leave them empty.
          company: String(data.get('company') ?? ''),
        }),
      });

      const payload = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setStatus('error');
        setError(payload.error ?? 'שליחת הפרטים נכשלה. אנא נסו שוב או התקשרו אלינו.');
        return;
      }

      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
      setError('לא הצלחנו להתחבר לשרת. אנא בדקו את החיבור ונסו שוב.');
    }
  }

  if (status === 'sent') {
    return (
      <form className="leadForm" onSubmit={(e) => e.preventDefault()} aria-live="polite">
        <div className="formSuccess" role="status">
          <span aria-hidden="true">✦</span>
          <strong>הפרטים נשלחו בהצלחה</strong>
          <p>תודה! נחזור אליכם בהקדם לשיחה אישית ונעימה.</p>
          <button type="button" className="formReset" onClick={() => setStatus('idle')}>
            שליחת פנייה נוספת
          </button>
        </div>
      </form>
    );
  }

  const busy = status === 'sending';

  return (
    <form className="leadForm" onSubmit={onSubmit} noValidate>
      <label htmlFor={`${formId}-name`}>
        שם מלא
        <input
          id={`${formId}-name`}
          name="fullName"
          placeholder="איך קוראים לך?"
          autoComplete="name"
          required
          disabled={busy}
        />
      </label>

      <label htmlFor={`${formId}-phone`}>
        טלפון
        <input
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          dir="rtl"
          placeholder="המספר שלך"
          autoComplete="tel"
          disabled={busy}
        />
      </label>

      <label htmlFor={`${formId}-email`}>
        אימייל
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          inputMode="email"
          placeholder="כדי שנוכל לשלוח פרטים"
          autoComplete="email"
          disabled={busy}
        />
      </label>

      <SelectField
        name="interest"
        label="במה נוכל לעזור?"
        options={interestOptions}
        defaultValue={defaultInterest}
        disabled={busy}
      />

      {withMessage ? (
        <label htmlFor={`${formId}-message`}>
          הודעה
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={4}
            placeholder="ספרו לנו במה תרצו שנעזור"
            disabled={busy}
          />
        </label>
      ) : null}

      {/* Honeypot — visually hidden, never shown to real users. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${formId}-company`}>אין למלא</label>
        <input id={`${formId}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" disabled={busy}>
        {busy ? 'שולח…' : submitLabel}
      </button>

      {status === 'error' && error ? (
        <p className="formError" role="alert">
          {error}
        </p>
      ) : null}

      <small>{note}</small>
    </form>
  );
}
