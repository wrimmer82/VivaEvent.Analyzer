import { Music2, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="pt-16 pb-8" style={{ background: 'hsl(0, 0%, 0%)', color: 'hsl(0, 0%, 90%)' }}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent">
                <Music2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">VivaEvent</span>
            </div>
            <p className="text-sm" style={{ color: 'hsl(0, 0%, 70%)' }}>
              Il marketplace che connette artisti e venue in modo semplice e automatizzato.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Prodotto</h3>
            <ul className="space-y-3 text-sm" style={{ color: 'hsl(0, 0%, 70%)' }}>
              <li><a href="#features" className="transition-colors hover:brightness-125">Features</a></li>
              <li><a href="#how-it-works" className="transition-colors hover:brightness-125">Come Funziona</a></li>
              <li><a href="#pricing" className="transition-colors hover:brightness-125">Prezzi</a></li>
              <li><a href="#" className="transition-colors hover:brightness-125">Roadmap</a></li>
            </ul>
          </div>

          {/* Risorse */}
          <div>
            <h3 className="font-semibold mb-4">Risorse</h3>
            <ul className="space-y-3 text-sm" style={{ color: 'hsl(0, 0%, 70%)' }}>
              <li><a href="#" className="transition-colors hover:brightness-125">Blog</a></li>
              <li><a href="#" className="transition-colors hover:brightness-125">Guide</a></li>
              <li><a href="#" className="transition-colors hover:brightness-125">Community</a></li>
              <li><a href="#" className="transition-colors hover:brightness-125">Supporto</a></li>
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h3 className="font-semibold mb-4">Contatti</h3>
            <ul className="space-y-3 text-sm" style={{ color: 'hsl(0, 0%, 70%)' }}>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:eagleslive@spidmail.it" className="transition-colors hover:brightness-125">
                  eagleslive@spidmail.it
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Roma, Italia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8" style={{ borderTop: '1px solid hsl(0, 0%, 20%)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: 'hsl(0, 0%, 60%)' }}>
            <p>© 2025 VivaEvent. Tutti i diritti riservati.</p>
            <div className="flex gap-6">
              <a href="#" className="transition-colors hover:brightness-125">Privacy Policy</a>
              <a href="#" className="transition-colors hover:brightness-125">Termini di Servizio</a>
              <a href="#" className="transition-colors hover:brightness-125">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
