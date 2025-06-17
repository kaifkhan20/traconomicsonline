
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClientData, ClientConfig, getCanonicalClientUrl } from '@/lib/client-data';
import { notFound } from 'next/navigation';
import { getAllClientIds } from '@/lib/client-data';

interface ClientPageProps {
  params: { clientId: string };
}

export async function generateStaticParams() {
  const clientIds = getAllClientIds();
  return clientIds.map((clientId) => ({ clientId }));
}

export async function generateMetadata({ params }: ClientPageProps): Promise<Metadata> {
  const client = getClientData(params.clientId);
  if (!client) {
    return {
      title: 'Client Not Found',
    };
  }
  
  const canonicalUrl = getCanonicalClientUrl(client.id, '/');
  
  return {
    title: `${client.name} - Demo Site`,
    description: client.description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function ClientPage({ params }: ClientPageProps) {
  const client = getClientData(params.clientId);

  if (!client) {
    notFound();
  }
  
  const clientHost = getCanonicalClientUrl(client.id, '/').replace(/^https?:\/\//, '').replace(/\/$/, '');


  return (
    <div className="flex flex-col items-center space-y-10 py-8">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">{client.name}'s Demo Site</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Welcome to the demonstration page for {client.name}. This illustrates how a client's site
          would be structured within Tracc, showcasing content and branding, accessed via <code>{clientHost}</code>.
        </p>
      </div>

      <Card className="w-full max-w-3xl shadow-xl overflow-hidden rounded-lg">
        <Image
          src="https://placehold.co/800x400.png"
          alt={`${client.name} placeholder image`}
          width={800}
          height={400}
          className="w-full object-cover"
          data-ai-hint={client.placeholderImageHint}
        />
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary/90">About {client.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>{client.description}</p>
          <p>Envision this space filled with compelling narratives, high-resolution imagery, interactive charts showcasing their impact, and testimonials from satisfied partners.</p>
          <Button variant="ghost" className="text-accent hover:text-accent-foreground hover:bg-accent/10">
            {client.callToActionText}
          </Button>
        </CardContent>
      </Card>

      <Link href="/" passHref>
        <Button variant="outline" className="transition-transform hover:scale-105">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Tracc Home
        </Button>
      </Link>
    </div>
  );
}
