import { Link } from "react-router-dom";
import { ReactNode } from "react";

const Navbar = ({ rightSlot }: { rightSlot?: ReactNode }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/register" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-[linear-gradient(135deg,hsl(var(--brand)),hsl(var(--brand-2)))] shadow-[var(--shadow-soft)]" />
          <span className="text-base font-semibold tracking-tight bg-clip-text text-transparent bg-[linear-gradient(135deg,hsl(var(--brand)),hsl(var(--brand-2)))]">
            AetherStay
          </span>
        </Link>
        <div className="flex items-center gap-2">{rightSlot}</div>
      </div>
    </header>
  );
};

export default Navbar;
