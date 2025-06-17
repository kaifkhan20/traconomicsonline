
import { NextRequest, NextResponse } from 'next/server';
import { getClientData, getCanonicalClientUrl, getAllClientIds } from './lib/client-data';

// Dynamically get known client IDs to be used as subdomains or first path segments
const KNOWN_CLIENT_IDS = getAllClientIds();

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. Static files (e.g. /favicon.ico, images, etc.) - typically handled if they have extensions
     * This matcher allows .xml and .txt to pass through for sitemap/robots handling by middleware if necessary.
     */
    '/((?!api/|_next/static/|_next/image|assets/|favicon.ico|sw.js).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;
  const hostname = req.headers.get('host') || '';

  let rootDomain = 'localhost:9002'; // Default for local
  if (process.env.NODE_ENV === 'production') {
    // In production, prioritize NEXT_PUBLIC_ROOT_DOMAIN, then VERCEL_URL, then the actual host.
    rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.VERCEL_URL || hostname;
  }

  // Extract potential subdomain
  let currentSubdomain = '';
  if (hostname !== rootDomain && hostname.endsWith(`.${rootDomain}`)) {
    currentSubdomain = hostname.split('.')[0].toLowerCase();
  } else if (process.env.NODE_ENV !== 'production' && !hostname.includes('.') && KNOWN_CLIENT_IDS.includes(hostname.toLowerCase())) {
    currentSubdomain = hostname.toLowerCase();
  }

  const firstPathSegment = pathname.split('/')[1]?.toLowerCase() || '';

  // Case 1: Request is to a known client subdomain (e.g., clienta.yourcustomdomain.com)
  if (currentSubdomain && KNOWN_CLIENT_IDS.includes(currentSubdomain)) {
    // Rewrite to /<clientSubdomain>/<originalPath> if not already structured like that
    // This allows Next.js to serve from /app/[clientId]/...
    if (firstPathSegment !== currentSubdomain) {
      url.pathname = `/${currentSubdomain}${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
    // If path already starts with /<clientSubdomain>, let it pass (it's correctly structured or an asset)
    return NextResponse.next();
  }

  // Case 2: Request is to the root domain, but path starts with a client ID (e.g., yourcustomdomain.com/clienta)
  // This is direct path access to a client page. Redirect to the subdomain.
  if (KNOWN_CLIENT_IDS.includes(firstPathSegment) && hostname === rootDomain) {
    const client = getClientData(firstPathSegment);
    if (client) {
      // Construct the rest of the path after the clientID segment
      const remainingPath = pathname.substring(firstPathSegment.length + 1); // e.g., /about from /clienta/about
      const newSubdomainUrl = getCanonicalClientUrl(client.id, remainingPath);
      return NextResponse.redirect(newSubdomainUrl, 308); // 308 Permanent Redirect
    }
  }

  // For any other requests to the root domain that don't match a client path, let them pass
  return NextResponse.next();
}
