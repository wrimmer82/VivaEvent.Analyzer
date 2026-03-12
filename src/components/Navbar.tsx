import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoImage from "@/assets/logo-ve.png";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-all">
            <img src={logoImage} alt="VivaEvent Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-foreground">VivaEvent</span>
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#come-funziona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Come Funziona
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Prezzi
            </a>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-4">
            <Button 
              size="sm" 
              className="rounded-full px-6 font-semibold"
              style={{
                background: 'hsl(160, 84%, 45%)',
                color: 'hsl(0, 0%, 100%)',
              }}
              asChild
            >
              <Link to="/accedi">Start Free Trial</Link>
            </Button>
            <Link 
              to="/accedi" 
              className="text-base font-bold text-foreground hover:text-primary transition-colors hidden sm:block"
            >
              Accedi
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
