import { getClientData, getCanonicalClientUrl } from '@/lib/client-data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
): Promise<NextResponse> {
  const clientId = params.clientId.toLowerCase();
  const client = getClientData(clientId);

  if (!client) {
    return new NextResponse('Client not found', { status: 404 });
  }

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${client.pages.map(page => {
    const pageUrl = getCanonicalClientUrl(client.id, page.path);
    return `<url><loc>${pageUrl}</loc><lastmod>${page.lastModified}</lastmod></url>`;
  }).join('')}
</urlset>`;

  return new NextResponse(sitemapContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate', // Cache for 1 day
    },
  });
}
