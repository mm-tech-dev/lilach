import type { MetadataRoute } from 'next';

import { site } from '@/lib/site';
import { getCourses, getServices } from '@/lib/vision-os/server';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [services, courses] = await Promise.all([getServices(), getCourses()]);

  const pages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/media`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site.url}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    {
      url: `${site.url}/accessibility`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  for (const s of services) {
    pages.push({
      url: `${site.url}/services/${s.slug}`,
      lastModified: new Date(s.updated_at ?? now),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  for (const c of courses) {
    pages.push({
      url: `${site.url}/courses/${c.slug}`,
      lastModified: new Date(c.updated_at ?? now),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  return pages;
}
