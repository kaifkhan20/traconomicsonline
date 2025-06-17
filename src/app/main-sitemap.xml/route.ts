import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const protocol = request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === "production" ? "https" : "http");
   const host = request.headers.get('host') || (
    process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'tracc.com' 
    : 'localhost:9002'
  );
  const baseUrl = `${protocol}://${host}`;

  // Define main site pages here
  const mainPages = [
    { url: `${baseUrl}/`, lastModified: new Date().toISOString() },
    // Add other main Tracc application pages if any (e.g., /about-tracc, /pricing)
  ];

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${mainPages
    .map(page => `<url><loc>${page.url}</loc><lastmod>${page.lastModified}</lastmod></url>`)
    .join('')}
</urlset>`;

  return new NextResponse(sitemapContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate', // Cache for 1 day
    },
  });
}
