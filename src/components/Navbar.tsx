import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";

const Navbar = () => {
  const { lang, setLang, t } = useI18n();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 hover:opacity-80 transition-all">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
                <path d="M3 12l4-2 4 2 4-2 4 2" strokeDasharray="2 2" opacity="0.5" />
              </svg>
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">
              VivaEvent <span className="text-primary">AI</span>
            </span>
          </a>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#come-funziona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t.nav.howItWorks[lang]}
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t.nav.pricing[lang]}
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 border border-border/50 rounded-full px-1 py-0.5">
              <button
                onClick={() => setLang("it")}
                className={`text-base px-1.5 py-0.5 rounded-full transition-all ${
                  lang === "it" ? "bg-primary/20 scale-110" : "opacity-50 hover:opacity-80"
                }`}
                title="Italiano"
              >
                🇮🇹
              </button>
              <button
                onClick={() => setLang("en")}
                className={`text-base px-1.5 py-0.5 rounded-full transition-all ${
                  lang === "en" ? "bg-primary/20 scale-110" : "opacity-50 hover:opacity-80"
                }`}
                title="English"
              >
                🇺🇸
              </button>
            </div>

            <Button 
              size="sm" 
              className="rounded-full px-5 font-semibold hidden sm:inline-flex"
              style={{
                background: 'hsl(160, 84%, 45%)',
                color: 'hsl(0, 0%, 100%)',
              }}
            >
              Start Free Trial
            </Button>

            <a 
              href="#" 
              className="text-sm font-bold text-foreground hover:text-primary transition-colors"
            >
              {t.nav.login[lang]}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
