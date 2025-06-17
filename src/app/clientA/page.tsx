import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClientAPage() {
  return (
    <div className="flex flex-col items-center space-y-10 py-8">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Client A's Demo Site</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Welcome to the demonstration page for Client A. This illustrates how a client's site
          would be structured within Tracc, showcasing content and branding.
        </p>
        <p className="text-sm text-muted-foreground">
          (In a production environment, this might be accessed via <code>clientA.tracc.com</code>)
        </p>
      </div>

      <Card className="w-full max-w-3xl shadow-xl overflow-hidden rounded-lg">
        <Image
          src="https://placehold.co/800x400.png"
          alt="Client A placeholder image"
          width={800}
          height={400}
          className="w-full object-cover"
          data-ai-hint="corporate office"
        />
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary/90">About Alpha Corp (Client A)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Alpha Corp is a fictional leading enterprise in innovative sustainable technologies. This page serves as a placeholder for their actual web content, which might include detailed information about their services, groundbreaking projects, company history, and contact details.</p>
          <p>Imagine this space filled with compelling narratives, high-resolution imagery of their projects, interactive charts showcasing their impact, and testimonials from satisfied partners.</p>
          <Button variant="ghost" className="text-accent hover:text-accent-foreground hover:bg-accent/10">
            Learn More (Example Button)
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
