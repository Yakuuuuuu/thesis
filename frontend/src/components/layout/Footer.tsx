const Footer = () => {
  return (
    <footer className="mt-20 border-t bg-background">
      <div className="container mx-auto py-10 grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-3 h-8 w-8 rounded-md bg-[linear-gradient(135deg,hsl(var(--brand)),hsl(var(--brand-2)))]" />
          <p className="text-sm text-muted-foreground">AI hospitality, elevated.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AetherStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
