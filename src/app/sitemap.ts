import type { MetadataRoute } from 'next';
import { getAllTopics } from '@/lib/mdx';

const SITE_URL = 'https://conceptweave.edu.np';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const topics = await getAllTopics();

  const topicUrls: MetadataRoute.Sitemap = topics.map((t) => {
    const slug = t.slug.join('/');
    const isSchool = t.slug[0] === 'school';

    return {
      url: `${SITE_URL}/${slug}`,
      lastModified: new Date(t.frontmatter.date),
      changeFrequency: 'monthly',
      priority: isSchool ? 0.8 : 0.9, // College slightly higher (university-level)
    };
  });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/school`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/college`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  return [...staticPages, ...topicUrls];
}
