import { Button } from "@/components/ui/button";
import { ArrowRight, Music2 } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(0, 0%, 0%), hsl(45, 100%, 12%), hsl(0, 0%, 5%), hsl(0, 0%, 0%))' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to bottom, hsl(var(--muted) / 0.3), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, hsl(0, 0%, 0%), transparent)' }} />
      <div className="absolute top-0 right-0 w-96 h-96" style={{ background: 'radial-gradient(circle, hsl(45, 100%, 15%) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96" style={{ background: 'radial-gradient(circle, hsl(45, 100%, 12%) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 backdrop-blur-sm rounded-2xl mb-4" style={{ background: 'hsl(180, 100%, 30%, 0.2)' }}>
            <Music2 className="w-10 h-10" style={{ color: 'hsl(180, 100%, 50%)' }} />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold" style={{ color: 'hsl(180, 100%, 50%)' }}>
            Pronto a Rivoluzionare il Tuo Booking?
          </h2>
          
          <p className="text-xl md:text-2xl max-w-2xl mx-auto" style={{ color: 'hsl(180, 100%, 60%)' }}>
            Unisciti a centinaia di artisti e venue che stanno già usando VivaEvent per semplificare i loro concerti
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="group text-lg px-8 py-6 shadow-xl"
              style={{ background: 'hsl(180, 100%, 50%)', color: 'hsl(0, 0%, 0%)', fontWeight: 'bold' }}
            >
              Inizia Gratis Oggi
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 backdrop-blur-sm"
              style={{ background: 'hsl(180, 100%, 50%, 0.1)', color: 'hsl(180, 100%, 50%)', borderColor: 'hsl(180, 100%, 50%, 0.5)' }}
            >
              Prenota Demo
            </Button>
          </div>

          <p className="text-sm pt-4" style={{ color: 'hsl(180, 100%, 60%, 0.8)' }}>
            Nessuna carta di credito richiesta • Inizia in 2 minuti • Cancella quando vuoi
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
