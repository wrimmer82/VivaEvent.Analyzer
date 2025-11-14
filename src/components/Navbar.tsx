import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoImage from "@/assets/logo-ve.png";

interface NavbarProps {
  logoLink?: string;
}

const Navbar = ({ logoLink = "/" }: NavbarProps) => {
  return <nav className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to={logoLink} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-all hover:scale-105">
            <div className="flex items-center justify-center w-10 h-10">
              <img src={logoImage} alt="VivaEvent Logo" className="w-10 h-10 object-contain" />
            </div>
            <span className="text-xl font-bold text-foreground">VivaEvent</span>
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#a-cosa-serve" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              A Cosa Serve
            </a>
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
            <Link to="/accedi">
              <Button variant="ghost" size="sm" className="px-[2px] py-[2px] text-2xl text-yellow-100 text-left rounded-2xl font-bold">
                Accedi
              </Button>
            </Link>
            <Link to="/accedi">
              
            </Link>
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;