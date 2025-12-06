import { Button } from "@/components/ui/button";
import { Music, ArrowRight, Sparkles } from "lucide-react";
import MatrixRain from "./MatrixRain";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Matrix Rain Effect */}
      <MatrixRain />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span 
              className="text-primary"
              style={{
                textShadow: `
                  0 0 10px rgba(0, 217, 255, 0.6),
                  0 0 20px rgba(0, 217, 255, 0.3),
                  1px 1px 0px rgba(0, 150, 190, 0.8),
                  2px 2px 0px rgba(0, 120, 160, 0.6),
                  3px 3px 8px rgba(0, 0, 0, 0.4)
                `
              }}
            >
              VivaEvent
            </span>
            <br />
            <span className="text-foreground drop-shadow-[0_0_30px_rgba(0,217,255,0.5)]">Live Music Booking</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Piattaforma intelligente che connette <span className="text-primary font-semibold">artisti</span>, <span className="text-accent font-semibold">professionisti</span> e <span className="text-accent font-semibold">venue</span> semplificando booking e collaborazioni.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="group text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant hover:shadow-[0_0_40px_rgba(0,217,255,0.6)] transition-all" asChild>
              <Link to="/inizia-ora">
                Inizia Gratis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary transition-all" asChild>
              <Link to="/#pricing">
                Scopri i Piani
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="space-y-1 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all hover:shadow-card">
              <div className="text-3xl md:text-4xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">300+</div>
              <div className="text-sm text-muted-foreground">Artisti</div>
            </div>
            <div className="space-y-1 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-accent/20 hover:border-accent/50 transition-all hover:shadow-card">
              <div className="text-3xl md:text-4xl font-bold text-accent drop-shadow-[0_0_10px_rgba(80,227,230,0.5)]">80+</div>
              <div className="text-sm text-muted-foreground">Venue</div>
            </div>
            <div className="space-y-1 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all hover:shadow-card">
              <div className="text-3xl md:text-4xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">200+</div>
              <div className="text-sm text-muted-foreground">Booking</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
