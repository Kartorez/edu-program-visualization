import { MetadataRoute } from 'next';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kn-vnau.edu.ua';

  const payload = await getPayload({ config });
  const { docs: programs } = await payload.find({
    collection: 'educational-programs',
    limit: 500,
    depth: 0,
  });

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  programs.forEach((program) => {
    const id = program.id;
    const updatedAt = new Date(program.updatedAt);
    
    routes.push({
      url: `${baseUrl}/plan/${id}`,
      lastModified: updatedAt,
      changeFrequency: 'monthly',
      priority: 0.9,
    });
    routes.push({
      url: `${baseUrl}/plan/${id}/graph`,
      lastModified: updatedAt,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
    routes.push({
      url: `${baseUrl}/plan/${id}/competencies`,
      lastModified: updatedAt,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
    routes.push({
      url: `${baseUrl}/plan/${id}/results`,
      lastModified: updatedAt,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  return routes;
}
