import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import MatrixRain from "./MatrixRain";
import dashboardPreview from "@/assets/dashboard-preview.png";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-background pt-12 pb-8">
      <MatrixRain />

      {/* Background blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 mx-auto text-center space-y-8">
        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight animate-fade-in">
          <span className="text-foreground">SEMPLIFICA IL </span>
          <span className="text-primary" style={{ textShadow: '0 0 20px hsl(195, 100%, 50%, 0.6)' }}>
            BOOKING MUSICALE.
          </span>
          <br />
          <span 
            className="text-primary"
            style={{ textShadow: '0 0 20px hsl(195, 100%, 50%, 0.6)' }}
          >
            PREDIRE IL FUTURO CON I DATI.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.15s' }}>
          Piattaforma intelligente per connettere artisti e venue, valutare match e prevedere ricavi con i dati, non con l'istinto.
        </p>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center rounded-full border border-border/60 bg-secondary/50 backdrop-blur-sm overflow-hidden pl-5 pr-1.5 py-1.5 hover:border-primary/50 transition-colors">
            <Search className="w-5 h-5 text-muted-foreground shrink-0 mr-3" />
            <input
              type="text"
              placeholder="Cerca Artista, Venue o Genere Musicale..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none text-base py-2"
            />
            <Button 
              className="rounded-full px-6 md:px-8 font-bold text-sm md:text-base shrink-0"
              style={{
                background: 'hsl(160, 84%, 45%)',
                color: 'hsl(0, 0%, 100%)',
              }}
            >
              ANALIZZA ORA
            </Button>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="max-w-4xl mx-auto pt-4 animate-fade-in" style={{ animationDelay: '0.45s' }}>
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border/30" style={{ boxShadow: '0 20px 60px -15px hsl(195, 100%, 50%, 0.2)' }}>
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/80 border-b border-border/30">
              <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(0, 84%, 60%)' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(45, 93%, 58%)' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(160, 84%, 45%)' }} />
            </div>
            <img 
              src={dashboardPreview} 
              alt="VivaEvent Dashboard Preview" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
