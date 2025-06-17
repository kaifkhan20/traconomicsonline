import { NextRequest, NextResponse } from 'next/server';

// Add your client subdomains here (lowercase)
const KNOWN_CLIENT_SUBDOMAINS = ['clienta', 'clientb']; 

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
  const url = req.nextUrl.clone(); // Use clone to modify
  const { pathname } = url;

  const hostname = req.headers.get('host') || '';

  const rootDomain = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'tracc.com' // Ensure NEXT_PUBLIC_ROOT_DOMAIN is set in prod
    : 'localhost:9002';

  // Extract potential subdomain
  // e.g. clienta from clienta.localhost:9002 or clienta.tracc.com
  let currentSubdomain = '';
  if (hostname !== rootDomain && hostname.endsWith(`.${rootDomain}`)) {
    currentSubdomain = hostname.split('.')[0].toLowerCase();
  } else if (process.env.NODE_ENV !== 'production' && hostname !== 'localhost:9002' && !hostname.includes('.')) {
    // Handle development case where hostname might be 'clienta' (from /etc/hosts)
    // and rootDomain is 'localhost:9002'
    if (KNOWN_CLIENT_SUBDOMAINS.includes(hostname.toLowerCase())) {
        currentSubdomain = hostname.toLowerCase();
    }
  }
  
  const firstPathSegment = pathname.split('/')[1]?.toLowerCase() || '';

  // If a known client subdomain is detected
  if (currentSubdomain && KNOWN_CLIENT_SUBDOMAINS.includes(currentSubdomain)) {
    // And the path doesn't already start with that client's ID
    if (firstPathSegment !== currentSubdomain) {
      // Rewrite to /<clientSubdomain>/<originalPath>
      // e.g., clienta.localhost:9002/about -> localhost:9002/clienta/about
      url.pathname = `/${currentSubdomain}${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // If accessed via /clientA/* or /clientB/*, these are handled by app/[clientId]/...
  // No special rewrite needed here, Next.js routing takes over.

  return NextResponse.next();
}
