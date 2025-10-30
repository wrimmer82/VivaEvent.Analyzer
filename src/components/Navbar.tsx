import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Music2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">VivaEvent</span>
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Come Funziona
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Prezzi
            </a>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Accedi
            </Button>
            <Button size="sm" className="hidden sm:inline-flex">
              Inizia Gratis
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
