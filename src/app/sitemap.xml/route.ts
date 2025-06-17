import { getAllClientIds, getCanonicalClientUrl } from '@/lib/client-data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const protocol = request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === "production" ? "https" : "http");
  const host = request.headers.get('host') || (
    process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'tracc.com' 
    : 'localhost:9002'
  );
  const rootUrl = `${protocol}://${host}`;

  const clientIds = getAllClientIds();
  
  const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${rootUrl}/main-sitemap.xml</loc>
  </sitemap>
  ${clientIds.map(id => {
    const clientSitemapUrl = getCanonicalClientUrl(id, '/sitemap.xml');
    return `<sitemap><loc>${clientSitemapUrl}</loc></sitemap>`;
  }).join('')}
</sitemapindex>`;

  return new NextResponse(sitemapIndexContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate', // Cache for 1 day
    },
  });
}
