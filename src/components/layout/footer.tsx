export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 px-4 md:px-8 border-t bg-card text-center text-muted-foreground">
      <div className="container mx-auto">
        <p>&copy; {currentYear} Tracc. All rights reserved.</p>
        <p className="text-sm mt-1">
          Powered by Next.js & Firebase Studio.
        </p>
      </div>
    </footer>
  );
}
