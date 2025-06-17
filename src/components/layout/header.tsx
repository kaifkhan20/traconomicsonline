import Link from 'next/link';

export function Header() {
  return (
    <header className="py-6 px-4 md:px-8 border-b bg-card shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-primary font-headline hover:opacity-80 transition-opacity">
          Tracc
        </Link>
        <nav className="space-x-4">
          <Link href="/clientA" className="text-foreground hover:text-primary transition-colors">
            Client A
          </Link>
          <Link href="/clientB" className="text-foreground hover:text-primary transition-colors">
            Client B
          </Link>
        </nav>
      </div>
    </header>
  );
}
