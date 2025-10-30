import { Bot, Shield, BarChart3, Zap, Globe, Clock } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Matching Intelligente",
    description: "Algoritmo che abbina automaticamente artisti e venue per genere, budget e disponibilità",
    color: "from-primary to-accent"
  },
  {
    icon: Shield,
    title: "Pagamenti Sicuri",
    description: "Sistema escrow con Stripe per proteggere artisti e venue durante ogni transazione",
    color: "from-accent to-primary"
  },
  {
    icon: BarChart3,
    title: "Analytics Avanzati",
    description: "Dashboard con metriche dettagliate su affluenza, incassi e performance degli eventi",
    color: "from-primary to-accent"
  },
  {
    icon: Zap,
    title: "Contratti Automatici",
    description: "Generazione e firma elettronica di contratti personalizzati in pochi click",
    color: "from-accent to-primary"
  },
  {
    icon: Globe,
    title: "Focus Italia",
    description: "Integrazione SIAE, SCF e dati localizzati per il mercato musicale italiano",
    color: "from-primary to-accent"
  },
  {
    icon: Clock,
    title: "24/7 Supporto AI",
    description: "Chatbot intelligente sempre disponibile per rispondere a domande e guidare gli utenti",
    color: "from-accent to-primary"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Tutto Quello che Ti Serve
          </h2>
          <p className="text-xl text-muted-foreground">
            Una piattaforma completa per gestire ogni aspetto del booking musicale
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-card"
              >
                <div className={`inline-flex w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
