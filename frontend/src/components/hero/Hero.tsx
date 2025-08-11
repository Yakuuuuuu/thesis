import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-hotel.jpg";
import { Link } from "react-router-dom";
import { useRef } from "react";

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty("--x", `${x}px`);
    ref.current.style.setProperty("--y", `${y}px`);
  };

  return (
    <section
      className="relative overflow-hidden rounded-xl border bg-gradient-to-b from-background to-[hsl(210_40%_98%)]"
      onMouseMove={onMouseMove}
      ref={ref}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 md:opacity-100" style={{ maskImage: "radial-gradient(400px_400px_at_var(--x,_-200px)_var(--y,_-200px),black,transparent)", background: "radial-gradient(600px 600px at var(--x, -200px) var(--y, -200px), hsl(var(--brand)/0.18), transparent 60%)" }} />
      <div className="container mx-auto grid items-center gap-10 py-16 md:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            AI-powered hospitality platform
          </h1>
          <p className="text-lg text-muted-foreground">
            Delight guests, empower staff, and maximize revenue with an end-to-end intelligent suite for modern hotels.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="hero">
              <Link to="/guest">Open Guest Portal</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard">View Analytics</Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          <img
            src={heroImage}
            alt="Modern hotel lobby with warm light and contemporary design"
            loading="lazy"
            className="w-full rounded-lg shadow-[var(--shadow-elevated)]"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
