import type { MetadataRoute } from 'next';

import { site } from '@/lib/site';
import { getCourses, getServices } from '@/lib/vision-os/server';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, courses] = await Promise.all([getServices(), getCourses()]);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/courses`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${site.url}/products`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    {
      url: `${site.url}/testimonials`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${site.url}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    {
      url: `${site.url}/accessibility`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  return [
    ...staticPages,
    ...services.map((s) => ({
      url: `${site.url}/services/${s.slug}`,
      lastModified: new Date(s.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...courses.map((c) => ({
      url: `${site.url}/courses/${c.slug}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
