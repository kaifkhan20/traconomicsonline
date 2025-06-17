export interface ClientPageInfo {
  path: string;
  title: string;
  lastModified: string;
}

export interface ClientConfig {
  id: string; // e.g., 'clienta'
  name: string; // e.g., 'Alpha Corp (Client A)'
  subdomain: string; // e.g., 'clienta'
  description: string;
  placeholderImageHint: string;
  callToActionText: string;
  pages: ClientPageInfo[];
}

const clients: Record<string, ClientConfig> = {
  clienta: {
    id: 'clienta',
    name: 'Alpha Corp (Client A)',
    subdomain: 'clienta',
    description: 'Alpha Corp is a fictional leading enterprise in innovative sustainable technologies. This page serves as a placeholder for their actual web content.',
    placeholderImageHint: 'corporate office',
    callToActionText: 'Learn More (Example Button)',
    pages: [
      { path: '/', title: 'Home', lastModified: new Date().toISOString() },
      { path: '/about', title: 'About Alpha Corp', lastModified: new Date().toISOString() },
    ],
  },
  clientb: {
    id: 'clientb',
    name: 'Beta Solutions (Client B)',
    subdomain: 'clientb',
    description: 'Beta Solutions is a fictional creative agency known for its cutting-edge design and digital marketing strategies. This demo page represents what their site could look like.',
    placeholderImageHint: 'creative agency',
    callToActionText: 'View Portfolio (Example Button)',
    pages: [
      { path: '/', title: 'Home', lastModified: new Date().toISOString() },
      { path: '/portfolio', title: 'Our Work', lastModified: new Date().toISOString() },
    ],
  },
};

export function getClientData(clientId: string): ClientConfig | undefined {
  return clients[clientId.toLowerCase()];
}

export function getAllClientIds(): string[] {
  return Object.keys(clients);
}

const defaultVercelHostnamePattern = /\.(vercel\.app|now\.sh)$/; // Matches .vercel.app and legacy .now.sh

export function getCanonicalClientUrl(clientId: string, path: string = ''): string {
  const client = getClientData(clientId);
  if (!client) throw new Error(`Client ${clientId} not found for canonical URL`);

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  
  // Determine the effective root domain. Use VERCEL_URL as a fallback if NEXT_PUBLIC_ROOT_DOMAIN isn't explicitly set on Vercel.
  let effectiveRootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || (process.env.VERCEL_URL || 'localhost:9002');
  if (process.env.VERCEL_URL && !process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    // VERCEL_URL doesn't include protocol, NEXT_PUBLIC_ROOT_DOMAIN should be just the hostname
    effectiveRootDomain = process.env.VERCEL_URL;
  }


  const normalizedPath = path === '/' ? '' : (path.startsWith('/') ? path : `/${path}`);

  // Check if a custom domain is configured (i.e., not a Vercel default domain and not localhost)
  const isCustomDomain = effectiveRootDomain && 
                         !defaultVercelHostnamePattern.test(effectiveRootDomain) && 
                         !effectiveRootDomain.includes('localhost');

  if (process.env.NODE_ENV === 'production' && isCustomDomain) {
    // For production with a custom domain, use the subdomain format
    return `${protocol}://${client.subdomain}.${effectiveRootDomain}${normalizedPath}`;
  } else {
    // For local dev, or if using a .vercel.app domain, or if NEXT_PUBLIC_ROOT_DOMAIN is not a custom TLD,
    // construct a path-based URL.
    // The base for this path-based URL is the effectiveRootDomain.
    let baseAppUrl = effectiveRootDomain;
    if (!baseAppUrl.startsWith('http')) {
      baseAppUrl = `${protocol}://${baseAppUrl}`;
    }
    return `${baseAppUrl}/${client.id}${normalizedPath === '/' ? '' : normalizedPath}`;
  }
}
