
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Cog, Globe } from 'lucide-react';
import { getAllClientIds, getClientData, getCanonicalClientUrl, ClientConfig } from '@/lib/client-data';

export default function Home() {
  const clientIds = getAllClientIds();
  const clients = clientIds.map(id => getClientData(id)).filter(Boolean) as ClientConfig[];

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.VERCEL_URL || 'localhost:9002';
  const isVercelAppDomain = rootDomain.endsWith('.vercel.app');


  return (
    <div className="flex flex-col items-center text-center space-y-16">
      <section className="space-y-6 max-w-3xl pt-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-headline text-primary">
          Build Beautiful Client Sites, Effortlessly.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Tracc empowers you to create and manage professional websites for your clients,
          all seamlessly hosted via dedicated subdomains.
        </p>
        {isVercelAppDomain && (
           <p className="text-sm text-muted-foreground bg-accent/10 p-3 rounded-md border border-accent/30">
            <strong>Note:</strong> You are currently viewing this on a <code>*.vercel.app</code> domain.
            For full client subdomain functionality (e.g., <code>clienta.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}</code>),
            a custom root domain needs to be configured on Vercel and set as <code>NEXT_PUBLIC_ROOT_DOMAIN</code>.
            The links below will point to subdomain URLs, but they may not resolve correctly without this setup.
          </p>
        )}
         {!isVercelAppDomain && (!process.env.NEXT_PUBLIC_ROOT_DOMAIN && process.env.NODE_ENV === 'production') && (
           <p className="text-sm text-muted-foreground bg-destructive/10 p-3 rounded-md border border-destructive/30">
            <strong>Warning:</strong> The <code>NEXT_PUBLIC_ROOT_DOMAIN</code> environment variable is not set.
            Subdomain links may not work as expected. Please configure this in your Vercel project settings.
          </p>
        )}
      </section>

      <section className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {clients.map((client) => {
          const clientSubdomainUrl = getCanonicalClientUrl(client.id, '/');
          const displaySubdomainUrl = clientSubdomainUrl.replace(/^https?:\/\//, '');

          return (
            <Card key={client.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center justify-center md:justify-start">
                  <Cog className="mr-2 h-6 w-6 text-accent" />
                  {client.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  Explore a demo site for "{client.name}" via its subdomain.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 mt-auto">
                <Link href={clientSubdomainUrl} passHref target="_blank" rel="noopener noreferrer">
                  <Button variant="default" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 ease-in-out transform hover:scale-105">
                    <Globe className="mr-2 h-5 w-5" /> View Site ({displaySubdomainUrl})
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="w-full max-w-3xl space-y-8 py-12">
        <h2 className="text-3xl font-bold font-headline text-primary/90">Why Choose Tracc?</h2>
        <Card className="text-left bg-card p-6 rounded-lg shadow-md">
        <ul className="space-y-4">
          {[
            { title: "Quick Setup", description: "Launch client sites in minutes with our intuitive platform." },
            { title: "Subdomain Hosting", description: "Each client gets their own professional subdomain." },
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
