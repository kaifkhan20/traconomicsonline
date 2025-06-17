
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Cog, Globe, Link2 } from 'lucide-react';
import { getAllClientIds, getClientData, getCanonicalClientUrl, ClientConfig } from '@/lib/client-data';

export default function Home() {
  const clientIds = getAllClientIds();
  const clients = clientIds.map(id => getClientData(id)).filter(Boolean) as ClientConfig[];

  const rootDisplayDomain = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'tracc.com' 
    : 'localhost:9002';

  return (
    <div className="flex flex-col items-center text-center space-y-16">
      <section className="space-y-6 max-w-3xl pt-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-headline text-primary">
          Build Beautiful Client Sites, Effortlessly.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Tracc empowers you to create and manage professional websites for your clients,
          all seamlessly hosted under our domain. Get started for free and elevate your client offerings.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {clients.map((client) => (
          <Card key={client.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center justify-center md:justify-start">
                <Cog className="mr-2 h-6 w-6 text-accent" />
                {client.name}
              </CardTitle>
              <CardDescription className="text-sm">
                Explore a demo site for "{client.name}".
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 mt-auto">
              <Link href={`/${client.id}`} passHref>
                <Button variant="default" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 ease-in-out transform hover:scale-105">
                  <Link2 className="mr-2 h-5 w-5" /> View (Path: /{client.id})
                </Button>
              </Link>
              <Link href={getCanonicalClientUrl(client.id, '/')} passHref target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 hover:border-primary/80 transition-all duration-300 ease-in-out transform hover:scale-105">
                  <Globe className="mr-2 h-5 w-5" /> View (Subdomain: {client.subdomain}.{rootDisplayDomain})
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="w-full max-w-3xl space-y-8 py-12">
        <h2 className="text-3xl font-bold font-headline text-primary/90">Why Choose Tracc?</h2>
        <Card className="text-left bg-card p-6 rounded-lg shadow-md">
        <ul className="space-y-4">
          {[
            { title: "Quick Setup", description: "Launch client sites in minutes with our intuitive platform." },
            { title: "Free Hosting", description: "Basic sites are free, nested under our domain (subdomain goal)." },
            { title: "Professional Look", description: "Utilize clean, modern designs for all client pages." },
            { title: "Easy Management", description: "A simple (conceptual) dashboard for all your client sites." },
          ].map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-6 w-6 text-accent mr-3 shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
        </Card>
      </section>
    </div>
  );
}
