import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MatrixRain from "@/components/MatrixRain";
import notaMusicale from "@/assets/nota-musicale.png";
const CTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.2
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  return <section id="a-cosa-serve" ref={sectionRef} className="py-24 relative overflow-hidden bg-background">
      <MatrixRain />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="mb-8">
            <img 
              src={notaMusicale} 
              alt="Nota musicale" 
              className="w-40 h-40 md:w-48 md:h-48 object-contain mx-auto"
              style={{
                filter: 'drop-shadow(0 0 30px hsl(180, 100%, 50%)) drop-shadow(0 0 50px hsl(180, 100%, 50%))',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, gentle-rotate 4s ease-in-out infinite'
              }}
            />
          </div>
          
          <h2 className={`text-4xl md:text-6xl font-bold transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
          color: 'hsl(180, 100%, 50%)'
        }}>
            Pronto a Rivoluzionare il Tuo Booking?
          </h2>
          
          <p className="text-xl md:text-2xl max-w-2xl mx-auto animate-fade-in" style={{
          color: 'hsl(180, 100%, 60%)',
          animationDelay: '0.2s',
          opacity: 0,
          animationFillMode: 'forwards'
        }}>
            Unisciti a centinaia di artisti e venue che stanno già usando VivaEvent per semplificare i loro concerti
          </p>

          <div className="max-w-3xl mx-auto pt-6 space-y-3 animate-fade-in" style={{
          animationDelay: '0.4s',
          opacity: 0,
          animationFillMode: 'forwards'
        }}>
            <p className="text-lg font-bold" style={{
            color: 'hsl(180, 100%, 50%)'
          }}>
              Suite di produttività
            </p>
            <p className="text-base leading-relaxed" style={{
            color: 'hsl(180, 100%, 60%)'
          }}>
              Dimenticatevi di fogli di calcolo, fax e assegni cartacei. VivaEvent semplifica la prenotazione dell&apos;intrattenimento dal vivo. Siamo la prima piattaforma di prenotazione basata su cloud a fornire una soluzione semplice per negoziare contratti, riscuotere pagamenti online e monitorare gli obiettivi di fatturato in tempo reale.
            </p>
          </div>

          <div className="flex justify-center items-center pt-4 animate-fade-in" style={{
          animationDelay: '0.6s',
          opacity: 0,
          animationFillMode: 'forwards'
        }}>
            <Button size="lg" className="group text-lg px-8 py-6 shadow-xl" style={{
            background: 'hsl(180, 100%, 50%)',
            color: 'hsl(0, 0%, 0%)',
            fontWeight: 'bold'
          }} asChild>
              <Link to="/inizia-ora">Accedi Ora<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </section>;
};
export default CTA;