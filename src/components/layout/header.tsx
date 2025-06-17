
import Link from 'next/link';
import { getAllClientIds, getClientData, ClientConfig, getCanonicalClientUrl } from '@/lib/client-data';

export function Header() {
  const clientIds = getAllClientIds();
  const clients = clientIds.map(id => getClientData(id)).filter(Boolean) as ClientConfig[];

  return (
    <header className="py-6 px-4 md:px-8 border-b bg-card shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-primary font-headline hover:opacity-80 transition-opacity">
          Tracc
        </Link>
        <nav className="space-x-4">
          {clients.map(client => {
            const clientSubdomainUrl = getCanonicalClientUrl(client.id, '/');
            return (
              <Link 
                key={client.id} 
                href={clientSubdomainUrl} 
                className="text-foreground hover:text-primary transition-colors"
                target="_blank" // Open client sites in new tab from header
                rel="noopener noreferrer"
              >
                {client.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
