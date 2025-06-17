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
  
  const clientSitemapUrl = getCanonicalClientUrl(client.id, '/sitemap.xml');

  const content = `User-agent: *
Allow: /
Sitemap: ${clientSitemapUrl}

User-agent: GPTBot
Disallow: /
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate', // Cache for 1 day
    },
  });
}
