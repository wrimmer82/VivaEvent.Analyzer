import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";
import MatrixRain from "./MatrixRain";
import DashboardMockup from "./DashboardMockup";

const Hero = () => {
  const { lang, t } = useI18n();

  return (
    <section
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-12 pb-8"
      style={{
        background: 'radial-gradient(ellipse at center, #00C2FF 0%, #020617 70%)',
      }}
    >
      <MatrixRain />

      {/* Vignettatura scura su tutti e 4 i lati */}
      <div className="absolute inset-0 pointer-events-none" style={{
        boxShadow: 'inset 0 0 200px 80px #020617',
      }} />

      <div className="container relative z-10 px-4 mx-auto text-center space-y-8">
        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight animate-fade-in">
          <span style={{ color: '#FFFFFF' }}>
            {lang === "it" ? "INVESTI CON L'" : lang === "es" ? "INVIERTE CON " : "INVEST WITH "}
          </span>
          <span style={{ color: '#FFFFFF', textShadow: '0 0 25px hsl(195, 100%, 50%, 0.5)' }}>
            {lang === "it" ? "IA" : lang === "es" ? "IA" : "AI"}
          </span>
          <span style={{ color: '#FFFFFF' }}>
            {lang === "it" ? " NEI DIRITTI MUSICALI." : lang === "es" ? " EN DERECHOS MUSICALES." : " IN MUSIC RIGHTS."}
          </span>
          <br />
          <span style={{ color: '#FFFFFF', textShadow: '0 0 25px hsl(195, 100%, 50%, 0.5)' }}>
            {t.hero.title2[lang]}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.15s', color: '#C7D2FE' }}>
          {t.hero.subtitle[lang]}
        </p>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center rounded-full border border-border/50 bg-secondary/40 backdrop-blur-md overflow-hidden pl-5 pr-1.5 py-1.5 hover:border-primary/40 focus-within:border-primary/60 transition-colors group">
            <Search className="w-5 h-5 text-muted-foreground shrink-0 mr-3" />
            <input
              type="text"
              placeholder={t.hero.searchPlaceholder[lang]}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-sm md:text-base py-2"
            />
            <Button
              className="rounded-full px-5 md:px-8 font-bold text-xs md:text-sm shrink-0 transition-all"
              style={{
                background: '#00F0FF',
                color: '#020617',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.4), 0 0 30px rgba(0, 240, 255, 0.2)',
              }}
            >
              {t.hero.analyzeNow[lang]}
            </Button>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="max-w-5xl mx-auto pt-4 animate-fade-in" style={{ animationDelay: '0.45s' }}>
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
};

export default Hero;
