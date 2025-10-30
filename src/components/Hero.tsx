import { Button } from "@/components/ui/button";
import { Music, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full shadow-card">
            <Music className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">VivaEvent - Il Marketplace per Live Music</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Connetti Artisti e Venue
            </span>
            <br />
            <span className="text-foreground">In Modo Semplice</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Il primo marketplace italiano che automatizza booking, contratti e pagamenti per concerti live con l'intelligenza artificiale
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="group text-lg px-8 py-6 shadow-elegant hover:shadow-xl transition-all">
              Inizia Gratis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Scopri Come Funziona
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-bold text-primary">300+</div>
              <div className="text-sm text-muted-foreground">Artisti</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-bold text-primary">80+</div>
              <div className="text-sm text-muted-foreground">Venue</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">Booking</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
