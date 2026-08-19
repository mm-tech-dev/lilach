import type { CmsNumber } from './vision-os/types';

/** CMS numbers arrive as decimal strings ("2900.00"); normalise them. */
export function toNumber(value: CmsNumber | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

/** "2,900 ₪" — omitted entirely when no price is set. */
export function formatPrice(value: CmsNumber | undefined): string | null {
  const n = toNumber(value);
  if (n === null || n <= 0) return null;
  return `${n.toLocaleString('he-IL', { maximumFractionDigits: 0 })} ₪`;
}

export function formatCount(value: CmsNumber | undefined): string | null {
  const n = toNumber(value);
  return n === null ? null : String(n);
}
