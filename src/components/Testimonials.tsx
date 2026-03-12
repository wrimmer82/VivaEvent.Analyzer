import { Quote } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="py-16 bg-background border-t border-border/30">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <Quote 
          className="w-8 h-8 text-primary/50 mx-auto mb-6" 
          style={{ filter: 'drop-shadow(0 0 10px hsl(195, 100%, 50%))' }}
        />
        <blockquote className="text-lg md:text-xl text-muted-foreground italic leading-relaxed mb-6">
          "Un'ora al giorno con questa piattaforma e ho ottimizzato il booking per un intero tour estivo. Incredibile."
        </blockquote>
        <cite className="text-sm font-semibold text-foreground not-italic">
          — M.R., Booking Agent Indipendente
        </cite>
      </div>
    </section>
  );
};

export default Testimonials;
