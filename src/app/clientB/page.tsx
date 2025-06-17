import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClientBPage() {
  return (
    <div className="flex flex-col items-center space-y-10 py-8">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Client B's Demo Site</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          This is Beta Solutions' (Client B) interactive corner on Tracc. Explore how we can tailor
          a unique online presence for diverse client needs.
        </p>
        <p className="text-sm text-muted-foreground">
          (In a production environment, this might be accessed via <code>clientB.tracc.com</code>)
        </p>
      </div>

      <Card className="w-full max-w-3xl shadow-xl overflow-hidden rounded-lg">
         <Image
          src="https://placehold.co/800x400.png"
          alt="Client B placeholder image"
          width={800}
          height={400}
          className="w-full object-cover"
          data-ai-hint="creative agency"
        />
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary/90">Beta Solutions (Client B)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Beta Solutions is a fictional creative agency known for its cutting-edge design and digital marketing strategies. This demo page represents what their site could look like, featuring a portfolio, service descriptions, case studies, and a blog.</p>
          <p>Envision a dynamic layout with vibrant visuals, embedded videos of their work, client success stories, and calls-to-action to engage potential customers.</p>
          <Button variant="ghost" className="text-accent hover:text-accent-foreground hover:bg-accent/10">
            View Portfolio (Example Button)
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
