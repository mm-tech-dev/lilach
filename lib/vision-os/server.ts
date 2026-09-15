/**
 * Server-only Vision OS CMS client.
 *
 * Never import this from a Client Component: it carries the `vos_*` API key.
 * All content reads happen here or in Route Handlers (BFF pattern).
 */
import 'server-only';

import type {
  CourseRow,
  LeadInput,
  MediaRow,
  ProductRow,
  ResolvedImage,
  ReviewRow,
  ServiceRow,
  TreatmentRow,
} from './types';

const API_URL = process.env.VISION_OS_API_URL ?? 'https://morevision.co.il/api';
const API_KEY = process.env.VISION_OS_API_KEY;
const PROJECT_ID = process.env.VISION_OS_PROJECT_ID;

/** Seconds before cached CMS reads are refreshed. Keeps edits visible quickly. */
const REVALIDATE = 60;

function base(): string {
  if (!PROJECT_ID) throw new Error('VISION_OS_PROJECT_ID is not set');
  return `${API_URL}/projects/${PROJECT_ID}`;
}

function authHeaders(): Record<string, string> {
  if (!API_KEY) throw new Error('VISION_OS_API_KEY is not set');
  return { Authorization: `Bearer ${API_KEY}` };
}

/** True when CMS credentials are present, so pages can fall back gracefully. */
export function cmsConfigured(): boolean {
  return Boolean(API_KEY && PROJECT_ID);
}

function unwrap<T>(payload: unknown): T | null {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return (payload as T) ?? null;
}

/**
 * Reads a published collection. Returns [] on any failure so a CMS outage
 * degrades the page instead of breaking the whole render.
 */
async function list<T>(entity: string, limit = 100): Promise<T[]> {
  if (!cmsConfigured()) return [];
  try {
    const res = await fetch(`${base()}/content/${entity}?limit=${limit}`, {
      headers: authHeaders(),
      next: { revalidate: REVALIDATE, tags: [`cms:${entity}`] },
    });
    if (!res.ok) {
      console.error(`[vision-os] GET ${entity} failed: ${res.status}`);
      return [];
    }
    const rows = unwrap<T[]>(await res.json());
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    console.error(`[vision-os] GET ${entity} threw`, err);
    return [];
  }
}

