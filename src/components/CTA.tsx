import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Music2 } from "lucide-react";

const CTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(0, 0%, 0%), hsl(45, 100%, 12%), hsl(0, 0%, 5%), hsl(0, 0%, 0%))' }}>
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
          
          <h2 className={`text-4xl md:text-6xl font-bold transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ color: 'hsl(180, 100%, 50%)' }}>
            Pronto a Rivoluzionare il Tuo Booking?
          </h2>
          
          <p className="text-xl md:text-2xl max-w-2xl mx-auto animate-fade-in" style={{ color: 'hsl(180, 100%, 60%)', animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
            Unisciti a centinaia di artisti e venue che stanno già usando VivaEvent per semplificare i loro concerti
          </p>

          <div className="max-w-3xl mx-auto pt-6 space-y-3 animate-fade-in" style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
            <p className="text-lg font-bold" style={{ color: 'hsl(180, 100%, 50%)' }}>
              Suite di produttività
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'hsl(180, 100%, 60%)' }}>
              Dimenticatevi di fogli di calcolo, fax e assegni cartacei. VivaEvent semplifica la prenotazione dell&apos;intrattenimento dal vivo. Siamo la prima piattaforma di prenotazione basata su cloud a fornire una soluzione semplice per negoziare contratti, riscuotere pagamenti online e monitorare gli obiettivi di fatturato in tempo reale.
            </p>
          </div>

          <div className="flex justify-center items-center pt-4 animate-fade-in" style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>
            <Button 
              size="lg" 
              className="group text-lg px-8 py-6 shadow-xl"
              style={{ background: 'hsl(180, 100%, 50%)', color: 'hsl(0, 0%, 0%)', fontWeight: 'bold' }}
            >
              Inizia Gratis Oggi
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="text-sm pt-4 animate-fade-in" style={{ color: 'hsl(180, 100%, 60%, 0.8)', animationDelay: '0.8s', opacity: 0, animationFillMode: 'forwards' }}>
            Nessuna carta di credito richiesta • Inizia in 2 minuti • Cancella quando vuoi
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
