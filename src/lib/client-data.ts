
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

export function getCanonicalClientUrl(clientId: string, path: string = ''): string {
  const client = getClientData(clientId);
  if (!client) throw new Error(`Client ${clientId} not found for canonical URL`);

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  
  // Use VERCEL_URL as a fallback if NEXT_PUBLIC_ROOT_DOMAIN isn't set, primarily for Vercel preview/dev environments.
  // Otherwise, prioritize NEXT_PUBLIC_ROOT_DOMAIN. Default to 'localhost:9002' for local non-Vercel dev.
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.VERCEL_URL || 'localhost:9002';

  const normalizedPath = path === '/' ? '' : (path.startsWith('/') ? path : `/${path}`);

  // Always construct a subdomain-style URL.
  // For this to work correctly in production, NEXT_PUBLIC_ROOT_DOMAIN must be a custom domain,
  // and DNS for client.NEXT_PUBLIC_ROOT_DOMAIN must point to Vercel.
  // If rootDomain is a vercel.app URL, the generated client.vercel.app URL might not resolve as expected
  // unless specific Vercel configurations for branch domains or similar are in place.
  return `${protocol}://${client.subdomain}.${rootDomain}${normalizedPath}`;
}