function num(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

/** CMS sort: explicit sort_order first, then title, so output is stable. */
function bySortOrder<T extends { sort_order?: unknown; title?: string; author_name?: string }>(
  a: T,
  b: T,
): number {
  const av = num(a.sort_order) ?? Number.MAX_SAFE_INTEGER;
  const bv = num(b.sort_order) ?? Number.MAX_SAFE_INTEGER;
  if (av !== bv) return av - bv;
  const an = a.title ?? a.author_name ?? '';
  const bn = b.title ?? b.author_name ?? '';
  return an.localeCompare(bn, 'he');
}

function isLive(row: { status?: string; is_active?: boolean | null }): boolean {
  const active = row.is_active ?? true;
  return row.status === 'published' && active !== false;
}

export async function getServices(): Promise<ServiceRow[]> {
  const rows = await list<ServiceRow>('services');
  return rows.filter(isLive).sort(bySortOrder);
}

export async function getService(slug: string): Promise<ServiceRow | null> {
  const rows = await getServices();
  return rows.find((r) => r.slug === slug) ?? null;
}

export async function getCourses(): Promise<CourseRow[]> {
  const rows = await list<CourseRow>('courses');
  return rows.filter(isLive).sort(bySortOrder);
}

export async function getCourse(slug: string): Promise<CourseRow | null> {
  const rows = await getCourses();
  return rows.find((r) => r.slug === slug) ?? null;
}

/** Courses flagged for the scrolling announcement bar. */
export async function getTickerCourses(): Promise<CourseRow[]> {
  const rows = await getCourses();
  const flagged = rows.filter((r) => r.show_in_ticker);
  return flagged.length > 0 ? flagged : rows.slice(0, 4);
}

export async function getReviews(): Promise<ReviewRow[]> {
  const rows = await list<ReviewRow>('reviews');
  return rows.filter(isLive).sort(bySortOrder);
}

/** The homepage shows three; falls back to the first three if none are flagged. */
export async function getFeaturedReviews(count = 3): Promise<ReviewRow[]> {
  const rows = await getReviews();
  const featured = rows.filter((r) => r.is_featured);
  return (featured.length > 0 ? featured : rows).slice(0, count);
}

export async function getTreatments(): Promise<TreatmentRow[]> {
  const rows = await list<TreatmentRow>('treatments');
  return rows.filter(isLive).sort(bySortOrder);
}

export async function getProducts(): Promise<ProductRow[]> {
  const rows = await list<ProductRow>('products');
  return rows.filter(isLive).sort(bySortOrder);
}

export async function getProduct(slug: string): Promise<ProductRow | null> {
  const rows = await getProducts();
  return rows.find((r) => r.slug === slug) ?? null;
}

/* ---------------------------------------------------------------- media --- */

/**
 * Media fields store UUIDs, so each has to be exchanged for a public URL.
 * Cached per id; failures resolve to null and the caller omits the image.
 */
export async function resolveMedia(
  id: string | null | undefined,
  fallbackAlt = '',
): Promise<ResolvedImage | null> {
  if (!id || !cmsConfigured()) return null;
  try {
    const res = await fetch(`${base()}/media/${id}`, {
      headers: authHeaders(),
      next: { revalidate: 3600, tags: ['cms:media'] },
    });
    if (!res.ok) return null;
    const row = unwrap<MediaRow>(await res.json());
    if (!row) return null;
    const url = row.publicUrl ?? row.public_url ?? row.url ?? null;
    if (!url) return null;
    return { url, alt: row.alt || fallbackAlt, width: row.width, height: row.height };
  } catch {
    return null;
  }
}

/** Resolves many media ids at once, de-duplicating repeated ids. */
export async function resolveMediaMap(
  ids: (string | null | undefined)[],
): Promise<Map<string, ResolvedImage>> {
  const unique = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  const entries = await Promise.all(
    unique.map(async (id) => [id, await resolveMedia(id)] as const),
  );
  const map = new Map<string, ResolvedImage>();
  for (const [id, img] of entries) if (img) map.set(id, img);
  return map;
}

/* ---------------------------------------------------------------- leads --- */

export interface LeadResult {
  saved: boolean;
  emailed: boolean;
  leadId?: string;
  error?: string;
}

/** Writes a form submission into the `leads` collection and publishes it. */
export async function createLead(input: LeadInput): Promise<{ id: string } | null> {
  if (!cmsConfigured()) return null;
  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const namePart =
    input.fullName
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'lead';

  const body: Record<string, unknown> = {
    slug: `${namePart}-${stamp}`,
    full_name: input.fullName,
    phone: input.phone || null,
    email: input.email || null,
    interest: input.interest || null,
    interest_detail: input.interestDetail || null,
    message_text: input.message ? `<p>${escapeHtml(input.message)}</p>` : null,
    source_page: input.sourcePage || null,
    lead_status: 'חדש',
    submitted_at: now.toISOString().slice(0, 10),
  };

  const res = await fetch(`${base()}/content/leads`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('[vision-os] createLead failed', res.status, await safeText(res));
    return null;
  }

  const row = unwrap<{ id: string }>(await res.json());
  if (!row?.id) return null;

  // Publish so the lead is visible in the CMS list view, not stuck in draft.
  await fetch(`${base()}/content/leads/${row.id}/publish`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: '{}',
    cache: 'no-store',
  }).catch(() => undefined);

  return { id: row.id };
}

/** Sends mail through the project's own SMTP configured in Vision OS. */
export async function sendProjectEmail(mail: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<boolean> {
  if (!cmsConfigured()) return false;
  try {
    const res = await fetch(`${base()}/email/send`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: mail.to,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      }),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('[vision-os] email send failed', res.status, await safeText(res));
      return false;
    }
    const payload = (await res.json()) as { log?: { status?: string } };
    return payload?.log?.status === 'sent';
  } catch (err) {
    console.error('[vision-os] email send threw', err);
    return false;
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 400);
  } catch {
    return '<unreadable>';
  }
}

export { num as toNumber };
