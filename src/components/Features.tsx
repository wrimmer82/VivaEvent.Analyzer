import { TrendingUp, Bot, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Performance Storica",
    description: "Visualizza lo storico delle prenotazioni e delle performance nell'ultimo decennio.",
  },
  {
    icon: Bot,
    title: "Analisi Predittiva",
    description: "Ottieni previsioni a 3-5 anni sui trend dei ricavi con il nostro AI.",
  },
  {
    icon: ShieldCheck,
    title: "Valutazione del Rischio",
    description: "Rileva cali virali o problemi di conformità legale prima che accadano.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center space-y-4 group">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon 
                    className="w-8 h-8 text-primary"
                    style={{
                      filter: 'drop-shadow(0 0 8px hsl(195, 100%, 50%))',
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
