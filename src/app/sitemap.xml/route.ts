
import { getAllClientIds, getCanonicalClientUrl } from '@/lib/client-data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const protocol = request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === "production" ? "https" : "http");

  let host = request.headers.get('host');
  if (process.env.NODE_ENV === 'production') {
    host = process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.VERCEL_URL || request.headers.get('host');
  } else {
    host = request.headers.get('host') || 'localhost:9002';
  }
  
  const rootUrl = `${protocol}://${host}`;

  const clientIds = getAllClientIds();
  
  const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${rootUrl}/main-sitemap.xml</loc>
  </sitemap>
  ${clientIds.map(id => {
    // getCanonicalClientUrl will correctly use NEXT_PUBLIC_ROOT_DOMAIN (or VERCEL_URL fallback via its internal logic)
    // to generate path-based URLs if on a .vercel.app domain.
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
