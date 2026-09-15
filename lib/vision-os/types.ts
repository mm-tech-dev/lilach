/** Shapes returned by the Vision OS dynamic-content API for this project. */

export type ContentStatus = 'draft' | 'published' | 'archived';

interface BaseRow {
  id: string;
  slug: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

/** Numeric CMS fields come back as decimal strings (e.g. "2900.00"). */
export type CmsNumber = number | string | null;

export interface ServiceRow extends BaseRow {
  title: string;
  description: string | null;
  icon_key: IconKey | null;
  full_description: string | null;
  image: string | null;
  /** When set, the service lives elsewhere and its card links out. */
  external_url: string | null;
  sort_order: CmsNumber;
  is_active: boolean | null;
}

export interface CourseRow extends BaseRow {
  title: string;
  event_type: string | null;
  date_label: string | null;
  start_date: string | null;
  summary: string | null;
  description: string | null;
  sessions: string | null;
  hours: string | null;
  location: string | null;
  price: CmsNumber;
  deposit: CmsNumber;
  max_participants: CmsNumber;
  prerequisites: string | null;
  image: string | null;
  /** Extra images; stored as a JSON array of media UUIDs. */
  gallery: string[] | string | null;
  /** External registration page, e.g. a Smoove landing page. */
  landing_url: string | null;
  show_in_ticker: boolean | null;
  sort_order: CmsNumber;
  is_active: boolean | null;
}

export interface ReviewRow extends BaseRow {
  author_name: string;
  body: string | null;
  rating: CmsNumber;
  initial: string | null;
  is_featured: boolean | null;
  sort_order: CmsNumber;
  is_active: boolean | null;
}

export interface ProductRow extends BaseRow {
  title: string;
  description: string | null;
  full_description: string | null;
  price: CmsNumber;
  image: string | null;
  sort_order: CmsNumber;
  is_active: boolean | null;
}

export interface MediaRow {
  id: string;
  filename: string;
  mimeType: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  publicUrl?: string | null;
  public_url?: string | null;
  url?: string | null;
}

export type IconKey = 'lectures' | 'workshops' | 'therapy' | 'courses' | 'shop';

/** A media reference already resolved to a URL the browser can load. */
export interface ResolvedImage {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface LeadInput {
  fullName: string;
  phone?: string;
  email?: string;
  interest?: string;
  message?: string;
  sourcePage?: string;
}
