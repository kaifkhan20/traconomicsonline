
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

  let rootDomain = 'localhost:9002'; // Default for local
  if (process.env.NODE_ENV === 'production') {
    // In production, prioritize NEXT_PUBLIC_ROOT_DOMAIN, then VERCEL_URL, then the actual host as a last resort.
    // VERCEL_URL is typically the <project-name>.vercel.app hostname.
    rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.VERCEL_URL || hostname;
  }


  // Extract potential subdomain
  // e.g. clienta from clienta.customdomain.com or clienta.traconomicsonline.com
  let currentSubdomain = '';
  if (hostname !== rootDomain && hostname.endsWith(`.${rootDomain}`)) {
    // This condition correctly handles custom domains.
    // For Vercel default domains (e.g. traconomicsonline.vercel.app), hostname will be equal to rootDomain
    // (if NEXT_PUBLIC_ROOT_DOMAIN or VERCEL_URL is set to traconomicsonline.vercel.app),
    // so currentSubdomain will remain empty, which is correct as we don't do subdomain rewrites for the default Vercel domain.
    currentSubdomain = hostname.split('.')[0].toLowerCase();
  } else if (process.env.NODE_ENV !== 'production' && !hostname.includes('.') && KNOWN_CLIENT_SUBDOMAINS.includes(hostname.toLowerCase())) {
    // Handle development case where hostname might be 'clienta' (from /etc/hosts)
    // and rootDomain is 'localhost:9002'
     currentSubdomain = hostname.toLowerCase();
  }
  
  const firstPathSegment = pathname.split('/')[1]?.toLowerCase() || '';

  // If a known client subdomain is detected (primarily for custom domains)
  if (currentSubdomain && KNOWN_CLIENT_SUBDOMAINS.includes(currentSubdomain)) {
    // And the path doesn't already start with that client's ID
    if (firstPathSegment !== currentSubdomain) {
      // Rewrite to /<clientSubdomain>/<originalPath>
      // e.g., clienta.customdomain.com/about -> customdomain.com/clienta/about (internally)
      url.pathname = `/${currentSubdomain}${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // If accessed via /clientA/* or /clientB/*, these are handled by app/[clientId]/...
  // No special rewrite needed here, Next.js routing takes over.

  return NextResponse.next();
}
