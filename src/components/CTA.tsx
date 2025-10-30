import { Button } from "@/components/ui/button";
import { ArrowRight, Music2 } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-accent to-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <Music2 className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            Pronto a Rivoluzionare il Tuo Booking?
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Unisciti a centinaia di artisti e venue che stanno già usando VivaEagle per semplificare i loro concerti
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="group bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-xl"
            >
              Inizia Gratis Oggi
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
            >
              Prenota Demo
            </Button>
          </div>

          <p className="text-sm text-white/70 pt-4">
            Nessuna carta di credito richiesta • Inizia in 2 minuti • Cancella quando vuoi
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
